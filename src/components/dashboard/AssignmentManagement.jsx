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
const AssignmentManagement = ({ leagueId, leagueName }) => {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Submission form state
  const [submissionForm, setSubmissionForm] = useState({
    submissionType: 'GITHUB_LINK',
    content: '',
    description: ''
  });

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await DataService.getLeagueAssignment(leagueId);
      setAssignment(data);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError('Failed to load assignment');
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
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    if (leagueId) {
      fetchAssignment();
      fetchSubmissions();
    }
  }, [leagueId, fetchAssignment, fetchSubmissions]);

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignment) return;

    setSubmitting(true);
    try {
      await DataService.submitAssignment(assignment.id, submissionForm);
      
      // Reset form and refresh submissions
      setSubmissionForm({
        submissionType: 'GITHUB_LINK',
        content: '',
        description: ''
      });
      setShowSubmissionForm(false);
      await fetchSubmissions();
      
      alert('Assignment submitted successfully!');
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignment Available</h3>
          <p className="text-gray-600">
            This league doesn't have an assignment yet.
          </p>
        </div>
      </div>
    );
  }

  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const canSubmit = !latestSubmission || latestSubmission.status === 'NEEDS_REVISION';

  return (
    <div className="space-y-6">
      {/* Assignment Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-2 text-[#FFDE59]" size={24} />
              {leagueName} Assignment
            </h2>
            <p className="text-gray-600 mt-1">{assignment.title}</p>
          </div>
          
          {assignment.dueDate && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Due Date</div>
              <div className="font-medium text-gray-900 flex items-center">
                <Calendar size={16} className="mr-1" />
                {new Date(assignment.dueDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Assignment Description */}
        <div className="prose max-w-none mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment Description</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {assignment.description}
            </div>
          </div>
        </div>

        {/* Assignment Requirements */}
        {assignment.requirements && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 whitespace-pre-wrap">
                {assignment.requirements}
              </div>
            </div>
          </div>
        )}

        {/* Submission Button */}
        {canSubmit && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowSubmissionForm(!showSubmissionForm)}
              className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#FFD700] transition-colors flex items-center"
            >
              <Upload size={16} className="mr-2" />
              {latestSubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
            </button>
          </div>
        )}
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Assignment</h3>
          
          <form onSubmit={handleSubmissionSubmit}>
            {/* Submission Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select
                value={submissionForm.submissionType}
                onChange={(e) => setSubmissionForm({...submissionForm, submissionType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="GITHUB_LINK">GitHub Repository Link</option>
                <option value="EXTERNAL_LINK">External Link</option>
                <option value="TEXT_SUBMISSION">Text Submission</option>
              </select>
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {submissionForm.submissionType === 'TEXT_SUBMISSION' ? 'Submission Content' : 'Link URL'}
              </label>
              {submissionForm.submissionType === 'TEXT_SUBMISSION' ? (
                <textarea
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({...submissionForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Enter your assignment submission..."
                  required
                />
              ) : (
                <input
                  type="url"
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({...submissionForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={submissionForm.submissionType === 'GITHUB_LINK' 
                    ? 'https://github.com/username/repository' 
                    : 'https://example.com/your-project'
                  }
                  required
                />
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={submissionForm.description}
                onChange={(e) => setSubmissionForm({...submissionForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Brief description of your submission, approach, or any notes..."
              />
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
      )}

      {/* Submission History */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission History</h3>
          
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                        {getSubmissionStatusIcon(submission.status)}
                        <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Submission #{submissions.length - index}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {submission.submissionType !== 'TEXT_SUBMISSION' && (
                    <a
                      href={submission.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View
                    </a>
                  )}
                </div>

                {/* Submission Content Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {submission.submissionType === 'GITHUB_LINK' ? 'GitHub Repository' : 
                     submission.submissionType === 'EXTERNAL_LINK' ? 'External Link' : 'Text Submission'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {submission.submissionType === 'TEXT_SUBMISSION' 
                      ? submission.content.substring(0, 200) + (submission.content.length > 200 ? '...' : '')
                      : submission.content
                    }
                  </div>
                </div>

                {/* Description */}
                {submission.description && (
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Description:</strong> {submission.description}
                  </div>
                )}

                {/* Feedback */}
                {submission.feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="text-sm font-medium text-blue-900 mb-1">Instructor Feedback</div>
                    <div className="text-sm text-blue-800">{submission.feedback}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
