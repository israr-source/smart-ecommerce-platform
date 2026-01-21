import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            // Simulated submission
            console.log('Form submitted:', formData);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-lg">
            <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
            {success && <div role="alert" className="alert alert-success mb-4"><span>Message sent successfully!</span></div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="form-control w-full">
                    <div className="label"><span className="label-text">Name</span></div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </label>
                <label className="form-control w-full">
                    <div className="label"><span className="label-text">Email</span></div>
                    <input type="email" placeholder="Type here" className="input input-bordered w-full"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </label>
                <label className="form-control">
                    <div className="label"><span className="label-text">Message</span></div>
                    <textarea className="textarea textarea-bordered h-24" placeholder="Bio"
                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required></textarea>
                </label>
                <button type="submit" className="btn btn-primary mt-4">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
