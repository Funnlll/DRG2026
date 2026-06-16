/**
 * Business Rules:
 * - field_trip_student_ids must be a subset of visit_student_ids
 * - visit_student_ids must have at least 1 item
 * - field_trip_student_ids can be empty
 */
import { db } from '../db.js'

export interface SubmitInput {
  school_id: number
  visit_student_ids: number[]
  field_trip_student_ids: number[]
  extra_participant_names?: string[]
}

export class ValidationError extends Error {
  status: number
  constructor(message: string) {
    super(message)
    this.status = 400
  }
}

export const submissionService = {
  async create(input: SubmitInput) {
    // 1) School must exist
    const school = await db.getSchoolById(input.school_id)
    if (!school) throw new ValidationError('School not found')

    // 2) At least 1 visiting student or extra participant required
    if (
      (!Array.isArray(input.visit_student_ids) || input.visit_student_ids.length === 0) &&
      (!Array.isArray(input.extra_participant_names) || input.extra_participant_names.length === 0)
    ) {
      throw new ValidationError('Please select at least one visiting student or add a participant')
    }

    // 3) Visiting students must belong to the school
    const schoolStudents = await db.getStudentsBySchool(input.school_id)
    const schoolStudentIds = new Set(schoolStudents.map((s) => s.id))
    for (const sid of input.visit_student_ids) {
      if (!schoolStudentIds.has(sid)) {
        throw new ValidationError(`Student #${sid} does not belong to this school`)
      }
    }

    // 4) Field Trip students must be subset of visiting students (can be empty)
    const visitSet = new Set(input.visit_student_ids)
    const fieldTrip = input.field_trip_student_ids ?? []
    for (const sid of fieldTrip) {
      if (!visitSet.has(sid)) {
        throw new ValidationError(`Field Trip student #${sid} must first be confirmed as a visitor`)
      }
    }

    return await db.addSubmission({
      school_id: input.school_id,
      visit_student_ids: input.visit_student_ids,
      field_trip_student_ids: fieldTrip,
      extra_participant_names: input.extra_participant_names,
    })
  },

  async list() {
    const submissions = await db.getAllSubmissions()
    return await Promise.all(submissions.map(async (sub) => {
      const school = await db.getSchoolById(sub.school_id)
      const schoolStudents = await db.getStudentsBySchool(sub.school_id)
      const nameMap = new Map(schoolStudents.map((s) => [s.id, s.name]))
      return {
        id: sub.id,
        school_name: school?.name ?? 'Unknown School',
        visit_students: sub.visit_student_ids.map((id) => nameMap.get(id) ?? `#${id}`).join(', '),
        extra_participants: sub.extra_participant_names?.length
          ? sub.extra_participant_names.join(', ')
          : undefined,
        field_trip_students:
          sub.field_trip_student_ids.length === 0
            ? 'Not participating'
            : sub.field_trip_student_ids.map((id) => nameMap.get(id) ?? `#${id}`).join(', '),
        submitted_at: sub.submitted_at,
      }
    }))
  },
}
