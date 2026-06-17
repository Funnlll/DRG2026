import { Router, type Request, type Response } from 'express'
import { submissionService, ValidationError, type SubmitInput } from '../services/submission.service.js'
import { isEmailConfigured, sendSubmissionEmail } from '../services/email.service.js'
import { buildSubmissionsWorkbook } from '../utils/excel.js'

const router = Router()

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
        ? req.body.extra_participant_names.map(String)
        : [],
      field_trip_extra_participant_names: Array.isArray(req.body?.field_trip_extra_participant_names)
        ? req.body.field_trip_extra_participant_names.map(String)
        : [],
    }

    const result = await submissionService.create(input)

    if (isEmailConfigured()) {
      sendSubmissionEmail(result)
        .then(() => {
          console.log(`Submission #${result.id} email sent`)
        })
        .catch((err) => {
          console.error(`Failed to send submission #${result.id} email:`, err)
        })
    } else {
      console.warn(`Submission #${result.id} saved, but email is not configured`)
    }

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

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ submissions: await submissionService.list() })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

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
    res.status(500).json({ error: 'Excel export failed' })
  }
})

export default router
