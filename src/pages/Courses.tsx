import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MapPin, Ruler, Flag } from 'lucide-react'
import { courses } from '../data'

export default function Courses() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [expandedHole, setExpandedHole] = useState<number | null>(null)

  return (
    <div className="px-4 pt-12">
      <h1 className="text-2xl font-bold mb-1">Courses</h1>
      <p className="text-white/40 text-sm mb-6">Explore our championship courses</p>

      <div className="space-y-4">
        {courses.map(course => {
          const isExpanded = expandedCourse === course.id
          const totalDist = course.holes.reduce((s, h) => s + h.distance, 0)
          return (
            <motion.div key={course.id} layout className="glass rounded-2xl overflow-hidden">
              <motion.button
                onClick={() => {
                  setExpandedCourse(isExpanded ? null : course.id)
                  setExpandedHole(null)
                }}
                className="w-full p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-3xl">
                    {course.image}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{course.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-emerald-400 font-medium">Par {course.par}</span>
                      <span className="text-xs text-white/30">Rating {course.rating}</span>
                      <span className="text-xs text-white/30">Slope {course.slope}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-white/30" />
                  </motion.div>
                </div>

                {/* Course stats bar */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <Flag size={14} className="text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">{course.holes.length}</p>
                    <p className="text-[9px] text-white/30">Holes</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <Ruler size={14} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">{totalDist.toLocaleString()}m</p>
                    <p className="text-[9px] text-white/30">Total</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <MapPin size={14} className="text-amber-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">{Math.round(totalDist / 18)}m</p>
                    <p className="text-[9px] text-white/30">Avg Hole</p>
                  </div>
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      {/* Par distribution */}
                      <div className="flex gap-2 mb-4">
                        {[3, 4, 5].map(par => {
                          const count = course.holes.filter(h => h.par === par).length
                          return (
                            <div key={par} className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                              <p className="text-emerald-400 text-sm font-bold">{count}×</p>
                              <p className="text-[10px] text-white/30">Par {par}</p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Hole list */}
                      <div className="space-y-1">
                        {course.holes.map(hole => (
                          <motion.button
                            key={hole.number}
                            onClick={() => setExpandedHole(expandedHole === hole.number ? null : hole.number)}
                            className="w-full bg-white/[0.02] hover:bg-white/5 rounded-lg p-3 flex items-center transition-colors"
                          >
                            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center mr-3">
                              <span className="text-xs font-bold">{hole.number}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                              <span className={`text-sm font-semibold ${
                                hole.par === 3 ? 'text-blue-400' : hole.par === 5 ? 'text-amber-400' : 'text-white/70'
                              }`}>
                                Par {hole.par}
                              </span>
                              <span className="text-xs text-white/30">{hole.distance}m</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-white/20">HCP</span>
                              <span className={`text-xs font-bold ${
                                hole.hcp <= 6 ? 'text-red-400' : hole.hcp <= 12 ? 'text-amber-400' : 'text-emerald-400'
                              }`}>
                                {hole.hcp}
                              </span>
                            </div>
                            {/* Difficulty bar */}
                            <div className="w-16 h-1.5 bg-white/5 rounded-full ml-3 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  hole.hcp <= 6 ? 'bg-red-400' : hole.hcp <= 12 ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${((19 - hole.hcp) / 18) * 100}%` }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                              />
                            </div>
                          </motion.button>
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
