/* eslint-disable react-refresh/only-export-components */
import React from "react"
import { motion } from "framer-motion"

export interface WeddingCardProps {
  brideName?: string
  groomName?: string
  eventDate?: string
  eventTime?: string
  venue?: string
  subtitle?: string
  invitationMessage?: string
  rsvpText?: string
  image_url?: string
}


export const DEFAULT_PROPS: Required<WeddingCardProps> = {
  brideName: "Emma",
  groomName: "James",
  eventDate: "June 15, 2025",
  eventTime: "4:00 PM",
  venue: "The Rose Garden Estate, London",
  subtitle: "Together with their families",
  invitationMessage:
    "Request the pleasure of your company at the celebration of their marriage",
  rsvpText: "RSVP by May 20, 2025",
  image_url:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
}


const WeddingInvitationCard: React.FC<WeddingCardProps> = (props) => {
  const {
    brideName,
    groomName,
    eventDate,
    eventTime,
    venue,
    subtitle,
    invitationMessage,
    rsvpText,
    image_url,
  } = { ...DEFAULT_PROPS, ...props }

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9 }}
        style={styles.card}
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          style={styles.imageWrapper}
        >
          <img src={image_url} alt="Wedding" style={styles.image} />
          <div style={styles.overlay} />
        </motion.div>

        {/* Content */}
        <div style={styles.content}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={styles.subtitle}
          >
            {subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={styles.names}
          >
            {brideName} <span style={styles.and}>&</span> {groomName}
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.7 }}
            style={styles.divider}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={styles.message}
          >
            {invitationMessage}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={styles.details}
          >
            <p>{eventDate}</p>
            <p>{eventTime}</p>
            <p>{venue}</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={styles.rsvp}
          >
            {rsvpText}
          </motion.p>
        </div>

        {/* Decorative animation */}
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={styles.floralTop}
        >
          ✿
        </motion.div>

        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={styles.floralBottom}
        >
          ❀
        </motion.div>
      </motion.div>
    </div>
  )
}

export default WeddingInvitationCard

/* =========================
   Styles
========================= */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fdf7f3, #f5e4dc)",
    padding: "20px",
    fontFamily: "Georgia, serif",
  },
  card: {
    maxWidth: "800px",
    width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    position: "relative",
  },
  imageWrapper: {
    height: "300px",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.2)",
  },
  content: {
    textAlign: "center",
    padding: "30px",
  },
  subtitle: {
    fontSize: "14px",
    letterSpacing: "2px",
    color: "#999",
  },
  names: {
    fontSize: "48px",
    margin: "10px 0",
    color: "#7a5645",
  },
  and: {
    color: "#c9a18f",
  },
  divider: {
    height: "2px",
    margin: "15px auto",
    background: "#d5b7a5",
  },
  message: {
    fontSize: "18px",
    margin: "20px 0",
  },
  details: {
    margin: "20px 0",
    lineHeight: "1.6",
  },
  rsvp: {
    marginTop: "20px",
    color: "#888",
  },
  floralTop: {
    position: "absolute",
    top: 10,
    right: 20,
    fontSize: "24px",
  },
  floralBottom: {
    position: "absolute",
    bottom: 10,
    left: 20,
    fontSize: "24px",
  },
}