import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { db } from '../db.js'

const DEFAULT_RECIPIENT_EMAIL = '676921772@qq.com'

let transporter: Transporter | null = null

export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
}

function getRecipientEmail(): string {
  return process.env.EMAIL_TO || DEFAULT_RECIPIENT_EMAIL
}

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!user || !pass) {
      throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS.')
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.qq.com',
      port: Number(process.env.EMAIL_PORT || 465),
      secure: process.env.EMAIL_SECURE !== 'false',
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
  field_trip_extra_participant_names?: string[]
  submitted_at: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderList(names: string[]): string {
  if (names.length === 0) return '<span style="color:#999;font-style:italic;">None</span>'
  return `<ol style="margin:8px 0 0;padding-left:22px;line-height:1.7;">${names
    .map((name) => `<li>${escapeHtml(name)}</li>`)
    .join('')}</ol>`
}

export async function sendSubmissionEmail(data: EmailSubmissionData): Promise<void> {
  const school = await db.getSchoolById(data.school_id)
  const schoolName = school?.name ?? 'Unknown School'
  const allStudents = await db.getStudentsBySchool(data.school_id)
  const nameMap = new Map(allStudents.map((s) => [s.id, s.name]))

  const visitNames = data.visit_student_ids.map((id) => nameMap.get(id) ?? `#${id}`)
  const extraNames = data.extra_participant_names ?? []
  const fieldTripNames = [
    ...data.field_trip_student_ids.map((id) => nameMap.get(id) ?? `#${id}`),
    ...(data.field_trip_extra_participant_names ?? []),
  ]

  const submittedTime = new Date(data.submitted_at).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;background:#f7f8fa;">
      <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 10px rgba(0,0,0,.08);">
        <h2 style="color:#0B2447;margin:0 0 16px;border-bottom:2px solid #A5F1E9;padding-bottom:12px;">
          New DRG2026 Visitor Confirmation
        </h2>
        <p style="margin:6px 0;color:#333;"><strong>Submission ID:</strong> #${String(data.id).padStart(4, '0')}</p>
        <p style="margin:6px 0;color:#333;"><strong>School:</strong> ${escapeHtml(schoolName)}</p>
        <p style="margin:6px 0;color:#333;"><strong>Submitted At:</strong> ${escapeHtml(submittedTime)}</p>

        <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin:18px 0;">
          <h3 style="color:#0B2447;margin:0 0 8px;font-size:16px;">Visiting Students (${visitNames.length})</h3>
          ${renderList(visitNames)}
        </div>

        <div style="background:#fff8e1;border-radius:8px;padding:16px;margin:18px 0;">
          <h3 style="color:#0B2447;margin:0 0 8px;font-size:16px;">Extra Participants (${extraNames.length})</h3>
          ${renderList(extraNames)}
        </div>

        <div style="background:${fieldTripNames.length > 0 ? '#e8f5e9' : '#f5f5f5'};border-radius:8px;padding:16px;margin:18px 0;">
          <h3 style="color:#0B2447;margin:0 0 8px;font-size:16px;">Field Trip Participants (${fieldTripNames.length})</h3>
          ${fieldTripNames.length > 0
            ? renderList(fieldTripNames)
            : '<span style="color:#999;font-style:italic;">Not participating</span>'}
        </div>

        <p style="border-top:1px dashed #ddd;margin:24px 0 0;padding-top:16px;color:#999;font-size:12px;text-align:center;">
          This email was sent automatically by the DRG2026 Visitor Confirmation system.
        </p>
      </div>
    </div>
  `

  const textContent = `
New DRG2026 Visitor Confirmation

Submission ID: #${String(data.id).padStart(4, '0')}
School: ${schoolName}
Submitted At: ${submittedTime}

Visiting Students (${visitNames.length}):
${visitNames.length ? visitNames.map((name) => `- ${name}`).join('\n') : '- None'}

Extra Participants (${extraNames.length}):
${extraNames.length ? extraNames.map((name) => `- ${name}`).join('\n') : '- None'}

Field Trip Participants (${fieldTripNames.length}):
${fieldTripNames.length ? fieldTripNames.map((name) => `- ${name}`).join('\n') : '- Not participating'}
  `.trim()

  const mailer = getTransporter()
  const user = process.env.EMAIL_USER

  await mailer.sendMail({
    from: `"DRG2026 Visitor Confirmation" <${user}>`,
    to: getRecipientEmail(),
    subject: `[DRG2026] ${schoolName} - Submission #${String(data.id).padStart(4, '0')}`,
    text: textContent,
    html: htmlContent,
  })
}
