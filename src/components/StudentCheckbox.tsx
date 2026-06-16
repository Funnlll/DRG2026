import { cn } from '@/lib/utils'
import type { Student } from '@/types'
import { User } from 'lucide-react'

interface StudentCheckboxProps {
  student: Student
  checked: boolean
  onToggle: () => void
  index?: number
  highlight?: boolean
}

export default function StudentCheckbox({ student, checked, onToggle, index, highlight }: StudentCheckboxProps) {
  return (
    <label
      className={cn(
        'group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200',
        'hover:shadow-paper',
        checked
          ? 'border-accent bg-accent-soft/40 shadow-paper'
          : 'border-border bg-cream-paper hover:border-primary/30',
        highlight && 'ring-2 ring-accent/40 ring-offset-1',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        className={cn(
          'shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all',
          checked
            ? 'bg-accent text-white scale-110'
            : 'bg-cream border-2 border-border group-hover:border-primary/50',
        )}
      >
        {checked && (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      <div className={cn(
        'shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors',
        checked ? 'bg-accent text-white' : 'bg-cream text-primary',
      )}>
        <User className="w-4.5 h-4.5" strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className={cn('font-semibold text-base sm:text-[17px] truncate', checked ? 'text-primary' : 'text-ink')}>
          {student.name}
        </div>
        {typeof index === 'number' && (
          <div className="text-xs text-soft font-medium">NO. {String(index + 1).padStart(2, '0')}</div>
        )}
      </div>
    </label>
  )
}
