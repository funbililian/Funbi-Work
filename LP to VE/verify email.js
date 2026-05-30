"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [email, setEmail] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [userCode, setUserCode] = useState("");

  // GENERATE RANDOM CODE

  const generateCode = () => {

    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();

  };

  // SEND VERIFICATION CODE

  const sendVerificationCode = async () => {

    if (!email) {
      alert("Enter email address");
      return;
    }

    const code = generateCode();

    setVerificationCode(code);

    try {

      const response = await fetch(
        "/api/send-verification",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            code,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        alert("Verification code sent to email");

      } else {

        alert(data.message);

      }

    } catch (error) {

      alert("Something went wrong");

    }

  };

  // VERIFY CODE

  const verifyCode = () => {

    if (userCode === verificationCode) {

      alert("Email verified successfully");

    } else {

      alert("Invalid verification code");

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

          <label className="block mb-2 font-semibold">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-4"
          />

        </div>

        {/* SEND BUTTON */}

        <button
          onClick={sendVerificationCode}
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
            placeholder="6-digit code"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-4"
          />

        </div>

        {/* VERIFY BUTTON */}

        <button
          onClick={verifyCode}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          Verify Email
        </button>

      </div>

    </section>

  );

}
