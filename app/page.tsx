import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Summer School Feedback System
        </h1>

        <p className="mt-4 text-gray-600">
          Multi-Day • Multi-Session • Multi-Faculty Feedback Portal
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/feedback"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Submit Feedback
          </Link>

          <Link
            href="/admin"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
