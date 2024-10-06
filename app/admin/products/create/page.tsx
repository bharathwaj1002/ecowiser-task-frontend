"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    brand: "",
    picture1: null,
    picture2: null,
    picture3: null,
  });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://127.0.0.1:8000/api/brands/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => setBrands(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    return () => {
      if (formData.picture1 instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(formData.picture1));
      }
      if (formData.picture2 instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(formData.picture2));
      }
      if (formData.picture3 instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(formData.picture3));
      }
    };
  }, [formData.picture1, formData.picture2, formData.picture3]);

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
      await axios.post("http://127.0.0.1:8000/api/products/", form, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            {/* Main Image */}
            <div className="mb-4 border border-gray-300 p-4 flex items-center justify-center">
              <img
                src={
                  formData.picture1 instanceof File
                    ? URL.createObjectURL(formData.picture1)
                    : formData.picture1
                }
                alt={formData.name}
                className="object-contain h-80 w-full"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-4 mb-4">
              {formData.picture1 && (
                <img
                  src={
                    formData.picture1 instanceof File
                      ? URL.createObjectURL(formData.picture1)
                      : formData.picture1
                  }
                  alt={`${formData.name} - picture1`}
                  className="h-20 w-20 border-2"
                />
              )}
              {formData.picture2 && (
                <img
                  src={
                    formData.picture2 instanceof File
                      ? URL.createObjectURL(formData.picture2)
                      : formData.picture2
                  }
                  alt={`${formData.name} - picture2`}
                  className="h-20 w-20 border-2"
                />
              )}
              {formData.picture3 && (
                <img
                  src={
                    formData.picture3 instanceof File
                      ? URL.createObjectURL(formData.picture3)
                      : formData.picture3
                  }
                  alt={`${formData.name} - picture3`}
                  className="h-20 w-20 border-2"
                />
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-lg font-semibold mb-2">Name</label>
                <input
                  className="text-black border p-2 w-full"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Brand
                </label>
                <select
                  className="text-black border p-2 w-full"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"
                  className="w-full h-full text-black"
                ></textarea>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Category
                </label>
                <input
                  className="text-black border p-2 w-full"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Price
                </label>
                <input
                  className="text-black border p-2 w-full"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">
                  Stock
                </label>
                <input
                  className="text-black border p-2 w-full"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column: Upload pictures */}
          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Picture 1
              </label>
              <input
                className="border p-2 w-full"
                type="file"
                name="picture1"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Picture 2
              </label>
              <input
                className="border p-2 w-full"
                type="file"
                name="picture2"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Picture 3
              </label>
              <input
                className="border p-2 w-full"
                type="file"
                name="picture3"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4"
            >
              Add Product
            </button>
          </div>
        </div>
      </form>
    </>
  );
}