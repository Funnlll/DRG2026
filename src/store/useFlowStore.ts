import { create } from 'zustand'
import type { Submission } from '@/types'

interface FlowState {
  schoolId: number | null
  schoolName: string
  visitStudentIds: number[]
  extraParticipantNames: string[]
  fieldTripStudentIds: number[]
  fieldTripExtraParticipantNames: string[]
  lastSubmission: Submission | null

  setSchool: (id: number, name: string) => void
  setVisitStudents: (ids: number[]) => void
  addExtraParticipant: (name: string) => void
  removeExtraParticipant: (name: string) => void
  setFieldTripStudents: (ids: number[]) => void
  setFieldTripExtraParticipants: (names: string[]) => void
  setLastSubmission: (s: Submission) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set) => ({
  schoolId: null,
  schoolName: '',
  visitStudentIds: [],
  extraParticipantNames: [],
  fieldTripStudentIds: [],
  fieldTripExtraParticipantNames: [],
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
    set((s) => {
      const extraParticipantNames = s.extraParticipantNames.filter((n) => n !== name)
      const extraSet = new Set(extraParticipantNames)
      return {
        extraParticipantNames,
        fieldTripExtraParticipantNames: s.fieldTripExtraParticipantNames.filter((n) => extraSet.has(n)),
      }
    }),
  setFieldTripStudents: (ids) => set({ fieldTripStudentIds: ids }),
  setFieldTripExtraParticipants: (names) => set({ fieldTripExtraParticipantNames: names }),
  setLastSubmission: (sub) => set({ lastSubmission: sub }),
  reset: () =>
    set({
      schoolId: null,
      schoolName: '',
      visitStudentIds: [],
      extraParticipantNames: [],
      fieldTripStudentIds: [],
      fieldTripExtraParticipantNames: [],
      lastSubmission: null,
    }),
}))
