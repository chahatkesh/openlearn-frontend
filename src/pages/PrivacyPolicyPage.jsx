import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import PageHead from '../components/common/PageHead';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Privacy Policy"
        description="Learn how OpenLearn protects your privacy and personal data. Our comprehensive privacy policy explains data collection, usage, and your rights as a user of our educational platform."
        keywords="privacy policy, data protection, personal information, user rights, educational privacy"
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <Link to="/" className="text-2xl font-bold text-black flex items-center">
              <img className='h-8 mr-3' src="/favicon.png" alt="" />
              OpenLearn
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFDE59] rounded-full mb-6">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how OpenLearn collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Last Updated:</strong> June 13, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8">
            {/* Quick Overview */}
            <div className="mb-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-[#FFDE59]" />
                Quick Overview
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFDE59] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We collect only necessary information for educational services</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFDE59] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your learning data remains private and secure</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFDE59] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We never sell your personal information</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFDE59] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You can delete your account and data anytime</span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Table of Contents</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <a href="#information-collection" className="text-blue-600 hover:text-blue-800">1. Information We Collect</a>
                <a href="#information-use" className="text-blue-600 hover:text-blue-800">2. How We Use Information</a>
                <a href="#information-sharing" className="text-blue-600 hover:text-blue-800">3. Information Sharing</a>
                <a href="#data-security" className="text-blue-600 hover:text-blue-800">4. Data Security</a>
                <a href="#user-rights" className="text-blue-600 hover:text-blue-800">5. Your Rights</a>
                <a href="#cookies" className="text-blue-600 hover:text-blue-800">6. Cookies & Tracking</a>
                <a href="#data-retention" className="text-blue-600 hover:text-blue-800">7. Data Retention</a>
                <a href="#changes" className="text-blue-600 hover:text-blue-800">8. Policy Changes</a>
                <a href="#contact" className="text-blue-600 hover:text-blue-800">9. Contact Us</a>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {/* 1. Information We Collect */}
              <section id="information-collection">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  1. Information We Collect
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                    <p className="text-gray-700 mb-3">When you create an account, we collect:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Full name and email address</li>
                      <li>Profile information you choose to provide</li>
                      <li>Educational background and interests</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Data</h3>
                    <p className="text-gray-700 mb-3">To provide educational services, we track:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Course enrollments and progress</li>
                      <li>Section completions and quiz results</li>
                      <li>Time spent on learning activities</li>
                      <li>Personal notes and reflections</li>
                      <li>Achievement badges and milestones</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Information</h3>
                    <p className="text-gray-700 mb-3">For platform functionality and security:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Login timestamps and session data</li>
                      <li>Platform usage analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. How We Use Information */}
              <section id="information-use">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Educational Services</h3>
                    <p className="text-green-700 text-sm">
                      Provide personalized learning experiences, track progress, award achievements, and enable social learning features.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Platform Improvement</h3>
                    <p className="text-blue-700 text-sm">
                      Analyze usage patterns to improve content, fix bugs, and develop new features that enhance learning outcomes.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Communication</h3>
                    <p className="text-purple-700 text-sm">
                      Send course updates, achievement notifications, and important platform announcements.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">Security & Compliance</h3>
                    <p className="text-orange-700 text-sm">
                      Prevent fraud, ensure platform security, and comply with legal requirements.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Information Sharing */}
              <section id="information-sharing">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Information Sharing</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-red-800 mb-2">We Never Sell Your Data</h3>
                  <p className="text-red-700 text-sm">
                    OpenLearn does not sell, rent, or trade your personal information to third parties for commercial purposes.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Limited Sharing Scenarios</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <UserCheck className="w-5 h-5 text-[#FFDE59] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <strong>With Your Consent:</strong> When you explicitly choose to share achievements on social media or with other learners.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-[#FFDE59] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <strong>Legal Compliance:</strong> When required by law, court order, or to protect platform security.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Database className="w-5 h-5 text-[#FFDE59] mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <strong>Service Providers:</strong> With trusted partners who help us operate the platform (all bound by strict confidentiality agreements).
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. Data Security */}
              <section id="data-security">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  4. Data Security
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Safeguards</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• End-to-end encryption for data transmission</li>
                      <li>• Secure database storage with encryption at rest</li>
                      <li>• Regular security audits and vulnerability assessments</li>
                      <li>• Multi-factor authentication for admin accounts</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Access Controls</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Role-based access control system</li>
                      <li>• Principle of least privilege</li>
                      <li>• Regular access reviews and audits</li>
                      <li>• Secure authentication with JWT tokens</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Security Incident Response:</strong> In the unlikely event of a security breach, we will notify affected users within 72 hours and provide clear guidance on protective actions.
                  </p>
                </div>
              </section>

              {/* 5. Your Rights */}
              <section id="user-rights">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Rights</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Access Your Data</h3>
                      <p className="text-gray-700 text-sm">Request a complete copy of all personal data we have about you.</p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Update Information</h3>
                      <p className="text-gray-700 text-sm">Correct or update your personal information through your profile settings.</p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Delete Your Account</h3>
                      <p className="text-gray-700 text-sm">Permanently delete your account and all associated data.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Data Portability</h3>
                      <p className="text-gray-700 text-sm">Export your learning data in a machine-readable format.</p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Restrict Processing</h3>
                      <p className="text-gray-700 text-sm">Limit how we use your data while keeping your account active.</p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Withdraw Consent</h3>
                      <p className="text-gray-700 text-sm">Opt out of optional data processing activities at any time.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Sections */}
              <section id="cookies">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies & Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience and analyze platform usage.
                </p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Essential Cookies:</strong> Required for basic platform functionality and security.</p>
                  <p><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform.</p>
                  <p><strong>Preference Cookies:</strong> Remember your settings and customizations.</p>
                </div>
              </section>

              <section id="data-retention">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Data Retention</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Active Accounts:</strong> We retain your data while your account is active and for educational continuity.</p>
                  <p><strong>Deleted Accounts:</strong> Personal data is deleted within 30 days of account deletion, except for legal compliance requirements.</p>
                  <p><strong>Anonymized Data:</strong> We may retain anonymized learning analytics for research and platform improvement.</p>
                </div>
              </section>

              <section id="changes">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Policy Changes</h2>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    We may update this privacy policy to reflect changes in our practices or for legal compliance. 
                    We will notify users of significant changes through:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Email notifications to all active users</li>
                    <li>Prominent notices on the platform</li>
                    <li>Updates to this page with clear change summaries</li>
                  </ul>
                </div>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have questions about this privacy policy or want to exercise your rights, contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> privacy@openlearn.nitj.ac.in</p>
                    <p><strong>Address:</strong> OpenLearn Team, NIT Jalandhar, Punjab, India</p>
                    <p><strong>Response Time:</strong> We aim to respond to all privacy requests within 5 business days.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-8">
            <Link to="/terms" className="text-yellow-600 hover:text-black font-medium">
              Terms of Service
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
