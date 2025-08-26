import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, GitCommit, ChevronDown, ExternalLink } from 'lucide-react'
import { getAllUpdates, getUniqueContributors } from '../../utils/updatesService'

const UpdatesPage = () => {
  const [allUpdates, setAllUpdates] = useState([])
  const [displayedUpdates, setDisplayedUpdates] = useState([])
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const updatesPerPage = 15

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true)
        const [data, contributorsData] = await Promise.all([
          getAllUpdates(),
          getUniqueContributors()
        ])
        setAllUpdates(data)
        setDisplayedUpdates(data.slice(0, updatesPerPage))
        setContributors(contributorsData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching updates:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [])

  const loadMoreUpdates = () => {
    setLoadingMore(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      const newDisplayCount = nextPage * updatesPerPage
      setDisplayedUpdates(allUpdates.slice(0, newDisplayCount))
      setCurrentPage(nextPage)
      setLoadingMore(false)
    }, 500) // Small delay for better UX
  }

  const hasMoreUpdates = displayedUpdates.length < allUpdates.length

  const formatDetailedDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getRepoDisplayName = (repo) => {
    switch (repo) {
      case 'frontend': return 'client'
      case 'backend': return 'server'
      default: return repo
    }
  }

  const getCategoryColors = (category) => {
    switch (category) {
      // Development domains
      case 'DevOps': return {
        badge: 'bg-violet-50 text-violet-700 border-violet-200',
        dot: 'border-violet-300 group-hover:border-violet-500',
        hoverBorder: 'hover:border-l-violet-300',
        fill: 'bg-violet-100 group-hover:bg-violet-300'
      }
      case 'Database': return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'border-emerald-300 group-hover:border-emerald-500',
        hoverBorder: 'hover:border-l-emerald-300',
        fill: 'bg-emerald-100 group-hover:bg-emerald-300'
      }
      case 'Authentication': return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'border-red-300 group-hover:border-red-500',
        hoverBorder: 'hover:border-l-red-300',
        fill: 'bg-red-100 group-hover:bg-red-300'
      }
      case 'Admin Panel': return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'border-indigo-300 group-hover:border-indigo-500',
        hoverBorder: 'hover:border-l-indigo-300',
        fill: 'bg-indigo-100 group-hover:bg-indigo-300'
      }
      case 'Learning Platform': return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'border-blue-300 group-hover:border-blue-500',
        hoverBorder: 'hover:border-l-blue-300',
        fill: 'bg-blue-100 group-hover:bg-blue-300'
      }
      case 'Gamification': return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'border-purple-300 group-hover:border-purple-500',
        hoverBorder: 'hover:border-l-purple-300',
        fill: 'bg-purple-100 group-hover:bg-purple-300'
      }
      case 'UI Components': return {
        badge: 'bg-pink-50 text-pink-700 border-pink-200',
        dot: 'border-pink-300 group-hover:border-pink-500',
        hoverBorder: 'hover:border-l-pink-300',
        fill: 'bg-pink-100 group-hover:bg-pink-300'
      }
      case 'Backend API': return {
        badge: 'bg-green-50 text-green-700 border-green-200',
        dot: 'border-green-300 group-hover:border-green-500',
        hoverBorder: 'hover:border-l-green-300',
        fill: 'bg-green-100 group-hover:bg-green-300'
      }
      
      // Quality and maintenance
      case 'Code Quality': return {
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dot: 'border-cyan-300 group-hover:border-cyan-500',
        hoverBorder: 'hover:border-l-cyan-300',
        fill: 'bg-cyan-100 group-hover:bg-cyan-300'
      }
      case 'Documentation': return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'border-amber-300 group-hover:border-amber-500',
        hoverBorder: 'hover:border-l-amber-300',
        fill: 'bg-amber-100 group-hover:bg-amber-300'
      }
      case 'Quality Assurance': return {
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'border-orange-300 group-hover:border-orange-500',
        hoverBorder: 'hover:border-l-orange-300',
        fill: 'bg-orange-100 group-hover:bg-orange-300'
      }
      case 'Performance': return {
        badge: 'bg-lime-50 text-lime-700 border-lime-200',
        dot: 'border-lime-300 group-hover:border-lime-500',
        hoverBorder: 'hover:border-l-lime-300',
        fill: 'bg-lime-100 group-hover:bg-lime-300'
      }
      case 'Configuration': return {
        badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dot: 'border-yellow-300 group-hover:border-yellow-500',
        hoverBorder: 'hover:border-l-yellow-300',
        fill: 'bg-yellow-100 group-hover:bg-yellow-300'
      }
      
      // User experience
      case 'Design & Styling': return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'border-rose-300 group-hover:border-rose-500',
        hoverBorder: 'hover:border-l-rose-300',
        fill: 'bg-rose-100 group-hover:bg-rose-300'
      }
      case 'User Experience': return {
        badge: 'bg-teal-50 text-teal-700 border-teal-200',
        dot: 'border-teal-300 group-hover:border-teal-500',
        hoverBorder: 'hover:border-l-teal-300',
        fill: 'bg-teal-100 group-hover:bg-teal-300'
      }
      case 'Navigation': return {
        badge: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'border-slate-300 group-hover:border-slate-500',
        hoverBorder: 'hover:border-l-slate-300',
        fill: 'bg-slate-100 group-hover:bg-slate-300'
      }
      case 'Search & Filtering': return {
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'border-sky-300 group-hover:border-sky-500',
        hoverBorder: 'hover:border-l-sky-300',
        fill: 'bg-sky-100 group-hover:bg-sky-300'
      }
      
      // Integration and external
      case 'Integrations': return {
        badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
        dot: 'border-fuchsia-300 group-hover:border-fuchsia-500',
        hoverBorder: 'hover:border-l-fuchsia-300',
        fill: 'bg-fuchsia-100 group-hover:bg-fuchsia-300'
      }
      case 'Version Control': return {
        badge: 'bg-stone-50 text-stone-700 border-stone-200',
        dot: 'border-stone-300 group-hover:border-stone-500',
        hoverBorder: 'hover:border-l-stone-300',
        fill: 'bg-stone-100 group-hover:bg-stone-300'
      }
      case 'Legal & Privacy': return {
        badge: 'bg-neutral-50 text-neutral-700 border-neutral-200',
        dot: 'border-neutral-300 group-hover:border-neutral-500',
        hoverBorder: 'hover:border-l-neutral-300',
        fill: 'bg-neutral-100 group-hover:bg-neutral-300'
      }
      
      // Special categories
      case 'Critical': return {
        badge: 'bg-red-100 text-red-800 border-red-300',
        dot: 'border-red-400 group-hover:border-red-600',
        hoverBorder: 'hover:border-l-red-400',
        fill: 'bg-red-200 group-hover:bg-red-400'
      }
      case 'Features': return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'border-emerald-300 group-hover:border-emerald-500',
        hoverBorder: 'hover:border-l-emerald-300',
        fill: 'bg-emerald-100 group-hover:bg-emerald-300'
      }
      case 'Bug Fixes': return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'border-red-300 group-hover:border-red-500',
        hoverBorder: 'hover:border-l-red-300',
        fill: 'bg-red-100 group-hover:bg-red-300'
      }
      case 'Maintenance': return {
        badge: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'border-gray-300 group-hover:border-gray-500',
        hoverBorder: 'hover:border-l-gray-300',
        fill: 'bg-gray-100 group-hover:bg-gray-300'
      }
      case 'Dashboard': return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'border-blue-300 group-hover:border-blue-500',
        hoverBorder: 'hover:border-l-blue-300',
        fill: 'bg-blue-100 group-hover:bg-blue-300'
      }
      case 'Testing': return {
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'border-orange-300 group-hover:border-orange-500',
        hoverBorder: 'hover:border-l-orange-300',
        fill: 'bg-orange-100 group-hover:bg-orange-300'
      }
      case 'Error Handling': return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'border-red-300 group-hover:border-red-500',
        hoverBorder: 'hover:border-l-red-300',
        fill: 'bg-red-100 group-hover:bg-red-300'
      }
      case 'General': return {
        badge: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'border-gray-300 group-hover:border-gray-500',
        hoverBorder: 'hover:border-l-gray-300',
        fill: 'bg-gray-100 group-hover:bg-gray-300'
      }
      
      // Default fallback
      default: return {
        badge: 'bg-gray-50 text-gray-600 border-gray-200',
        dot: 'border-gray-200 group-hover:border-[#FFDE59]',
        hoverBorder: 'hover:border-l-[#FFDE59]',
        fill: 'bg-gray-100 group-hover:bg-[#FFDE59]'
      }
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#FFDE59] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading updates...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <h2 className="text-sm font-medium text-gray-900 mb-1">Unable to load updates</h2>
          <p className="text-xs text-gray-500 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link 
              to="/" 
              className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Home
            </Link>
            <div className="text-xs text-gray-400">
              {allUpdates.length} total commits
            </div>
          </div>
          
          <div className="mb-3">
            <h1 className="text-lg font-semibold text-gray-900 mb-1">Platform Updates</h1>
            <p className="text-xs text-gray-500">
              Real-time development progress from git history
            </p>
          </div>

          {/* Contributors Section */}
          {contributors.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Contributors</h3>
              <div className="flex flex-wrap gap-2">
                {contributors.map((contributor, index) => (
                  <a
                    key={index}
                    href={`https://github.com/${contributor.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 transition-colors"
                    title={`${contributor.commitCount} commits`}
                  >
                    <span className="font-medium">@{contributor.username}</span>
                    <span className="ml-1 text-gray-500">({contributor.commitCount})</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thread-like Timeline */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-2">
          {displayedUpdates.map((update, index) => (
            <div 
              key={update.id} 
              className="relative group"
            >
              {/* Thread line */}
              {index < displayedUpdates.length - 1 && (
                <div className="absolute left-2.5 top-10 bottom-0 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"></div>
              )}
              
              {/* Update item */}
              <div className={`relative flex items-start space-x-4 py-4 hover:bg-gray-50/50 transition-all duration-200 rounded-lg px-3 -mx-3 border-l-2 border-l-transparent ${getCategoryColors(update.category).hoverBorder}`}>
                {/* Commit dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <div className={`w-5 h-5 bg-white border-2 rounded-full relative z-10 transition-all duration-200 ${getCategoryColors(update.category).dot}`}>
                    <div className={`absolute inset-0.5 rounded-full transition-all duration-200 ${getCategoryColors(update.category).fill}`}></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Category label */}
                      {update.category && (
                        <div className="mb-2">
                          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColors(update.category).badge}`}>
                            <span className="truncate">
                              {getRepoDisplayName(update.repo)}: {update.category}
                            </span>
                          </span>
                        </div>
                      )}
                      
                      {/* Summary */}
                      <p className="text-sm text-gray-900 leading-relaxed mb-3 font-medium">
                        {update.summary}
                      </p>
                      
                      {/* Meta info */}
                      <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
                        {/* Clickable commit hash */}
                        <a
                          href={`https://github.com/openlearnnitj/openlearn-${update.repo || 'frontend'}/commit/${update.commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-2.5 py-1 rounded-md transition-colors duration-200"
                          title={`View commit ${update.commitHash} on GitHub`}
                        >
                          <GitCommit className="w-3 h-3 mr-1.5" />
                          <span className="font-mono text-xs">{update.commitHash}</span>
                          <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
                        </a>
                        
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">by</span>
                          <span className="font-medium text-gray-600">{update.author}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Time */}
                    <div className="flex-shrink-0 text-xs text-right">
                      <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-gray-700 mb-2">
                        <div className="font-medium">{formatDetailedDate(update.date)}</div>
                      </div>
                      <div className="flex items-center justify-end text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="font-mono">{update.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreUpdates && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMoreUpdates}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-[#FFDE59] hover:bg-[#FFDE59]/5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading more updates...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  <span>View More</span>
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {allUpdates.length - displayedUpdates.length} remaining
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        {!hasMoreUpdates && (
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
              <GitCommit className="w-3 h-3 mr-2" />
              <span>
                All updates loaded • Auto-synced with git history
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdatesPage
