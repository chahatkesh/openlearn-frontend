import { getRealTimeCommits } from '../api/githubService'

/**
 * Updates Service for processing and managing platform updates
 * 
 * Features:
 * - Process git commits into structured updates
 * - Support for fetching ALL commits or recent commits for performance
 * - Advanced commit message parsing for type and category detection
 * - Contributor analysis and statistics
 */

/**
 * Process raw commit data into updates format
 * @param {Array} commits - Raw git commit data
 * @returns {Array} Processed updates
 */
const processCommitsToUpdates = (commits) => {
  return commits.map((commit, index) => {
    const date = new Date(parseInt(commit.time) * 1000)
    const dateString = date.toISOString().split('T')[0]
    const timeString = date.toTimeString().split(' ')[0].substring(0, 5)
    
    return {
      id: index + 1,
      date: dateString,
      time: timeString,
      summary: parseCommitSummary(commit.message),
      category: parseCommitCategory(commit.message),
      commitHash: commit.hash,
      author: commit.author,
      repo: commit.repo || 'unknown',
      timestamp: parseInt(commit.time)
    }
  }).sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Get all platform updates from real-time GitHub API
 * @param {boolean} fetchAll - Whether to fetch all commits or just recent ones
 * @param {number} recentCount - Number of recent commits if fetchAll is false
 * @returns {Promise<Array>} Array of update objects
 */
export const getAllUpdates = async (fetchAll = true, recentCount = 200) => {
  const commits = await getRealTimeCommits(true, fetchAll, recentCount);
  return processCommitsToUpdates(commits);
}

/**
 * Get ALL platform updates (every single commit) from real-time GitHub API
 * @returns {Promise<Array>} Array of all update objects
 */
export const getAllUpdatesComplete = async () => {
  const commits = await getRealTimeCommits(true, true); // fetchAll = true, no limit
  return processCommitsToUpdates(commits);
}

/**
 * Get recent platform updates (for better performance)
 * @param {number} recentCount - Number of recent updates to fetch
 * @returns {Promise<Array>} Array of recent update objects
 */
export const getRecentUpdatesOptimized = async (recentCount = 200) => {
  const commits = await getRealTimeCommits(true, false, recentCount); // fetchAll = false, with limit
  return processCommitsToUpdates(commits);
}

/**
 * Get updates by category
 * @param {string} category - The category of update
 * @param {boolean} searchAll - Whether to search all commits or just recent ones
 * @returns {Promise<Array>} Filtered array of updates
 */
export const getUpdatesByCategory = async (category, searchAll = false) => {
  const updates = searchAll ? await getAllUpdatesComplete() : await getAllUpdates(false, 500);
  return updates.filter(update => update.category === category)
}

/**
 * Get recent updates (last N updates)
 * @param {number} count - Number of recent updates to retrieve
 * @returns {Promise<Array>} Array of recent updates
 */
export const getRecentUpdates = async (count = 5) => {
  // For recent updates, we only need a reasonable amount to choose from
  const updates = await getAllUpdates(false, Math.max(count * 2, 100));
  return updates.slice(0, count)
}

/**
 * Get unique contributors from all commits
 * @param {boolean} searchAll - Whether to search all commits or just recent ones for performance
 * @returns {Promise<Array>} Array of unique contributor objects with username and commit count
 */
export const getUniqueContributors = async (searchAll = true) => {
  try {
    // For contributors, we want to search all commits by default to get accurate counts
    const updates = searchAll ? await getAllUpdatesComplete() : await getAllUpdates(false, 1000);
    const contributorMap = new Map()
    
    updates.forEach(update => {
      const author = update.author
      // Filter out authors with spaces in their names (likely display names, not usernames)
      if (!author.includes(' ')) {
        if (contributorMap.has(author)) {
          contributorMap.set(author, contributorMap.get(author) + 1)
        } else {
          contributorMap.set(author, 1)
        }
      }
    })
    
    return Array.from(contributorMap.entries())
      .map(([username, commitCount]) => ({ username, commitCount }))
      .sort((a, b) => b.commitCount - a.commitCount) // Sort by commit count descending
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return []
  }
}

/**
 * Helper function to parse commit summary from commit message
 * @param {string} message - Git commit message
 * @returns {string} Cleaned summary
 */
const parseCommitSummary = (message) => {
  // Remove conventional commit prefixes and clean up
  let summary = message
    .replace(/^(feat|fix|docs|style|refactor|test|chore|security)(\(.+\))?:\s*/i, '')
    .trim()

  // Capitalize first letter
  if (summary.length > 0) {
    summary = summary.charAt(0).toUpperCase() + summary.slice(1)
  }

  return summary
}

/**
 * Helper function to parse category from commit message or files changed
 * @param {string} message - Git commit message
 * @returns {string} Inferred category
 */
const parseCommitCategory = (message) => {
  const lowerMessage = message.toLowerCase()
  
  // Prioritize conventional commit prefixes first
  if (lowerMessage.startsWith('feat:') || lowerMessage.startsWith('feature:')) {
    return getCategoryFromFeature(lowerMessage)
  }
  if (lowerMessage.startsWith('fix:')) {
    return getCategoryFromFix(lowerMessage)
  }
  if (lowerMessage.startsWith('chore:')) {
    return 'Maintenance'
  }
  if (lowerMessage.startsWith('refactor:')) {
    return 'Code Quality'
  }
  if (lowerMessage.startsWith('docs:')) {
    return 'Documentation'
  }
  if (lowerMessage.startsWith('test:')) {
    return 'Quality Assurance'
  }
  if (lowerMessage.startsWith('crit:')) {
    return 'Critical'
  }
  
  // Check for deployment and DevOps patterns
  if (lowerMessage.includes('deploy') || lowerMessage.includes('ci/cd') || lowerMessage.includes('workflow') || 
      lowerMessage.includes('docker') || lowerMessage.includes('aws') || lowerMessage.includes('render') || 
      lowerMessage.includes('vercel') || lowerMessage.includes('ec2') || lowerMessage.includes('production') ||
      lowerMessage.includes('staging') || lowerMessage.includes('pipeline')) {
    return 'DevOps'
  }
  
  // Database and backend infrastructure
  if (lowerMessage.includes('prisma') || lowerMessage.includes('schema') || lowerMessage.includes('migration') ||
      lowerMessage.includes('database') || lowerMessage.includes('db') || lowerMessage.includes('health check') ||
      lowerMessage.includes('keepalive') || lowerMessage.includes('status') || lowerMessage.includes('monitoring')) {
    return 'Database'
  }
  
  // Authentication and security
  if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('signin') ||
      lowerMessage.includes('signup') || lowerMessage.includes('permission') || lowerMessage.includes('role') ||
      lowerMessage.includes('security') || lowerMessage.includes('approval') || lowerMessage.includes('access')) {
    return 'Authentication'
  }
  
  // Admin panel and management
  if (lowerMessage.includes('admin') || lowerMessage.includes('management') || lowerMessage.includes('crud') ||
      lowerMessage.includes('user management') || lowerMessage.includes('section management') ||
      lowerMessage.includes('resource management') || lowerMessage.includes('week management') ||
      lowerMessage.includes('cohort') || lowerMessage.includes('assignment')) {
    return 'Admin Panel'
  }
  
  // Learning and educational features
  if (lowerMessage.includes('learning') || lowerMessage.includes('resource') || lowerMessage.includes('section') ||
      lowerMessage.includes('progress') || lowerMessage.includes('badge') || lowerMessage.includes('completion') ||
      lowerMessage.includes('enrollment') || lowerMessage.includes('specialization') || lowerMessage.includes('week')) {
    return 'Learning Platform'
  }
  
  // Gaming and social features
  if (lowerMessage.includes('leaderboard') || lowerMessage.includes('league') || lowerMessage.includes('rank') ||
      lowerMessage.includes('social') || lowerMessage.includes('sharing') || lowerMessage.includes('badge') ||
      lowerMessage.includes('achievement') || lowerMessage.includes('statistics') || lowerMessage.includes('pathfinder')) {
    return 'Gamification'
  }
  
  // UI/UX and components
  if (lowerMessage.includes('component') || lowerMessage.includes('modal') || lowerMessage.includes('portal') ||
      lowerMessage.includes('layout') || lowerMessage.includes('hero') || lowerMessage.includes('banner') ||
      lowerMessage.includes('card') || lowerMessage.includes('button') || lowerMessage.includes('form') ||
      lowerMessage.includes('dropdown') || lowerMessage.includes('tooltip') || lowerMessage.includes('animation') ||
      lowerMessage.includes('framer motion') || lowerMessage.includes('ui')) {
    return 'UI Components'
  }
  
  // Design and styling
  if (lowerMessage.includes('styling') || lowerMessage.includes('css') || lowerMessage.includes('tailwind') ||
      lowerMessage.includes('font') || lowerMessage.includes('typography') || lowerMessage.includes('color') ||
      lowerMessage.includes('spacing') || lowerMessage.includes('layout') || lowerMessage.includes('design') ||
      lowerMessage.includes('background') || lowerMessage.includes('scrollbar') || lowerMessage.includes('hover') ||
      lowerMessage.includes('visual') || lowerMessage.includes('favicon') || lowerMessage.includes('icon')) {
    return 'Design & Styling'
  }
  
  // Navigation and routing
  if (lowerMessage.includes('routing') || lowerMessage.includes('navigation') || lowerMessage.includes('redirect') ||
      lowerMessage.includes('route') || lowerMessage.includes('page') || lowerMessage.includes('spa')) {
    return 'Navigation'
  }
  
  // Search and filtering
  if (lowerMessage.includes('search') || lowerMessage.includes('filter') || lowerMessage.includes('pagination') ||
      lowerMessage.includes('sorting') || lowerMessage.includes('limit') || lowerMessage.includes('query')) {
    return 'Search & Filtering'
  }
  
  // User experience improvements
  if (lowerMessage.includes('keyboard') || lowerMessage.includes('shortcut') || lowerMessage.includes('focus') ||
      lowerMessage.includes('accessibility') || lowerMessage.includes('ux') || lowerMessage.includes('experience') ||
      lowerMessage.includes('interaction') || lowerMessage.includes('responsive') || lowerMessage.includes('mobile')) {
    return 'User Experience'
  }
  
  // API and backend services
  if (lowerMessage.includes('api') || lowerMessage.includes('endpoint') || lowerMessage.includes('service') ||
      lowerMessage.includes('controller') || lowerMessage.includes('backend') || lowerMessage.includes('server') ||
      lowerMessage.includes('middleware') || lowerMessage.includes('validation') || lowerMessage.includes('error handling')) {
    return 'Backend API'
  }
  
  // Documentation and guides
  if (lowerMessage.includes('doc') || lowerMessage.includes('readme') || lowerMessage.includes('contributing') ||
      lowerMessage.includes('license') || lowerMessage.includes('guide') || lowerMessage.includes('changelog') ||
      lowerMessage.includes('comment') || lowerMessage.includes('jsdoc') || lowerMessage.includes('documentation')) {
    return 'Documentation'
  }
  
  // Code quality and maintenance
  if (lowerMessage.includes('refactor') || lowerMessage.includes('cleanup') || lowerMessage.includes('optimize') ||
      lowerMessage.includes('performance') || lowerMessage.includes('lint') || lowerMessage.includes('format') ||
      lowerMessage.includes('remove unused') || lowerMessage.includes('console log') || lowerMessage.includes('maintainability') ||
      lowerMessage.includes('code structure') || lowerMessage.includes('readability')) {
    return 'Code Quality'
  }
  
  // Testing and quality assurance
  if (lowerMessage.includes('test') || lowerMessage.includes('testing') || lowerMessage.includes('bug') ||
      lowerMessage.includes('issue') || lowerMessage.includes('template') || lowerMessage.includes('qa') ||
      lowerMessage.includes('quality') || lowerMessage.includes('validation') || lowerMessage.includes('integrity')) {
    return 'Quality Assurance'
  }
  
  // Version control and collaboration
  if (lowerMessage.includes('merge') || lowerMessage.includes('pull request') || lowerMessage.includes('branch') ||
      lowerMessage.includes('conflict') || lowerMessage.includes('upstream') || lowerMessage.includes('git') ||
      lowerMessage.includes('commit')) {
    return 'Version Control'
  }
  
  // Third-party integrations
  if (lowerMessage.includes('integration') || lowerMessage.includes('twitter') || lowerMessage.includes('instagram') ||
      lowerMessage.includes('github') || lowerMessage.includes('linkedin') || lowerMessage.includes('external') ||
      lowerMessage.includes('cdn') || lowerMessage.includes('dependency')) {
    return 'Integrations'
  }
  
  // Configuration and setup
  if (lowerMessage.includes('config') || lowerMessage.includes('setup') || lowerMessage.includes('init') ||
      lowerMessage.includes('package') || lowerMessage.includes('dependency') || lowerMessage.includes('env') ||
      lowerMessage.includes('environment') || lowerMessage.includes('build') || lowerMessage.includes('vite') ||
      lowerMessage.includes('webpack') || lowerMessage.includes('babel')) {
    return 'Configuration'
  }
  
  // Error handling and debugging
  if (lowerMessage.includes('error') || lowerMessage.includes('exception') || lowerMessage.includes('debug') ||
      lowerMessage.includes('troubleshoot') || lowerMessage.includes('logging') || lowerMessage.includes('catch') ||
      lowerMessage.includes('handling') || lowerMessage.includes('fallback')) {
    return 'Error Handling'
  }
  
  // Privacy and legal
  if (lowerMessage.includes('privacy') || lowerMessage.includes('terms') || lowerMessage.includes('policy') ||
      lowerMessage.includes('legal') || lowerMessage.includes('compliance') || lowerMessage.includes('gdpr')) {
    return 'Legal & Privacy'
  }
  
  // Performance and optimization
  if (lowerMessage.includes('performance') || lowerMessage.includes('optimization') || lowerMessage.includes('speed') ||
      lowerMessage.includes('loading') || lowerMessage.includes('cache') || lowerMessage.includes('lazy') ||
      lowerMessage.includes('bundle') || lowerMessage.includes('compress')) {
    return 'Performance'
  }

  // Default fallback
  return 'General'
}

// Helper function for feature categorization
const getCategoryFromFeature = (message) => {
  if (message.includes('dashboard')) return 'Dashboard'
  if (message.includes('admin')) return 'Admin Panel'
  if (message.includes('auth') || message.includes('login')) return 'Authentication'
  if (message.includes('learning') || message.includes('resource')) return 'Learning Platform'
  if (message.includes('ui') || message.includes('component')) return 'UI Components'
  if (message.includes('leaderboard') || message.includes('league')) return 'Gamification'
  if (message.includes('search') || message.includes('filter')) return 'Search & Filtering'
  if (message.includes('deploy') || message.includes('ci/cd')) return 'DevOps'
  if (message.includes('api') || message.includes('backend')) return 'Backend API'
  if (message.includes('doc') || message.includes('readme')) return 'Documentation'
  return 'Features'
}

// Helper function for fix categorization
const getCategoryFromFix = (message) => {
  if (message.includes('deploy') || message.includes('docker') || message.includes('ci/cd')) return 'DevOps'
  if (message.includes('prisma') || message.includes('schema') || message.includes('database')) return 'Database'
  if (message.includes('auth') || message.includes('login') || message.includes('permission')) return 'Authentication'
  if (message.includes('ui') || message.includes('component') || message.includes('modal')) return 'UI Components'
  if (message.includes('api') || message.includes('backend') || message.includes('endpoint')) return 'Backend API'
  if (message.includes('routing') || message.includes('navigation')) return 'Navigation'
  if (message.includes('focus') || message.includes('textarea') || message.includes('keyboard')) return 'User Experience'
  if (message.includes('styling') || message.includes('css') || message.includes('layout')) return 'Design & Styling'
  if (message.includes('package') || message.includes('dependency') || message.includes('build')) return 'Configuration'
  return 'Bug Fixes'
}