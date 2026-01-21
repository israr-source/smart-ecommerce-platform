import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.some(id => id === product._id));
    }, [product._id]);

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let newWishlist;
        if (isWishlisted) {
            newWishlist = wishlist.filter(id => id !== product._id);
        } else {
            newWishlist = [...wishlist, product._id];
        }
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl relative card-hover overflow-hidden rounded-2xl group">
            <figure className="h-64 overflow-hidden relative">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </figure>
            <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 btn btn-circle btn-sm border-none shadow-md ${isWishlisted ? 'btn-secondary text-white' : 'btn-ghost bg-white/80 hover:bg-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <div className="card-body p-6">
                <div className="badge badge-outline mb-2 text-xs text-gray-400">{product.category}</div>
                <h2 className="card-title text-lg font-bold line-clamp-1">{product.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                    <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm px-6 rounded-full shadow-md">View</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
