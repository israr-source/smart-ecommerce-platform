import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(p => p.category))];
                setCategories(uniqueCategories);

                if (categoryFilter) {
                    setProducts(data.filter(p => p.category === categoryFilter));
                } else {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryFilter]);

    const handleCategoryChange = (category) => {
        if (category) {
            setSearchParams({ category });
        } else {
            setSearchParams({});
        }
    };

    if (loading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                <button
                    className={`btn rounded-full ${!categoryFilter ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleCategoryChange(null)}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn rounded-full ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {!loading && products.length === 0 && (
                <div className="text-center py-10 opacity-70">
                    <p className="text-xl">No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Products;
