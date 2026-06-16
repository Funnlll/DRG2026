import { create } from 'zustand'
import type { Submission } from '@/types'

interface FlowState {
  schoolId: number | null
  schoolName: string
  visitStudentIds: number[]
  extraParticipantNames: string[]
  fieldTripStudentIds: number[]
  lastSubmission: Submission | null

  setSchool: (id: number, name: string) => void
  setVisitStudents: (ids: number[]) => void
  addExtraParticipant: (name: string) => void
  removeExtraParticipant: (name: string) => void
  setFieldTripStudents: (ids: number[]) => void
  setLastSubmission: (s: Submission) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set) => ({
  schoolId: null,
  schoolName: '',
  visitStudentIds: [],
  extraParticipantNames: [],
  fieldTripStudentIds: [],
  lastSubmission: null,

  setSchool: (id, name) => set({ schoolId: id, schoolName: name }),
  setVisitStudents: (ids) =>
    set((s) => {
      const visitSet = new Set(ids)
      // Field Trip must be a subset of visiting students
      const newFieldTrip = s.fieldTripStudentIds.filter((id) => visitSet.has(id))
      return { visitStudentIds: ids, fieldTripStudentIds: newFieldTrip }
    }),
  addExtraParticipant: (name) =>
    set((s) => ({
      extraParticipantNames: [...s.extraParticipantNames, name],
    })),
  removeExtraParticipant: (name) =>
    set((s) => ({
      extraParticipantNames: s.extraParticipantNames.filter((n) => n !== name),
    })),
  setFieldTripStudents: (ids) => set({ fieldTripStudentIds: ids }),
  setLastSubmission: (sub) => set({ lastSubmission: sub }),
  reset: () =>
    set({
      schoolId: null,
      schoolName: '',
      visitStudentIds: [],
      extraParticipantNames: [],
      fieldTripStudentIds: [],
      lastSubmission: null,
    }),
}))
