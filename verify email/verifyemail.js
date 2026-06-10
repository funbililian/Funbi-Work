"use client";

import { useState } from "react";

const API_BASE = "https://tax-system-backend.onrender.com/api/auth";

export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [userCode, setUserCode] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // SEND VERIFICATION CODE
  // ==========================

  const sendVerificationCode = async () => {

    if (!email) {
      alert("Enter email address");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${API_BASE}/send-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Verification code sent to email");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY CODE
  // ==========================

  const verifyCode = async () => {

    if (!email || !userCode) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${API_BASE}/verify-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          code: userCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Email verified successfully 🎉");

      // redirect to login
      window.location.href = "/login.html";

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-5">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-8">
          Email Verification
        </h1>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">Email Address</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-4"
          />
        </div>

        {/* SEND CODE */}
        <button
          onClick={sendVerificationCode}
          disabled={loading}
          className="w-full bg-green-700 text-white py-4 rounded-xl mb-6"
        >
          Send Verification Code
        </button>

        {/* CODE INPUT */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">
            Enter Verification Code
          </label>

          <input
            type="text"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full border rounded-xl px-4 py-4"
          />
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyCode}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          Verify Email
        </button>

      </div>

    </section>
  );
}