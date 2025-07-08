/**
 * GitHub API Service for real-time commit fetching
 * 
 * Features:
 * - Pagination support to fetch ALL commits (not limited to 100)
 * - Option to fetch recent commits for better performance
 * - Caching with separate cache keys for all vs recent commits
 * - Rate limiting friendly with proper headers
 */

const GITHUB_API_BASE = 'https://api.github.com';
const REPOS = [
  { name: 'openlearn-frontend', owner: 'openlearnnitj' },
  { name: 'openlearn-backend', owner: 'openlearnnitj' }
];

// Add your GitHub token here for higher rate limits (optional)
const GITHUB_TOKEN = import.meta.env.REACT_APP_GITHUB_TOKEN || null;

/**
 * Get headers for GitHub API requests
 */
const getGitHubHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OpenLearn-App'
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  return headers;
};

/**
 * Fetch commits from a single repository with pagination to get all commits
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} maxCommits - Maximum number of commits to fetch (0 = all)
 * @returns {Promise<Array>} Array of commit objects
 */
export const fetchRepoCommits = async (owner, repo, maxCommits = 0) => {
  const allCommits = [];
  let page = 1;
  const perPage = 100; // GitHub's maximum per page
  
  console.log(`Fetching commits from ${owner}/${repo}${maxCommits > 0 ? ` (max: ${maxCommits})` : ' (all)'}...`);
  
  while (true) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`;
    const response = await fetch(url, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    
    // If no commits returned, we've reached the end
    if (commits.length === 0) {
      break;
    }
    
    console.log(`Fetched page ${page}: ${commits.length} commits (total so far: ${allCommits.length + commits.length})`);
    
    // Transform GitHub API response to match your current format
    const transformedCommits = commits.map(commit => ({
      hash: commit.sha.substring(0, 7), // Short hash
      date: commit.commit.committer.date.split('T')[0], // YYYY-MM-DD format
      time: Math.floor(new Date(commit.commit.committer.date).getTime() / 1000).toString(), // Unix timestamp
      author: commit.author?.login || commit.commit.author.name,
      message: commit.commit.message.split('\n')[0], // First line only
      repo: repo.replace('openlearn-', '') // 'frontend' or 'backend'
    }));
    
    allCommits.push(...transformedCommits);
    
    // If we have a limit and we've reached it, stop
    if (maxCommits > 0 && allCommits.length >= maxCommits) {
      console.log(`Reached max commits limit (${maxCommits}), stopping at ${allCommits.length} commits`);
      return allCommits.slice(0, maxCommits);
    }
    
    // If we got less than the full page, we've reached the end
    if (commits.length < perPage) {
      console.log(`Reached end of commits (page ${page} returned ${commits.length} < ${perPage})`);
      break;
    }
    
    page++;
  }
  
  console.log(`Finished fetching ${allCommits.length} commits from ${owner}/${repo}`);
  return allCommits;
};

/**
 * Fetch commits from all configured repositories
 * @param {number} maxCommitsPerRepo - Maximum number of commits per repo (0 = all)
 * @returns {Promise<Array>} Combined array of all commits
 */
export const fetchAllRepoCommits = async (maxCommitsPerRepo = 0) => {
  const commitPromises = REPOS.map(repo => 
    fetchRepoCommits(repo.owner, repo.name, maxCommitsPerRepo)
  );
  
  const repoCommits = await Promise.all(commitPromises);
  
  // Combine all commits and sort by timestamp (latest first)
  const allCommits = repoCommits.flat();
  return allCommits.sort((a, b) => parseInt(b.time) - parseInt(a.time));
};

/**
 * Get real-time commits with caching
 * @param {boolean} useCache - Whether to use cached data if available
 * @param {boolean} fetchAll - Whether to fetch all commits or just recent ones
 * @param {number} recentCount - Number of recent commits if fetchAll is false
 * @returns {Promise<Array>} Array of commits
 */
export const getRealTimeCommits = async (useCache = true, fetchAll = true, recentCount = 100) => {
  const cacheKey = fetchAll ? 'github_commits_cache_all' : `github_commits_cache_recent_${recentCount}`;
  const cacheTimeKey = fetchAll ? 'github_commits_cache_time_all' : `github_commits_cache_time_recent_${recentCount}`;
  const cacheValidityMs = 5 * 60 * 1000; // 5 minutes

  // Check cache first if enabled
  if (useCache) {
    const cachedCommits = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    
    if (cachedCommits && cacheTime) {
      const timeDiff = Date.now() - parseInt(cacheTime);
      if (timeDiff < cacheValidityMs) {
        return JSON.parse(cachedCommits);
      }
    }
  }

  // Fetch fresh data
  const commits = fetchAll ? await fetchAllRepoCommits() : await fetchRecentCommits(recentCount);
  
  // Cache the results
  localStorage.setItem(cacheKey, JSON.stringify(commits));
  localStorage.setItem(cacheTimeKey, Date.now().toString());
  
  return commits;
};

/**
 * Fetch recent commits from all repositories (for performance)
 * @param {number} recentCount - Number of recent commits to fetch per repo
 * @returns {Promise<Array>} Combined array of recent commits
 */
export const fetchRecentCommits = async (recentCount = 50) => {
  return fetchAllRepoCommits(recentCount);
};

/**
 * Get repository statistics (for debugging and monitoring)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Repository statistics
 */
export const getRepoStats = async (owner, repo) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const response = await fetch(url, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repoData = await response.json();
    return {
      name: repoData.name,
      fullName: repoData.full_name,
      totalCommits: 'Unknown', // GitHub doesn't provide total count directly
      lastUpdated: repoData.updated_at,
      defaultBranch: repoData.default_branch,
      language: repoData.language,
      size: repoData.size
    };
  } catch (error) {
    console.error(`Error fetching stats for ${owner}/${repo}:`, error);
    return null;
  }
};
