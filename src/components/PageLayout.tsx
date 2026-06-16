import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, History, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  /** Current step (1, 2, 3), pass null for non-step pages */
  step: 1 | 2 | 3 | null
  /** Custom container className */
  className?: string
}

const STEPS = [
  { n: 1, label: 'Select School', desc: 'School' },
  { n: 2, label: 'Confirm Visitors', desc: 'Visitors' },
  { n: 3, label: 'Field Trip', desc: 'Activity' },
] as const

export default function PageLayout({ children, step, className }: PageLayoutProps) {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-cream-paper/80 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/step/1" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary text-cream flex items-center justify-center shadow-paper group-hover:rotate-[-6deg] transition-transform">
              <GraduationCap className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold text-primary tracking-tight">
                DRG2026 Visitor Confirmation
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-mute font-medium">
                SCHOOL VISIT & ACTIVITY
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5">
            <NavLink to="/records" active={location.pathname === '/records'} icon={<History className="w-4 h-4" />}>
              Submissions
            </NavLink>
            <NavLink to="/step/1" active={location.pathname === '/step/1'} icon={<ListChecks className="w-4 h-4" />}>
              New Entry
            </NavLink>
          </nav>
        </div>

        {/* Step Progress Bar */}
        {step !== null && (
          <div className="border-t border-border/60 bg-cream/60">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
              <ol className="flex items-center gap-2 sm:gap-4">
                {STEPS.map((s, i) => {
                  const isCurrent = s.n === step
                  const isDone = s.n < step
                  return (
                    <li key={s.n} className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                      <div
                        className={cn(
                          'shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-semibold text-sm border-2 transition-all',
                          isCurrent && 'bg-primary text-cream border-primary shadow-paper scale-110',
                          isDone && 'bg-accent text-white border-accent',
                          !isCurrent && !isDone && 'bg-cream text-mute border-border',
                        )}
                      >
                        {isDone ? (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          s.n
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={cn('text-xs sm:text-sm font-semibold truncate', (isCurrent || isDone) ? 'text-primary' : 'text-mute')}>
                          {s.label}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-soft font-medium hidden sm:block">
                          {s.desc}
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn('h-px flex-1 hidden sm:block transition-colors', isDone ? 'bg-accent' : 'bg-border')} />
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}
      </header>

      <main className={cn('flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10', className)}>
        {children}
      </main>

      <footer className="border-t border-border/60 py-5 text-center text-xs text-soft">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-center gap-2">
          <span className="font-display italic text-primary">DRG2026 Visitor Confirmation</span>
          <span>·</span>
          <span>3-step Data Collection & Export</span>
        </div>
      </footer>
    </div>
  )
}

function NavLink({
  to,
  active,
  icon,
  children,
}: {
  to: string
  active: boolean
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-cream shadow-paper'
          : 'text-mute hover:text-primary hover:bg-cream',
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  )
}
