'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, MessageCircle, Share2, MapPin } from 'lucide-react'

interface ReelCardProps {
  reel: {
    id: string
    title: string
    location: string
    thumbnail: string
    likes: number
    comments: number
    views: number
    creator?: {
      username: string
      avatar: string
      full_name: string
    }
  }
}

export default function ReelCard({ reel }: ReelCardProps) {
  const [liked, setLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <motion.div
      className="group relative bg-surface rounded-xl overflow-hidden shadow-cinematic hover:shadow-gold transition-all duration-500"
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-surface to-card flex items-center justify-center">
          <div className="text-6xl text-text-muted">🎬</div>
        </div>
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={24} className="text-primary ml-1" fill="currentColor" />
          </motion.div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
          {reel.title}
        </h3>
        
        <div className="flex items-center text-text-secondary text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{reel.location}</span>
        </div>

        {/* Creator */}
        {reel.creator && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-primary">
                {reel.creator.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {reel.creator.full_name}
              </p>
              <p className="text-xs text-accent">@{reel.creator.username}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-3">
          <span>{formatNumber(reel.views)} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              className={`flex items-center space-x-1 ${liked ? 'text-like' : 'text-text-secondary hover:text-like'} transition-colors`}
              onClick={() => setLiked(!liked)}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{formatNumber(reel.likes + (liked ? 1 : 0))}</span>
            </motion.button>

            <button className="flex items-center space-x-1 text-text-secondary hover:text-comment transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">{formatNumber(reel.comments)}</span>
            </button>
          </div>

          <button className="text-text-secondary hover:text-share transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
