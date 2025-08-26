import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHead from '../components/common/PageHead';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageHead 
        title="Privacy Policy"
        description="Learn how OpenLearn protects your privacy and personal data. Our comprehensive privacy policy explains data collection, usage, and your rights as a user of our educational platform."
        keywords="privacy policy, data protection, personal information, user rights, educational privacy"
      />
      
      {/* Minimal Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-light text-black mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            Your privacy matters to us. Here's how we protect your personal information.
          </p>
          <p className="text-sm text-gray-400 mt-8 font-medium">
            Last updated June 13, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Information We Collect
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                participate in our educational programs, or contact us for support.
              </p>
              <div className="ml-6 space-y-4">
                <p><span className="font-medium">Account Information:</span> Name, email address, and educational details</p>
                <p><span className="font-medium">Learning Data:</span> Progress, achievements, and course interactions</p>
                <p><span className="font-medium">Communication:</span> Messages you send us and support requests</p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              How We Use Your Information
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We use the information we collect to provide, maintain, and improve our educational services.
              </p>
              <div className="ml-6 space-y-4">
                <p>• Deliver personalized learning experiences</p>
                <p>• Track your progress and achievements</p>
                <p>• Communicate important updates</p>
                <p>• Provide customer support</p>
                <p>• Ensure platform security</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Information Sharing
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
              <p>
                We may share information in limited circumstances, such as to comply with legal obligations 
                or protect our rights and the safety of our users.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Data Security
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p>
                While we strive to protect your information, no internet transmission is completely secure. 
                We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Your Rights
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                You have certain rights regarding your personal information:
              </p>
              <div className="ml-6 space-y-4">
                <p>• Access and review your personal data</p>
                <p>• Correct inaccurate information</p>
                <p>• Request deletion of your data</p>
                <p>• Object to certain processing activities</p>
                <p>• Data portability</p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Cookies and Tracking
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and improve our services.
              </p>
              <p>
                You can control cookie settings through your browser preferences. Disabling cookies may 
                affect some platform functionality.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Children's Privacy
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Our services are designed for users 13 years and older. We do not knowingly collect 
                personal information from children under 13.
              </p>
              <p>
                If we learn that we have collected information from a child under 13, we will delete 
                that information promptly.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Changes to This Policy
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page.
              </p>
              <p>
                Your continued use of our services after changes take effect constitutes acceptance of 
                the updated policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-medium text-black mb-6">
              Contact Us
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="ml-6 space-y-2">
                <p>Email: info@openlearn.org.in</p>
                <p>Address: NIT Jalandhar, Punjab, India</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
