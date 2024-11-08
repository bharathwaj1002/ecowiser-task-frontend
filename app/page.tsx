"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    Promise.all([
      axios.get("https://ecowiser-task.duckdns.org/api/products/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      axios.get("https://ecowiser-task.duckdns.org/api/check_auth_status/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      axios.get("https://ecowiser-task.duckdns.org/api/brands/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    ])
      .then(([productsResponse, authResponse, brandsResponse]) => {
        setProducts(productsResponse.data);
        setBrands(brandsResponse.data);
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.error("Error:", error);
        setError("Failed to fetch data. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signup");
    }
  }, [isAuthenticated, router]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="container mx-auto p-4">
          <div className="flex">
            <h1 className="text-4xl font-bold my-6">Featured Products</h1>
            <button onClick={logout} className="ml-auto my-6 text-red-600">Logout</button>
          </div>
          {/* Buttons to Add Product and Brand */}
          <div className="mb-4">
            <Link href="/admin/products/create">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
                Add Product
              </button>
            </Link>
            <Link href="/admin/brands/create">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Add Brand
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={product.picture1}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-zinc-400">{product.brand.name}</p>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <h2 className="text-l">{product.description}</h2>
                  <p className="text-gray-500 font-extrabold">
                    ₹{product.price}
                  </p>
                  <span className="l-100">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-green-400"
                    >
                      More Details
                    </Link>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1>Unauthorised</h1>
      )}
    </>
  );
}
