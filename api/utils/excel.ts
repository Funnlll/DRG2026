import ExcelJS from 'exceljs'
import { db } from '../db.js'

export async function buildSubmissionsWorkbook(): Promise<Buffer> {
  const submissions = await db.getAllSubmissions()
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Field Trip System'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Submissions', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  sheet.columns = [
    { header: 'Submission ID', key: 'id', width: 10 },
    { header: 'School', key: 'school', width: 28 },
    { header: 'Visiting Students', key: 'visit', width: 40 },
    { header: 'Extra Participants', key: 'extra', width: 34 },
    { header: 'Field Trip Participants', key: 'field_trip', width: 44 },
    { header: 'Submitted At', key: 'submitted_at', width: 24 },
  ]

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B2447' },
  }
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }
  sheet.getRow(1).height = 26

  for (const sub of submissions) {
    const school = await db.getSchoolById(sub.school_id)
    const schoolStudents = await db.getStudentsBySchool(sub.school_id)
    const nameMap = new Map(schoolStudents.map((s) => [s.id, s.name]))
    const fieldTripNames = [
      ...sub.field_trip_student_ids.map((id) => nameMap.get(id) ?? `#${id}`),
      ...(sub.field_trip_extra_participant_names ?? []),
    ]

    sheet.addRow({
      id: sub.id,
      school: school?.name ?? 'Unknown School',
      visit: sub.visit_student_ids.map((id) => nameMap.get(id) ?? `#${id}`).join(', '),
      extra: sub.extra_participant_names?.length
        ? sub.extra_participant_names.join(', ')
        : 'N/A',
      field_trip: fieldTripNames.length === 0
        ? 'Not participating'
        : fieldTripNames.join(', '),
      submitted_at: sub.submitted_at,
    })
  }

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F4E1' },
      }
    }
    row.alignment = { vertical: 'middle', wrapText: true }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
