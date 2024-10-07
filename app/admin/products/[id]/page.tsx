"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios"; // Import Axios
import AdminLayout from "../../layout";

export default function EditProduct(params) {
  const { id } = params.params;
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    description: "",
    category: "",
    picture1: null,
    picture2: null,
    picture3: null,
  });

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch product data
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("authToken");
      axios
        .get(`http://54.206.137.89:8000/api/products/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError("Failed to fetch product data.");
        });
    }
  }, [id]);

  // Fetch brands
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://54.206.137.89:8000/api/brands/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to fetch brands.");
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const token = localStorage.getItem("authToken");
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      await axios.put(`http://54.206.137.89:8000/api/products/${id}/`, form, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      window.location.href = `/product/${id}`;
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update product.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Cleanup object URLs to avoid memory leaks
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

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error */}
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
                  value={formData.description}
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
                type="file"
                name="picture1"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Picture 2
              </label>
              <input
                type="file"
                name="picture2"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Picture 3
              </label>
              <input
                type="file"
                name="picture3"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Updating..." : "Update Details"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
