import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, Users, Search, Plus, UserPlus, X } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import StudentCheckbox from '@/components/StudentCheckbox'
import Button from '@/components/Button'
import { api } from '@/api/client'
import { useFlowStore } from '@/store/useFlowStore'
import { useToast } from '@/hooks/useToast'
import type { Student } from '@/types'
import { cn } from '@/lib/utils'

export default function Step2VisitStudents() {
  const navigate = useNavigate()
  const { schoolId, schoolName, visitStudentIds, setVisitStudents, extraParticipantNames, addExtraParticipant, removeExtraParticipant } = useFlowStore()
  const toast = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [newParticipant, setNewParticipant] = useState('')
  const [showAddCard, setShowAddCard] = useState(false)

  useEffect(() => {
    if (schoolId == null) {
      navigate('/step/1', { replace: true })
      return
    }
    let alive = true
    setLoading(true)
    api
      .listStudents(schoolId)
      .then((d) => alive && setStudents(d.students))
      .catch((e) => alive && toast.error(`Failed to load students: ${e.message}`))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId])

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return students
    return students.filter((s) => s.name.toLowerCase().includes(k))
  }, [students, keyword])

  const selectedSet = useMemo(() => new Set(visitStudentIds), [visitStudentIds])

  const toggle = (id: number) => {
    const next = new Set(selectedSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setVisitStudents(students.filter((s) => next.has(s.id)).map((s) => s.id))
  }

  const selectAll = () => {
    if (visitStudentIds.length === students.length) {
      setVisitStudents([])
    } else {
      setVisitStudents(students.map((s) => s.id))
    }
  }

  const handleAddParticipant = () => {
    const name = newParticipant.trim()
    if (!name) {
      toast.warning('Please enter a participant name')
      return
    }
    if (extraParticipantNames.includes(name)) {
      toast.warning('This participant has already been added')
      return
    }
    addExtraParticipant(name)
    setNewParticipant('')
    setShowAddCard(false)
    toast.success('Participant added')
  }

  const handleNext = () => {
    const totalVisitors = visitStudentIds.length + extraParticipantNames.length
    if (totalVisitors === 0) {
      toast.warning('Please select at least one visiting student or add a participant')
      return
    }
    navigate('/step/3')
  }

  if (schoolId == null) return null

  return (
    <PageLayout step={2}>
      {toast.node}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-10 anim-fade-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <Users className="w-3 h-3" />
            Step 02
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Confirm <span className="italic text-accent-deep">Visitors</span>
          </h1>
          <p className="mt-3 text-mute text-base sm:text-lg">
            Selected School: <span className="text-primary font-semibold">{schoolName}</span> ·
            {' '}Check the students who are actually visiting.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 anim-fade-up anim-fade-up-1">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search student name..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-cream-paper border-2 border-border focus:border-primary focus:outline-none transition-colors text-sm"
            />
          </div>
          <button
            onClick={selectAll}
            className="h-11 px-4 rounded-xl border-2 border-border text-sm font-semibold text-primary hover:bg-cream transition-colors"
          >
            {visitStudentIds.length === students.length && students.length > 0
              ? 'Deselect All'
              : 'Select All'}
          </button>
        </div>

        {/* Student List */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-mute py-20">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-mute">No matching students found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((s, i) => (
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
          </div>
        )}

        {/* Extra Participants Section */}
        <div className="mt-8 anim-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Additional Participants
            </h3>
            {!showAddCard && (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            )}
          </div>

          {/* Extra Participants List */}
          {extraParticipantNames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {extraParticipantNames.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-accent bg-accent-soft/30"
                >
                  <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{name}</div>
                    <div className="text-xs text-soft">Additional participant</div>
                  </div>
                  <button
                    onClick={() => removeExtraParticipant(name)}
                    className="shrink-0 w-8 h-8 rounded-full bg-cream hover:bg-red-100 text-mute hover:text-red-500 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Participant Card */}
          {showAddCard && (
            <div className="rounded-2xl border-2 border-accent bg-accent-soft/20 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary mb-2">Add New Participant</div>
                  <input
                    type="text"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
                    placeholder="Enter participant name..."
                    className="w-full h-11 px-4 rounded-xl bg-cream-paper border-2 border-border focus:border-accent focus:outline-none transition-colors text-sm"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={handleAddParticipant}
                      className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCard(false)
                        setNewParticipant('')
                      }}
                      className="px-4 py-2 rounded-lg border-2 border-border text-mute text-sm font-semibold hover:bg-cream transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-4 mt-10">
          <div className="bg-cream-paper/95 backdrop-blur-md border border-border shadow-paper-lg rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="text-sm">
              <span className="text-mute">Selected </span>
              <span className="font-display text-2xl font-bold text-accent-deep tabular-nums">
                {visitStudentIds.length + extraParticipantNames.length}
              </span>
              <span className="text-mute"> / {students.length + extraParticipantNames.length} participants</span>
              {extraParticipantNames.length > 0 && (
                <span className="ml-2 text-xs text-accent font-medium">
                  ({extraParticipantNames.length} extra)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/step/1')}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button
                size="md"
                onClick={handleNext}
                disabled={visitStudentIds.length + extraParticipantNames.length === 0}
                className={visitStudentIds.length + extraParticipantNames.length > 0 ? 'anim-pulse-glow' : ''}
              >
                Next Step
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
