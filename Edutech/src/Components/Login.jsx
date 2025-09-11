import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex flex-col space-y-3">
            <button className="flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition-all">
              <img src="/Images/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>

            <button className="flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition-all">
              <img src="/Images/apple-icon.png" alt="Apple" className="w-5 h-5 mr-2" />
              Sign in with Apple
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/Images/industry.png"
            alt="Login Illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
