import { getRealTimeCommits } from './githubService'

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
      type: parseCommitType(commit.message),
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
 * Get updates by type
 * @param {string} type - The type of update (feature, improvement, security, docs, etc.)
 * @param {boolean} searchAll - Whether to search all commits or just recent ones
 * @returns {Promise<Array>} Filtered array of updates
 */
export const getUpdatesByType = async (type, searchAll = false) => {
  const updates = searchAll ? await getAllUpdatesComplete() : await getAllUpdates(false, 500);
  return updates.filter(update => update.type === type)
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
 * Helper function to parse commit type from commit message
 * @param {string} message - Git commit message
 * @returns {string} Parsed type
 */
const parseCommitType = (message) => {
  const lowerMessage = message.toLowerCase().trim()
  
  // Handle conventional commit prefixes with colon
  if (lowerMessage.includes(':')) {
    const prefix = lowerMessage.split(':')[0].trim()
    
    // Primary conventional commit types
    if (prefix === 'feat' || prefix === 'feature') return 'feature'
    if (prefix === 'fix' || prefix === 'bugfix') return 'fix'
    if (prefix === 'docs' || prefix === 'doc' || prefix === 'documentation') return 'docs'
    if (prefix === 'style' || prefix === 'ui' || prefix === 'design') return 'style'
    if (prefix === 'refactor' || prefix === 'cleanup') return 'refactor'
    if (prefix === 'test' || prefix === 'testing') return 'test'
    if (prefix === 'chore' || prefix === 'maintenance') return 'chore'
    if (prefix === 'perf' || prefix === 'performance') return 'performance'
    if (prefix === 'ci' || prefix === 'build') return 'ci'
    if (prefix === 'revert') return 'revert'
    
    // Extended conventional commit types
    if (prefix === 'security' || prefix === 'sec') return 'security'
    if (prefix === 'config' || prefix === 'conf') return 'config'
    if (prefix === 'deploy' || prefix === 'deployment') return 'deploy'
    if (prefix === 'hotfix' || prefix === 'patch') return 'hotfix'
    if (prefix === 'breaking' || prefix === 'break') return 'breaking'
    if (prefix === 'deps' || prefix === 'dependency') return 'deps'
    if (prefix === 'wip' || prefix === 'work in progress') return 'wip'
    if (prefix === 'init' || prefix === 'initial') return 'init'
    if (prefix === 'release' || prefix === 'version') return 'release'
    if (prefix === 'merge') return 'merge'
    if (prefix === 'crit' || prefix === 'critical') return 'critical'
  }
  
  // Handle messages without conventional prefixes
  // Check for action words at the beginning
  const words = lowerMessage.split(' ')
  const firstWord = words[0]
  const firstTwoWords = words.slice(0, 2).join(' ')
  
  // Action-based type detection
  if (firstWord === 'add' || firstWord === 'added' || firstWord === 'adding') {
    return 'feature'
  }
  if (firstWord === 'implement' || firstWord === 'implemented' || firstWord === 'implementing') {
    return 'feature'
  }
  if (firstWord === 'create' || firstWord === 'created' || firstWord === 'creating') {
    return 'feature'
  }
  if (firstWord === 'build' || firstWord === 'built' || firstWord === 'building') {
    return 'feature'
  }
  if (firstWord === 'introduce' || firstWord === 'introduced' || firstWord === 'introducing') {
    return 'feature'
  }
  
  // Fix-related actions
  if (firstWord === 'fix' || firstWord === 'fixed' || firstWord === 'fixing') {
    return 'fix'
  }
  if (firstWord === 'resolve' || firstWord === 'resolved' || firstWord === 'resolving') {
    return 'fix'
  }
  if (firstWord === 'correct' || firstWord === 'corrected' || firstWord === 'correcting') {
    return 'fix'
  }
  if (firstWord === 'repair' || firstWord === 'repaired' || firstWord === 'repairing') {
    return 'fix'
  }
  if (firstWord === 'patch' || firstWord === 'patched' || firstWord === 'patching') {
    return 'fix'
  }
  
  // Improvement-related actions
  if (firstWord === 'improve' || firstWord === 'improved' || firstWord === 'improving') {
    return 'improvement'
  }
  if (firstWord === 'enhance' || firstWord === 'enhanced' || firstWord === 'enhancing') {
    return 'improvement'
  }
  if (firstWord === 'optimize' || firstWord === 'optimized' || firstWord === 'optimizing') {
    return 'performance'
  }
  if (firstWord === 'upgrade' || firstWord === 'upgraded' || firstWord === 'upgrading') {
    return 'improvement'
  }
  if (firstWord === 'refine' || firstWord === 'refined' || firstWord === 'refining') {
    return 'improvement'
  }
  
  // Refactor-related actions
  if (firstWord === 'refactor' || firstWord === 'refactored' || firstWord === 'refactoring') {
    return 'refactor'
  }
  if (firstWord === 'restructure' || firstWord === 'restructured' || firstWord === 'restructuring') {
    return 'refactor'
  }
  if (firstWord === 'reorganize' || firstWord === 'reorganized' || firstWord === 'reorganizing') {
    return 'refactor'
  }
  if (firstWord === 'cleanup' || firstWord === 'clean') {
    return 'refactor'
  }
  if (firstWord === 'simplify' || firstWord === 'simplified' || firstWord === 'simplifying') {
    return 'refactor'
  }
  
  // Removal-related actions
  if (firstWord === 'remove' || firstWord === 'removed' || firstWord === 'removing') {
    return 'refactor'
  }
  if (firstWord === 'delete' || firstWord === 'deleted' || firstWord === 'deleting') {
    return 'refactor'
  }
  if (firstWord === 'drop' || firstWord === 'dropped' || firstWord === 'dropping') {
    return 'refactor'
  }
  
  // Update-related actions
  if (firstWord === 'update' || firstWord === 'updated' || firstWord === 'updating') {
    return 'update'
  }
  if (firstWord === 'modify' || firstWord === 'modified' || firstWord === 'modifying') {
    return 'update'
  }
  if (firstWord === 'change' || firstWord === 'changed' || firstWord === 'changing') {
    return 'update'
  }
  if (firstWord === 'adjust' || firstWord === 'adjusted' || firstWord === 'adjusting') {
    return 'update'
  }
  if (firstWord === 'revise' || firstWord === 'revised' || firstWord === 'revising') {
    return 'update'
  }
  
  // Merge-related
  if (firstWord === 'merge' || firstWord === 'merged' || firstWord === 'merging') {
    return 'merge'
  }
  if (firstTwoWords === 'merge pull' || firstTwoWords === 'merge branch') {
    return 'merge'
  }
  
  // Documentation-related
  if (firstWord === 'document' || firstWord === 'documented' || firstWord === 'documenting') {
    return 'docs'
  }
  if (firstWord === 'readme' || lowerMessage.includes('readme')) {
    return 'docs'
  }
  
  // Configuration-related
  if (firstWord === 'configure' || firstWord === 'configured' || firstWord === 'configuring') {
    return 'config'
  }
  if (firstWord === 'setup' || firstWord === 'set' || firstWord === 'install') {
    return 'config'
  }
  
  // Initial/Bootstrap
  if (firstWord === 'initial' || firstWord === 'initialize' || firstWord === 'init') {
    return 'init'
  }
  if (firstWord === 'bootstrap' || firstWord === 'scaffolding') {
    return 'init'
  }
  
  // Content-based detection (fallback)
  if (lowerMessage.includes('security') || lowerMessage.includes('vulnerability') || 
      lowerMessage.includes('permission') || lowerMessage.includes('auth')) {
    return 'security'
  }
  
  if (lowerMessage.includes('test') || lowerMessage.includes('testing') || 
      lowerMessage.includes('spec') || lowerMessage.includes('unit test')) {
    return 'test'
  }
  
  if (lowerMessage.includes('style') || lowerMessage.includes('css') || 
      lowerMessage.includes('styling') || lowerMessage.includes('design') ||
      lowerMessage.includes('ui') || lowerMessage.includes('layout')) {
    return 'style'
  }
  
  if (lowerMessage.includes('performance') || lowerMessage.includes('optimize') || 
      lowerMessage.includes('speed') || lowerMessage.includes('efficiency')) {
    return 'performance'
  }
  
  if (lowerMessage.includes('deploy') || lowerMessage.includes('deployment') || 
      lowerMessage.includes('ci/cd') || lowerMessage.includes('build') ||
      lowerMessage.includes('pipeline') || lowerMessage.includes('workflow')) {
    return 'ci'
  }
  
  if (lowerMessage.includes('dependency') || lowerMessage.includes('package') || 
      lowerMessage.includes('deps') || lowerMessage.includes('npm') ||
      lowerMessage.includes('yarn') || lowerMessage.includes('upgrade')) {
    return 'deps'
  }
  
  if (lowerMessage.includes('breaking') || lowerMessage.includes('break') || 
      lowerMessage.includes('major') || lowerMessage.includes('incompatible')) {
    return 'breaking'
  }
  
  if (lowerMessage.includes('hotfix') || lowerMessage.includes('critical') || 
      lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
    return 'hotfix'
  }
  
  if (lowerMessage.includes('wip') || lowerMessage.includes('work in progress') || 
      lowerMessage.includes('partial') || lowerMessage.includes('incomplete')) {
    return 'wip'
  }
  
  if (lowerMessage.includes('revert') || lowerMessage.includes('rollback') || 
      lowerMessage.includes('undo')) {
    return 'revert'
  }
  
  // Check for improvement indicators
  if (lowerMessage.includes('enhance') || lowerMessage.includes('improve') || 
      lowerMessage.includes('better') || lowerMessage.includes('upgrade') ||
      lowerMessage.includes('modernize') || lowerMessage.includes('revamp')) {
    return 'improvement'
  }
  
  // Default fallback
  return 'update'
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
    return 'Testing'
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