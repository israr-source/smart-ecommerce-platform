import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                phone: parsedUser.phone || '',
                address: parsedUser.address || ''
            });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseUid: user.firebaseUid,
                    ...formData
                })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
                setUser({ ...user, ...data });
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="opacity-90">{user.email}</p>
                            <span className="badge badge-secondary mt-2 capitalize">{user.role}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Contact Details</h2>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-primary btn-sm">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name</span></label>
                                <input type="text" className="input input-bordered w-full" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="tel" className="input input-bordered w-full" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Shipping Address</span></label>
                                <textarea className="textarea textarea-bordered w-full" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required></textarea>
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</h3>
                                    <p className="text-lg font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Address</h3>
                                    <p className="text-lg font-medium text-gray-900 whitespace-pre-wrap">{user.address || 'Not provided'}</p>
                                </div>
                            </div>
                            {(!user.phone || !user.address) && (
                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>Your profile is incomplete. Please update your phone and address for shipping.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
