import { motion } from 'motion/react'
import { Code2, Layers, Database, Cpu, Wrench, Terminal, Globe } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

interface SkillsGridProps {
  skills: Skill[]
}

const categoryIcons: Record<string, typeof Code2> = {
  'Language': Code2,
  'Languages': Code2,
  'Frontend': Layers,
  'Backend': Cpu,
  'Framework': Layers,
  'Frameworks': Layers,
  'Database & ORMs': Database,
  'Databases': Database,
  'Tools': Wrench,
  'DevOps': Terminal,
  'System': Terminal,
  'General': Globe,
}

function getLevelLabel(proficiency: number): { label: string; badgeClass: string } {
  if (proficiency >= 5) {
    return {
      label: 'Expert',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-500/20'
    }
  }
  if (proficiency >= 4) {
    return {
      label: 'Advanced',
      badgeClass: 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border-primary-500/20'
    }
  }
  return {
    label: 'Proficient',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50'
  }
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, catIdx) => {
        const IconComponent = categoryIcons[category] || Code2
        const categorySkills = skills.filter((s) => s.category === category)

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: catIdx * 0.08 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4 dark:border-slate-800/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100/70 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                <IconComponent size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{category}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{categorySkills.length} Technologies</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {categorySkills.map((skill) => {
                const { label, badgeClass } = getLevelLabel(skill.proficiency)
                return (
                  <div
                    key={skill.id}
                    className="group inline-flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-sm transition-all hover:border-primary-400 hover:bg-white hover:shadow dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-primary-500/50 dark:hover:bg-slate-800/80"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
