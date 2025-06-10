import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Users, 
  Star,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import SectionProgress from '../components/dashboard/SectionProgress';
import ResourceCard from '../components/dashboard/ResourceCard';

/**
 * Resource Progress Demo Page
 * Demonstrates the comprehensive Resource Progress Tracking API integration
 */
const ResourceProgressDemoPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showIndividualCard, setShowIndividualCard] = useState(false);

  // Mock data for demonstration
  const mockSections = [
    {
      id: 'section-1',
      name: 'Introduction to React',
      description: 'Learn the fundamentals of React including components, state, and props.',
      week: {
        name: 'Week 1: Frontend Fundamentals',
        league: {
          name: 'Web Development Bootcamp'
        }
      }
    },
    {
      id: 'section-2', 
      name: 'Advanced React Concepts',
      description: 'Deep dive into hooks, context, and advanced patterns in React.',
      week: {
        name: 'Week 2: Advanced Frontend',
        league: {
          name: 'Web Development Bootcamp'
        }
      }
    },
    {
      id: 'section-3',
      name: 'State Management',
      description: 'Learn about Redux, Zustand, and other state management solutions.',
      week: {
        name: 'Week 3: State & Data',
        league: {
          name: 'Web Development Bootcamp'
        }
      }
    }
  ];

  const mockResource = {
    id: 'resource-demo-1',
    title: 'React Components Deep Dive',
    description: 'Comprehensive guide to creating and managing React components',
    type: 'VIDEO',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    estimatedTime: 1800, // 30 minutes in seconds
    progress: {
      isCompleted: false,
      markedForRevision: false,
      personalNote: '',
      timeSpent: 0,
      completedAt: null,
      lastAccessed: null
    }
  };

  const handleSectionComplete = (sectionId, statistics) => {
    console.log(`Section ${sectionId} completed!`, statistics);
    alert(`🎉 Congratulations! You've completed the section with ${statistics.completionPercentage}% progress!`);
  };

  const handleResourceProgressUpdate = (resourceId, progressData) => {
    console.log(`Resource ${resourceId} progress updated:`, progressData);
  };

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedSection(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Sections
          </button>

          {/* Section Progress Component Demo */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Section Progress Component Demo
            </h2>
            <p className="text-gray-600 mb-6">
              This demonstrates the comprehensive section-level progress tracking with resource analytics, 
              filtering, search, and bulk operations.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Features Demonstrated:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Real-time progress statistics and analytics</li>
                <li>• Resource filtering (all, completed, revision, not-started)</li>
                <li>• Search functionality across resource titles and types</li>
                <li>• Bulk operations (complete all, reset all)</li>
                <li>• Individual resource progress tracking with notes and time</li>
                <li>• Section completion celebration</li>
                <li>• Responsive design with mobile support</li>
              </ul>
            </div>
          </div>

          {/* Live Section Progress Component */}
          <SectionProgress 
            sectionId={selectedSection.id}
            onSectionComplete={handleSectionComplete}
          />
        </div>
      </div>
    );
  }

  if (showIndividualCard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => setShowIndividualCard(false)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Demo Menu
          </button>

          {/* Individual Resource Card Demo */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resource Card Component Demo
            </h2>
            <p className="text-gray-600 mb-6">
              This demonstrates the individual resource progress tracking with comprehensive features.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2">Features Demonstrated:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Time tracking with visual timer during resource interaction</li>
                <li>• Personal notes with inline editing and character validation</li>
                <li>• Progress status indicators (completed, revision, in-progress, not-started)</li>
                <li>• Mark resources as completed with time tracking</li>
                <li>• Mark resources for revision with notes</li>
                <li>• Reset progress functionality</li>
                <li>• Local storage persistence for offline access</li>
                <li>• Error handling with user-friendly messages</li>
              </ul>
            </div>
          </div>

          {/* Live Resource Card Component */}
          <ResourceCard 
            resource={mockResource}
            onProgressUpdate={handleResourceProgressUpdate}
            showTimeTracking={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resource Progress Tracking API Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive demonstration of the OpenLearn Resource Progress Tracking system with 
            granular analytics, time tracking, personal notes, and advanced section management.
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Integration Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 mb-3">
                <BookOpen size={32} />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Resource Progress API</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• GET /api/resource-progress/:resourceId</li>
                <li>• POST /api/resource-progress/:resourceId/complete</li>
                <li>• POST /api/resource-progress/:resourceId/revision</li>
                <li>• PUT /api/resource-progress/:resourceId/note</li>
                <li>• DELETE /api/resource-progress/:resourceId/reset</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 mb-3">
                <Users size={32} />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Section Analytics API</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• GET /api/resource-progress/section/:sectionId/resources</li>
                <li>• GET /api/resource-progress/revision/list</li>
                <li>• Real-time progress statistics</li>
                <li>• Completion percentage tracking</li>
                <li>• Time analytics per section</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="text-purple-600 mb-3">
                <Star size={32} />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Advanced Features</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Time tracking with localStorage persistence</li>
                <li>• Personal notes (max 1000 characters)</li>
                <li>• Bulk operations for multiple resources</li>
                <li>• Offline access with local storage</li>
                <li>• Comprehensive validation helpers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Progress Demo */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Section Progress Demo
              </h3>
              <p className="text-gray-600">
                Experience comprehensive section-level analytics with filtering, search, and bulk operations.
              </p>
            </div>

            <div className="space-y-4">
              {mockSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{section.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {section.week.name} • {section.week.league.name}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Resource Demo */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Resource Card Demo
              </h3>
              <p className="text-gray-600">
                Test individual resource progress tracking with notes, time tracking, and status management.
              </p>
            </div>

            <button
              onClick={() => setShowIndividualCard(true)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Play className="mr-2" size={20} />
              Try Resource Card Demo
            </button>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Demo Resource:</h4>
              <div className="text-sm text-gray-600">
                <div>📹 {mockResource.title}</div>
                <div className="mt-1">{mockResource.description}</div>
                <div className="mt-1">Estimated time: 30 minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Note */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-medium text-yellow-900 mb-2">🔧 Backend Integration Ready</h3>
          <p className="text-yellow-800 text-sm">
            This demo showcases the complete frontend implementation. The Resource Progress API endpoints 
            are ready for backend integration. All API calls are properly structured and include error handling, 
            validation, and offline support through local storage persistence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceProgressDemoPage;
