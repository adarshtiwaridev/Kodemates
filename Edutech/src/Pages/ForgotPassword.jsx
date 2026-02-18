import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call your backend API here
    console.log("Send reset link to:", email);

    setMessage("If this email exists, a reset link has been sent.");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-lg max-w-md w-full px-6 py-8 mx-auto">
        
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Reset Password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white text-sm font-medium">
              Enter your registered Email
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-300 text-center text-sm">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-white text-sm">
          Remember your password?{" "}
          <a href="/login" className="underline hover:text-blue-300">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
