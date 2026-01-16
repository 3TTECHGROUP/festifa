import { motion } from "framer-motion"
import { Calendar, Clock, Gift, Sparkles } from "lucide-react"

interface BirthdayCardProps {
  celebrantName?: string
  age?: number
  eventDate?: string
  eventTime?: string
}

const BalloonSVG = ({ color, className }: { color: string; className?: string }) => (
  <svg viewBox="0 0 100 140" className={className}>
    <ellipse cx="50" cy="70" rx="45" ry="60" fill={color} />
    <path d="M 50 130 L 45 160 L 55 160 Z" fill={color} />
    <line x1="50" y1="130" x2="50" y2="160" stroke={color} strokeWidth="2" />
    <ellipse cx="50" cy="55" rx="15" ry="20" fill="rgba(255,255,255,0.4)" />
  </svg>
)

const MickeyMouseSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <circle cx="60" cy="60" r="50" fill="#000" />
    <circle cx="140" cy="60" r="50" fill="#000" />
    <ellipse cx="100" cy="130" rx="65" ry="70" fill="#000" />
    <circle cx="80" cy="55" r="8" fill="#fff" />
    <circle cx="120" cy="55" r="8" fill="#fff" />
    <ellipse cx="100" cy="110" rx="20" ry="15" fill="#fff" />
  </svg>
)

export function BirthdayCard({
  celebrantName = "Sarah Johnson",
  age = 28,
  eventDate = "March 15, 2025",
  eventTime = "6:00 PM",
}: BirthdayCardProps) {
  const balloonColors = ["#FF6B9D", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94", "#C7CEEA"]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 px-6 py-24 sm:px-12">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-yellow-300/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Large Floating Balloons */}
      {balloonColors.map((color, index) => {
        const positions = [
          { left: "5%", top: "10%" },
          { left: "85%", top: "15%" },
          { left: "10%", top: "70%" },
          { left: "80%", top: "65%" },
          { left: "45%", top: "5%" },
          { left: "50%", top: "75%" },
        ]
        const pos = positions[index % positions.length]

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: pos.left, top: pos.top }}
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{
              opacity: [0.7, 1, 0.8],
              y: [0, -30, 0],
              x: [0, Math.sin(index) * 15, 0],
              scale: [0.8, 1, 0.9],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          >
            <BalloonSVG color={color} className="h-32 w-32 sm:h-40 sm:w-40 drop-shadow-2xl" />
          </motion.div>
        )
      })}

      {/* Mickey Mouse Decorations */}
      <motion.div
        className="absolute left-[3%] top-[25%]"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <MickeyMouseSVG className="h-20 w-20 opacity-80 sm:h-24 sm:w-24" />
      </motion.div>

      <motion.div
        className="absolute right-[5%] top-[50%]"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <MickeyMouseSVG className="h-16 w-16 opacity-70 sm:h-20 sm:w-20" />
      </motion.div>

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl border-4 border-white bg-gradient-to-br from-white via-pink-50 to-purple-50 p-8 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.4)] sm:p-12"
        >
          <div className="absolute -right-4 -top-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          </div>

          <div className="absolute -left-4 -top-4">
            <motion.div
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <Gift className="h-10 w-10 text-pink-400 drop-shadow-lg" />
            </motion.div>
          </div>

          <div className="space-y-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-purple-600 sm:text-4xl">🎉 Happy Birthday! 🎉</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <p className="text-2xl font-semibold text-slate-800 sm:text-3xl">{celebrantName}</p>
              <p className="text-lg text-slate-600 sm:text-xl">
                Turning <span className="font-bold text-purple-600">{age}</span> today!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center gap-4 rounded-2xl border-2 border-purple-200 bg-white/80 p-6 sm:flex-row sm:justify-center sm:gap-8"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</p>
                  <p className="text-base font-semibold text-slate-800">{eventDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-pink-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time</p>
                  <p className="text-base font-semibold text-slate-800">{eventTime}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex justify-center gap-3 pt-4"
            >
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="text-3xl sm:text-4xl"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                >
                  🎈
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}