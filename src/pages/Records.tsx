import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ArrowLeft, Loader2, FileSpreadsheet, Inbox } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import Button from '@/components/Button'
import { api } from '@/api/client'
import type { SubmissionListItem } from '@/types'

export default function Records() {
  const [items, setItems] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .listSubmissions()
      .then((d) => alive && setItems(d.submissions))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <PageLayout step={null}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              <FileSpreadsheet className="w-3 h-3" />
              Submissions
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
              <span className="italic text-accent-deep">Submission</span> History
            </h1>
            <p className="mt-2 text-mute">
              Total <span className="text-primary font-semibold tabular-nums">{items.length}</span> records, sorted by submission time (newest first).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/step/1">
              <Button variant="ghost" size="md">
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </Button>
            </Link>
            <a href={api.exportUrl()} target="_blank" rel="noreferrer">
              <Button size="md">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </a>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-mute py-20">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading records...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-6 text-center">
            Failed to load: {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-cream-paper rounded-3xl border border-dashed border-border">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-cream items-center justify-center text-soft mb-4">
              <Inbox className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="font-display text-2xl font-bold text-primary mb-1">No Records</div>
            <div className="text-mute text-sm mb-5">Complete a 3-step submission to see records here</div>
            <Link to="/step/1">
              <Button>
                <ArrowLeft className="w-4 h-4" />
                Submit First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-cream-paper rounded-3xl border border-border shadow-paper overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary text-cream text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4 text-left font-bold">ID</th>
                    <th className="px-5 py-4 text-left font-bold">School</th>
                    <th className="px-5 py-4 text-left font-bold">Visitors</th>
                    <th className="px-5 py-4 text-left font-bold">Extra Participants</th>
                    <th className="px-5 py-4 text-left font-bold">Field Trip</th>
                    <th className="px-5 py-4 text-left font-bold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr
                      key={it.id}
                      className={i % 2 === 0 ? 'bg-cream-paper' : 'bg-cream/40'}
                    >
                      <td className="px-5 py-4 font-display font-bold text-accent-deep tabular-nums">
                        #{String(it.id).padStart(4, '0')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-primary">{it.school_name}</td>
                      <td className="px-5 py-4 text-ink max-w-[200px]">
                        <div className="line-clamp-2">{it.visit_students}</div>
                      </td>
                      <td className="px-5 py-4 text-ink max-w-[150px]">
                        <div className="line-clamp-2">
                          {it.extra_participants || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink max-w-[200px]">
                        <div className="line-clamp-2">
                          {it.field_trip_students === '（Not participating）' ? (
                            <span className="text-soft italic">Not participating</span>
                          ) : (
                            it.field_trip_students
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-mute text-xs tabular-nums whitespace-nowrap">
                        {fmtDate(it.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-cream-paper rounded-2xl border border-border shadow-paper p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display font-bold text-accent-deep text-lg tabular-nums">
                      #{String(it.id).padStart(4, '0')}
                    </div>
                    <div className="text-xs text-mute tabular-nums">
                      {fmtDate(it.submitted_at)}
                    </div>
                  </div>
                  <div className="font-semibold text-primary text-base mb-2">
                    {it.school_name}
                  </div>
                  <Row label="Visitors" value={it.visit_students} />
                  {it.extra_participants && <Row label="Extra" value={it.extra_participants} />}
                  <Row
                    label="FT"
                    value={it.field_trip_students === '（Not participating）' ? 'Not participating' : it.field_trip_students}
                    muted={it.field_trip_students === '（Not participating）'}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-sm py-1">
      <span className="text-[10px] uppercase tracking-wider text-mute font-bold w-10 shrink-0 pt-0.5">
        {label}
      </span>
      <span className={muted ? 'text-soft italic' : 'text-ink'}>{value}</span>
    </div>
  )
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}
