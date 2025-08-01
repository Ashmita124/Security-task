
import { Card } from "@/components/common/ui/card";
import axios from "axios";
import { DollarSign, LayoutDashboard, List, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/v1";

const Dashboard = () => {
    const [users, setUsers] = useState(0);
    const [orders, setOrders] = useState(0);
    const [items, setItems] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${API_BASE_URL}/auth/getAllCustomers`);
                setUsers(userResponse.data.count || 0);

                const orderResponse = await axios.get(`${API_BASE_URL}/order/orders`);
                setOrders(orderResponse.data.length);

                const totalRevenue = orderResponse.data
                    ? orderResponse.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    : 0;
                setRevenue(totalRevenue);

                const itemResponse = await axios.get(`${API_BASE_URL}/item/getItems`);
                setItems(itemResponse.data.count || 0);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-3 space-y-4 bg-gradient-to-br from-pink-50 to-pink-100 min-h-screen">
            <div className="flex items-center gap-2 text-xl font-bold text-pink-600">
                <LayoutDashboard size={28} className="text-pink-400" />
                Dashboard
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-white rounded-2xl shadow-md hover:bg-pink-50 transition">
                    <User size={32} className="text-pink-400" />
                    <div>
                        <h2 className="text-lg font-semibold text-pink-600">Users</h2>
                        <p className="text-xl font-bold text-gray-800">{users}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white rounded-2xl shadow-md hover:bg-pink-50 transition">
                    <ShoppingBag size={32} className="text-pink-400" />
                    <div>
                        <h2 className="text-lg font-semibold text-pink-600">Orders</h2>
                        <p className="text-xl font-bold text-gray-800">{orders}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white rounded-2xl shadow-md hover:bg-pink-50 transition">
                    <DollarSign size={32} className="text-pink-400" />
                    <div>
                        <h2 className="text-lg font-semibold text-pink-600">Revenue</h2>
                        <p className="text-xl font-bold text-gray-800">Rs {revenue}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white rounded-2xl shadow-md hover:bg-pink-50 transition">
                    <List size={32} className="text-pink-400" />
                    <div>
                        <h2 className="text-lg font-semibold text-pink-600">Menu Items</h2>
                        <p className="text-xl font-bold text-gray-800">{items}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 shadow-md bg-white rounded-2xl hover:bg-pink-50 transition">
                    <h2 className="text-lg font-semibold mb-4 text-pink-600">Top Selling Cosmetics</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>Matte Lipstick - 220 sales</li>
                        <li>Hydrating Face Serum - 180 sales</li>
                        <li>Volumizing Mascara - 150 sales</li>
                        <li>Glow Foundation - 130 sales</li>
                    </ul>
                </Card>
                <Card className="p-4 shadow-md bg-white rounded-2xl hover:bg-pink-50 transition">
                    <h2 className="text-lg font-semibold mb-4 text-pink-600">Top Categories</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>Skincare - 4.9/5</li>
                        <li>Makeup - 4.8/5</li>
                        <li>Haircare - 4.7/5</li>
                        <li>Fragrances - 4.6/5</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;