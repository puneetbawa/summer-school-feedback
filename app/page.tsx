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
    mobile: "",
    day_id: "",
    session_id: "",
    faculty_id: "",
    content_quality: "5",
    explanation: "5",
    interaction: "5",
    activity_quality: "5",
    usefulness: "5",
    organization: "5",
    liked_most: "",
    suggestion: "",
  });

  useEffect(() => {
    async function loadDays() {
      const { data } = await supabase.from("days").select("*").order("id");
      setDays(data || []);
    }
    loadDays();
  }, []);

  async function loadSessions(dayId: string) {
    setForm({ ...form, day_id: dayId, session_id: "", faculty_id: "" });

    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("day_id", dayId)
      .order("id");

    setSessions(data || []);
    setFaculty([]);
  }

  async function loadFaculty(sessionId: string) {
    setForm({ ...form, session_id: sessionId, faculty_id: "" });

    const { data } = await supabase
      .from("session_faculty")
      .select(`
        faculty_id,
        role,
        faculty (
          faculty_name,
          designation,
          department
        )
      `)
      .eq("session_id", sessionId);

    setFaculty(data || []);
  }

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "day_id") {
      loadSessions(value);
      return;
    }

    if (name === "session_id") {
      loadFaculty(value);
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMessage("");

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

    const { error } = await supabase.from("feedback").insert([payload]);

    if (error) {
      setMessage("Unable to submit feedback. Please try again.");
      return;
    }

    setMessage("Feedback submitted successfully. Thank you.");

    setForm({
      student_name: "",
      school_name: "",
      class_name: "",
      email: "",
      mobile: "",
      day_id: "",
      session_id: "",
      faculty_id: "",
      content_quality: "5",
      explanation: "5",
      interaction: "5",
      activity_quality: "5",
      usefulness: "5",
      organization: "5",
      liked_most: "",
      suggestion: "",
    });

    setSessions([]);
    setFaculty([]);
  }

  const ratingFields = [
    ["content_quality", "Session content was useful"],
    ["explanation", "Faculty explained the topic clearly"],
    ["interaction", "Faculty encouraged interaction"],
    ["activity_quality", "Activity / hands-on quality"],
    ["usefulness", "Session improved my understanding"],
    ["organization", "Overall session organization"],
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700">
          AI Summer School Feedback Form
        </h1>

        <p className="text-gray-600 mt-2 mb-6">
          Please submit feedback for the session you attended.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <input required name="student_name" value={form.student_name} onChange={handleChange} placeholder="Student Name *" className="border p-3 rounded-xl" />
            <input name="school_name" value={form.school_name} onChange={handleChange} placeholder="School Name" className="border p-3 rounded-xl" />
            <input name="class_name" value={form.class_name} onChange={handleChange} placeholder="Class / Grade" className="border p-3 rounded-xl" />
            <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" className="border p-3 rounded-xl" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email ID" className="border p-3 rounded-xl md:col-span-2" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <select required name="day_id" value={form.day_id} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="">Select Day *</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.day_title}
                </option>
              ))}
            </select>

            <select required name="session_id" value={form.session_id} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="">Select Session *</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.session_title}
                </option>
              ))}
            </select>

            <select required name="faculty_id" value={form.faculty_id} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="">Select Faculty *</option>
              {faculty.map((f: any, index: number) => (
                <option key={index} value={f.faculty_id}>
                  {f.faculty?.faculty_name} - {f.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {ratingFields.map(([name, label]) => (
              <div key={name} className="bg-slate-50 p-4 rounded-xl border">
                <label className="font-medium text-gray-700">{label}</label>
                <select name={name} value={(form as any)[name]} onChange={handleChange} className="w-full mt-2 border p-3 rounded-xl bg-white">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Average</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
            ))}
          </div>

          <textarea name="liked_most" value={form.liked_most} onChange={handleChange} placeholder="What did you like most about this session?" className="w-full border p-3 rounded-xl min-h-24" />

          <textarea name="suggestion" value={form.suggestion} onChange={handleChange} placeholder="Any suggestion for improvement?" className="w-full border p-3 rounded-xl min-h-24" />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
            Submit Feedback
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-semibold text-blue-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
