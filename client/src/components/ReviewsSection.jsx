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
                    userId: user.uid // Ensure this matches backend expectation
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
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} className="chat chat-start">
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                                        <span className="text-xs">{review.userId?.name?.[0] || 'U'}</span>
                                    </div>
                                </div>
                                <div className="chat-header">
                                    {review.userId?.name || 'User'}
                                    <time className="text-xs opacity-50 ml-2">{new Date(review.createdAt).toLocaleDateString()}</time>
                                </div>
                                <div className="chat-bubble chat-bubble-primary bg-opacity-10 text-base-content">
                                    <div className="rating rating-xs mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <input
                                                key={i}
                                                type="radio"
                                                className="mask mask-star-2 bg-orange-400"
                                                checked={i < review.rating}
                                                readOnly
                                            />
                                        ))}
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Write Review Form */}
                <div className="card bg-base-100 shadow-lg border border-base-200 h-fit">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Write a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">Rating</label>
                                <div className="rating">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <input
                                            key={star}
                                            type="radio"
                                            name="rating-1"
                                            className="mask mask-star-2 bg-orange-400"
                                            checked={newReview.rating === star}
                                            onChange={() => setNewReview({ ...newReview, rating: star })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">Comment</label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Share your thoughts..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-full">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
