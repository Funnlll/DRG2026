import { useState } from 'react'
import { Calendar, MapPin, Clock, Bus, Sparkles, Mountain, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FieldTripInfo } from '@/types'

interface ItineraryCardProps {
  info: FieldTripInfo
  compact?: boolean
}

const ATTRACTION_DETAILS: Record<string, string> = {
  'Shawan Ancient Town':
    'With over 800 years of history, Shawan Ancient Village in Panyu District is a well-preserved Lingnan ancient water town famed for Cantonese folk music, traditional wok-ear houses, time-honored ginger milk curd and intangible cultural heritage handicrafts.',
  'Yuyin Garden':
    'A delicate private Lingnan classical garden built in the Qing Dynasty, Yuyin Garden ranks among the Four Great Gardens of Guangdong and features compact, ingenious layout, exquisite carvings and poetic waterscape that fully showcase the aesthetics of ancient Cantonese scholar-official residences.',
  'Guangzhou Urban Planning Exhibition Center':
    "Located in Baiyun New Town, this large official venue vividly presents Guangzhou's 2,200-year urban development history, current construction achievements and future development blueprints via massive sand tables, immersive films and advanced digital technologies, serving as a key window to learn about the city's urban planning and modern development.",
  'Urban/Architectural Model Museum':
    "As China's first professional museum themed on architectural models, it houses nearly 300 exquisite model works focusing on architectures in the Guangdong-Hong Kong-Macao Greater Bay Area, showcasing Lingnan architectural culture, classic global buildings and innovative futuristic design concepts in a space designed under the guidance of renowned academician He Jingtang.",
}

export default function ItineraryCard({ info, compact = false }: ItineraryCardProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="stamp-card p-5 sm:p-7 relative overflow-hidden">
      {/* Header Title */}
      <div className="flex items-start justify-between mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-cream text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            <Sparkles className="w-3 h-3" />
            Itinerary
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary leading-tight">
            {info.name}
          </h3>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <div className="text-[10px] uppercase tracking-wider text-mute font-semibold">Date</div>
          <div className="font-display font-bold text-primary text-sm">{info.date}</div>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={info.date} />
        <InfoRow icon={<Clock className="w-4 h-4" />} label="Departure" value={info.departure_time} highlight />
        <InfoRow icon={<MapPin className="w-4 h-4" />} label="Assembly" value={info.assembly_location} />
        <InfoRow icon={<Bus className="w-4 h-4" />} label="Return" value={info.return_time} />
      </div>

      {/* Attractions Gallery */}
      <div className="mb-5 sm:mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-mute font-bold mb-3 flex items-center gap-2">
          <Mountain className="w-3.5 h-3.5 text-accent" />
          Featured Attractions
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {info.attractions.map((attraction, i) => {
            const isExpanded = expandedId === attraction.id
            return (
              <div
                key={attraction.id}
                className={cn(
                  'group relative rounded-xl overflow-hidden bg-cream-paper border border-border hover:border-accent transition-all duration-300 cursor-pointer',
                  isExpanded && 'col-span-2 ring-2 ring-accent/30'
                )}
                onClick={() => handleToggle(attraction.id)}
              >
                {/* Image */}
                <div className={cn('overflow-hidden', isExpanded ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {attraction.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/70 line-clamp-1 mt-0.5">
                        {attraction.description}
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {isExpanded ? (
                        <X className="w-4 h-4 text-white/80" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Number badge */}
                <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent text-white text-[10px] sm:text-xs font-bold">
                    {i + 1}
                  </span>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="bg-cream-paper p-4 sm:p-5 animate-in slide-in-from-top-2 duration-300">
                    <h4 className="font-display text-lg font-bold text-primary mb-2">
                      {attraction.name}
                    </h4>
                    <p className="text-sm text-ink leading-relaxed">
                      {ATTRACTION_DETAILS[attraction.name] || attraction.description}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="mb-5 sm:mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-mute font-bold mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Schedule
        </div>
        <ol className="relative space-y-3 pl-5 border-l-2 border-dashed border-line">
          {info.schedule.map((item, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-cream shadow-paper" />
              <div className="flex items-baseline gap-2.5">
                <span className="font-display font-bold text-primary text-sm tabular-nums shrink-0">
                  {item.time}
                </span>
                <span className="text-sm text-ink leading-snug">{item.activity}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function InfoRow({
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
    <div
      className={cn(
        'flex items-start gap-2.5 p-2.5 rounded-lg',
        highlight ? 'bg-accent-soft/40' : 'bg-cream-paper/40'
      )}
    >
      <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-mute font-bold">{label}</div>
        <div className="text-sm text-ink font-medium mt-0.5 leading-snug">{value}</div>
      </div>
    </div>
  )
}
