import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Building2 } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import SchoolCard from '@/components/SchoolCard'
import Button from '@/components/Button'
import { api } from '@/api/client'
import { useFlowStore } from '@/store/useFlowStore'
import { useToast } from '@/hooks/useToast'
import type { School as SchoolType } from '@/types'

export default function Step1School() {
  const navigate = useNavigate()
  const { schoolId, setSchool } = useFlowStore()
  const toast = useToast()
  const [schools, setSchools] = useState<SchoolType[]>([])
  const [loading, setLoading] = useState(true)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .listSchools()
      .then((d) => {
        if (alive) setSchools(d.schools)
      })
      .catch((e) => {
        if (alive) toast.error(`Failed to load schools: ${e.message}`)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNext = () => {
    if (schoolId == null) {
      toast.warning('Please select a school to continue')
      return
    }
    navigate('/step/2')
  }

  return (
    <PageLayout step={1}>
      {toast.node}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 anim-fade-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <Building2 className="w-3 h-3" />
            Step 01
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Select <span className="italic text-accent-deep">School</span>
          </h1>
          <p className="mt-3 text-mute text-base sm:text-lg max-w-xl">
            Please select the school for this visit. The next step will list all students from the selected school for confirmation.
          </p>
        </div>

        {/* School Grid */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-mute py-20">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading schools...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {schools.map((s, i) => (
              <div
                key={s.id}
                className="anim-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
              >
                <SchoolCard
                  school={s}
                  index={i + 1}
                  selected={schoolId === s.id}
                  onSelect={() => setSchool(s.id, s.name)}
                  onDoubleClick={() => {
                    setSchool(s.id, s.name)
                    navigate('/step/2')
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-10 sm:mt-12 flex items-center justify-end anim-fade-up anim-fade-up-2">
          <Button
            size="lg"
            onClick={handleNext}
            disabled={schoolId == null}
            className={schoolId != null ? 'anim-pulse-glow' : ''}
          >
            Next Step
            <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
          </Button>
        </div>

        {/* Hint */}
        <p className="mt-4 text-center text-xs text-soft">
          Wrong school? You can always go back and change it.
        </p>
      </div>
    </PageLayout>
  )
}
