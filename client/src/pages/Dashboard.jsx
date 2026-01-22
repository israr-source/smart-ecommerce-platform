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

    const [wishlistProducts, setWishlistProducts] = useState([]);

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
        // ... existing fetchData implementation ... 
        // preserving original logic just by not changing it here since we only replacing lines 22-33 if we were replacing that block, 
        // but wait, I need to insert fetchWishlist function and state.
        // Let's replace the whole component body relative to the change or just insert carefully.
        // Actually, I will replace the component main parts to integrate the tab switching.
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

                fetch(url, { headers: { 'userid': userId } })
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch orders');
                        return res.json();
                    })
                    .then(setOrders)
                    .catch(console.error);
            }
        }
    };

    // ... existing handlers ...

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    {/* Tab Switcher for User */}
                    {role === 'user' && (
                        <div className="tabs tabs-boxed">
                            <a className={`tab ${view === 'list' ? 'tab-active' : ''}`} onClick={() => setView('list')}>My Orders</a>
                            <a className={`tab ${view === 'wishlist' ? 'tab-active' : ''}`} onClick={() => setView('wishlist')}>Wishlist</a>
                        </div>
                    )}
                    <div className="badge badge-lg badge-primary">{role === 'admin' ? 'Admin Access' : 'User Access'}</div>
                </div>
            </div>

            {role === 'admin' ? (
                // ... Admin View ...
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
                    {view === 'wishlist' ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
                            {wishlistProducts.length === 0 ? (
                                <div className="text-center py-10 bg-base-100 rounded-xl shadow">
                                    <p className="text-lg text-gray-500">Your wishlist is empty.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {wishlistProducts.map(product => (
                                        <div key={product._id} className="card bg-base-100 shadow-xl border border-base-200">
                                            <figure className="h-48 overflow-hidden">
                                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                            </figure>
                                            <div className="card-body p-4">
                                                <h3 className="card-title text-base">{product.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                                <div className="card-actions justify-between items-center mt-2">
                                                    <span className="text-lg font-bold text-primary">${product.price}</span>
                                                    <a href={`/products/${product._id}`} className="btn btn-sm btn-outline btn-primary">View</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                                            <div>
                                                                <span className="font-semibold block">{item.productId?.title || 'Unknown Product'}</span>
                                                                <span className="text-xs text-gray-400">ID: {item.productId?._id || item.productId}</span>
                                                            </div>
                                                            <span className="font-mono">x{item.quantity}</span>
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
            )}
        </div>
    );
};

export default Dashboard;
