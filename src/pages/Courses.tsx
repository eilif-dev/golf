import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Ruler, Flag, Gauge } from 'lucide-react'
import { courses } from '../data'

export default function Courses({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Courses</h1>
      <p className="text-white/30 text-sm mb-6">Explore our championship courses</p>

      <div className="space-y-4">
        {courses.map((course, ci) => {
          const isExpanded = expandedCourse === course.id
          const totalDist = course.holes.reduce((s, h) => s + h.distance, 0)
          const longestHole = course.holes.reduce((max, h) => h.distance > max.distance ? h : max, course.holes[0])
          const hardestHole = course.holes.reduce((min, h) => h.hcp < min.hcp ? h : min, course.holes[0])

          return (
            <motion.div
              key={course.id}
              layout
              className="glass rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/8 flex items-center justify-center text-3xl">
                    {course.image}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{course.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-emerald-400 font-semibold">Par {course.par}</span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className="text-[10px] text-white/30">CR {course.rating}</span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className="text-[10px] text-white/30">SR {course.slope}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-white/20" />
                  </motion.div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    { icon: Flag, label: 'Holes', value: '18', color: 'text-emerald-400' },
                    { icon: Ruler, label: 'Total', value: `${(totalDist / 1000).toFixed(1)}km`, color: 'text-blue-400' },
                    { icon: Gauge, label: 'Longest', value: `${longestHole.distance}m`, color: 'text-amber-400' },
                    { icon: Flag, label: 'Hardest', value: `#${hardestHole.number}`, color: 'text-red-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.02] rounded-xl p-2.5 text-center">
                      <s.icon size={13} className={`${s.color} mx-auto mb-1 opacity-70`} />
                      <p className="text-[11px] font-bold">{s.value}</p>
                      <p className="text-[8px] text-white/20 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </button>

              {/* Expanded holes */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      {/* Par distribution */}
                      <div className="flex gap-2 mb-4">
                        {[3, 4, 5].map(par => {
                          const count = course.holes.filter(h => h.par === par).length
                          const pct = (count / 18) * 100
                          return (
                            <div key={par} className="flex-1 bg-white/[0.02] rounded-xl p-3 text-center relative overflow-hidden">
                              <div
                                className="absolute bottom-0 left-0 right-0 bg-emerald-500/8 transition-all"
                                style={{ height: `${pct}%` }}
                              />
                              <p className="text-emerald-400 text-lg font-bold relative">{count}×</p>
                              <p className="text-[10px] text-white/25 relative">Par {par}</p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Holes table */}
                      <div className="space-y-1">
                        {course.holes.map((hole, i) => (
                          <motion.div
                            key={hole.number}
                            className="flex items-center p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mr-3 ${
                              hole.par === 3 ? 'bg-blue-500/10 text-blue-400' :
                              hole.par === 5 ? 'bg-amber-500/10 text-amber-400' :
                              'bg-white/5 text-white/50'
                            }`}>
                              {hole.number}
                            </div>

                            <span className="text-[11px] font-semibold w-12 text-white/50">Par {hole.par}</span>
                            <span className="text-[11px] text-white/25 w-14">{hole.distance}m</span>

                            {/* HCP badge */}
                            <span className={`text-[10px] font-bold w-8 text-center ${
                              hole.hcp <= 6 ? 'text-red-400' : hole.hcp <= 12 ? 'text-amber-400' : 'text-emerald-400/60'
                            }`}>
                              {hole.hcp}
                            </span>

                            {/* Difficulty visualization */}
                            <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full ml-3 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  hole.hcp <= 6 ? 'bg-red-400/70' : hole.hcp <= 12 ? 'bg-amber-400/50' : 'bg-emerald-400/30'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${((19 - hole.hcp) / 18) * 100}%` }}
                                transition={{ delay: 0.2 + i * 0.02, duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
