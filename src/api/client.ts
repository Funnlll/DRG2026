import type {
  School,
  Student,
  Submission,
  SubmissionListItem,
  FieldTripInfo,
} from '@/types'

const BASE = ''

async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let message = `请求失败 (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}

export const api = {
  listSchools: () => request<{ schools: School[] }>('/api/schools'),
  listStudents: (schoolId: number) =>
    request<{ students: Student[] }>(`/api/schools/${schoolId}/students`),
  createSubmission: (body: {
    school_id: number
    visit_student_ids: number[]
    field_trip_student_ids: number[]
    extra_participant_names?: string[]
  }) =>
    request<{ submission: Submission }>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  listSubmissions: () =>
    request<{ submissions: SubmissionListItem[] }>('/api/submissions'),
  getFieldTrip: () =>
    request<{ field_trip: FieldTripInfo }>('/api/field-trip'),
  exportUrl: () => '/api/submissions/export',
}
