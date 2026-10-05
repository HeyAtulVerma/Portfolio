import { useRef, useEffect } from 'react'
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

function SkillCard({ category, skills, index }: { category: string; skills: Skill[]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power3.out',
          delay: (index % 3) * 0.08,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }, cardRef)
    }
    run()
    return () => ctx?.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const IconComponent = categoryIcons[category] || Code2

  return (
    <div
      ref={cardRef}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <IconComponent size={16} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#141714] dark:text-[#ecf0ea]">{category}</h3>
        <span className="ml-auto text-[10px] text-slate-400 dark:text-white/40">{skills.length}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-primary-500/40 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/80 dark:hover:border-primary-500/40 transition-colors"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, catIdx) => {
        const categorySkills = skills.filter((s) => s.category === category)
        return (
          <SkillCard
            key={category}
            category={category}
            skills={categorySkills}
            index={catIdx}
          />
        )
      })}
    </div>
  )
}
