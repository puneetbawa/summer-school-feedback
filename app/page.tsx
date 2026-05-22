"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
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

    loadData();
  }, []);

  const total = feedback.length;

  const avg = (field: string) =>
    total
      ? (
          feedback.reduce((sum, item) => sum + Number(item[field] || 0), 0) /
          total
        ).toFixed(2)
      : "0";

  const facultySummary = feedback.reduce((acc: any, item) => {
    const name = item.faculty?.faculty_name || "Unknown";
    if (!acc[name]) acc[name] = { count: 0, total: 0 };
    acc[name].count++;
    acc[name].total +=
      Number(item.content_quality) +
      Number(item.explanation) +
      Number(item.interaction) +
      Number(item.activity_quality) +
      Number(item.usefulness) +
      Number(item.organization);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Admin Feedback Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          <Card title="Responses" value={total} />
          <Card title="Content" value={avg("content_quality")} />
          <Card title="Explanation" value={avg("explanation")} />
          <Card title="Interaction" value={avg("interaction")} />
          <Card title="Activity" value={avg("activity_quality")} />
          <Card title="Usefulness" value={avg("usefulness")} />
          <Card title="Organization" value={avg("organization")} />
        </div>

        <h2 className="text-xl font-semibold mb-3">Faculty-wise Average</h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Faculty</th>
                <th className="p-3">Responses</th>
                <th className="p-3">Average / 5</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(facultySummary).map((name) => (
                <tr key={name} className="border-b">
                  <td className="p-3">{name}</td>
                  <td className="p-3">{facultySummary[name].count}</td>
                  <td className="p-3">
                    {(facultySummary[name].total / (facultySummary[name].count * 6)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mb-3">All Feedback</h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">School</th>
                <th className="p-3">Day</th>
                <th className="p-3">Session</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Liked Most</th>
                <th className="p-3">Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="p-3">{f.student_name}</td>
                  <td className="p-3">{f.school_name}</td>
                  <td className="p-3">{f.days?.day_title}</td>
                  <td className="p-3">{f.sessions?.session_title}</td>
                  <td className="p-3">{f.faculty?.faculty_name}</td>
                  <td className="p-3">{f.liked_most}</td>
                  <td className="p-3">{f.suggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-blue-700">{value}</h2>
    </div>
  );
}
