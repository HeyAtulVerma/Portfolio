import { motion } from 'motion/react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

interface SkillsGridProps {
  skills: Skill[]
}

const proficiencyColors: Record<number, string> = {
  1: 'bg-slate-300 dark:bg-slate-700',
  2: 'bg-blue-400 dark:bg-blue-500',
  3: 'bg-primary-500 dark:bg-primary-400',
  4: 'bg-accent-500 dark:bg-accent-400',
  5: 'bg-green-500 dark:bg-green-400',
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, catIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: catIdx * 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{category}</h3>
          <div className="space-y-3">
            {skills
              .filter((s) => s.category === category)
              .map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-xs text-slate-500">{skill.proficiency}/5</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      className={`h-full rounded-full ${proficiencyColors[skill.proficiency] || proficiencyColors[3]}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency * 20}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
