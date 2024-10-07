"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../layout";
import axios from "axios";

export default function EditBrand(params) {
  // const router = useRouter();
  const id = params.params.id;
  console.log("PARAMS: ", params.params.id);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("authToken");
      axios
        .get(`https://https://ecowiser-task.duckdns.org/api/brands/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Error:", err));
    }
  }, [id]);

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
      await axios.put(`https://https://ecowiser-task.duckdns.org/api/brands/${id}/`, form, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      window.location.href = "/admin/brands";
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Edit Brand</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Logo:</label>
          <input type="file" name="logo" onChange={handleChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Update Brand
        </button>
      </form>
    </>
  );
}
