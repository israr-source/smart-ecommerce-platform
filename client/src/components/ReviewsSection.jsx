import { useState, useEffect } from 'react';

const ReviewsSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

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
        <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Reviews List */}
                <div className="md:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg text-primary"></span></div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center p-10 bg-base-100 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                                <div className="card-body p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-primary-content rounded-full w-12 text-xl font-bold">
                                                    <span>{review.userId?.name?.[0] || 'U'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{review.userId?.name || 'User'}</h4>
                                                <div className="rating rating-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <input
                                                            key={i}
                                                            type="radio"
                                                            className="mask mask-star-2 bg-warning"
                                                            checked={i < review.rating}
                                                            readOnly
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <time className="text-sm text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</time>
                                    </div>
                                    <p className="mt-4 text-gray-600 leading-relaxed">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Write Review Form */}
                <div className="md:col-span-1">
                    <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-24">
                        <div className="card-body">
                            <h3 className="card-title text-xl mb-2">Write a Review</h3>
                            <p className="text-sm text-gray-500 mb-4">Share your thoughts on this product.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label font-medium">Rating</label>
                                    <div className="rating rating-lg gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <input
                                                key={star}
                                                type="radio"
                                                name="rating-1"
                                                className="mask mask-star-2 bg-warning"
                                                checked={newReview.rating === star}
                                                onChange={() => setNewReview({ ...newReview, rating: star })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium">Your Review</label>
                                    <textarea
                                        className="textarea textarea-bordered h-32 focus:border-primary focus:ring-1 focus:ring-primary text-base"
                                        placeholder="What did you like or dislike?"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-full btn-lg mt-2 text-white shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 transition-all">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
