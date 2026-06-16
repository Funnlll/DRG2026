import { Router, type Request, type Response } from 'express'
import { FIELD_TRIP_INFO } from '../field-trip-data.js'

const router = Router()

/**
 * GET /api/field-trip - 获取固定行程信息
 */
router.get('/', (_req: Request, res: Response): void => {
  res.json({ field_trip: FIELD_TRIP_INFO })
})

export default router
