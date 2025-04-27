import type { SharedData } from "@/types"
import { Head, Link, usePage, } from "@inertiajs/react"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-background text-foregroung">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-primary" font-bold text-xl>
              SmartGrade
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              HOME
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Contact us
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              About us
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              How it works
            </Link>
            {auth.user ? (
              <Link href={route("dashboard")} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={route("login")} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  Login
                </Link>
              </>
            )}
          </nav>
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Automated Code Review for Smarter Learning
              </h1>
              <p className="text-foreground mb-8 max-w-lg">
                an ai-powered platform that delivers instant code feedback, auto-grading, and performance insights.
              </p>
              <Link
                href={auth.user ? route("dashboard") : route("register")}
                className="bg-primary text-white px-6 py-3 rounded-md font-medium inline-block"
              >
                Get Started
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative">
                {/* No need for the background shapes as they're part of the image */}
                <div className="relative z-10 flex justify-center">
                  <img
                    src="/images/welcome_pic.png"
                    alt="Students using SmartGrade"
                    className="w-full h-auto max-w-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-wider text-primary mb-2">FEATURES</h2>
            <h3 className="text-3xl font-bold">What You Can Do?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"                 
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Dual Submission</h4>
              <p className="text-center text-muted-foreground text-sm">
                Submit code projects via direct upload or GitHub links.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">AI Code Evaluation</h4>
              <p className="text-center text-muted-foreground text-sm">
                Leverages intelligent feedback generated by machine learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Manual Grading</h4>
              <p className="text-center text-muted-foreground text-sm">
                Teachers enjoy custom controls and editable, override-ready scoring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Analytics & Reports</h4>
              <p className="text-center text-muted-foreground text-sm">Visualize progress and export detailed reports.</p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Role-Based Access</h4>
              <p className="text-center text-muted-foreground text-sm">Stay secure with smart login for students, teachers.</p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center">
              <div className="bg-primary p-4 rounded-lg mb-4 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Personalized Feedback</h4>
              <p className="text-center text-muted-foreground text-sm">
                Understand your code better with clear, actionable insights.
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-wider text-primary mb-2">PROCESS</h2>
            <h3 className="text-3xl font-bold">How it works</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-16 space-y-8 md:space-y-0">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>:
              <h4 className="font-semibold">Submit Code</h4>
            </div>

            <div className="hidden md:block border-t-2 border-dashed border-border w-24"></div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold">Get Instant Feedback</h4>
            </div>

            <div className="hidden md:block border-t-2 border-dashed border-border w-24"></div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold">Track Progress</h4>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card text-card-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="text-primary font-bold text-xl">
                  SmartGrade
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SmartGrade. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
