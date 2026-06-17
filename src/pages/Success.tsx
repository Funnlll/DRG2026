import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Download, RotateCw, FileSpreadsheet, Hash, Calendar, School as SchoolIcon, Users, Bus, UserPlus, MessageCircle } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import Button from '@/components/Button'
import { useFlowStore } from '@/store/useFlowStore'
import { api } from '@/api/client'
import { useToast } from '@/hooks/useToast'

export default function Success() {
  const navigate = useNavigate()
  const {
    lastSubmission,
    schoolName,
    visitStudentIds,
    extraParticipantNames,
    fieldTripStudentIds,
    fieldTripExtraParticipantNames,
    reset,
  } = useFlowStore()
  const toast = useToast()

  useEffect(() => {
    if (!lastSubmission) {
      navigate('/step/1', { replace: true })
    }
  }, [lastSubmission, navigate])

  if (!lastSubmission) return null

  const startOver = () => {
    reset()
    navigate('/step/1')
  }

  const handleExport = async () => {
    try {
      window.open(api.exportUrl(), '_blank')
      toast.success('Downloading Excel...')
    } catch (e) {
      toast.error('Export failed')
    }
  }

  const fmt = (iso: string) => {
    try {
      const d = new Date(iso)
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    } catch {
      return iso
    }
  }

  const fieldTripTotal = fieldTripStudentIds.length + fieldTripExtraParticipantNames.length

  return (
    <PageLayout step={null}>
      {toast.node}

      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex anim-scale-in">
            <svg
              className="w-20 h-20 sm:w-24 sm:h-24"
              viewBox="0 0 80 80"
              fill="none"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="#A5F1E9"
                stroke="#19A7CE"
                strokeWidth="3"
                className="anim-pulse-glow"
              />
              <path
                d="M22 41l13 13L58 27"
                stroke="#0B2447"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="anim-check"
              />
            </svg>
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold text-primary anim-fade-up anim-fade-up-1">
            <span className="italic text-accent-deep">Success</span>
          </h1>
          <p className="mt-3 text-mute text-base sm:text-lg anim-fade-up anim-fade-up-2">
            Your visit and Field Trip roster has been recorded. Download Excel or submit another entry.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-cream-paper rounded-3xl border border-border shadow-paper p-6 sm:p-8 anim-fade-up anim-fade-up-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-mute font-bold mb-3">
            Submission Summary
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <SummaryItem icon={<Hash className="w-4 h-4" />} label="ID" value={`#${String(lastSubmission.id).padStart(4, '0')}`} />
            <SummaryItem icon={<SchoolIcon className="w-4 h-4" />} label="School" value={schoolName} />
            <SummaryItem icon={<Users className="w-4 h-4" />} label="Visitors" value={`${visitStudentIds.length} students`} />
            {extraParticipantNames.length > 0 && (
              <SummaryItem icon={<UserPlus className="w-4 h-4" />} label="Extra" value={`${extraParticipantNames.length} participants`} />
            )}
            <SummaryItem
              icon={<Bus className="w-4 h-4" />}
              label="Field Trip"
              value={fieldTripTotal === 0 ? 'Not participating' : `${fieldTripTotal} participants`}
              highlight={fieldTripTotal === 0}
            />
          </div>

          <div className="mt-5 pt-5 border-t border-dashed border-line flex items-center gap-2 text-sm text-mute">
            <Calendar className="w-4 h-4 text-accent" />
            Submitted at: <span className="text-primary font-semibold tabular-nums">{fmt(lastSubmission.submitted_at)}</span>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="mt-6 bg-cream-paper rounded-3xl border border-border shadow-paper p-6 sm:p-8 anim-fade-up anim-fade-up-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="shrink-0">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-border bg-white p-2">
                <img
                  src="/qrcode.png"
                  alt="Activity Group Chat QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-soft border border-accent/20 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-deep mb-2">
                <MessageCircle className="w-3 h-3" />
                Join Group Chat
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
                Scan to Join Activity Wechat Group
              </h3>
              <p className="mt-2 text-sm text-mute leading-relaxed">
                Please scan the QR code with WeChat to join the activity group chat. Important updates and announcements will be shared there.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 anim-fade-up anim-fade-up-5">
          <Button variant="primary" size="lg" onClick={startOver} fullWidth>
            <RotateCw className="w-4 h-4" />
            Submit Another
          </Button>
          <Button variant="outline" size="lg" onClick={handleExport} fullWidth>
            <Download className="w-4 h-4" />
            Export All to Excel
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/records"
            className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-primary transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            View All Submissions →
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}

function SummaryItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-mute font-bold">
        {icon}
        {label}
      </div>
      <div
        className={
          'mt-1 font-display text-lg sm:text-xl font-bold leading-tight ' +
          (highlight ? 'text-mute italic' : 'text-primary')
        }
      >
        {value}
      </div>
    </div>
  )
}
