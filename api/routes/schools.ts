import { Router, type Request, type Response } from 'express'
import { db } from '../db.js'

const router = Router()

/**
 * GET /api/schools - 获取学校列表
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ schools: await db.getSchools() })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
