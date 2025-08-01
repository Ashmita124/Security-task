
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../common/customer/Footer';
import Hero from '../common/customer/Hero';
import ItemCard from '../common/customer/ItemCard';
import Layout from '../common/customer/layout';

const fetchItems = async (token, csrfToken) => {
    try {
        const headers = {
            'X-CSRF-Token': csrfToken
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios.get('http://localhost:3000/api/v1/item/items-by-tags', {
            headers,
            withCredentials: true
        });
        console.log('Home.jsx: fetchItems response:', response.status, response.data);
        if (response.status === 304) {
            // Handle 304 by returning null; useQuery will use cache
            return null;
        }
        // Check if response.data has the expected structure
        if (response.data && ('Featured' in response.data || 'Popular' in response.data || 'Trending' in response.data || 'Special' in response.data)) {
            return response.data;
        }
        // Fallback: check for success field for backward compatibility
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error('Invalid response structure from server');
    } catch (error) {
        console.error('Home.jsx: Error fetching items by tags:', error.response?.data || error.message);
        throw error;
    }
};

const Home = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);
    const navigate = useNavigate();
    const customerId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('Home.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('Home.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ITEMS_BY_TAGS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('Home.jsx: JWT Token:', token);
            // Allow guests: fetch without token if not present
            return fetchItems(token, csrfToken);
        },
        enabled: !!csrfToken,
        select: (data) => data || undefined,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to load items.', { autoClose: 4000 });
            }
        }
    });

    const featuredItems = data?.Featured ?? [];
    const trendingItems = data?.Trending ?? [];
    const bestSellerItems = data?.Popular ?? [];
    const specialItems = data?.Special ?? [];

    if (isLoading || isCsrfLoading) return <div className="p-6 text-gray-800">Loading...</div>;
    if (error) return <div className="p-6 text-gray-800">Error fetching items: {error.response?.data?.message || error.message}</div>;

    return (
        <>
            <Layout />
            <Hero />
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 min-h-screen">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <section className="p-4 bg-pink-50 shadow-md hover:bg-pink-100 transition rounded-2xl my-4">
                    <h2 className="text-xl font-bold p-2 text-pink-600">Featured Beauty Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {featuredItems.length > 0 ? (
                            featuredItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <p className="text-gray-800 col-span-full text-center">No featured products available</p>
                        )}
                    </div>
                </section>
                <section className="p-4 bg-pink-50 shadow-md hover:bg-pink-100 transition rounded-2xl my-4">
                    <h2 className="text-xl font-bold p-2 text-pink-600">Trending Beauty</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {trendingItems.length > 0 ? (
                            trendingItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <p className="text-gray-800 col-span-full text-center">No trending products available</p>
                        )}
                    </div>
                </section>
                <section className="p-4 bg-pink-50 shadow-md hover:bg-pink-100 transition rounded-2xl my-4">
                    <h2 className="text-xl font-bold p-2 text-pink-600">Best Sellers</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {bestSellerItems.length > 0 ? (
                            bestSellerItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <p className="text-gray-800 col-span-full text-center">No best sellers available</p>
                        )}
                    </div>
                </section>
                <section className="p-4 bg-pink-50 shadow-md hover:bg-pink-100 transition rounded-2xl my-4">
                    <h2 className="text-xl font-bold p-2 text-pink-600">Beauty Specials</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {specialItems.length > 0 ? (
                            specialItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <p className="text-gray-800 col-span-full text-center">No specials available</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
