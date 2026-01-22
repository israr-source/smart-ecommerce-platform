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
        // Simulate sending 
        setTimeout(() => {
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="max-w-6xl w-full bg-base-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">

                {/* Contact Info Section */}
                <div className="md:w-1/2 bg-primary p-12 text-primary-content flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
                        <p className="text-lg opacity-90 mb-12">
                            Have questions about our smart gadgets? We're here to help you find the perfect upgrade for your lifestyle.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                                    <p className="opacity-80">Chattogram, Bangladesh</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                    <p className="opacity-80">support@shoply.com</p>
                                    <p className="opacity-80">careers@shoply.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                                    <p className="opacity-80">+1 (555) 123-4567</p>
                                    <p className="opacity-80">Sun-Thu, 9am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Circle */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Form Section */}
                <div className="md:w-1/2 p-12 bg-base-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h3>

                    {success && <div role="alert" className="alert alert-success mb-6 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Thanks! We'll get back to you shortly.</span></div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label font-medium text-gray-600">Your Name</label>
                            <input
                                type="text"
                                className="input input-bordered w-full h-12 focus:border-primary focus:ring-1 focus:ring-primary bg-base-200/50"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label font-medium text-gray-600">Email Address</label>
                            <input
                                type="email"
                                className="input input-bordered w-full h-12 focus:border-primary focus:ring-1 focus:ring-primary bg-base-200/50"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label font-medium text-gray-600">Message</label>
                            <textarea
                                className="textarea textarea-bordered w-full h-32 focus:border-primary focus:ring-1 focus:ring-primary bg-base-200/50 text-base"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary w-full btn-lg text-white shadow-lg hover:-translate-y-1 transition-transform">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
