import { Router, type Request, type Response } from 'express'
import { db } from '../db.js'

const router = Router()

/**
 * GET /api/schools/:id/students - 获取某校学生
 */
router.get('/:id/students', async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.id)
  if (!Number.isInteger(schoolId)) {
    res.status(400).json({ error: '无效的学校 id' })
    return
  }
  try {
    const school = await db.getSchoolById(schoolId)
    if (!school) {
      res.status(404).json({ error: '学校不存在' })
      return
    }
    res.json({ students: await db.getStudentsBySchool(schoolId) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
