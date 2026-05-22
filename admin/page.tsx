"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeedback() {
      const { data } = await supabase
        .from("feedback")
        .select(`
          *,
          days(day_title),
          sessions(session_title),
          faculty(faculty_name)
        `)
        .order("created_at", { ascending: false });

      setFeedback(data || []);
    }

    fetchFeedback();
  }, []);

  const total = feedback.length;

  const average = (field: string) => {
    if (!total) return 0;

    return (
      feedback.reduce(
        (sum, item) => sum + Number(item[field] || 0),
        0
      ) / total
    ).toFixed(2);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Admin Analytics Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <Card title="Total Responses" value={total} />
          <Card title="Content Quality" value={average("content_quality")} />
          <Card title="Faculty Explanation" value={average("explanation")} />
          <Card title="Usefulness" value={average("usefulness")} />

        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Day</th>
                <th className="p-3">Session</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Liked Most</th>
                <th className="p-3">Suggestion</th>
              </tr>

            </thead>

            <tbody>

              {feedback.map((item) => (

                <tr key={item.id} className="border-b">

                  <td className="p-3">
                    {item.student_name}
                  </td>

                  <td className="p-3">
                    {item.days?.day_title}
                  </td>

                  <td className="p-3">
                    {item.sessions?.session_title}
                  </td>

                  <td className="p-3">
                    {item.faculty?.faculty_name}
                  </td>

                  <td className="p-3">
                    {item.liked_most}
                  </td>

                  <td className="p-3">
                    {item.suggestion}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-blue-700 mt-2">
        {value}
      </h2>

    </div>
  );
}
