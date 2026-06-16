import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { db } from '../db.js'

const RECIPIENT_EMAIL = '676921772@qq.com'

let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!user || !pass) {
      throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.')
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    })
  }
  return transporter
}

export interface EmailSubmissionData {
  id: number
  school_id: number
  visit_student_ids: number[]
  field_trip_student_ids: number[]
  extra_participant_names?: string[]
  submitted_at: string
}

export async function sendSubmissionEmail(data: EmailSubmissionData): Promise<void> {
  const school = db.getSchoolById(data.school_id)
  const schoolName = school?.name ?? 'Unknown School'
  const allStudents = db.getStudentsBySchool(data.school_id)
  const nameMap = new Map(allStudents.map((s) => [s.id, s.name]))

  const visitNames = data.visit_student_ids.map((id) => nameMap.get(id) ?? `#${id}`)
  const fieldTripNames = data.field_trip_student_ids.map((id) => nameMap.get(id) ?? `#${id}`)

  const submittedTime = new Date(data.submitted_at).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #0B2447; margin-top: 0; border-bottom: 2px solid #A5F1E9; padding-bottom: 12px;">
          🎓 新的到访确认提交
        </h2>
        
        <div style="margin: 20px 0;">
          <p style="margin: 8px 0; color: #666;">
            <strong style="color: #333; display: inline-block; width: 100px;">提交编号:</strong>
            <span style="color: #19A7CE; font-weight: bold;">#${String(data.id).padStart(4, '0')}</span>
          </p>
          <p style="margin: 8px 0; color: #666;">
            <strong style="color: #333; display: inline-block; width: 100px;">学校:</strong>
            <span style="color: #333; font-weight: 600;">${schoolName}</span>
          </p>
          <p style="margin: 8px 0; color: #666;">
            <strong style="color: #333; display: inline-block; width: 100px;">提交时间:</strong>
            <span>${submittedTime}</span>
          </p>
        </div>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #0B2447; margin-top: 0; font-size: 16px;">📋 到访学生名单</h3>
          <p style="margin: 8px 0; color: #333; line-height: 1.6;">
            ${visitNames.join('、')}
          </p>
          <p style="margin: 4px 0; color: #666; font-size: 13px;">
            共 ${visitNames.length} 人
          </p>
        </div>

        ${data.extra_participant_names && data.extra_participant_names.length > 0 ? `
        <div style="background: #fff8e1; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #0B2447; margin-top: 0; font-size: 16px;">👥 额外参与者</h3>
          <p style="margin: 8px 0; color: #333; line-height: 1.6;">
            ${data.extra_participant_names.join('、')}
          </p>
        </div>
        ` : ''}

        <div style="background: ${fieldTripNames.length > 0 ? '#e8f5e9' : '#f5f5f5'}; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #0B2447; margin-top: 0; font-size: 16px;">🚌 Field Trip 参与情况</h3>
          <p style="margin: 8px 0; color: #333; line-height: 1.6;">
            ${fieldTripNames.length > 0 
              ? fieldTripNames.join('、') + `<br/><span style="color: #666; font-size: 13px;">共 ${fieldTripNames.length} 人参加 Field Trip</span>`
              : '<span style="color: #999; font-style: italic;">该学校不参加 Field Trip</span>'
            }
          </p>
        </div>

        <div style="border-top: 1px dashed #ddd; margin-top: 24px; padding-top: 16px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            此邮件由系统自动发送 | 到访确认系统
          </p>
        </div>
      </div>
    </div>
  `

  const textContent = `
新的到访确认提交

提交编号: #${String(data.id).padStart(4, '0')}
学校: ${schoolName}
提交时间: ${submittedTime}

到访学生名单 (${visitNames.length}人):
${visitNames.join(', ')}

${data.extra_participant_names && data.extra_participant_names.length > 0 ? `额外参与者: ${data.extra_participant_names.join(', ')}

` : ''}
Field Trip 参与情况:
${fieldTripNames.length > 0 ? fieldTripNames.join(', ') + ` (共${fieldTripNames.length}人)` : '不参加 Field Trip'}

---
此邮件由系统自动发送
  `.trim()

  const mailer = getTransporter()
  const user = process.env.EMAIL_USER

  await mailer.sendMail({
    from: `"到访确认系统" <${user}>`,
    to: RECIPIENT_EMAIL,
    subject: `【到访确认】${schoolName} - 新提交 #${String(data.id).padStart(4, '0')}`,
    text: textContent,
    html: htmlContent,
  })
}
