import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Users, Shield } from 'lucide-react';
import PageHead from '../components/common/PageHead';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Terms of Service"
        description="Review OpenLearn's terms of service governing platform usage, user responsibilities, and community guidelines for our educational gaming platform at NIT Jalandhar."
        keywords="terms of service, user agreement, platform rules, community guidelines, educational terms"
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
            <Scale className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of the OpenLearn platform. By using our services, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Last Updated:</strong> June 13, 2025 | <strong>Effective Date:</strong> June 13, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-8">
            <div className="mb-8 p-6 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Terms Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>OpenLearn is free for NIT Jalandhar students</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You retain ownership of your learning content</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Respectful community behavior is required</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Educational use only - no commercial activities</span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Table of Contents</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <a href="#acceptance" className="text-blue-600 hover:text-blue-800">1. Acceptance of Terms</a>
                <a href="#eligibility" className="text-blue-600 hover:text-blue-800">2. Eligibility</a>
                <a href="#account" className="text-blue-600 hover:text-blue-800">3. Account Responsibilities</a>
                <a href="#acceptable-use" className="text-blue-600 hover:text-blue-800">4. Acceptable Use</a>
                <a href="#content" className="text-blue-600 hover:text-blue-800">5. Content & Intellectual Property</a>
                <a href="#platform-rules" className="text-blue-600 hover:text-blue-800">6. Platform Rules</a>
                <a href="#privacy" className="text-blue-600 hover:text-blue-800">7. Privacy & Data</a>
                <a href="#termination" className="text-blue-600 hover:text-blue-800">8. Account Termination</a>
                <a href="#disclaimers" className="text-blue-600 hover:text-blue-800">9. Disclaimers</a>
                <a href="#limitation" className="text-blue-600 hover:text-blue-800">10. Limitation of Liability</a>
                <a href="#changes" className="text-blue-600 hover:text-blue-800">11. Changes to Terms</a>
                <a href="#contact" className="text-blue-600 hover:text-blue-800">12. Contact Information</a>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {/* 1. Acceptance of Terms */}
              <section id="acceptance">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By accessing or using the OpenLearn platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                    If you disagree with any part of these terms, you may not access the Service.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between you and OpenLearn, operated by students of 
                    National Institute of Technology, Jalandhar ("we," "us," or "our").
                  </p>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Important:</strong> These Terms are subject to Indian law and any disputes will be resolved 
                      in accordance with the laws of India.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  2. Eligibility
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Primary Users</h3>
                    <p className="text-blue-700 text-sm">
                      Current students, alumni, and faculty of NIT Jalandhar are eligible to use OpenLearn.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Guest Access</h3>
                    <p className="text-green-700 text-sm">
                      Limited guest access may be granted to external users for specific educational collaborations.
                    </p>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Age Requirement:</strong> You must be at least 18 years old or have parental consent.</p>
                    <p><strong>Capacity:</strong> You must have the legal capacity to enter into these Terms.</p>
                    <p><strong>Compliance:</strong> You must comply with all applicable local, state, and national laws.</p>
                  </div>
                </div>
              </section>

              {/* 3. Account Responsibilities */}
              <section id="account">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Account Responsibilities</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Security</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Keep your login credentials secure and confidential</li>
                      <li>• Use a strong, unique password</li>
                      <li>• Notify us immediately of any unauthorized access</li>
                      <li>• Log out from shared or public computers</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Provide accurate and complete information</li>
                      <li>• Keep your profile information up to date</li>
                      <li>• Use your real name and valid email address</li>
                      <li>• Do not impersonate others or create fake accounts</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Account Responsibility:</strong> You are responsible for all activities that occur under your account. 
                    OpenLearn is not liable for any loss resulting from unauthorized use of your account.
                  </p>
                </div>
              </section>

              {/* 4. Acceptable Use */}
              <section id="acceptable-use">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  4. Acceptable Use Policy
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Permitted Uses</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Access educational content and participate in learning activities</li>
                      <li>• Share knowledge and collaborate with other learners</li>
                      <li>• Create and share educational content within the platform</li>
                      <li>• Use the platform for academic and professional development</li>
                      <li>• Provide feedback to improve the platform</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Prohibited Uses</h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-700 font-medium mb-3">You may NOT use OpenLearn to:</p>
                      <ul className="space-y-2 text-red-700 text-sm">
                        <li>• Violate any local, state, or national laws</li>
                        <li>• Harass, threaten, or discriminate against other users</li>
                        <li>• Share inappropriate, offensive, or harmful content</li>
                        <li>• Attempt to gain unauthorized access to the platform</li>
                        <li>• Distribute malware, viruses, or malicious code</li>
                        <li>• Engage in commercial activities without authorization</li>
                        <li>• Plagiarize or violate intellectual property rights</li>
                        <li>• Create multiple accounts or share account access</li>
                        <li>• Spam or send unsolicited communications</li>
                        <li>• Reverse engineer or compromise platform security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Content & Intellectual Property */}
              <section id="content">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Content & Intellectual Property</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Content</h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>Ownership:</strong> You retain ownership of any content you create and share on OpenLearn, 
                        including notes, discussions, and project submissions.
                      </p>
                      <p>
                        <strong>License to Us:</strong> By sharing content, you grant OpenLearn a non-exclusive, 
                        royalty-free license to use, display, and distribute your content within the platform for educational purposes.
                      </p>
                      <p>
                        <strong>Responsibility:</strong> You are responsible for ensuring your content does not violate 
                        copyright, trademark, or other intellectual property rights.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Content</h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>Educational Materials:</strong> Course content, learning materials, and platform features 
                        are owned by OpenLearn or licensed from content creators.
                      </p>
                      <p>
                        <strong>Limited License:</strong> We grant you a personal, non-transferable license to access 
                        and use platform content for educational purposes only.
                      </p>
                      <p>
                        <strong>Restrictions:</strong> You may not copy, distribute, or commercialize platform content 
                        without explicit permission.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Platform Rules */}
              <section id="platform-rules">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Platform Rules & Community Guidelines</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Respectful Communication</h3>
                      <p className="text-green-700 text-sm">
                        Be respectful, constructive, and inclusive in all interactions with fellow learners and instructors.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Academic Integrity</h3>
                      <p className="text-blue-700 text-sm">
                        Complete assignments independently unless collaboration is explicitly encouraged. Give proper attribution.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Quality Content</h3>
                      <p className="text-purple-700 text-sm">
                        Share high-quality, relevant content that contributes to the learning community.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">Privacy Respect</h3>
                      <p className="text-orange-700 text-sm">
                        Respect others' privacy and do not share personal information without consent.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Privacy & Data */}
              <section id="privacy">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  7. Privacy & Data Protection
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Our collection and use of your personal information is governed by our 
                    <Link to="/privacy" className="text-[#FFDE59] hover:text-yellow-600 font-medium"> Privacy Policy</Link>, 
                    which is incorporated into these Terms by reference.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
                      <p className="text-gray-700 text-sm">
                        We collect only the minimum data necessary to provide educational services and improve the platform.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Data Security</h3>
                      <p className="text-gray-700 text-sm">
                        We implement industry-standard security measures to protect your personal and learning data.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Account Termination */}
              <section id="termination">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Account Termination</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Voluntary Termination</h3>
                    <p className="text-gray-700 mb-3">
                      You may delete your account at any time through your profile settings. Upon deletion:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Your personal data will be deleted within 30 days</li>
                      <li>Your learning progress and achievements will be permanently removed</li>
                      <li>Content you've shared may remain for educational purposes (anonymized)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Involuntary Termination</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 mb-3">
                        We may suspend or terminate your account if you:
                      </p>
                      <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                        <li>Violate these Terms of Service or community guidelines</li>
                        <li>Engage in harassment or harmful behavior</li>
                        <li>Attempt to compromise platform security</li>
                        <li>Use the platform for illegal activities</li>
                        <li>Create multiple accounts or share account access</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Appeal Process</h3>
                    <p className="text-gray-700">
                      If your account is suspended or terminated, you may appeal the decision by contacting us at 
                      <span className="font-medium"> support@openlearn.nitj.ac.in</span> within 14 days.
                    </p>
                  </div>
                </div>
              </section>

              {/* 9. Disclaimers */}
              <section id="disclaimers">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-[#FFDE59]" />
                  9. Disclaimers
                </h2>
                
                <div className="space-y-4">
                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-3">Educational Platform</h3>
                    <p className="text-yellow-700 text-sm">
                      OpenLearn is an educational platform created and maintained by students. While we strive for accuracy 
                      and quality, we cannot guarantee that all content is error-free or complete.
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">"As-Is" Service</h3>
                    <p className="text-gray-700 text-sm">
                      The platform is provided "as-is" without warranties of any kind, either express or implied. 
                      We do not warrant that the service will be uninterrupted, secure, or error-free.
                    </p>
                  </div>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>No Academic Credit:</strong> OpenLearn courses do not provide official academic credit unless explicitly stated.</p>
                    <p><strong>Platform Availability:</strong> We strive for 99% uptime but cannot guarantee continuous availability.</p>
                    <p><strong>Content Accuracy:</strong> Course content is for educational purposes and may not reflect the most current information.</p>
                  </div>
                </div>
              </section>

              {/* 10. Limitation of Liability */}
              <section id="limitation">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Limitation of Liability</h2>
                
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm mb-4">
                    <strong>Important Legal Notice:</strong> To the fullest extent permitted by law, OpenLearn and its operators 
                    shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from 
                    your use of the platform.
                  </p>
                  <div className="space-y-2 text-red-700 text-sm">
                    <p>• Loss of data or learning progress</p>
                    <p>• Interruption of educational activities</p>
                    <p>• Technical difficulties or platform downtime</p>
                    <p>• Decisions made based on platform content</p>
                    <p>• Interactions with other users</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-4">
                  Our maximum liability for any claims related to the platform shall not exceed ₹1,000 or the amount 
                  you have paid to use the platform (if any), whichever is lower.
                </p>
              </section>

              {/* 11. Changes to Terms */}
              <section id="changes">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Changes to These Terms</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Notification Process</h3>
                    <p className="text-blue-700 text-sm">
                      We will notify users of significant changes to these Terms through email and prominent platform notices 
                      at least 15 days before changes take effect.
                    </p>
                  </div>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Minor Updates:</strong> We may make minor clarifications or corrections without advance notice.
                    </p>
                    <p>
                      <strong>Major Changes:</strong> Substantial modifications will require explicit acceptance before continued use.
                    </p>
                    <p>
                      <strong>Continued Use:</strong> Your continued use of the platform after changes take effect constitutes 
                      acceptance of the new Terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* 12. Contact Information */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Contact Information</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> legal@openlearn.nitj.ac.in</p>
                    <p><strong>Support:</strong> support@openlearn.nitj.ac.in</p>
                    <p><strong>Address:</strong> OpenLearn Team, NIT Jalandhar, G.T Road, Jalandhar, Punjab 144011, India</p>
                    <p><strong>Response Time:</strong> We aim to respond to all inquiries within 5 business days.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Legal Jurisdiction:</strong> These Terms are governed by Indian law. Any disputes will be resolved 
                    in the courts of Jalandhar, Punjab, India.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-8">
            <Link to="/privacy" className="text-yellow-600 hover:text-black font-medium">
              Privacy Policy
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

export default TermsOfServicePage;
