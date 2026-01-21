import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                // Take the first 8 products as featured
                setFeaturedProducts(data.slice(0, 8));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Hero />
            <div className="container mx-auto py-16 px-4">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Featured Products</h2>
                    <div className="w-24 h-1 bg-primary rounded-full"></div>
                    <p className="text-gray-500 mt-4 text-center max-w-2xl">
                        Discover our handpicked selection of top-rated smart gadgets, designed to elevate your lifestyle.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-16">
                            <Link to="/products" className="btn btn-primary btn-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                View All Products
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
