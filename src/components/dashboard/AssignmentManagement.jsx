import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Upload, 
  ExternalLink, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  RefreshCw,
  Send
} from 'lucide-react';
import DataService from '../../utils/dataService';

/**
 * Assignment Management Component
 * Handles assignment viewing, submission, and tracking
 */
const AssignmentManagement = ({ leagueId }) => {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Submission form state
  const [submissionForm, setSubmissionForm] = useState({
    submissionType: 'GITHUB_LINK',
    content: ''
  });

  const fetchAssignment = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching assignment for league:', leagueId);
      const data = await DataService.getLeagueAssignment(leagueId);
      console.log('Assignment data received:', data);
      setAssignment(data); // data will be null if no assignment exists
    } catch (err) {
      console.error('Error fetching assignment:', err);
      
      // Handle different types of errors
      if (err.message && (err.message.includes('404') || err.message.includes('Not Found'))) {
        // If it's a 404, just set assignment to null (no assignment exists)
        console.log('No assignment found for this league (404)');
        setAssignment(null);
      } else if (err.message && err.message.includes('Unable to connect')) {
        // Network error
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        // Other errors
        setError(`Failed to load assignment: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await DataService.getMySubmissions();
      // Filter submissions for this league
      const leagueSubmissions = data.filter(sub => 
        sub.assignment?.leagueId === leagueId
      );
      setSubmissions(leagueSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      // Don't show error for submissions if it's just a network issue - submissions are optional
      setSubmissions([]);
    }
  }, [leagueId]);

  useEffect(() => {
    if (leagueId) {
      const loadData = async () => {
        await fetchAssignment();
        await fetchSubmissions();
      };
      loadData();
    }
  }, [leagueId, fetchAssignment, fetchSubmissions]);

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignment) return;

    setSubmitting(true);
    try {
      // Prepare submission data based on API documentation
      const submissionData = {};
      
      if (submissionForm.submissionType === 'TEXT_SUBMISSION') {
        submissionData.content = submissionForm.content;
      } else if (submissionForm.submissionType === 'GITHUB_LINK') {
        submissionData.githubUrl = submissionForm.content;
      } else if (submissionForm.submissionType === 'LIVE_URL') {
        submissionData.liveUrl = submissionForm.content;
      } else if (submissionForm.submissionType === 'FILE_URL') {
        submissionData.fileUrl = submissionForm.content;
      }

      await DataService.submitAssignment(assignment.id, submissionData);
      
      // Reset form and refresh submissions
      setSubmissionForm({
        submissionType: 'GITHUB_LINK',
        content: ''
      });
      setShowSubmissionForm(false);
      await fetchSubmissions();
      
      // Show success message based on whether it's a new submission or resubmission
      const message = latestSubmission 
        ? 'Assignment resubmitted successfully!' 
        : 'Assignment submitted successfully!';
      alert(message);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert(`Failed to submit assignment: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'text-blue-600 bg-blue-50';
      case 'UNDER_REVIEW': return 'text-yellow-600 bg-yellow-50';
      case 'APPROVED': return 'text-green-600 bg-green-50';
      case 'NEEDS_REVISION': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSubmissionStatusIcon = (status) => {
    switch (status) {
      case 'SUBMITTED': return <Clock size={16} />;
      case 'UNDER_REVIEW': return <RefreshCw size={16} />;
      case 'APPROVED': return <CheckCircle size={16} />;
      case 'NEEDS_REVISION': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-4">
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Assignment</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchAssignment();
            }}
            className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-4">
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Coming Soon</h3>
          <p className="text-gray-600">
            Assignments will be uploaded soon. Check back later for exciting project challenges!
          </p>
        </div>
      </div>
    );
  }

  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const canSubmit = !latestSubmission || latestSubmission.status === 'NEEDS_REVISION';

  return (
    <div className="space-y-4 mt-4">
      {/* Assignment Details */}
      <div className="bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 rounded-lg border border-[#FFDE59]/30 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{assignment.title}</h2>
                <p className="text-sm text-gray-600">League Assignment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {assignment.dueDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {submissions.length > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Submitted
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Pending
                </span>
              )}
              
              {canSubmit && (
                <button
                  onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                  className="bg-[#FFDE59] text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-[#FFD700] transition-colors flex items-center"
                >
                  <Upload size={14} className="mr-1" />
                  {latestSubmission ? 'Resubmit' : 'Submit'}
                </button>
              )}
            </div>
          </div>

          {/* Compact Assignment Description */}
          <div className="bg-white/60 border border-[#FFDE59]/30 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 line-clamp-3">
              {assignment.description}
            </p>
          </div>

          {/* Submission Details (if submitted) */}
          {submissions.length > 0 && (
            <div className="bg-white/80 border border-[#FFDE59]/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(latestSubmission.status)}`}>
                    {getSubmissionStatusIcon(latestSubmission.status)}
                    <span className="ml-1">{latestSubmission.status.replace('_', ' ')}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Submitted on {new Date(latestSubmission.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                
                {(latestSubmission.githubUrl || latestSubmission.liveUrl || latestSubmission.fileUrl) && (
                  <a
                    href={latestSubmission.githubUrl || latestSubmission.liveUrl || latestSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#000000] flex items-center text-xs font-medium transition-colors"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    View
                  </a>
                )}
              </div>

              {/* Submission Content */}
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-700">
                  {latestSubmission.githubUrl ? 'GitHub Repository:' : 
                   latestSubmission.liveUrl ? 'Project Link:' : 
                   latestSubmission.fileUrl ? 'File Upload:' : 'Text Submission:'}
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  {latestSubmission.content && latestSubmission.content.length > 0
                    ? latestSubmission.content.substring(0, 150) + (latestSubmission.content.length > 150 ? '...' : '')
                    : latestSubmission.githubUrl || latestSubmission.liveUrl || latestSubmission.fileUrl
                  }
                </div>
              </div>

              {/* Feedback */}
              {latestSubmission.feedback && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                  <div className="text-xs font-medium text-blue-900">Instructor Feedback:</div>
                  <div className="text-xs text-blue-800 mt-1">{latestSubmission.feedback}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {latestSubmission ? 'Resubmit Your Assignment' : 'Submit Your Assignment'}
            </h3>
          </div>
          
          <div className="px-6 py-4">
            {latestSubmission && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will replace your previous submission.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmissionSubmit}>
              {/* Submission Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Type
                </label>
                <select
                  value={submissionForm.submissionType}
                  onChange={(e) => setSubmissionForm({...submissionForm, submissionType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] transition-colors"
                  required
                >
                  <option value="GITHUB_LINK">GitHub Repository Link</option>
                  <option value="LIVE_URL">Live Demo Link</option>
                  <option value="FILE_URL">File Upload Link</option>
                  <option value="TEXT_SUBMISSION">Text Submission</option>
                </select>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {submissionForm.submissionType === 'TEXT_SUBMISSION' ? 'Submission Content' : 'Link URL'}
                </label>
                {submissionForm.submissionType === 'TEXT_SUBMISSION' ? (
                  <textarea
                    value={submissionForm.content}
                    onChange={(e) => setSubmissionForm({...submissionForm, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] transition-colors"
                    rows={6}
                    placeholder="Enter your assignment submission..."
                    required
                  />
                ) : (
                  <input
                    type="url"
                    value={submissionForm.content}
                    onChange={(e) => setSubmissionForm({...submissionForm, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] transition-colors"
                    placeholder={submissionForm.submissionType === 'GITHUB_LINK' 
                      ? 'https://github.com/username/repository' 
                      : submissionForm.submissionType === 'LIVE_URL'
                      ? 'https://your-project.vercel.app'
                      : 'https://drive.google.com/file/d/...'
                    }
                    required
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send size={16} className="mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
