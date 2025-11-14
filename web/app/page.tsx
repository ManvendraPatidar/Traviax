'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, MapPin, Heart, MessageCircle, Share2, Sparkles, Compass, Plane, User } from 'lucide-react'
import Header from '@/components/Header'
import ReelCard from '@/components/ReelCard'
import ConciergeChat from '@/components/ConciergeChat'
import BookingSearch from '@/components/BookingSearch'

interface Reel {
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'reels' | 'explore' | 'concierge' | 'bookings' | 'profile'>('reels')
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo
    const mockReels: Reel[] = [
      {
        id: 'r1',
        title: 'Golden Hour at Sultanahmet',
        location: 'Istanbul, Turkey',
        thumbnail: '/api/placeholder/400/600',
        likes: 1247,
        comments: 89,
        views: 12400,
        creator: {
          username: 'marco_explorer',
          avatar: '/api/placeholder/40/40',
          full_name: 'Marco Rossi'
        }
      },
      {
        id: 'r2',
        title: 'Hidden Café in Dubai\'s Old Quarter',
        location: 'Al Fahidi, Dubai',
        thumbnail: '/api/placeholder/400/600',
        likes: 892,
        comments: 67,
        views: 8900,
        creator: {
          username: 'sarah_wanderer',
          avatar: '/api/placeholder/40/40',
          full_name: 'Sarah Al-Mansouri'
        }
      },
      {
        id: 'r3',
        title: 'Sunset Over Bosphorus',
        location: 'Galata Bridge, Istanbul',
        thumbnail: '/api/placeholder/400/600',
        likes: 2156,
        comments: 145,
        views: 18700,
        creator: {
          username: 'marco_explorer',
          avatar: '/api/placeholder/40/40',
          full_name: 'Marco Rossi'
        }
      }
    ]
    
    setTimeout(() => {
      setReels(mockReels)
      setLoading(false)
    }, 1000)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'reels':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-gradient-gold">Discover</span> the World
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
                Experience travel through cinematic reels from explorers around the globe
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface rounded-xl h-96 shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map((reel) => (
                  <ReelCard key={reel.id} reel={reel} />
                ))}
              </div>
            )}
          </div>
        )
      
      case 'explore':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-gradient-gold">Explore</span> Places
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
                Discover amazing destinations and hidden gems
              </p>
            </div>
            
            <div className="glass rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search places, cities..."
                    className="w-full bg-card border border-border-light rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
                <button className="bg-gradient-gold text-primary px-6 py-3 rounded-lg font-semibold hover:shadow-gold transition-smooth">
                  Search
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Historical Sites', 'Food & Drink', 'Landmarks', 'Culture'].map((category) => (
                <button
                  key={category}
                  className="glass rounded-lg p-4 text-left hover:border-accent transition-smooth"
                >
                  <h3 className="font-semibold text-text-primary mb-2">{category}</h3>
                  <p className="text-text-muted text-sm">Explore {category.toLowerCase()}</p>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 'concierge':
        return <ConciergeChat />
      
      case 'bookings':
        return <BookingSearch />
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Your <span className="text-gradient-gold">Profile</span>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
                Track your travel journey and memories
              </p>
            </div>
            
            <div className="glass rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Demo Traveler</h2>
              <p className="text-text-secondary mb-4">@demo_traveler</p>
              <p className="text-text-muted mb-6">Exploring the world with Traviax ✨</p>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">15</div>
                  <div className="text-text-muted text-sm">Places</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">32</div>
                  <div className="text-text-muted text-sm">Check-ins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">8</div>
                  <div className="text-text-muted text-sm">Cities</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-4">
            {[
              { id: 'reels', icon: Play, label: 'Reels' },
              { id: 'explore', icon: Compass, label: 'Explore' },
              { id: 'concierge', icon: Sparkles, label: 'AI Concierge' },
              { id: 'bookings', icon: Plane, label: 'Bookings' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                  activeTab === id
                    ? 'bg-gradient-gold text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gradient-gold mb-2">Traviax</h3>
            <p className="text-text-muted">Premium travel experiences with cinematic beauty</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
