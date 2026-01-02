import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, GitCommit, ChevronDown, ExternalLink } from 'lucide-react'
import { getAllUpdates, getUniqueContributors } from '../../utils/helpers/updatesService'

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
      case 'monitoring': return 'monitoring'
      default: return repo
    }
  }

  const getRepoColors = (repo) => {
    switch (repo) {
      case 'frontend':
      case 'client':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'border-blue-300 group-hover:border-blue-500',
          fill: 'bg-blue-100 group-hover:bg-blue-300'
        }
      case 'backend':
      case 'server':
        return {
          badge: 'bg-green-50 text-green-700 border-green-200',
          dot: 'border-green-300 group-hover:border-green-500',
          fill: 'bg-green-100 group-hover:bg-green-300'
        }
      case 'monitoring':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'border-purple-300 group-hover:border-purple-500',
          fill: 'bg-purple-100 group-hover:bg-purple-300'
        }
      default:
        return {
          badge: 'bg-gray-50 text-gray-600 border-gray-200',
          dot: 'border-gray-200 group-hover:border-[#FFDE59]',
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
    <div className="min-h-screen bg-gray/25">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {/* Logo - Clickable to go home */}
            <Link to="/" className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#FFDE59] to-[#FFD000] rounded-xl flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
              <img src="/logo.jpg" alt="OpenLearn" className="w-full h-full object-cover" />
            </Link>
            
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight mb-1">Platform Updates</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{allUpdates.length} commits</span>
                {contributors.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{contributors.length} contributors</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors */}
      {contributors.length > 0 && (
        <div className="bg-[#FFDE59] border-b border-[#FFD000]">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {contributors.map((contributor, index) => (
                <a
                  key={index}
                  href={`https://github.com/${contributor.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-900 hover:text-gray-700 transition-colors px-2 py-1 rounded-md hover:bg-white/40"
                  title={`${contributor.commitCount} commits`}
                >
                  <span>@{contributor.username}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-700">{contributor.commitCount}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="space-y-0 relative pt-8">
          {/* Continuous thread line from top to bottom */}
          <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-gray-100"></div>
          
          {displayedUpdates.map((update) => (
            <div 
              key={update.id} 
              className="relative"
            >
              {/* Update */}
              <div className="relative flex gap-4 pb-4 group">
                {/* Dot */}
                <div className="flex-shrink-0 mt-2">
                  <div className={`w-3 h-3 rounded-full border-2 bg-white relative z-0 transition-all group-hover:scale-125 group-hover:border-[#FFDE59] ${getRepoColors(update.repo).dot}`}>
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#FFDE59]/20 group-hover:to-[#FFD000]/20 transition-all"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRepoColors(update.repo).badge.replace('border-blue-200', 'border-0').replace('border-green-200', 'border-0').replace('border-purple-200', 'border-0').replace('border-gray-200', 'border-0')}`}>
                          {getRepoDisplayName(update.repo)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDetailedDate(update.date)}</span>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <p className="text-sm text-gray-900 leading-relaxed mb-4">
                      {update.summary}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="font-medium">{update.author}</span>
                        <span className="text-gray-300">|</span>
                        <a
                          href={`https://github.com/openlearnnitj/openlearn-${update.repo || 'frontend'}/commit/${update.commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-gray-500 hover:text-gray-900 transition-colors px-1.5 py-0.5 rounded hover:bg-[#FFDE59]/10"
                        >
                          {update.commitHash}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-gray-400">{update.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMoreUpdates && (
          <div className="text-center pt-4">
            <button
              onClick={loadMoreUpdates}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-[#FFDE59]/10 hover:border-[#FFDE59] hover:text-gray-900 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <span className="text-gray-400">({allUpdates.length - displayedUpdates.length})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* End */}
        {!hasMoreUpdates && displayedUpdates.length > 0 && (
          <div className="text-center pt-8">
            <p className="text-sm text-gray-400">All updates loaded</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdatesPage
