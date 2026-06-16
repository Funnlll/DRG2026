/**
 * API 入口
 */
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import schoolRoutes from './routes/schools.js'
import studentRoutes from './routes/students.js'
import submissionRoutes from './routes/submissions.js'
import fieldTripRoutes from './routes/field-trip.js'

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API 路由
 */
app.use('/api/schools', schoolRoutes)
app.use('/api/schools', studentRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/field-trip', fieldTripRoutes)

/**
 * 健康检查
 */
app.use(
  '/api/health',
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json({ success: true, message: 'ok' })
  },
)

/**
 * 全局错误处理
 */
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  res.status(500).json({ success: false, error: 'Server internal error' })
})

/**
 * 404
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API not found' })
})

export default app
