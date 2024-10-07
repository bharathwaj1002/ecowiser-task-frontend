"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getCSRFToken = () => {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    // Check if the CSRF token exists
    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }
    return null; // Return null if not found
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const csrfToken = getCSRFToken(); // Get CSRF token

      // Check if the CSRF token is available
      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      const response = await axios.post(
        "https://54.206.137.89:8000/api/login/",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include CSRF token in the headers
          },
        }
      );
      
      // If successful, handle the response
      localStorage.setItem("authToken", response.data.token);
      console.log("Login successful:", response.data);
      // Save the token or user info to local storage or context here
      // Redirect to home or dashboard after login
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || error.message); // Display error message to user
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-6">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-lg w-full p-2 my-2 black text-black"
          />
        </div>
        <div>
          <label className="block">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded-lg w-full p-2 my-2 text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600">
          Sign up here
        </a>
      </p>
    </div>
  );
}
