import { Router, type Request, type Response } from 'express'
import { submissionService, ValidationError, type SubmitInput } from '../services/submission.service.js'
import { sendSubmissionEmail } from '../services/email.service.js'
import { buildSubmissionsWorkbook } from '../utils/excel.js'

const router = Router()

/**
 * POST /api/submissions - 提交一条记录
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: SubmitInput = {
      school_id: Number(req.body?.school_id),
      visit_student_ids: Array.isArray(req.body?.visit_student_ids)
        ? req.body.visit_student_ids.map(Number)
        : [],
      field_trip_student_ids: Array.isArray(req.body?.field_trip_student_ids)
        ? req.body.field_trip_student_ids.map(Number)
        : [],
      extra_participant_names: Array.isArray(req.body?.extra_participant_names)
        ? req.body.extra_participant_names
        : [],
    }
    const result = await submissionService.create(input)

    // 异步发送邮件通知（不阻塞响应）
    sendSubmissionEmail(result).catch((err) => {
      console.error('Failed to send email:', err)
    })

    res.json({ submission: result })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(e.status).json({ error: e.message })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/submissions - 获取所有提交记录
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ submissions: await submissionService.list() })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/submissions/export - 导出 Excel
 */
router.get('/export', async (_req: Request, res: Response): Promise<void> => {
  try {
    const buffer = await buildSubmissionsWorkbook()
    const filename = `Field-Trip-Submissions-${new Date().toISOString().slice(0, 10)}.xlsx`
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(buffer)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Excel 导出失败' })
  }
})

export default router
