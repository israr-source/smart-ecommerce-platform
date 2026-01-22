import { useState, useEffect } from 'react';

const ProfileCompletionModal = ({ user, isOpen, onClose }) => {
    // Only show if user is missing phone or address
    // But logic for "when to show" might be controlled by parent.

    // If phone and address are present, we don't need this, but user might want to edit.
    // This modal is specifically for "Completion" (First time).

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseUid: user.firebaseUid, // Using firebaseUid as identifier
                    ...formData
                })
            });
            const data = await res.json();
            if (res.ok) {
                // Update local storage
                const currentUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
                onClose(data); // Pass back updated data
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                <p className="text-gray-500 mb-6">Please provide your contact details for shipping.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Full Name</span></label>
                        <input type="text" className="input input-bordered w-full" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Phone Number</span></label>
                        <input type="tel" className="input input-bordered w-full" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required placeholder="+1 234 567 8900" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Shipping Address</span></label>
                        <textarea className="textarea textarea-bordered w-full" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required placeholder="123 Main St, City, Country"></textarea>
                    </div>

                    <button type="submit" className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}>
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;
