import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Missed The Game ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our mobile-first PWA for watching football highlights without spoilers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Email address (when you sign up for an account)</li>
              <li>Authentication data (via Firebase Auth)</li>
              <li>Favorites and preferences (stored in Supabase)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Usage Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Video viewing data (via Google Analytics 4)</li>
              <li>App usage patterns and interactions</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide and improve our spoiler-free video service</li>
              <li>Sync your favorites across devices when logged in</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Send marketing communications (only with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">Google Analytics 4</h3>
            <p className="text-gray-700 mb-4">
              We use GA4 to understand how users interact with our app. 
              You can opt out of analytics tracking through our cookie banner.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Firebase Authentication</h3>
            <p className="text-gray-700 mb-4">
              We use Firebase for secure user authentication. 
              Your login data is handled according to Google's privacy policy.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Supabase</h3>
            <p className="text-gray-700 mb-4">
              Your favorites and preferences are stored securely in Supabase, 
              a PostgreSQL database service with enterprise-grade security.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">Mailchimp</h3>
            <p className="text-gray-700 mb-4">
              If you consent to marketing emails, we sync your email with Mailchimp 
              for newsletter delivery. You can unsubscribe at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Encryption in transit and at rest</li>
              <li>Row-level security policies in our database</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Local Storage</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and local storage to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Remember your spoiler preferences</li>
              <li>Store your favorites locally (when not logged in)</li>
              <li>Track analytics (with your consent)</li>
              <li>Remember your donation acknowledgment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for children under 13. 
              We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. 
              We will notify you of any changes by posting the new Privacy Policy on this page 
              and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: privacy@missedthegame.com<br />
              Website: <Link href="/" className="text-blue-600 hover:underline">missedthegame.com</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
