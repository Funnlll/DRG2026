export interface School {
  id: number
  name: string
}

export interface Student {
  id: number
  school_id: number
  name: string
}

export interface Submission {
  id: number
  school_id: number
  visit_student_ids: number[]
  field_trip_student_ids: number[]
  extra_participant_names?: string[]
  submitted_at: string
}

export interface SubmissionListItem {
  id: number
  school_name: string
  visit_students: string
  extra_participants?: string
  field_trip_students: string
  submitted_at: string
}

export interface ScheduleItem {
  time: string
  activity: string
}

export interface FieldTripAttraction {
  id: number
  name: string
  description: string
  image: string
}

export interface FieldTripInfo {
  name: string
  date: string
  assembly_location: string
  departure_time: string
  schedule: { time: string; activity: string }[]
  lunch: string
  return_time: string
  notes: string[]
  contact: {
    teacher: string
    phone: string
    backup: string
  }
  attractions: FieldTripAttraction[]
}
