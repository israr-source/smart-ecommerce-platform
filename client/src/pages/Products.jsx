import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
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

    if (loading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-10">{categoryFilter ? `${categoryFilter} Products` : "Our Products"}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products;
