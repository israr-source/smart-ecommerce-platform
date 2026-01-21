import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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


    const handleBuyNow = async () => {
        // Basic check for auth
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token) {
            alert('Please login to purchase');
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Uncomment when auth middleware is active
                },
                body: JSON.stringify({
                    totalAmount: product.price,
                    products: [{ productId: product._id, quantity: 1 }],
                    userId: user._id // Sending userId for now until middleware is active
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Order placed successfully! Order ID: ' + data.orderId);
            } else {
                alert('Order failed: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (!product) return <div className="min-h-screen flex justify-center items-center text-xl">Product not found</div>;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
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
                            <span className="text-4xl font-bold text-primary">${product.price}</span>
                            <button onClick={handleBuyNow} className="btn btn-primary btn-lg w-full sm:w-auto px-12 shadow-xl hover:scale-105 transition-transform">Buy Now</button>
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
