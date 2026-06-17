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
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import schoolRoutes from './routes/schools.js'
import studentRoutes from './routes/students.js'
import submissionRoutes from './routes/submissions.js'
import fieldTripRoutes from './routes/field-trip.js'

dotenv.config({ quiet: true })

const app: express.Application = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticDir =
  [
    path.resolve(__dirname, '..', '..', 'dist'),
    path.resolve(__dirname, '..', 'dist'),
  ].find((dir) => fs.existsSync(dir)) ?? path.resolve(__dirname, '..', '..', 'dist')

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
 * Production static frontend hosting.
 */
if (process.env.NODE_ENV === 'production' && fs.existsSync(staticDir)) {
  app.use(express.static(staticDir))
  app.get('*', (req: Request, res: Response, next: NextFunction): void => {
    if (req.path.startsWith('/api/')) {
      next()
      return
    }
    res.sendFile(path.join(staticDir, 'index.html'))
  })
}

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
