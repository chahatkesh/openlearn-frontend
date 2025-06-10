import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play,
  Server,
  Network,
  Database,
  Activity,
  TestTube,
  Target,
  TrendingUp,
  Users,
  Settings,
  FileText,
  Timer,
  Eye,
  EyeOff
} from 'lucide-react';

/**
 * Comprehensive API Tests Component
 * Combines API Integration Checker, Integration Summary, Service Manager, and Resource Progress Testing
 */
const ComprehensiveAPITests = ({ user }) => {
  const [activeSection, setActiveSection] = useState('api-checker');
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [logs, setLogs] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('accessToken');

  // API Endpoints for testing
  const apiEndpoints = [
    // Progress Tracking Endpoints
    {
      category: 'Progress Tracking',
      tests: [
        {
          name: 'Get User Dashboard',
          method: 'GET',
          url: `${BASE_URL}/api/progress/dashboard`,
          description: 'Retrieve user dashboard with progress and badges'
        },
        {
          name: 'Get All Enrollments (Admin)',
          method: 'GET',
          url: `${BASE_URL}/api/progress/enrollments?page=1&limit=5`,
          description: 'Get paginated enrollments for admin view',
          requiresPathfinder: true
        },
        {
          name: 'Enroll User',
          method: 'POST',
          url: `${BASE_URL}/api/progress/enroll`,
          body: {
            cohortId: 'test_cohort',
            leagueId: 'test_league'
          },
          description: 'Enroll user in cohort/league',
          expectError: true
        }
      ]
    },
    // Resource Progress Endpoints
    {
      category: 'Resource Progress',
      tests: [
        {
          name: 'Get Resource Progress',
          method: 'GET',
          url: `${BASE_URL}/api/resource-progress/test-resource-123`,
          description: 'Get progress for a specific resource'
        },
        {
          name: 'Mark Resource Completed',
          method: 'POST',
          url: `${BASE_URL}/api/resource-progress/test-resource-123/complete`,
          body: {
            timeSpent: 300,
            personalNote: 'Test completion note'
          },
          description: 'Mark resource as completed with time tracking'
        },
        {
          name: 'Mark for Revision',
          method: 'POST',
          url: `${BASE_URL}/api/resource-progress/test-resource-123/revision`,
          body: {
            personalNote: 'Needs more review'
          },
          description: 'Mark resource for revision'
        },
        {
          name: 'Update Note',
          method: 'PUT',
          url: `${BASE_URL}/api/resource-progress/test-resource-123/note`,
          body: {
            personalNote: 'Updated test note'
          },
          description: 'Update personal note for resource'
        },
        {
          name: 'Reset Progress',
          method: 'DELETE',
          url: `${BASE_URL}/api/resource-progress/test-resource-123/reset`,
          description: 'Reset resource progress'
        },
        {
          name: 'Get Section Resources',
          method: 'GET',
          url: `${BASE_URL}/api/resource-progress/section/test-section-456/resources`,
          description: 'Get all resources in a section with progress'
        },
        {
          name: 'Get Revision List',
          method: 'GET',
          url: `${BASE_URL}/api/resource-progress/revision/list?page=1&limit=10`,
          description: 'Get paginated list of resources marked for revision'
        }
      ]
    },
    // Badge System Endpoints
    {
      category: 'Badge System',
      tests: [
        {
          name: 'Get All Badges',
          method: 'GET',
          url: `${BASE_URL}/api/badges`,
          description: 'Retrieve all available badges'
        },
        {
          name: 'Get User Badges',
          method: 'GET',
          url: `${BASE_URL}/api/badges/user/badges`,
          description: 'Get badges earned by current user'
        },
        {
          name: 'Create Badge (Admin)',
          method: 'POST',
          url: `${BASE_URL}/api/badges`,
          body: {
            name: 'Test Badge',
            description: 'Test badge description',
            criteria: 'Test criteria',
            iconUrl: 'https://example.com/icon.png'
          },
          description: 'Create a new badge (admin only)',
          requiresPathfinder: true
        }
      ]
    },
    // Admin Endpoints
    {
      category: 'Admin Management',
      tests: [
        {
          name: 'Get All Users',
          method: 'GET',
          url: `${BASE_URL}/api/admin/users`,
          description: 'Get all users (admin only)',
          requiresPathfinder: true
        },
        {
          name: 'Get All Cohorts',
          method: 'GET',
          url: `${BASE_URL}/api/admin/cohorts`,
          description: 'Get all cohorts (admin only)',
          requiresPathfinder: true
        },
        {
          name: 'Get All Leagues',
          method: 'GET',
          url: `${BASE_URL}/api/admin/leagues`,
          description: 'Get all leagues (admin only)',
          requiresPathfinder: true
        }
      ]
    }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testEndpoint = async (test) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const config = {
        method: test.method,
        headers
      };

      if (test.body && ['POST', 'PUT', 'PATCH'].includes(test.method)) {
        config.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, config);
      const data = await response.json();

      const result = {
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString()
      };

      if (test.expectError && !response.ok) {
        result.success = true; // Expected failure
        result.note = 'Expected error (test data)';
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults({});
    clearLogs();
    addLog('🚀 Starting comprehensive API tests...', 'info');

    const newResults = {};

    for (const category of apiEndpoints) {
      addLog(`📂 Testing ${category.category} endpoints...`, 'info');
      newResults[category.category] = {};

      for (const test of category.tests) {
        // Skip admin tests if user doesn't have required role
        if (test.requiresPathfinder && !['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user?.role)) {
          newResults[category.category][test.name] = {
            skipped: true,
            reason: 'Requires Pathfinder role'
          };
          addLog(`⏭️ Skipped: ${test.name} (requires Pathfinder role)`, 'info');
          continue;
        }

        setCurrentTest(`${category.category}: ${test.name}`);
        addLog(`🔄 Testing: ${test.name}`, 'info');

        const result = await testEndpoint(test);
        newResults[category.category][test.name] = result;

        if (result.success) {
          addLog(`✅ ${test.name}: Success`, 'success');
        } else {
          addLog(`❌ ${test.name}: ${result.error || 'Failed'}`, 'error');
        }

        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setResults(newResults);
    setCurrentTest('');
    setTesting(false);
    addLog('✅ All tests completed!', 'success');
  };

  const runCategoryTests = async (categoryName) => {
    setTesting(true);
    addLog(`🚀 Testing ${categoryName} endpoints...`, 'info');

    const category = apiEndpoints.find(cat => cat.category === categoryName);
    const newResults = { ...results };
    newResults[categoryName] = {};

    for (const test of category.tests) {
      if (test.requiresPathfinder && !['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user?.role)) {
        newResults[categoryName][test.name] = {
          skipped: true,
          reason: 'Requires Pathfinder role'
        };
        addLog(`⏭️ Skipped: ${test.name} (requires Pathfinder role)`, 'info');
        continue;
      }

      setCurrentTest(`${categoryName}: ${test.name}`);
      addLog(`🔄 Testing: ${test.name}`, 'info');

      const result = await testEndpoint(test);
      newResults[categoryName][test.name] = result;

      if (result.success) {
        addLog(`✅ ${test.name}: Success`, 'success');
      } else {
        addLog(`❌ ${test.name}: ${result.error || 'Failed'}`, 'error');
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResults(newResults);
    setCurrentTest('');
    setTesting(false);
    addLog(`✅ ${categoryName} tests completed!`, 'success');
  };

  const getOverallStats = () => {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    Object.values(results).forEach(category => {
      Object.values(category).forEach(result => {
        total++;
        if (result.skipped) {
          skipped++;
        } else if (result.success) {
          passed++;
        } else {
          failed++;
        }
      });
    });

    return { total, passed, failed, skipped };
  };

  const stats = getOverallStats();

  const renderAPIChecker = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Server className="mr-3 text-blue-600" size={24} />
              API Integration Checker
            </h3>
            <p className="text-gray-600 mt-1">
              Test all API endpoints for functionality and connectivity
            </p>
          </div>
          
          <button
            onClick={runAllTests}
            disabled={testing}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Play className="mr-2" size={16} />
            {testing ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {/* Overall Stats */}
        {stats.total > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
              <div className="text-sm text-yellow-600">Skipped</div>
            </div>
          </div>
        )}

        {/* Current Test */}
        {testing && currentTest && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <RefreshCw className="animate-spin mr-2 text-blue-600" size={16} />
              <span className="text-blue-800">Testing: {currentTest}</span>
            </div>
          </div>
        )}
      </div>

      {/* Test Categories */}
      <div className="space-y-4">
        {apiEndpoints.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
              <button
                onClick={() => runCategoryTests(category.category)}
                disabled={testing}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
              >
                Test Category
              </button>
            </div>

            <div className="space-y-3">
              {category.tests.map((test) => {
                const result = results[category.category]?.[test.name];
                const statusIcon = result?.skipped ? (
                  <AlertTriangle className="text-yellow-500" size={16} />
                ) : result?.success ? (
                  <CheckCircle className="text-green-500" size={16} />
                ) : result ? (
                  <XCircle className="text-red-500" size={16} />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                );

                return (
                  <div key={test.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {statusIcon}
                      <div>
                        <div className="font-medium text-gray-900">
                          {test.method} {test.name}
                          {test.requiresPathfinder && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Admin Only
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{test.description}</div>
                        {result?.note && (
                          <div className="text-xs text-blue-600 mt-1">{result.note}</div>
                        )}
                      </div>
                    </div>
                    
                    {result && !result.skipped && (
                      <div className="text-right">
                        <div className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.status || (result.success ? 'Success' : 'Failed')}
                        </div>
                        {result.timestamp && (
                          <div className="text-xs text-gray-500">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Test Logs */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2" size={20} />
            Test Logs
          </h4>
          <button
            onClick={clearLogs}
            className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className="mr-1" size={14} />
            Clear
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No logs yet. Run some tests to see results here.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={`text-sm ${
                  log.type === 'success' ? 'text-green-600' :
                  log.type === 'error' ? 'text-red-600' :
                  'text-gray-700'
                }`}>
                  <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderIntegrationStatus = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <Database className="mr-3 text-green-600" size={24} />
          Integration Status Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apiEndpoints.map((category) => {
            const categoryResults = results[category.category] || {};
            const categoryTests = Object.values(categoryResults);
            const passed = categoryTests.filter(r => r.success && !r.skipped).length;
            const total = categoryTests.filter(r => !r.skipped).length;
            const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
            
            return (
              <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                <div className="text-2xl font-bold mb-2" style={{
                  color: percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'
                }}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {passed}/{total} endpoints working
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Integration Health Score</h4>
          <div className="text-3xl font-bold text-blue-800">
            {stats.total > 0 ? Math.round((stats.passed / (stats.total - stats.skipped)) * 100) : 0}%
          </div>
          <div className="text-sm text-blue-700">
            Overall API integration health based on successful endpoint tests
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: 'api-checker',
      name: 'API Checker',
      icon: <Server size={20} />,
      description: 'Test all API endpoints'
    },
    {
      id: 'integration-status',
      name: 'Integration Status',
      icon: <Database size={20} />,
      description: 'View overall integration health'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-1">
        <nav className="flex space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {section.icon}
              <span className="ml-2">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      {activeSection === 'api-checker' && renderAPIChecker()}
      {activeSection === 'integration-status' && renderIntegrationStatus()}
    </div>
  );
};

export default ComprehensiveAPITests;
