import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Missed The Game ("the Service"), you agree to be bound by 
              these Terms of Service ("Terms"). If you do not agree to these Terms, 
              please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Missed The Game is a mobile-first Progressive Web App (PWA) that provides 
              football highlight videos while protecting users from spoilers. Our service includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Spoiler-free football highlight videos</li>
              <li>User account management and favorites</li>
              <li>Cross-device synchronization of preferences</li>
              <li>Donation and support features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">Video Content</h3>
            <p className="text-gray-700 mb-4">
              All video content is provided by third-party sources (Scorebat). 
              We do not claim ownership of the video content and are not responsible 
              for its accuracy or availability.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Our Content</h3>
            <p className="text-gray-700 mb-4">
              The Service, including its design, functionality, and content, 
              is owned by Missed The Game and protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our 
              <Link href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</Link> 
              to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              The Service is provided "as is" without warranties of any kind. We disclaim:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>All warranties, express or implied</li>
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy or reliability of content</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, Missed The Game shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or other intangible losses</li>
              <li>Damages resulting from your use of the Service</li>
              <li>Third-party content or services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Donations and Payments</h2>
            <p className="text-gray-700 mb-4">
              Donations are processed through third-party services (Buy Me a Coffee). 
              All donations are voluntary and non-refundable. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Change donation features at any time</li>
              <li>Suspend donation processing temporarily</li>
              <li>Refuse donations at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users 
              of significant changes by posting the updated Terms on this page. 
              Your continued use of the Service constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws 
              of [Your Jurisdiction], without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: legal@missedthegame.com<br />
              Website: <Link href="/" className="text-blue-600 hover:underline">missedthegame.com</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
