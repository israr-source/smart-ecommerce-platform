import { useState, useEffect } from 'react';
import AdminProductForm from '../components/AdminProductForm';

const Dashboard = () => {
    // Mock user/role - in real app, get from Context/LocalStorage
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    // For demo: verify role logic. We need a way to 'fake' admin if needed or use real from DB 
    // But since localStorage might not have 'role' unless we put it there on login...
    // Let's assume the user object in localStorage *might* have it or we fetch it.
    // For this implementation, let's default to 'user' but allow a toggle for testing if needed or just trust the data.

    // NOTE: To test as admin, manually modify localStorage 'user' object to have role: 'admin'
    // or we can fetch the user profile from backend on mount. 

    const [role, setRole] = useState('user');
    const [view, setView] = useState('list'); // 'list' | 'form'

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        // Basic check, in reality we should validate with backend
        if (storedUser.email === 'admin@example.com') { // Simple hardcoded admin check for demo or check property
            setRole('admin');
        } else if (storedUser.role) {
            setRole(storedUser.role);
        }
        setUser(storedUser);

        fetchData(storedUser.role === 'admin' ? 'admin' : 'user');
    }, []);

    const fetchData = (currentRole) => {
        if (currentRole === 'admin') {
            fetch('/api/products')
                .then(res => res.json())
                .then(setProducts)
                .catch(console.error);
        } else {
            // Fetch my orders
            // We need to pass userId if not using auth middleware cookies/headers logic fully yet
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = userData._id;

            if (userId) {
                // In our previous seeder, we might not have 'uid' that matches Firebase UID unless we sync them. 
                // But let's assume valid flow.

                let url = '/api/orders/myorders';
                if (userId) {
                    // Determine if we need to query param (based on our backend logic update)
                    // Our backend looks for header 'userid' or query 'userId'
                    url += `?userId=${userId}`; // simpler for now
                }

                fetch(url, {
                    headers: {
                        'userid': userId // sending as header too
                    }
                })
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch orders');
                        return res.json();
                    })
                    .then(setOrders)
                    .catch(console.error);
            } else {
                console.log("No user ID found, skipping order fetch");
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setView('form');
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
                fetchData('admin');
            } catch (error) {
                console.error(error);
                alert('Failed to delete');
            }
        }
    };

    const handleFormSuccess = () => {
        setView('list');
        setEditingProduct(null);
        fetchData('admin');
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                const res = await fetch(`/api/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                });
                if (res.ok) {
                    fetchData('user');
                } else {
                    alert('Failed to cancel');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="badge badge-lg badge-primary">{role === 'admin' ? 'Admin Access' : 'User Access'}</div>
            </div>

            {role === 'admin' ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Manage Products & Services</h2>
                        {view === 'list' && (
                            <button onClick={() => { setEditingProduct(null); setView('form'); }} className="btn btn-primary">
                                + Add New
                            </button>
                        )}
                    </div>

                    {view === 'form' ? (
                        <AdminProductForm
                            productToEdit={editingProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setView('list')}
                        />
                    ) : (
                        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
                            <table className="table w-full">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id} className="hover">
                                            <td>
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={product.imageUrl} alt={product.title} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="font-bold">{product.title}</td>
                                            <td>
                                                <span className={`badge ${product.type === 'service' ? 'badge-info' : 'badge-ghost'}`}>
                                                    {product.type || 'product'}
                                                </span>
                                            </td>
                                            <td>${product.price}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <button onClick={() => handleEditProduct(product)} className="btn btn-ghost btn-xs text-warning mr-2">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-ghost btn-xs text-error">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-10 bg-base-100 rounded-xl shadow">
                            <p className="text-lg text-gray-500">No orders found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {orders.map(order => (
                                <div key={order._id} className="card bg-base-100 shadow-xl border border-base-200">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="card-title text-primary">Order #{order._id.slice(-6)}</h3>
                                                <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`badge ${order.status === 'shipped' ? 'badge-success' : order.status === 'cancelled' ? 'badge-error' : 'badge-warning'} p-3`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="divider my-2"></div>

                                        <div className="space-y-2">
                                            {order.products.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span>Product ID: {item.productId} (x{item.quantity})</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="divider my-2"></div>

                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xl font-bold">Total: ${order.totalAmount}</p>
                                            {order.status === 'pending' && (
                                                <button onClick={() => handleCancelOrder(order._id)} className="btn btn-sm btn-outline btn-error">
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
