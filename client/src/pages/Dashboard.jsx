import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProductForm from '../components/AdminProductForm';

const Dashboard = () => {
    const navigate = useNavigate();
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

    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (storedUser.role === 'admin') {
            navigate('/admin/dashboard'); // Redirect Admin to proper dashboard
            return;
        }

        // Basic check, in reality we should validate with backend
        if (storedUser.email === 'admin@example.com') { // Simple hardcoded admin check for demo or check property
            // Legacy check, ideally use role
            navigate('/admin/dashboard');
            return;
        } else if (storedUser.role) {
            setRole(storedUser.role);
        }
        setUser(storedUser);

        fetchData(storedUser.role === 'admin' ? 'admin' : 'user');
        if (storedUser._id) fetchWishlist(storedUser._id);
    }, []);

    const fetchWishlist = (userId) => {
        fetch(`/api/users/${userId}/wishlist`)
            .then(res => res.json())
            // The API returns an array of products (populated)
            .then(setWishlistProducts)
            .catch(console.error);
    };

    const fetchData = (currentRole) => {
        const token = localStorage.getItem('token');
        if (currentRole === 'admin') {
            fetch('/api/products')
                .then(res => res.json())
                .then(setProducts)
                .catch(console.error);
        } else {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = userData._id;

            if (userId) {
                let url = '/api/orders/myorders';
                if (userId) url += `?userId=${userId}`;

                const headers = { 'userid': userId };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                fetch(url, { headers })
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch orders');
                        return res.json();
                    })
                    .then(setOrders)
                    .catch(console.error);
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

    const handleUpdateAddress = async (orderId, currentAddress) => {
        const newAddress = prompt("Enter new shipping address:", currentAddress);
        if (newAddress && newAddress !== currentAddress) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ shippingAddress: newAddress })
                });
                if (res.ok) {
                    fetchData('user');
                } else {
                    alert('Failed to update address');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order history?')) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchData('user');
                } else {
                    alert('Failed to delete order');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 'cancelled' })
                });
                if (res.ok) {
                    fetchData('user');
                } else {
                    const data = await res.json().catch(() => ({}));
                    alert('Failed to cancel: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };


    // Stats Calculation
    const totalSpent = orders.reduce((acc, order) => acc + (order.status !== 'cancelled' ? order.totalAmount : 0), 0);
    const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'shipped').length;

    return (
        <div className="min-h-screen bg-base-200/50 pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-content pt-12 pb-24 px-4 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <div className="container mx-auto relative z-10 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Hello, {user.email?.split('@')[0] || 'User'}! 👋</h1>
                            <p className="text-primary-content/80 text-lg">Welcome back to your dashboard.</p>
                        </div>
                        <div className="badge badge-lg bg-white/20 border-none text-white backdrop-blur-sm p-4">
                            {role === 'admin' ? 'Admin Access' : 'Member'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Stats Grid */}
                {role === 'user' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title font-medium">Total Spent</div>
                            <div className="stat-value text-primary">${totalSpent.toFixed(2)}</div>
                            <div className="stat-desc">Lifetime purchases</div>
                        </div>

                        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title font-medium">Active Orders</div>
                            <div className="stat-value text-secondary">{activeOrdersCount}</div>
                            <div className="stat-desc">Pending or Shipped</div>
                        </div>

                        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
                            <div className="stat-figure text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <div className="stat-title font-medium">Wishlist</div>
                            <div className="stat-value text-accent">{wishlistProducts.length}</div>
                            <div className="stat-desc">Items saved</div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="bg-base-100 rounded-3xl shadow-xl min-h-[500px] overflow-hidden border border-base-200">

                    {role === 'user' && (
                        <div className="border-b border-base-200">
                            <div className="flex justify-center sm:justify-start p-4 bg-base-50/50">
                                <div className="tabs tabs-boxed bg-base-200/50 p-1 rounded-xl">
                                    <a className={`tab tab-md rounded-lg transition-all duration-300 ${view === 'list' ? 'tab-active bg-white shadow-sm' : ''}`} onClick={() => setView('list')}>📦 My Orders</a>
                                    <a className={`tab tab-md rounded-lg transition-all duration-300 ${view === 'wishlist' ? 'tab-active bg-white shadow-sm' : ''}`} onClick={() => setView('wishlist')}>❤️ My Wishlist</a>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 sm:p-8">
                        {role === 'admin' ? (
                            // ... Admin View ...
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Product Management</h2>
                                    {view === 'list' && (
                                        <button onClick={() => { setEditingProduct(null); setView('form'); }} className="btn btn-primary gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                            Add New Product
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
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead className="bg-base-200">
                                                <tr>
                                                    <th>Product</th>
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
                                                            <div className="flex items-center space-x-3">
                                                                <div className="avatar">
                                                                    <div className="mask mask-squircle w-12 h-12">
                                                                        <img src={product.imageUrl} alt={product.title} />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold">{product.title}</div>
                                                                    <div className="text-sm opacity-50">{product.category}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${product.type === 'service' ? 'badge-info' : 'badge-ghost'} badge-sm`}>
                                                                {product.type || 'product'}
                                                            </span>
                                                        </td>
                                                        <td className="font-mono">${product.price}</td>
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
                            // User View
                            <div className="animate-fade-in">
                                {view === 'wishlist' ? (
                                    // Wishlist View
                                    <div>
                                        {wishlistProducts.length === 0 ? (
                                            <div className="text-center py-20">
                                                <div className="bg-base-200 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                                                <p className="text-gray-500 mb-6">Start exploring products to save for later!</p>
                                                <a href="/products" className="btn btn-primary">Explore Products</a>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {wishlistProducts.map(product => (
                                                    <div key={product._id} className="card bg-base-100 shadow-lg border border-base-100 hover:shadow-2xl transition-all duration-300 group">
                                                        <figure className="h-48 overflow-hidden relative">
                                                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                            <div className="absolute top-2 right-2 badge badge-ghost bg-white/80 backdrop-blur-md">{product.category}</div>
                                                        </figure>
                                                        <div className="card-body p-4">
                                                            <h3 className="card-title text-base font-bold truncate">{product.title}</h3>
                                                            <p className="text-sm text-gray-500 line-clamp-1 h-5">{product.description}</p>
                                                            <div className="flex justify-between items-center mt-3">
                                                                <span className="text-lg font-bold text-primary">${product.price}</span>
                                                                <a href={`/products/${product._id}`} className="btn btn-sm btn-circle btn-primary">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Orders View
                                    <div className="space-y-6">
                                        {orders.length === 0 ? (
                                            <div className="text-center py-20">
                                                <div className="bg-base-200 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                                                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
                                                <a href="/products" className="btn btn-primary">Start Shopping</a>
                                            </div>
                                        ) : (
                                            orders.map(order => (
                                                <div key={order._id} className="card bg-base-100 shadow-md border border-base-200 overflow-hidden hover:shadow-lg transition-shadow">
                                                    {/* Order Header */}
                                                    <div className="bg-base-200/50 p-4 flex flex-wrap justify-between items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-full ${order.status === 'shipped' ? 'bg-success/10 text-success' : order.status === 'cancelled' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                                                                {order.status === 'shipped' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                                ) : order.status === 'cancelled' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm">Order <span className="font-mono text-gray-500">#{order._id.slice(-6).toUpperCase()}</span></p>
                                                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`badge ${order.status === 'shipped' ? 'badge-success' : order.status === 'cancelled' ? 'badge-error' : 'badge-warning'} uppercase font-bold tracking-wider`}>
                                                            {order.status}
                                                        </div>
                                                    </div>

                                                    <div className="p-0">
                                                        {/* Order Items */}
                                                        {order.products.map((item, idx) => (
                                                            <div key={idx} className="flex gap-4 p-4 border-b border-base-100 last:border-0 hover:bg-base-50/50 transition-colors">
                                                                <div className="avatar">
                                                                    <div className="w-16 h-16 rounded-xl bg-base-200">
                                                                        {item.productId?.imageUrl ? (
                                                                            <img src={item.productId.imageUrl} alt={item.productId.title || 'Product'} />
                                                                        ) : (
                                                                            <span className="flex items-center justify-center h-full text-xs">No Img</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-base">{item.productId?.title || 'Unknown Product'}</h4>
                                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    {item.productId?.price && <p className="font-bold">${item.productId.price * item.quantity}</p>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Order Footer */}
                                                    <div className="bg-base-50 p-4 border-t border-base-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                                        <div className="text-sm space-y-1 w-full md:w-auto">
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                <span className="font-semibold text-gray-600">Ship to:</span> {order.shippingAddress}
                                                            </div>
                                                            {order.estimatedDelivery && (
                                                                <div className="flex items-center gap-2 text-info font-medium">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    <span>Arriving by: {order.estimatedDelivery}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                                            <div className="text-lg font-bold mr-4">Total: ${order.totalAmount}</div>

                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button onClick={() => handleUpdateAddress(order._id, order.shippingAddress)} className="btn btn-sm btn-ghost hover:bg-base-200">
                                                                        Edit Address
                                                                    </button>
                                                                    <button onClick={() => handleCancelOrder(order._id)} className="btn btn-sm btn-warning btn-outline">
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button onClick={() => handleDeleteOrder(order._id)} className="btn btn-sm btn-error btn-outline" title="Delete History">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
