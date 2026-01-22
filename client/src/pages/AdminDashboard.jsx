import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products'); // products, orders, settings
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Product Form State
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        title: '', description: '', price: '', imageUrl: '', category: '', stock: 0, type: 'product'
    });

    const token = localStorage.getItem('token');

    // Check Auth
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || !user || user.role !== 'admin') {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = () => {
        setLoading(true);
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'orders') {
            fetchOrders();
        } else {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productForm)
            });
            if (res.ok) {
                setEditingProduct(null);
                setProductForm({ title: '', description: '', price: '', imageUrl: '', category: '', stock: 0, type: 'product' });
                fetchProducts();
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setProductForm(product);
        window.scrollTo(0, 0); // Scroll to form
    };

    // Order Handlers
    const handleOrderStatus = async (id, status) => {
        try {
            await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'products' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>Products</button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>Orders</button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>Settings</button>
                </nav>
                <div className="mt-auto">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {activeTab === 'products' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

                        {/* Add/Edit Product Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Title" className="input input-bordered w-full" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} required />
                                <input placeholder="Price" type="number" className="input input-bordered w-full" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                                <input placeholder="Category" className="input input-bordered w-full" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required />
                                <input placeholder="Image URL" className="input input-bordered w-full" value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} required />
                                <input placeholder="Stock" type="number" className="input input-bordered w-full" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                                <select className="select select-bordered w-full" value={productForm.type} onChange={e => setProductForm({ ...productForm, type: e.target.value })}>
                                    <option value="product">Product</option>
                                    <option value="service">Service</option>
                                </select>
                                <textarea placeholder="Description" className="textarea textarea-bordered w-full md:col-span-2" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required></textarea>

                                <div className="md:col-span-2 flex gap-2">
                                    <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                                    {editingProduct && <button type="button" className="btn btn-ghost" onClick={() => { setEditingProduct(null); setProductForm({ title: '', description: '', price: '', imageUrl: '', category: '', stock: 0, type: 'product' }); }}>Cancel</button>}
                                </div>
                            </form>
                        </div>

                        {/* Product List */}
                        <div className="grid grid-cols-1 gap-4">
                            {products.map(product => (
                                <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={product.imageUrl} alt={product.title} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <h4 className="font-bold">{product.title}</h4>
                                            <p className="text-sm text-gray-500">${product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(product)} className="btn btn-sm btn-info btn-outline">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-sm btn-error btn-outline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage All Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="table bg-white shadow-md rounded-lg">
                                {/* head */}
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td><span className="text-xs font-mono">{order._id.substring(order._id.length - 8)}</span></td>
                                            <td>
                                                <div>
                                                    <div className="font-bold">{order.userId?.name || 'Unknown'}</div>
                                                    <div className="text-sm opacity-50">{order.userId?.email}</div>
                                                </div>
                                            </td>
                                            <td>${order.totalAmount}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'shipping' ? 'badge-info' : 'badge-warning'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="select select-bordered select-xs w-full max-w-xs"
                                                    value={order.status}
                                                    onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="shipping">Shipping</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Settings</h2>
                        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
                            {/* Change Email Form */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">Update Email</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newEmail = e.target.newEmail.value;
                                    try {
                                        const res = await fetch('/api/admin/email', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify({ newEmail })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            alert('Email updated successfully');
                                            // Update local storage to reflect changes immediately
                                            const currentUser = JSON.parse(localStorage.getItem('user'));
                                            localStorage.setItem('user', JSON.stringify({ ...currentUser, email: newEmail }));
                                        } else {
                                            alert(data.message || 'Failed to update email');
                                        }
                                    } catch (err) { console.error(err); alert('Error updating email'); }
                                }}>
                                    <input name="newEmail" type="email" placeholder="New Email Address" className="input input-bordered w-full mb-4" defaultValue={JSON.parse(localStorage.getItem('user'))?.email} required />
                                    <button type="submit" className="btn btn-secondary w-full">Update Email</button>
                                </form>
                            </div>

                            {/* Change Password Form */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newPassword = e.target.newPassword.value;
                                    try {
                                        const res = await fetch('/api/admin/password', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify({ newPassword })
                                        });
                                        if (res.ok) alert('Password updated');
                                        else alert('Failed');
                                    } catch (err) { console.error(err); }
                                }}>
                                    <input name="newPassword" type="password" placeholder="New Password" className="input input-bordered w-full mb-4" required />
                                    <button type="submit" className="btn btn-primary w-full">Update Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
