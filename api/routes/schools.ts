import { Router, type Request, type Response } from 'express'
import { db } from '../db.js'

const router = Router()

/**
 * GET /api/schools - 获取学校列表
 */
router.get('/', (_req: Request, res: Response): void => {
  res.json({ schools: db.getSchools() })
})

export default router
