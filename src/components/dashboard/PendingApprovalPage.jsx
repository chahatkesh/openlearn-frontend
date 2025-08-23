import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const PendingApprovalPage = ({ user }) => {  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6">
          <div className="bg-[#FFDE59] rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
            <Clock size={32} className="text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Pending Approval
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Hi <strong>{user?.name}</strong>, your account is currently under review. 
          You'll be able to access your dashboard once admin approves your registration.
        </p>

        {/* User Info Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-yellow-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Pending
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined:</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">What to do?</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• Wait for admin approval, which may take up to 24 hours</li>
            <li>• Ensure your profile is complete(add social handles)</li>
          </ul>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-[#FFDE59] text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-[#FFD700] transition-colors"
        >
          Refresh Status
        </button>

        {/* Logout Link */}
        <div className="mt-4">
          <a 
            href="/logout" 
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
