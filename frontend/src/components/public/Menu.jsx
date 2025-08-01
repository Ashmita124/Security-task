import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Menu = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category/getCategories");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:3000/api/v1/item/getItems";
        if (category) {
          url = `http://localhost:3000/api/v1/item/getItems/category/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        let items = data.data || [];

        if (sortOption === "low-to-high") {
          items.sort((a, b) => a.price - b.price);
        } else if (sortOption === "high-to-low") {
          items.sort((a, b) => b.price - a.price);
        } else if (sortOption === "above-500") {
          items = items.filter((item) => item.price > 500);
        } else if (sortOption === "below-500") {
          items = items.filter((item) => item.price <= 500);
        } else if (sortOption === "between-1000-2000") {
          items = items.filter((item) => item.price >= 1000 && item.price <= 2000);
        }

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption]);
  return (
    <>
      <Layout />
      <div className="flex bg-gradient-to-br from-pink-50 to-pink-100 p-4 mt-[-40px] h-full min-h-screen">
        {/* Left Sidebar */}
        <div className="w-1/4 mt-10 p-4">
          <h2 className="font-bold text-lg mb-2 text-pink-600">
            Product Categories
          </h2>
          <select
            className="border border-pink-300 p-2 w-full mb-4 text-pink-600 bg-pink-50 rounded-lg focus:ring-2 focus:ring-pink-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" className="text-black">
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="text-black">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Container */}
        <div className="w-3/4 p-4 mt-10 flex flex-col relative">
          {/* Sorting */}
          <div className="bg-white p-4 mt-[-15px] w-1/4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-2 text-pink-600">
              Sort Products
            </h2>
            <select
              className="border border-pink-300 p-2 w-full text-pink-600 bg-pink-50 rounded-lg focus:ring-2 focus:ring-pink-400"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="" className="text-black">
                Default Sorting
              </option>
              <option value="low-to-high" className="text-black">
                Price: Low to High
              </option>
              <option value="high-to-low" className="text-black">
                Price: High to Low
              </option>
              <option value="above-500" className="text-black">
                Price: Above 500
              </option>
              <option value="below-500" className="text-black">
                Price: Below 500
              </option>
              <option value="between-1000-2000" className="text-black">
                Price: 1000 - 2000
              </option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 gap-6 mt-6 mr-10">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 border border-pink-100"
                  onClick={() => navigate(`/item/details/${product._id}`)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4 border border-pink-200"
                  />
                  <h3 className="text-lg font-semibold text-pink-600">{product.name}</h3>
                  <span className="font-bold text-xl text-pink-500">
                    ${product.price}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-pink-400 text-center col-span-3">No products found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Menu;
