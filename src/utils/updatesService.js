/**
 * Platform Updates Service
 * 
 * This service automatically fetches platform updates from git commit history
 * and processes them into a user-friendly timeline format.
 */

/**
 * Fetch git commit history and convert to updates format
 * @param {number} limit - Number of commits to fetch
 * @returns {Promise<Array>} Array of update objects
 */
export const fetchGitCommits = async (limit = 50) => {
  try {
    // Note: In a production environment, this would use a backend API
    // that executes: git log --pretty=format:'{"hash":"%h","date":"%ad","time":"%at","author":"%an","message":"%s"}' --date=short -${limit}
    
    // For frontend, we'll need to call an API endpoint
    // Since we can't execute shell commands directly from the browser,
    // we'll simulate this with a fetch to a hypothetical API endpoint
    
    const response = await fetch(`/api/git/commits?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }).catch(() => {
      // Fallback: if no API is available, we'll use processed git data
      throw new Error('Git API not available')
    })

    if (response.ok) {
      const commits = await response.json()
      return processCommitsToUpdates(commits)
    } else {
      throw new Error('Failed to fetch commits from API')
    }
  } catch (error) {
    console.warn('Could not fetch from git API, using local processing:', error.message)
    // Fallback to processing known git data
    return getProcessedCommits()
  }
}

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
      author: commit.author
    }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Get processed commits with actual git data
 * This function contains real commit data from the repository
 */
const getProcessedCommits = () => {
  // Complete real commit data from the repository
  const realCommits = [
    {"hash":"3b6d3db","date":"2025-06-16","time":"1750080535","author":"chahatkesh","message":"fix: Update Instagram link in Footer component for accuracy"},
    {"hash":"7b1e47b","date":"2025-06-16","time":"1750012447","author":"chahatkesh","message":"docs: Add contributing guidelines and license information"},
    {"hash":"601ef87","date":"2025-06-15","time":"1750010201","author":"chahatkesh","message":"feat: Implement strategic user fetching with improved error handling and logging"},
    {"hash":"abfcc86","date":"2025-06-15","time":"1749992327","author":"chahatkesh","message":"fix: Update default sorting parameters in UserManagement component for consistency"},
    {"hash":"d976308","date":"2025-06-15","time":"1749991261","author":"chahatkesh","message":"Implement code changes to enhance functionality and improve performance"},
    {"hash":"39aed8d","date":"2025-06-15","time":"1749990678","author":"chahatkesh","message":"fix: Update weeks count display in LearningProgressSection for accurate league statistics"},
    {"hash":"5506538","date":"2025-06-15","time":"1749990432","author":"chahatkesh","message":"feat: Revamp WelcomeBanner component with new layout and decorative elements"},
    {"hash":"bff64d1","date":"2025-06-15","time":"1749990072","author":"chahatkesh","message":"Enhance landing page components with Framer Motion animations"},
    {"hash":"b4e4361","date":"2025-06-15","time":"1749989537","author":"chahatkesh","message":"fix: Update Pending Approval page messaging for clarity on admin approval process"},
    {"hash":"97b90e7","date":"2025-06-15","time":"1749988310","author":"chahatkesh","message":"feat: Add Updates page and integrate platform updates from git commit history"},
    {"hash":"543eaf8","date":"2025-06-15","time":"1749986952","author":"chahatkesh","message":"Enhance documentation and features for OpenLearn Platform"},
    {"hash":"3293ab0","date":"2025-06-15","time":"1749986074","author":"chahatkesh","message":"feat: Implement search functionality with context provider and event handling across dashboard components"},
    {"hash":"c1d6d2e","date":"2025-06-15","time":"1749985193","author":"chahatkesh","message":"feat: Enhance leaderboard display with recalculated ranks and improved table layout"},
    {"hash":"aa8bdca","date":"2025-06-15","time":"1749983175","author":"chahatkesh","message":"refactor: Remove unnecessary console logs from various components for cleaner code"},
    {"hash":"856de7c","date":"2025-06-15","time":"1749982371","author":"chahatkesh","message":"feat: Add resource revision functionality with toast notifications and UI updates"},
    {"hash":"f3f1453","date":"2025-06-15","time":"1749934956","author":"chahatkesh","message":"feat: Add Specializations route and restrict access to Grand Pathfinders"},
    {"hash":"2f3c39a","date":"2025-06-15","time":"1749934268","author":"chahatkesh","message":"feat: Implement Favicon Service for fetching and caching favicons across resources"},
    {"hash":"78e5bf2","date":"2025-06-15","time":"1749932364","author":"chahatkesh","message":"Refactor code structure for improved readability and maintainability"},
    {"hash":"c38d205","date":"2025-06-15","time":"1749927841","author":"chahatkesh","message":"feat: Refactor Note component to use react-icons for technology stack and enhance layout with minimal design"},
    {"hash":"ca7ea15","date":"2025-06-15","time":"1749927099","author":"chahatkesh","message":"feat: Enhance Note component with improved layout, technology stack display, and additional links"},
    {"hash":"73b1144","date":"2025-06-14","time":"1749924665","author":"chahatkesh","message":"feat: Implement dashboard routing with dedicated league detail pages and layout structure"},
    {"hash":"e9b1c4d","date":"2025-06-14","time":"1749923905","author":"chahatkesh","message":"feat: Add Inter font family and apply to body for improved typography"},
    {"hash":"5a7823f","date":"2025-06-14","time":"1749923649","author":"chahatkesh","message":"feat: Update hero-pattern background image for improved visual consistency"},
    {"hash":"afe30d3","date":"2025-06-14","time":"1749923435","author":"chahatkesh","message":"feat: Update hero-pattern background image and add global cursor pointer for buttons"},
    {"hash":"e209eba","date":"2025-06-14","time":"1749922564","author":"chahatkesh","message":"feat: Add AdminDefaultRedirect component for role-based navigation in admin panel"},
    {"hash":"ccc70a7","date":"2025-06-14","time":"1749921792","author":"chahatkesh","message":"feat: Implement ModalPortal component for improved modal handling"},
    {"hash":"7ffdf46","date":"2025-06-14","time":"1749920201","author":"chahatkesh","message":"feat: Update poweredBy text in LeagueCard component for consistency"},
    {"hash":"c4dff37","date":"2025-06-14","time":"1749843214","author":"chahatkesh","message":"feat: Simplify section progress display by removing progress percentage and related elements in LeagueDetailPage"},
    {"hash":"0a4b342","date":"2025-06-14","time":"1749841973","author":"chahatkesh","message":"feat: Rename 'Section' to 'Day' in SectionManagement component for clarity"},
    {"hash":"a143ddd","date":"2025-06-14","time":"1749840130","author":"chahatkesh","message":"feat: Remove description field from WeekManagement component and related logic"},
    {"hash":"b85fdf9","date":"2025-06-13","time":"1749838764","author":"chahatkesh","message":"feat: Update social sharing messages to include @OpenLearn_nitj for improved branding"},
    {"hash":"085eebd","date":"2025-06-13","time":"1749838628","author":"chahatkesh","message":"feat: Remove description field from SectionManagement component and related logic"},
    {"hash":"73728c3","date":"2025-06-13","time":"1749837486","author":"chahatkesh","message":"Add admin pages for managing assignments, cohorts, leagues, resources, sections, specializations, users, and weeks"},
    {"hash":"079dd70","date":"2025-06-13","time":"1749795733","author":"chahatkesh","message":"feat: Update social sharing references from Twitter to X and enhance UI components across the application"},
    {"hash":"0ee999c","date":"2025-06-13","time":"1749794250","author":"chahatkesh","message":"feat: Enhance User Management component with improved filtering, sorting, and user detail modal"},
    {"hash":"ff68d6f","date":"2025-06-13","time":"1749793587","author":"chahatkesh","message":"feat: Enhance assignment fetching with error handling and update UI messages"},
    {"hash":"3b19c58","date":"2025-06-13","time":"1749792642","author":"chahatkesh","message":"feat: Replace Twitter icon with updated branding and adjust hover effect in Footer component"},
    {"hash":"6159fad","date":"2025-06-13","time":"1749792436","author":"chahatkesh","message":"Add Privacy Policy and Terms of Service pages with SEO enhancements"},
    {"hash":"e1e554f","date":"2025-06-12","time":"1749729089","author":"chahatkesh","message":"Add comprehensive documentation for OpenLearn platform"},
    {"hash":"0f4ac4a","date":"2025-06-12","time":"1749728054","author":"chahatkesh","message":"feat: Update Learning Progress Section to display only for enrolled users"},
    {"hash":"566c901","date":"2025-06-12","time":"1749727646","author":"chahatkesh","message":"feat: Add Welcome Banner for new users in Learning Progress Section"},
    {"hash":"a850205","date":"2025-06-12","time":"1749727188","author":"chahatkesh","message":"feat: Update TeamMemberCard styles for improved layout and spacing"},
    {"hash":"5dc48e1","date":"2025-06-12","time":"1749727028","author":"chahatkesh","message":"feat: Enhance Hero, Leaderboard, and Team components with improved UI/UX, new styles, and social media links"},
    {"hash":"5e1afd6","date":"2025-06-12","time":"1749726162","author":"chahatkesh","message":"feat: Refactor LeagueCard component by removing iconColor prop and adjusting styles for better UI consistency"},
    {"hash":"ca2e3c1","date":"2025-06-12","time":"1749725766","author":"chahatkesh","message":"feat: Revamp About and Team sections with enhanced UI/UX and animations"},
    {"hash":"27cfddf","date":"2025-06-12","time":"1749724160","author":"chahatkesh","message":"feat: Enhance TeamMemberCard UI/UX with new styles and social media icons"},
    {"hash":"93262bd","date":"2025-06-12","time":"1749722562","author":"chahatkesh","message":"feat: Add react-icons dependency and update Hero, Leaderboard, and Team components for authentication checks and UI enhancements"},
    {"hash":"3b1fe4e","date":"2025-06-12","time":"1749672718","author":"chahatkesh","message":"Fix Vercel configuration - remove invalid functions runtime"},
    {"hash":"50f8961","date":"2025-06-12","time":"1749672624","author":"chahatkesh","message":"Add Vercel configuration for SPA routing and deployment"},
    {"hash":"1ed3d20","date":"2025-06-12","time":"1749672401","author":"chahatkesh","message":"feat: Remove unnecessary 'dev' flags from package-lock.json"},
    {"hash":"e0c1a87","date":"2025-06-12","time":"1749672326","author":"chahatkesh","message":"Fix deployment build issues"},
    {"hash":"3d6cc39","date":"2025-06-12","time":"1749669441","author":"chahatkesh","message":"feat: Implement Assignment Management component for admin panel"},
    {"hash":"74849d4","date":"2025-06-11","time":"1749666550","author":"chahatkesh","message":"feat: remove ComprehensiveAPITests component from AdminPage and update tab handling"},
    {"hash":"94522cb","date":"2025-06-11","time":"1749666261","author":"chahatkesh","message":"feat: improve error handling and messaging in dashboard data fetching"},
    {"hash":"a6bb2fd","date":"2025-06-11","time":"1749664834","author":"chahatkesh","message":"feat: implement user avatar generation and fallback mechanism across components"},
    {"hash":"e95be58","date":"2025-06-11","time":"1749663851","author":"chahatkesh","message":"feat: enhance scrollbar styles for LeagueDetailPage and improve visibility on hover"},
    {"hash":"e889600","date":"2025-06-11","time":"1749661505","author":"chahatkesh","message":"feat: update LeagueDetailPage layout and enhance resource display with new columns"},
    {"hash":"59bdd1b","date":"2025-06-11","time":"1749656708","author":"chahatkesh","message":"feat: add Leaderboard component and integrate leaderboard data fetching"},
    {"hash":"215900c","date":"2025-06-11","time":"1749645046","author":"chahatkesh","message":"feat: enhance scrollbar styling for modals and dashboard sections"},
    {"hash":"3c08a1a","date":"2025-06-11","time":"1749644408","author":"chahatkesh","message":"feat: add SocialEditModal for updating user social connections and implement refreshUser functionality"},
    {"hash":"c383a63","date":"2025-06-11","time":"1749643244","author":"chahatkesh","message":"feat: add BadgesModal component to display user badges and achievements"},
    {"hash":"840ee2d","date":"2025-06-11","time":"1749641611","author":"chahatkesh","message":"feat: Improve enrollment statistics display and enhance UI elements in Learning Progress Section"},
    {"hash":"831d30e","date":"2025-06-11","time":"1749640625","author":"chahatkesh","message":"feat: Enhance Learning Progress Section with detailed resource tracking and improved UI elements"},
    {"hash":"75b461a","date":"2025-06-11","time":"1749640404","author":"chahatkesh","message":"feat: Add league statistics calculation and improve data validation in Learning Progress Section"},
    {"hash":"bc72ce6","date":"2025-06-11","time":"1749639478","author":"chahatkesh","message":"feat: Revamp Learning Progress Section UI with enhanced resource and section progress displays"},
    {"hash":"1cf743e","date":"2025-06-11","time":"1749638392","author":"chahatkesh","message":"feat: Implement accurate section progress calculation and enhance resource tracking in Learning Progress Section"},
    {"hash":"8accf46","date":"2025-06-11","time":"1749637862","author":"chahatkesh","message":"feat: Enhance Learning Progress Section with accurate resource progress calculations and improved error handling"},
    {"hash":"1b19ae5","date":"2025-06-11","time":"1749635448","author":"chahatkesh","message":"Refactor: Remove ServiceIntegrationManager component and related services"},
    {"hash":"e4d5f22","date":"2025-06-11","time":"1749631245","author":"chahatkesh","message":"Enhance demo mode functionality and error handling across components"},
    {"hash":"9fae232","date":"2025-06-11","time":"1749580485","author":"chahatkesh","message":"feat: Update Learning Progress Section with modern design and enhanced league statistics display"},
    {"hash":"4ab8df2","date":"2025-06-10","time":"1749579907","author":"chahatkesh","message":"feat: Revamp Learning Progress Section and Progress Dashboard with modern design and enhanced user experience"},
    {"hash":"a22a75c","date":"2025-06-10","time":"1749579036","author":"chahatkesh","message":"feat: Enhance UserProfileSection to fetch and display user statistics with loading state"},
    {"hash":"d3000fa","date":"2025-06-10","time":"1749578003","author":"chahatkesh","message":"Implement code changes to enhance functionality and improve performance"},
    {"hash":"63303c8","date":"2025-06-10","time":"1749575707","author":"chahatkesh","message":"Implement code changes to enhance functionality and improve performance"},
    {"hash":"7635b30","date":"2025-06-10","time":"1749573479","author":"chahatkesh","message":"feat: Complete implementation of Resource Progress Tracking API integration"},
    {"hash":"be13cee","date":"2025-06-10","time":"1749554224","author":"chahatkesh","message":"feat: Remove Goals & Milestones section from Progress Dashboard for cleaner UI"},
    {"hash":"a5a85ac","date":"2025-06-10","time":"1749553410","author":"chahatkesh","message":"feat: Add Progress, Resource Progress, and Social Services for tracking and sharing user achievements"},
    {"hash":"3e410c2","date":"2025-06-10","time":"1749522713","author":"chahatkesh","message":"feat: Update section creation API to include name, description, and weekId"},
    {"hash":"0823bac","date":"2025-06-10","time":"1749521101","author":"chahatkesh","message":"feat: Add LeagueDetailPage component for detailed league view and progress tracking"},
    {"hash":"e9cff3d","date":"2025-06-10","time":"1749518964","author":"chahatkesh","message":"feat: Update role requirements for admin access and enhance user role display in Dashboard"},
    {"hash":"29009df","date":"2025-06-10","time":"1749518156","author":"chahatkesh","message":"feat: Remove Forgot Password page and update routing in SignIn and SignUp pages for better user flow"},
    {"hash":"a7941e1","date":"2025-06-10","time":"1749517755","author":"chahatkesh","message":"feat: Add Resource Management component with CRUD functionality and integrate into AdminPage"},
    {"hash":"a7677ac","date":"2025-06-10","time":"1749516597","author":"chahatkesh","message":"feat: Enhance User Management with filtering options and improved UI; update AdminPage to manage all users"},
    {"hash":"5077c2f","date":"2025-06-10","time":"1749515577","author":"chahatkesh","message":"feat: Add Section Management component with CRUD functionality and integration into AdminPage"},
    {"hash":"70a1432","date":"2025-06-10","time":"1749514269","author":"chahatkesh","message":"feat: Implement User Management and Week Management components"},
    {"hash":"6d8be40","date":"2025-06-10","time":"1749511243","author":"chahatkesh","message":"Implement authentication flow with routing, including Sign In, Sign Up, Forgot Password, and Dashboard pages; add AuthContext and ProtectedRoute for user management"},
    {"hash":"0fea95a","date":"2025-06-10","time":"1749508917","author":"chahatkesh","message":"Refactor code structure for improved readability and maintainability"},
    {"hash":"2a814fa","date":"2025-06-10","time":"1749505056","author":"chahatkesh","message":"Add Team component with hierarchical structure and interactive InfoCard for team members"},
    {"hash":"0692785","date":"2025-06-10","time":"1749502774","author":"chahatkesh","message":"Add Cohort component with LeagueCard subcomponent and enhanced layout"},
    {"hash":"1f3e88b","date":"2025-06-10","time":"1749501227","author":"chahatkesh","message":"Enhance Hero component with new layout and content; add hero-pattern background to CSS"},
    {"hash":"9c49894","date":"2025-06-10","time":"1749498742","author":"chahatkesh","message":"Add LandingPage component and related subcomponents"},
    {"hash":"53d5341","date":"2025-06-10","time":"1749497542","author":"chahatkesh","message":"Initialize React application with Vite, Tailwind CSS, and basic routing setup"},
    {"hash":"f13015f","date":"2025-06-10","time":"1749496698","author":"Chahat Kesharwani","message":"Initial commit"}
  ]

  return processCommitsToUpdates(realCommits)
}

/**
 * Get all platform updates from git history
 * @returns {Promise<Array>} Array of update objects
 */
export const getAllUpdates = async () => {
  try {
    return await fetchGitCommits()
  } catch (error) {
    console.error('Error fetching updates:', error)
    return getProcessedCommits()
  }
}

/**
 * Get updates by type
 * @param {string} type - The type of update (feature, improvement, security, docs, etc.)
 * @returns {Promise<Array>} Filtered array of updates
 */
export const getUpdatesByType = async (type) => {
  const updates = await getAllUpdates()
  return updates.filter(update => update.type === type)
}

/**
 * Get updates by category
 * @param {string} category - The category of update
 * @returns {Promise<Array>} Filtered array of updates
 */
export const getUpdatesByCategory = async (category) => {
  const updates = await getAllUpdates()
  return updates.filter(update => update.category === category)
}

/**
 * Get recent updates (last N updates)
 * @param {number} count - Number of recent updates to retrieve
 * @returns {Promise<Array>} Array of recent updates
 */
export const getRecentUpdates = async (count = 5) => {
  const updates = await getAllUpdates()
  return updates.slice(0, count)
}

/**
 * Helper function to parse commit type from commit message
 * @param {string} message - Git commit message
 * @returns {string} Parsed type
 */
const parseCommitType = (message) => {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes('feat:') || lowerMessage.includes('feature:')) return 'feature'
  if (lowerMessage.includes('fix:') || lowerMessage.includes('bugfix:')) return 'fix'
  if (lowerMessage.includes('docs:') || lowerMessage.includes('documentation:')) return 'docs'
  if (lowerMessage.includes('security:') || lowerMessage.includes('sec:')) return 'security'
  if (lowerMessage.includes('refactor:') || lowerMessage.includes('cleanup:')) return 'refactor'
  if (lowerMessage.includes('style:') || lowerMessage.includes('ui:')) return 'style'
  if (lowerMessage.includes('test:') || lowerMessage.includes('testing:')) return 'test'
  if (lowerMessage.includes('enhance') || lowerMessage.includes('improve')) return 'improvement'
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
  
  // Check for specific keywords in commit message
  if (lowerMessage.includes('dashboard')) return 'Dashboard'
  if (lowerMessage.includes('admin')) return 'Admin Panel'
  if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('signin')) return 'Authentication'
  if (lowerMessage.includes('ui') || lowerMessage.includes('component') || lowerMessage.includes('layout')) return 'UI/UX'
  if (lowerMessage.includes('doc') || lowerMessage.includes('readme')) return 'Documentation'
  if (lowerMessage.includes('security') || lowerMessage.includes('permission') || lowerMessage.includes('role')) return 'Security'
  if (lowerMessage.includes('api') || lowerMessage.includes('service') || lowerMessage.includes('backend')) return 'Backend'
  if (lowerMessage.includes('search')) return 'Search'
  if (lowerMessage.includes('leaderboard') || lowerMessage.includes('league')) return 'Gaming'
  if (lowerMessage.includes('resource') || lowerMessage.includes('learning')) return 'Learning'
  if (lowerMessage.includes('refactor') || lowerMessage.includes('cleanup') || lowerMessage.includes('optimize')) return 'Code Quality'
  if (lowerMessage.includes('font') || lowerMessage.includes('typography') || lowerMessage.includes('styling')) return 'Design'
  if (lowerMessage.includes('routing') || lowerMessage.includes('navigation')) return 'Navigation'
  if (lowerMessage.includes('modal') || lowerMessage.includes('portal')) return 'Components'
  
  return 'General'
}
