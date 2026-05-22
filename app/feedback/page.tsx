"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeedbackPage() {
  const [days, setDays] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    student_name: "",
    school_name: "",
    class_name: "",
    email: "",
    day_id: "",
    session_id: "",
    faculty_id: "",
    content_quality: 5,
    explanation: 5,
    interaction: 5,
    activity_quality: 5,
    usefulness: 5,
    organization: 5,
    liked_most: "",
    suggestion: "",
  });

  useEffect(() => {
    async function fetchDays() {
      const { data } = await supabase
        .from("days")
        .select("*")
        .order("id");

      setDays(data || []);
    }

    fetchDays();
  }, []);

  async function fetchSessions(dayId: string) {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("day_id", dayId);

    setSessions(data || []);
    setFaculty([]);
  }

  async function fetchFaculty(sessionId: string) {
    const { data } = await supabase
      .from("session_faculty")
      .select(`
        faculty_id,
        role,
        faculty (
          faculty_name,
          designation
        )
      `)
      .eq("session_id", sessionId);

    setFaculty(data || []);
  }

  function handleChange(e: any) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "day_id") {
      fetchSessions(value);
    }

    if (name === "session_id") {
      fetchFaculty(value);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const payload = {
      ...form,
      day_id: Number(form.day_id),
      session_id: Number(form.session_id),
      faculty_id: Number(form.faculty_id),
      content_quality: Number(form.content_quality),
      explanation: Number(form.explanation),
      interaction: Number(form.interaction),
      activity_quality: Number(form.activity_quality),
      usefulness: Number(form.usefulness),
      organization: Number(form.organization),
    };

    const { error } = await supabase
      .from("feedback")
      .insert([payload]);

    if (error) {
      setMessage("Error submitting feedback.");
    } else {
      setMessage("Feedback submitted successfully.");
    }
  }

  const ratings = [
    ["content_quality", "Content Quality"],
    ["explanation", "Faculty Explanation"],
    ["interaction", "Interaction"],
    ["activity_quality", "Activity Quality"],
    ["usefulness", "Usefulness"],
    ["organization", "Overall Organization"],
  ];

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Session Feedback Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            required
            name="student_name"
            placeholder="Student Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="school_name"
            placeholder="School Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="class_name"
            placeholder="Class"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <select
            required
            name="day_id"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select Day</option>

            {days.map((day) => (
              <option key={day.id} value={day.id}>
                {day.day_title}
              </option>
            ))}
          </select>

          <select
            required
            name="session_id"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select Session</option>

            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.session_title}
              </option>
            ))}
          </select>

          <select
            required
            name="faculty_id"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select Faculty</option>

            {faculty.map((f: any, index: number) => (
              <option key={index} value={f.faculty_id}>
                {f.faculty.faculty_name} ({f.role})
              </option>
            ))}
          </select>

          {ratings.map(([name, label]) => (
            <div key={name}>
              <label className="font-medium">
                {label}
              </label>

              <select
                name={name}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
          ))}

          <textarea
            name="liked_most"
            placeholder="What did you like most?"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            name="suggestion"
            placeholder="Suggestions for improvement"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Submit Feedback
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-semibold">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
