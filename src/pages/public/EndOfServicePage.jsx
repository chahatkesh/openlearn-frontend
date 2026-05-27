import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Footer, Navbar } from '../../components/layout'
import { PageHead } from '../../components/common'

const EndOfServicePage = () => {
  return (
    <>
      <PageHead
        title="End of Service"
        description="OpenLearn has reached end of service. Read what has changed, what remains available, and how the public archive will be maintained."
        keywords="OpenLearn end of service, OpenLearn archive, NIT Jalandhar learning community"
      />
      <Navbar />
      <main className="min-h-screen bg-white pt-16 sm:pt-[72px] lg:pt-20">
        <section className="bg-red-700 text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-red-50 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to OpenLearn
            </Link>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-100">
              End of Service Notice
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              OpenLearn has reached end of service.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-red-50 sm:text-lg">
              The active OpenLearn platform, including cohorts, dashboard access, login,
              submissions, progress tracking, and backend services, has been discontinued.
              The public website remains available as an archive of the community, events,
              and work created during OpenLearn's active period.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-800">
            <div>
              <h2 className="text-2xl font-semibold text-gray-950">What changed</h2>
              <p className="mt-3 leading-7">
                OpenLearn is no longer operating as an active software service. The backend
                infrastructure has been shut down, and product features that depended on it
                are no longer maintained.
              </p>
              <ul className="mt-4 space-y-2 leading-7">
                <li>Active cohorts and enrollments are discontinued.</li>
                <li>Dashboard, login, submissions, and progress updates are unavailable.</li>
                <li>API, monitoring, and backend infrastructure are no longer operated.</li>
                <li>The public website remains as an archive for past events and community records.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-950">Why this happened</h2>
              <p className="mt-3 leading-7">
                OpenLearn was run by a student-led team with limited funds and operational
                bandwidth. Because the organization is no longer active, keeping the full
                platform online would not be responsible. Ending the active service lets the
                project close cleanly while preserving its public history.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-950">What OpenLearn achieved</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="border-l-4 border-red-700 pl-4">
                  <dt className="text-3xl font-bold text-gray-950">675</dt>
                  <dd className="mt-1 text-sm text-gray-600">registered users</dd>
                </div>
                <div className="border-l-4 border-red-700 pl-4">
                  <dt className="text-3xl font-bold text-gray-950">414</dt>
                  <dd className="mt-1 text-sm text-gray-600">cohort enrollments</dd>
                </div>
                <div className="border-l-4 border-red-700 pl-4">
                  <dt className="text-3xl font-bold text-gray-950">202</dt>
                  <dd className="mt-1 text-sm text-gray-600">learning resources</dd>
                </div>
                <div className="border-l-4 border-red-700 pl-4">
                  <dt className="text-3xl font-bold text-gray-950">4,472</dt>
                  <dd className="mt-1 text-sm text-gray-600">resource progress records</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-950">For former users</h2>
              <p className="mt-3 leading-7">
                Platform data was backed up before infrastructure shutdown for operational
                records. The archive does not provide dashboard access or individual progress
                exports. Public event pages, community pages, and project history may remain
                available while the domain and static hosting remain active.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-950">Repository notice</h2>
              <p className="mt-3 leading-7">
                The frontend and backend repositories remain available as archived project
                records. They should not be treated as actively operated production services.
              </p>
              <a
                href="https://github.com/openlearnnitj"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-red-700 hover:text-red-800"
              >
                View OpenLearn on GitHub
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default EndOfServicePage
