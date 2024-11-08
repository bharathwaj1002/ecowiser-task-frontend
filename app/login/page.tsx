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

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {

      const response = await axios.post(
        "https://ecowiser-task.duckdns.org/api/login/",
        {
          email,
          password,
        },
      );
      
      
      localStorage.setItem("authToken", response.data.token);
      console.log("Login successful:", response.data);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || error.message);
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
