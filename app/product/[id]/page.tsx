"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const ProductSpecs = (params) => {
  const { id } = params.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(""); // To handle the selected image

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `https://ecowiser-task.duckdns.org/api/products/${id}/`,
            {
              headers: {
                Authorization: `Token ${token}`, // Token prefix, not Bearer
              },
            }
          );
          setProduct(response.data);
          setActiveImage(response.data.picture1); // Set the first image as default
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");
    if (confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`https://ecowiser-task.duckdns.org/api/products/${id}/`, {
          headers: {
            Authorization: `Token ${token}`, // Make sure to use Token
          },
        })
        .then(() => (window.location.href = "/"))
        .catch((err) => console.error("Error:", err));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          {/* Main Image */}
          <div className="mb-4 border border-gray-300 p-4 flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="object-contain h-80 w-full"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4">
            {[product.picture1, product.picture2, product.picture3].map(
              (picture, index) =>
                picture && (
                  <img
                    key={index}
                    src={picture}
                    alt={`${product.name} - picture${index + 1}`}
                    className={`h-20 w-20 cursor-pointer border-2 ${
                      activeImage === picture
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                    onClick={() => handleImageClick(picture)}
                  />
                )
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-6">
          <p className="text-lg mb-2">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="text-lg mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-lg mb-2">
            <strong>Price:</strong> ₹{product.price}
          </p>
          <p className="text-lg mb-2">
            <strong>Stock:</strong> {product.stock} items
          </p>
          <p className="text-lg mb-2">
            <strong>Brand:</strong> {product.brand.name}
          </p>
          <Link href={`/admin/products/${id}`}>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            >
              Update
            </button>
          </Link>
          <button onClick={() => handleDelete(product.id)}>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4 ml-4"
            >
              Delete
            </button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
