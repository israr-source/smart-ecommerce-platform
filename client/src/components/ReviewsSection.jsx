import { useState, useEffect } from 'react';

const ReviewsSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    useEffect(() => {
        if (reviews.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % reviews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [reviews]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('Please login to write a review');
            return;
        }

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newReview,
                    productId,
                    userId: user._id
                })
            });

            if (res.ok) {
                setNewReview({ rating: 5, comment: '' });
                fetchReviews();
            } else {
                alert('Failed to submit review');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-20 max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-light mb-12 text-center tracking-tight">Customer Reviews</h2>

            {/* Sliding Review Banner */}
            {reviews.length > 1 && (
                <div className="w-full bg-neutral-900 rounded-3xl mb-16 overflow-hidden relative h-80 flex items-center justify-center">
                    {reviews.map((review, index) => (
                        <div
                            key={review._id}
                            className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-700'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <div className="avatar mb-4">
                                <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={review.userId?.photoURL || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=random`} alt={review.userId?.name} />
                                </div>
                            </div>
                            <p className="text-white text-xl md:text-2xl text-center font-light leading-relaxed max-w-3xl">"{review.comment}"</p>
                            <p className="text-gray-400 mt-2 font-medium tracking-wide uppercase text-sm">— {review.userId?.name || 'Customer'}</p>
                        </div>
                    ))}
                    <div className="absolute bottom-6 flex gap-3">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-gray-700 w-2 hover:bg-gray-600'}`}
                            ></button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-10">
                    <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                        Latest Reviews
                        <span className="badge badge-neutral badge-sm font-normal">{reviews.length}</span>
                    </h3>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 font-light">
                            No reviews yet. Be the first to share your experience.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {reviews.map(review => (
                                <div key={review._id} className="py-8 first:pt-0">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-full">
                                                <img src={review.userId?.photoURL || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=random`} alt={review.userId?.name} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-gray-900">{review.userId?.name || 'User'}</h4>
                                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-500 text-xs my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-light pl-14">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Write Review Form */}
                <div className="lg:col-span-5">
                    <div className="bg-gray-50 rounded-3xl p-8 lg:p-10 sticky top-24">
                        <h3 className="text-2xl font-light mb-2 text-gray-900">Write a Review</h3>
                        <p className="text-sm text-gray-500 mb-8 font-light">How was your overall experience?</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`btn btn-circle btn-sm border-none shadow-none text-lg transition-transform hover:scale-110 ${newReview.rating >= star ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Comment</label>
                                <textarea
                                    className="textarea w-full h-32 bg-white border-0 shadow-sm focus:ring-2 focus:ring-black/5 resize-none text-base placeholder:text-gray-300 pointer-events-auto"
                                    placeholder="Tell us what you liked..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-neutral w-full rounded-full normal-case text-lg font-normal mt-4 shadow-lg hover:shadow-xl transition-all">
                                Post Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
