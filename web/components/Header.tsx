'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Sparkles size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-gold">Traviax</h1>
              <p className="text-xs text-text-muted">Premium Travel Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <button className="text-text-secondary hover:text-text-primary transition-smooth">
              Sign In
            </button>
            <button className="bg-gradient-gold text-primary px-4 py-2 rounded-lg font-semibold hover:shadow-gold transition-smooth">
              Get Started
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
