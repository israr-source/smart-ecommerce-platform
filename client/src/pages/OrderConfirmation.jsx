import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const { order } = location.state || {};

    if (!order) {
        return (
            <div className="min-h-screen f flex flex-col items-center justify-center bg-base-100">
                <h2 className="text-2xl font-bold mb-4">No order details found</h2>
                <Link to="/" className="btn btn-primary">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl">
                <div className="card-body text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-success/20 p-4 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>
                    <h2 className="card-title text-3xl justify-center mb-2">Order Confirmed!</h2>
                    <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

                    <div className="bg-base-200 rounded-xl p-6 mb-6 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-500">Order ID</span>
                            <span className="font-mono text-sm">{order._id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-500">Status</span>
                            <span className="badge badge-success">{order.status}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-500">Estimated Delivery</span>
                            <span className="text-info font-medium">{order.estimatedDelivery}</span>
                        </div>
                        <div className="divider my-2"></div>
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Amount</span>
                            <span>${order.totalAmount}</span>
                        </div>
                    </div>

                    <div className="card-actions justify-center gap-4">
                        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
                        <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
