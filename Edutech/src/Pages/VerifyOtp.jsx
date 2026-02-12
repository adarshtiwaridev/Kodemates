import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    // Get saved signup data
    const storedData = localStorage.getItem("signupData");

    if (!storedData) {
      setError("Session expired. Please signup again.");
      return;
    }

    const formData = JSON.parse(storedData);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            otp: otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Clear localStorage after success
      localStorage.removeItem("signupData");

      // Redirect to login
      navigate("/dashboard");

    } catch (err) {
      setError("Verification failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-lg max-w-md w-full px-6 py-10 mx-auto">
        <h2 className="text-4xl font-extrabold text-white mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-center text-white mb-6 text-sm opacity-90">
          Enter the 6-digit OTP sent to your email
        </p>

    <form onSubmit={handleVerify} className="space-y-4">

          <div>
            <label className="block text-white text-sm font-medium">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              className="mt-1 block w-full px-4 py-3 text-center tracking-widest text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Verify OTP
          </button>
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Didn’t receive OTP?{" "}
          <span className="underline cursor-pointer hover:text-blue-300">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
