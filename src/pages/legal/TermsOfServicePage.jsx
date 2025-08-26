import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHead } from '../../components/common';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageHead 
        title="Terms of Service"
        description="Review OpenLearn's terms of service governing platform usage, user responsibilities, and community guidelines for our educational gaming platform at NIT Jalandhar."
        keywords="terms of service, user agreement, platform rules, community guidelines, educational terms"
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            These terms govern your use of OpenLearn. By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-gray-400 mt-8 font-medium">
            Last updated June 13, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Acceptance of Terms
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                By accessing or using OpenLearn, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are 
                prohibited from using or accessing this platform.
              </p>
            </div>
          </section>

          {/* Platform Description */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Platform Description
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                OpenLearn is an educational platform developed by NIT Jalandhar that provides interactive 
                learning experiences, progress tracking, and community features for students.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the platform at any 
                time without prior notice.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              User Accounts
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                To access certain features, you must create an account. You are responsible for:
              </p>
              <div className="ml-6 space-y-4">
                <p>• Providing accurate and complete information</p>
                <p>• Maintaining the security of your account credentials</p>
                <p>• All activities that occur under your account</p>
                <p>• Notifying us immediately of any unauthorized use</p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Acceptable Use
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                You agree to use OpenLearn only for lawful purposes and in accordance with these terms. 
                You may not:
              </p>
              <div className="ml-6 space-y-4">
                <p>• Violate any applicable laws or regulations</p>
                <p>• Harass, abuse, or harm other users</p>
                <p>• Upload malicious content or software</p>
                <p>• Attempt to gain unauthorized access to our systems</p>
                <p>• Share your account with others</p>
                <p>• Use the platform for commercial purposes without permission</p>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Content and Intellectual Property
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                All content on OpenLearn, including text, graphics, logos, and software, is the property 
                of NIT Jalandhar or its licensors and is protected by copyright and other intellectual 
                property laws.
              </p>
              <p>
                You retain ownership of content you submit to the platform, but grant us a license to use, 
                display, and distribute such content in connection with our services.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Privacy
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed 
                by our Privacy Policy, which is incorporated into these terms by reference.
              </p>
              <p>
                By using OpenLearn, you consent to the collection and use of your information as described 
                in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Educational Use */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Educational Use
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                OpenLearn is designed for educational purposes. While we strive to provide accurate and 
                up-to-date content, we make no warranties about the completeness or accuracy of the 
                educational materials.
              </p>
              <p>
                Your academic progress and achievements on the platform are for motivational and tracking 
                purposes and do not constitute official academic credit.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Disclaimers
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                OpenLearn is provided "as is" without warranties of any kind. We disclaim all warranties, 
                express or implied, including but not limited to merchantability, fitness for a particular 
                purpose, and non-infringement.
              </p>
              <p>
                We do not guarantee that the platform will be uninterrupted, secure, or error-free.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Limitation of Liability
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                To the maximum extent permitted by law, NIT Jalandhar and OpenLearn shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages resulting from 
                your use of the platform.
              </p>
              <p>
                Our total liability to you for all claims shall not exceed the amount you paid to use 
                the platform, if any.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Termination
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We may terminate or suspend your account and access to OpenLearn at any time, with or 
                without cause, with or without notice.
              </p>
              <p>
                You may terminate your account at any time by contacting us. Upon termination, your right 
                to use the platform will cease immediately.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Governing Law
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                These terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
                of the courts in Punjab, India.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-medium text-black mb-6">
              Changes to Terms
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of material 
                changes by posting the updated terms on this page.
              </p>
              <p>
                Your continued use of OpenLearn after changes take effect constitutes acceptance of the 
                updated terms.
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
                If you have questions about these terms of service, please contact us:
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

export default TermsOfServicePage;
