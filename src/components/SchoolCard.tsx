import { School, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { School as SchoolType } from '@/types'

interface SchoolCardProps {
  school: SchoolType
  selected: boolean
  onSelect: () => void
  onDoubleClick?: () => void
  index: number
}

export default function SchoolCard({ school, selected, onSelect, onDoubleClick, index }: SchoolCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      className={cn(
        'group relative w-full text-left rounded-3xl border-2 bg-cream-paper p-6 sm:p-8 transition-all duration-300',
        'hover:shadow-paper-lg hover:-translate-y-1',
        selected
          ? 'border-primary shadow-paper-lg -translate-y-1'
          : 'border-border hover:border-primary/40',
      )}
    >
      {/* Number Badge */}
      <div className={cn(
        'absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shadow-paper transition-all',
        selected
          ? 'bg-accent text-white anim-pulse-glow'
          : 'bg-primary text-cream group-hover:rotate-[-8deg]',
      )}>
        {String.fromCharCode(64 + index)}
      </div>

      {/* Selection Indicator */}
      <div className={cn(
        'absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-all',
        selected ? 'bg-accent text-white scale-100' : 'bg-transparent border-2 border-border scale-90 opacity-0 group-hover:opacity-100',
      )}>
        <Check className="w-4 h-4" strokeWidth={3} />
      </div>

      <div className="flex items-start gap-4">
        <div className={cn(
          'shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors',
          selected ? 'bg-primary text-cream' : 'bg-cream text-primary',
        )}>
          <School className="w-7 h-7" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-mute font-semibold mb-1">
            UNIVERSITY
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
            {school.name}
          </div>
          <div className="mt-2 text-sm text-mute">
            Double-click to select and continue
          </div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className={cn(
        'absolute bottom-0 left-6 right-6 h-1 rounded-full transition-all',
        selected ? 'bg-accent' : 'bg-transparent group-hover:bg-primary/10',
      )} />
    </button>
  )
}
