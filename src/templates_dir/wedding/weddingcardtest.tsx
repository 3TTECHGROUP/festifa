/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion"
import { Calendar, Clock, Heart, Sparkles, MapPin, Users } from "lucide-react"

interface WeddingCardProps {
  brideName?: string
  groomName?: string
  eventDate?: string
  eventTime?: string
  venue?: string
}

// Defaults used when rendering the template without overrides
export const DEFAULT_PROPS = {
  brideName: "Emma",
  groomName: "James",
  eventDate: "June 15, 2025",
  eventTime: "4:00 PM",
  venue: "The Rose Garden Estate",
}

const FlowerSVG = ({ color, className }: { color: string; className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="15" fill={color} />
    <path d="M50 10 L45 30 L55 30 Z" fill={color} opacity="0.8" />
    <path d="M85 50 L65 45 L65 55 Z" fill={color} opacity="0.8" />
    <path d="M50 85 L45 65 L55 65 Z" fill={color} opacity="0.8" />
    <path d="M15 50 L35 45 L35 55 Z" fill={color} opacity="0.8" />
    <circle cx="50" cy="50" r="8" fill="#FFD700" />
  </svg>
)

const RingSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="35" cy="50" r="20" fill="none" stroke="#FFD700" strokeWidth="4" />
    <circle cx="35" cy="50" r="25" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <circle cx="65" cy="50" r="12" fill="none" stroke="#C0C0C0" strokeWidth="4" />
    <circle cx="65" cy="50" r="17" fill="none" stroke="#C0C0C0" strokeWidth="2" opacity="0.5" />
    <circle cx="45" cy="50" r="3" fill="#FFD700" />
  </svg>
)

const HeartSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M50 90 L20 60 C10 50 10 35 20 25 C30 15 45 15 50 25 C55 15 70 15 80 25 C90 35 90 50 80 60 L50 90" fill="#FF6B9D" />
  </svg>
)

function WeddingCard({
  brideName = "Emma",
  groomName = "James",
  eventDate = "June 15, 2025",
  eventTime = "4:00 PM",
  venue = "The Rose Garden Estate",
}: WeddingCardProps) {
  const flowerColors = ["#FFB6C1", "#E6E6FA", "#FFDAB9", "#98D8C8", "#FFC0CB", "#D8BFD8"]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 py-24 sm:px-12">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-rose-200/40 blur-3xl"
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
          className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl"
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

      {/* Floating Flowers */}
      {flowerColors.map((color, index) => {
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
              opacity: [0.6, 0.9, 0.7],
              y: [0, -40, 0],
              rotate: [0, 15, -15, 0],
              scale: [0.8, 1.1, 0.9],
            }}
            transition={{
              duration: 5 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          >
            <FlowerSVG color={color} className="h-24 w-24 sm:h-32 sm:w-32 drop-shadow-xl" />
          </motion.div>
        )
      })}

      {/* Ring Decorations */}
      <motion.div
        className="absolute left-[8%] top-[20%]"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <RingSVG className="h-16 w-16 opacity-70 sm:h-20 sm:w-20" />
      </motion.div>

      <motion.div
        className="absolute right-[8%] top-[70%]"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      >
        <HeartSVG className="h-14 w-14 opacity-60 sm:h-16 sm:w-16" />
      </motion.div>

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl border-4 border-white bg-gradient-to-br from-white via-rose-50 to-amber-50 p-8 shadow-[0_30px_80px_-20px_rgba(244,114,182,0.4)] sm:p-12"
        >
          <div className="absolute -right-4 -top-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-10 w-10 text-amber-400 drop-shadow-lg" />
            </motion.div>
          </div>

          <div className="absolute -left-4 -bottom-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="h-8 w-8 text-rose-400 drop-shadow-lg" />
            </motion.div>
          </div>

          <div className="space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-rose-600 sm:text-4xl">💍 Wedding Invitation 💍</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-3"
            >
              <p className="text-3xl font-light text-slate-600 sm:text-4xl">
                {brideName} <span className="text-rose-400 font-serif">&</span> {groomName}
              </p>
              <p className="text-lg italic text-slate-500">request the pleasure of your company</p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Heart className="mx-auto h-8 w-8 text-rose-400" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="rounded-2xl border-2 border-rose-200 bg-white/80 p-6 space-y-4"
            >
              <div className="flex items-center justify-center gap-3">
                <Calendar className="h-5 w-5 text-rose-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</p>
                  <p className="text-base font-semibold text-slate-800">{eventDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time</p>
                  <p className="text-base font-semibold text-slate-800">{eventTime}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Venue</p>
                  <p className="text-base font-semibold text-slate-800">{venue}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-amber-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">Reception to follow</span>
              </div>
              <div className="w-px h-6 bg-rose-200 hidden sm:block" />
              <div className="text-sm text-slate-500">RSVP by April 15, 2025</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center gap-2 pt-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl sm:text-3xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {i % 2 === 0 ? "💐" : "🌸"}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WeddingCard