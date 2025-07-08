import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, GitCommit, ChevronDown, ExternalLink } from 'lucide-react'
import { getAllUpdates, getUniqueContributors } from '../utils/updatesService'

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

  const getTypeBgColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'fix': return 'bg-red-100 text-red-800 border-red-300'
      case 'refactor': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'docs': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'style': return 'bg-pink-100 text-pink-800 border-pink-300'
      case 'test': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'security': return 'bg-red-200 text-red-900 border-red-400'
      case 'improvement': return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      case 'chore': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getRepoBgColor = (repo) => {
    switch (repo) {
      case 'frontend': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'backend': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getDotColor = (type) => {
    switch (type) {
      case 'feature': return 'border-emerald-300 group-hover:border-emerald-500'
      case 'fix': return 'border-red-300 group-hover:border-red-500'
      case 'refactor': return 'border-blue-300 group-hover:border-blue-500'
      case 'docs': return 'border-purple-300 group-hover:border-purple-500'
      case 'style': return 'border-pink-300 group-hover:border-pink-500'
      case 'test': return 'border-orange-300 group-hover:border-orange-500'
      case 'security': return 'border-red-400 group-hover:border-red-600'
      case 'improvement': return 'border-indigo-300 group-hover:border-indigo-500'
      default: return 'border-gray-200 group-hover:border-[#FFDE59]'
    }
  }

  const getHoverBorderColor = (type) => {
    switch (type) {
      case 'feature': return 'hover:border-l-emerald-300'
      case 'fix': return 'hover:border-l-red-300'
      case 'refactor': return 'hover:border-l-blue-300'
      case 'docs': return 'hover:border-l-purple-300'
      case 'style': return 'hover:border-l-pink-300'
      case 'test': return 'hover:border-l-orange-300'
      case 'security': return 'hover:border-l-red-400'
      case 'improvement': return 'hover:border-l-indigo-300'
      default: return 'hover:border-l-[#FFDE59]'
    }
  }

  const getDotFillColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-emerald-100 group-hover:bg-emerald-300'
      case 'fix': return 'bg-red-100 group-hover:bg-red-300'
      case 'refactor': return 'bg-blue-100 group-hover:bg-blue-300'
      case 'docs': return 'bg-purple-100 group-hover:bg-purple-300'
      case 'style': return 'bg-pink-100 group-hover:bg-pink-300'
      case 'test': return 'bg-orange-100 group-hover:bg-orange-300'
      case 'security': return 'bg-red-200 group-hover:bg-red-400'
      case 'improvement': return 'bg-indigo-100 group-hover:bg-indigo-300'
      default: return 'bg-gray-100 group-hover:bg-[#FFDE59]'
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
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-0">
          {displayedUpdates.map((update, index) => (
            <div 
              key={update.id} 
              className="relative group"
            >
              {/* Thread line */}
              {index < displayedUpdates.length - 1 && (
                <div className="absolute left-2 top-8 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent"></div>
              )}
              
              {/* Update item */}
              <div className={`relative flex items-start space-x-3 py-3 hover:bg-gray-50 transition-all duration-200 rounded-md px-2 -mx-2 border-l-2 border-l-transparent ${getHoverBorderColor(update.type)}`}>
                {/* Commit dot */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-4 h-4 bg-white border-2 rounded-full relative z-10 transition-colors ${getDotColor(update.type)}`}>
                    <div className={`absolute inset-0.5 rounded-full transition-colors ${getDotFillColor(update.type)}`}></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      {/* Type badge */}
                      {update.type && (
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${getTypeBgColor(update.type)} mb-1`}>
                          {update.type}
                        </span>
                      )}
                      
                      {/* Summary */}
                      <p className="text-sm text-gray-900 leading-relaxed mb-1">
                        {update.summary}
                      </p>
                      
                      {/* Meta info */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {/* Repo tag */}
                        {update.repo && (
                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${getRepoBgColor(update.repo)}`}>
                            {update.repo}
                          </span>
                        )}
                        
                        {/* Clickable commit hash */}
                        <a
                          href={`https://github.com/openlearnnitj/openlearn-${update.repo || 'frontend'}/commit/${update.commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full transition-colors hover:text-gray-700"
                          title={`View commit ${update.commitHash} on GitHub`}
                        >
                          <GitCommit className="w-3 h-3 mr-1" />
                          <span className="font-mono">{update.commitHash}</span>
                          <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                        </a>
                        
                        <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-600">
                          {update.category}
                        </span>
                        <span>by {update.author}</span>
                      </div>
                    </div>
                    
                    {/* Time */}
                    <div className="text-xs text-gray-400 text-right min-w-0 ml-2">
                      <div className="bg-gray-50 px-2 py-1 rounded text-gray-600 mb-1">
                        {formatDetailedDate(update.date)}
                      </div>
                      <div className="flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" />
                        {update.time}
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
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreUpdates}
              disabled={loadingMore}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-[#FFDE59] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View More ({allUpdates.length - displayedUpdates.length} remaining)
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        {!hasMoreUpdates && (
          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <div className="inline-flex items-center text-xs text-gray-500">
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
