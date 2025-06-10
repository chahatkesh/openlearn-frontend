import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  FileText,
  TestTube,
  Target,
  TrendingUp,
  Users,
  Database
} from 'lucide-react';
import ResourceProgressService from '../../utils/resourceProgressService';

/**
 * Resource Progress Integration Test Component
 * Comprehensive testing interface for Resource Progress API endpoints
 */
const ResourceProgressIntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState('all');
  const [testResourceId, setTestResourceId] = useState('test-resource-123');
  const [testSectionId, setTestSectionId] = useState('test-section-456');
  const [testNote, setTestNote] = useState('This is a test note for resource progress tracking.');
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults({});
  };

  // Individual API endpoint tests
  const testEndpoints = {
    getResourceProgress: {
      name: 'Get Resource Progress',
      description: 'GET /api/resource-progress/:resourceId',
      test: async () => {
        try {
          const result = await ResourceProgressService.getResourceProgress(testResourceId);
          addLog('✅ Get Resource Progress: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Get Resource Progress: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    markResourceCompleted: {
      name: 'Mark Resource Completed',
      description: 'POST /api/resource-progress/:resourceId/complete',
      test: async () => {
        try {
          const result = await ResourceProgressService.markResourceCompleted(
            testResourceId, 
            300, // 5 minutes
            testNote
          );
          addLog('✅ Mark Resource Completed: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Mark Resource Completed: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    markResourceForRevision: {
      name: 'Mark Resource for Revision',
      description: 'POST /api/resource-progress/:resourceId/revision',
      test: async () => {
        try {
          const result = await ResourceProgressService.markResourceForRevision(
            testResourceId,
            'Needs more review on this topic'
          );
          addLog('✅ Mark Resource for Revision: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Mark Resource for Revision: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    updateResourceNote: {
      name: 'Update Resource Note',
      description: 'PUT /api/resource-progress/:resourceId/note',
      test: async () => {
        try {
          const result = await ResourceProgressService.updateResourceNote(
            testResourceId,
            'Updated note: ' + new Date().toISOString()
          );
          addLog('✅ Update Resource Note: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Update Resource Note: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    resetResourceProgress: {
      name: 'Reset Resource Progress',
      description: 'DELETE /api/resource-progress/:resourceId/reset',
      test: async () => {
        try {
          const result = await ResourceProgressService.resetResourceProgress(testResourceId);
          addLog('✅ Reset Resource Progress: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Reset Resource Progress: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    getSectionResourcesProgress: {
      name: 'Get Section Resources Progress',
      description: 'GET /api/resource-progress/section/:sectionId/resources',
      test: async () => {
        try {
          const result = await ResourceProgressService.getSectionResourcesProgress(testSectionId);
          addLog('✅ Get Section Resources Progress: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Get Section Resources Progress: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    getRevisionResources: {
      name: 'Get Revision Resources',
      description: 'GET /api/resource-progress/revision/list',
      test: async () => {
        try {
          const result = await ResourceProgressService.getRevisionResources(1, 10);
          addLog('✅ Get Revision Resources: Success', 'success');
          return { success: true, data: result };
        } catch (error) {
          addLog(`❌ Get Revision Resources: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    }
  };

  // Test utility functions
  const testUtilities = {
    timeTracking: {
      name: 'Time Tracking Utilities',
      test: () => {
        try {
          // Test time tracking
          const tracker = ResourceProgressService.startTimeTracking(testResourceId);
          addLog('✅ Start Time Tracking: Success', 'success');
          
          setTimeout(() => {
            const elapsed = tracker.getElapsedSeconds();
            addLog(`✅ Get Elapsed Time: ${elapsed} seconds`, 'success');
            
            const stopped = tracker.stop();
            addLog(`✅ Stop Time Tracking: ${stopped} seconds`, 'success');
          }, 2000);
          
          return { success: true };
        } catch (error) {
          addLog(`❌ Time Tracking Utilities: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    validation: {
      name: 'Validation Helpers',
      test: () => {
        try {
          // Test note validation
          const noteValidation = ResourceProgressService.validatePersonalNote(testNote);
          addLog(`✅ Note Validation: ${noteValidation.isValid ? 'Valid' : 'Invalid'}`, 'success');
          
          // Test time validation
          const timeValidation = ResourceProgressService.validateTimeSpent(300);
          addLog(`✅ Time Validation: ${timeValidation.isValid ? 'Valid' : 'Invalid'}`, 'success');
          
          return { success: true };
        } catch (error) {
          addLog(`❌ Validation Helpers: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    },
    
    formatting: {
      name: 'Formatting Utilities',
      test: () => {
        try {
          // Test time formatting
          const formatted = ResourceProgressService.formatTimeSpent(3661); // 1h 1m 1s
          addLog(`✅ Time Formatting: ${formatted}`, 'success');
          
          // Test status info
          const statusInfo = ResourceProgressService.getProgressStatusInfo({ isCompleted: true });
          addLog(`✅ Status Info: ${statusInfo.label}`, 'success');
          
          // Test resource type icon
          const icon = ResourceProgressService.getResourceTypeIcon('VIDEO');
          addLog(`✅ Resource Icon: ${icon}`, 'success');
          
          return { success: true };
        } catch (error) {
          addLog(`❌ Formatting Utilities: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }
      }
    }
  };

  const runSingleTest = async (testKey) => {
    setIsRunning(true);
    addLog(`🔄 Running test: ${testEndpoints[testKey]?.name || testUtilities[testKey]?.name}`, 'info');
    
    let result;
    if (testEndpoints[testKey]) {
      result = await testEndpoints[testKey].test();
    } else if (testUtilities[testKey]) {
      result = testUtilities[testKey].test();
    }
    
    setTestResults(prev => ({
      ...prev,
      [testKey]: result
    }));
    
    setIsRunning(false);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearLogs();
    addLog('🚀 Starting comprehensive Resource Progress API tests...', 'info');
    
    const results = {};
    
    // Test all API endpoints
    for (const [key, test] of Object.entries(testEndpoints)) {
      addLog(`🔄 Testing: ${test.name}`, 'info');
      results[key] = await test.test();
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test all utilities
    for (const [key, test] of Object.entries(testUtilities)) {
      addLog(`🔄 Testing: ${test.name}`, 'info');
      results[key] = test.test();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTestResults(results);
    setIsRunning(false);
    addLog('✅ All tests completed!', 'success');
  };

  const getTestStatus = (testKey) => {
    const result = testResults[testKey];
    if (!result) return 'pending';
    return result.success ? 'success' : 'error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} />;
      case 'error': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TestTube className="mr-3 text-blue-600" size={28} />
              Resource Progress API Integration Tests
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive testing suite for all Resource Progress API endpoints and utilities
            </p>
          </div>
          
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Play className="mr-2" size={16} />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Resource ID
            </label>
            <input
              type="text"
              value={testResourceId}
              onChange={(e) => setTestResourceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Section ID
            </label>
            <input
              type="text"
              value={testSectionId}
              onChange={(e) => setTestSectionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Note
            </label>
            <input
              type="text"
              value={testNote}
              onChange={(e) => setTestNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* API Endpoints Tests */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="mr-2" size={20} />
          API Endpoints
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(testEndpoints).map(([key, test]) => (
            <div key={key} className={`border rounded-lg p-4 ${getStatusColor(getTestStatus(key))}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm opacity-75">{test.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(getTestStatus(key))}
                  <button
                    onClick={() => runSingleTest(key)}
                    disabled={isRunning}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Utility Functions Tests */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          Utility Functions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(testUtilities).map(([key, test]) => (
            <div key={key} className={`border rounded-lg p-4 ${getStatusColor(getTestStatus(key))}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(getTestStatus(key))}
                  <button
                    onClick={() => runSingleTest(key)}
                    disabled={isRunning}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Logs */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2" size={20} />
            Test Logs
          </h3>
          <button
            onClick={clearLogs}
            className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="mr-1" size={14} />
            Clear
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No test logs yet. Run some tests to see results here.</p>
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

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Test Summary
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r?.success).length}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => r?.success === false).length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceProgressIntegrationTest;
