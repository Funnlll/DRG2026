import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Loader2, Sparkles, Compass, UserPlus } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import StudentCheckbox from '@/components/StudentCheckbox'
import ItineraryCard from '@/components/ItineraryCard'
import Button from '@/components/Button'
import { api } from '@/api/client'
import { useFlowStore } from '@/store/useFlowStore'
import { useToast } from '@/hooks/useToast'
import type { Student, FieldTripInfo } from '@/types'

export default function Step3FieldTrip() {
  const navigate = useNavigate()
  const {
    schoolId,
    schoolName,
    visitStudentIds,
    extraParticipantNames,
    fieldTripStudentIds,
    setFieldTripStudents,
    setLastSubmission,
    reset,
  } = useFlowStore()
  const toast = useToast()

  const [students, setStudents] = useState<Student[]>([])
  const [fieldTrip, setFieldTrip] = useState<FieldTripInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)

  useEffect(() => {
    if (schoolId == null || (visitStudentIds.length === 0 && extraParticipantNames.length === 0)) {
      navigate('/step/1', { replace: true })
      return
    }
    let alive = true
    setLoading(true)
    Promise.all([api.listStudents(schoolId), api.getFieldTrip()])
      .then(([s, f]) => {
        if (!alive) return
        setStudents(s.students.filter((st) => visitStudentIds.includes(st.id)))
        setFieldTrip(f.field_trip)
      })
      .catch((e) => alive && toast.error(`Failed to load: ${e.message}`))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, visitStudentIds.length, extraParticipantNames.length])

  const totalVisitors = visitStudentIds.length + extraParticipantNames.length
  const selectedSet = useMemo(() => new Set(fieldTripStudentIds), [fieldTripStudentIds])

  const toggle = (id: number) => {
    const next = new Set(selectedSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setFieldTripStudents([...next])
  }

  const handleSubmit = async () => {
    if (schoolId == null) return
    if (fieldTripStudentIds.length === 0) {
      const ok = window.confirm('No Field Trip students selected. Are you sure you want to submit?')
      if (!ok) return
    }
    setSubmitting(true)
    try {
      const res = await api.createSubmission({
        school_id: schoolId,
        visit_student_ids: visitStudentIds,
        field_trip_student_ids: fieldTripStudentIds,
        extra_participant_names: extraParticipantNames,
      })
      setLastSubmission(res.submission)
      toast.success('Submitted successfully!')
      setTimeout(() => navigate('/success'), 400)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Submission failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (schoolId == null) return null

  return (
    <PageLayout step={3}>
      {toast.node}

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-10 anim-fade-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <Sparkles className="w-3 h-3" />
            Step 03
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            <span className="italic text-accent-deep">Field Trip</span> Participants
          </h1>
          <p className="mt-3 text-mute text-base sm:text-lg">
            From the <span className="text-primary font-semibold">{totalVisitors}</span> confirmed visitors ({visitStudentIds.length} students + {extraParticipantNames.length} extra), select participants for the Field Trip (can be empty).
          </p>
        </div>

        {loading || !fieldTrip ? (
          <div className="flex items-center justify-center gap-3 text-mute py-20">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading itinerary & students...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">
            {/* Left: Student Selection */}
            <section>
              <div className="bg-cream-paper rounded-3xl border border-border shadow-paper p-5 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-mute font-bold">
                      {schoolName} · Visitors
                    </div>
                    <div className="font-display text-2xl font-bold text-primary mt-0.5">
                      Select Field Trip Participants
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-mute font-bold">
                      Selected
                    </div>
                    <div className="font-display text-3xl font-bold text-accent-deep tabular-nums leading-none mt-0.5">
                      {fieldTripStudentIds.length}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {students.map((s, i) => (
                    <div
                      key={s.id}
                      className="anim-fade-up"
                      style={{ animationDelay: `${0.05 + i * 0.04}s` }}
                    >
                      <StudentCheckbox
                        student={s}
                        index={i}
                        checked={selectedSet.has(s.id)}
                        onToggle={() => toggle(s.id)}
                      />
                    </div>
                  ))}
                  {extraParticipantNames.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed border-accent bg-accent-soft/30"
                    >
                      <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base truncate">{name}</div>
                        <div className="text-xs text-soft">Additional participant (cannot join Field Trip)</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-cream/60 border border-dashed border-line text-xs text-mute flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center font-bold text-[10px] mt-0.5">
                    i
                  </span>
                  <div>
                    If this school is not participating in Field Trip, <strong className="text-primary">leave all unchecked</strong> and submit directly.
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/step/2')}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      reset()
                      navigate('/step/1')
                    }}
                    className="h-11 px-4 text-sm font-medium text-mute hover:text-primary transition-colors"
                  >
                    Cancel & Restart
                  </button>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    loading={submitting}
                    className={!submitting ? 'anim-pulse-glow' : ''}
                  >
                    <Send className="w-4 h-4" strokeWidth={2.4} />
                    Confirm & Submit
                  </Button>
                </div>
              </div>
            </section>

            {/* Right: Itinerary Card (sticky on desktop) */}
            <aside className="lg:sticky lg:top-32">
              {/* Mobile toggle button */}
              <button
                onClick={() => setShowItinerary((v) => !v)}
                className="lg:hidden w-full flex items-center justify-between gap-2 px-5 py-3.5 rounded-2xl bg-primary text-cream shadow-paper mb-3"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Compass className="w-4 h-4" />
                  View Field Trip Itinerary
                </span>
                <span className="text-xs opacity-80">{showItinerary ? 'Collapse' : 'Expand'}</span>
              </button>
              <div className={showItinerary ? 'block' : 'hidden lg:block'}>
                <ItineraryCard info={fieldTrip} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
