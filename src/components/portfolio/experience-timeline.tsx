import { motion } from 'motion/react'
import { Briefcase } from 'lucide-react'

interface Experience {
  id: string
  role: string
  company: string
  description: string
  startDate: string
  endDate: string | null
  isCurrentRole: boolean
}

interface ExperienceTimelineProps {
  experiences: Experience[]
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary-500 to-accent-500 md:left-8" />

      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative pl-12 md:pl-20"
          >
            {/* Timeline dot */}
            <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-500 bg-white dark:bg-slate-950 md:left-6">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                    <Briefcase size={14} />
                    <span className="font-medium">{exp.company}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
                  {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate || ''}
                </span>
              </div>
              {exp.description && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
