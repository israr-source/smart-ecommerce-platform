import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);


    const [showCheckout, setShowCheckout] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const addressRef = useRef();
    const [shippingInfo, setShippingInfo] = useState({ cost: 0, date: '' });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    const handleBuyNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to purchase');
            navigate('/login');
            return;
        }

        // Suggest/Generate Shipping
        const randomCost = Math.floor(Math.random() * 20) + 5; // $5 - $25
        const days = Math.floor(Math.random() * 7) + 3; // 3 - 10 days
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);

        setShippingInfo({
            cost: randomCost,
            date: deliveryDate.toDateString()
        });

        setShowCheckout(true);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault(); // Prevent form submit refresh if any
        const address = addressRef.current.value;
        if (!address) {
            alert('Address is required');
            return;
        }

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !token) { // Check for user and token
            alert('Please login first');
            return;
        }

        setLoading(true);

        try {
            const finalTotal = (product.price * quantity) + shippingInfo.cost; // Updated total calculation

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Use token from localStorage
                },
                body: JSON.stringify({
                    totalAmount: finalTotal,
                    products: [{ productId: product._id, quantity: quantity }], // Pass selected quantity
                    userId: user._id,
                    shippingAddress: address,
                    shippingCost: shippingInfo.cost,
                    estimatedDelivery: shippingInfo.date
                })
            });
            const data = await res.json();
            if (res.ok) {
                setShowCheckout(false);
                navigate('/order-confirmation', { state: { order: data } }); // Navigate on success
            } else {
                alert('Order failed: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showCheckout) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (!product) return <div className="min-h-screen flex justify-center items-center text-xl">Product not found</div>;

    return (
        <div className="container mx-auto py-12 px-4 relative">
            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-slide-up">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Secure Checkout
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span>{product.title}</span>
                                    <span className="font-bold">${product.price?.toFixed(2)}</span>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm">Quantity</span>
                                    <div className="join">
                                        <button className="join-item btn btn-xs btn-outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                        <span className="join-item btn btn-xs bg-base-100 border-base-content/20 no-animation w-10">{quantity}</span>
                                        <button className="join-item btn btn-xs btn-outline" onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm mb-1 text-gray-500">
                                    <span>Shipping Estimate</span>
                                    <span>${shippingInfo.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2 text-info">
                                    <span>Estimated Delivery</span>
                                    <span>{shippingInfo.date}</span>
                                </div>
                                <div className="divider my-1"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${((product.price * quantity) + shippingInfo.cost).toFixed(2)}</span>
                                </div>
                            </div>

                            <form className="space-y-3">
                                <div>
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <span className="label-text font-semibold">Shipping Address</span>
                                    </label>
                                    <input ref={addressRef} type="text" placeholder="123 Main St, City, Country" className="input input-bordered w-full" defaultValue="123 Smart St, Tech City" />
                                </div>

                                <div>
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <span className="label-text font-semibold">Payment Method</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <button type="button" className="btn btn-outline btn-sm btn-active flex-1">Credit Card</button>
                                        <button type="button" className="btn btn-outline btn-sm flex-1">PayPal</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Card Number (Mock)</span>
                                    </label>
                                    <input type="text" placeholder="**** **** **** 1234" className="input input-bordered w-full" disabled defaultValue="**** **** **** 4242" />
                                </div>
                            </form>
                        </div>

                        <div className="modal-action mt-6">
                            <button onClick={() => setShowCheckout(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={handlePlaceOrder} className="btn btn-primary px-8">Pay & Place Order</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-base-100 rounded-3xl shadow-2xl overflow-hidden ${showCheckout ? 'blur-sm' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="h-[400px] lg:h-[600px] bg-gray-100 relative">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <div className="badge badge-primary p-3 text-white">{product.category}</div>
                            <div className={`badge ${product.type === 'service' ? 'badge-info' : 'badge-ghost'} p-3 uppercase font-bold tracking-wider`}>
                                {product.type || 'Product'}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{product.title}</h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                            <span className="text-4xl font-bold text-primary">${product.price?.toFixed(2)}</span>
                            {isAdmin ? (
                                <button disabled className="btn btn-disabled btn-lg w-full sm:w-auto px-12">Admin View</button>
                            ) : (
                                <button onClick={handleBuyNow} className="btn btn-primary btn-lg w-full sm:w-auto px-12 shadow-xl hover:scale-105 transition-transform">Buy Now</button>
                            )}
                        </div>

                        <div className="divider my-8"></div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-base-200 rounded-xl">
                                <span className="block font-bold">Fast Delivery</span>
                                <span className="text-xs text-gray-500">2-3 Days</span>
                            </div>
                            <div className="p-4 bg-base-200 rounded-xl">
                                <span className="block font-bold">Guaranteed</span>
                                <span className="text-xs text-gray-500">1 Year</span>
                            </div>
                            <div className="p-4 bg-base-200 rounded-xl">
                                <span className="block font-bold">Generic</span>
                                <span className="text-xs text-gray-500">Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reviews Section */}
            <ReviewsSection productId={product._id} />
        </div>
    );
};

export default ProductDetails;
