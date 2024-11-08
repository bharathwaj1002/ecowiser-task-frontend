"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateBrand() {
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      await axios.post("https://ecowiser-task.duckdns.org/api/brands/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Create New Brand</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input className="text-black" type="text" name="name" onChange={handleChange} required />
        </div>
        <div>
          <label>Logo:</label>
          <input type="file" name="logo" onChange={handleChange} required />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Create Brand
        </button>
      </form>
    </>
  );
}
