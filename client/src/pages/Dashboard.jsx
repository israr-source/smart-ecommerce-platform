import { useState, useEffect } from 'react';

const Dashboard = () => {
    // Mock role, typically would come from Auth context
    const role = 'user'; // Change to 'admin' to test admin view

    const [data, setData] = useState([]);

    useEffect(() => {
        if (role === 'user') {
            fetch('/api/orders/myorders')
                .then(res => res.json())
                .then(setData)
                .catch(console.error);
        }
        // Logic for admin to fetch all products would go here
    }, [role]);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {role === 'admin' ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Sample Product 1</td>
                                    <td>$29.99</td>
                                    <td>10</td>
                                    <td>
                                        <button className="btn btn-xs btn-warning mr-2">Edit</button>
                                        <button className="btn btn-xs btn-error">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
                    <div className="grid gap-4">
                        {data.map(order => (
                            <div key={order._id} className="card bg-base-100 shadow-xl border">
                                <div className="card-body">
                                    <h3 className="card-title">Order #{order._id}</h3>
                                    <p>Status: <span className={`badge ${order.status === 'shipped' ? 'badge-success' : 'badge-warning'}`}>{order.status}</span></p>
                                    <p>Total: <span className="font-bold">${order.totalAmount}</span></p>
                                    <p>Date: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
