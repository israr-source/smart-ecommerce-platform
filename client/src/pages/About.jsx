import React from 'react';

const About = () => {
    const team = [
        {
            name: "Sayem",
            role: "Team Leader & Developer",
            email: "c231239@ugrad.iiuc.ac.bd",
            image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" // Placeholder or generic avatar if actual not provided
        },
        {
            name: "Irfan",
            role: "Developer",
            email: "c231221@ugrad.iiuc.ac.bd",
            image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        },
        {
            name: "Saptarshi",
            role: "Analyst",
            email: "c231237@ugrad.iiuc.ac.bd",
            image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        }
    ];

    return (
        <div className="bg-base-100 min-h-screen">
            {/* Hero Section */}
            <div className="hero h-[400px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)' }}>
                <div className="hero-overlay bg-opacity-70"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">About Shoply</h1>
                        <p className="mb-5 text-lg">
                            We are passionate about bringing the future of living to your doorstep.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="card-body">
                            <h2 className="card-title text-3xl font-bold text-primary mb-4">Our Mission</h2>
                            <p className="text-lg leading-relaxed">
                                To revolutionize the ecommerce experience by providing cutting-edge smart gadgets that enhance modern living, while fostering a community of innovation and trust.
                            </p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="card-body">
                            <h2 className="card-title text-3xl font-bold text-secondary mb-4">Our Vision</h2>
                            <p className="text-lg leading-relaxed">
                                To be the world's leading destination for smart technology, empowering individuals to live smarter, more connected lives through accessible and reliable innovation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        We are hard working, passionate and enthusiast developers from <span className="text-primary font-semibold">International Islamic University Chittagong</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-base-200">
                            <figure className="px-10 pt-10">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random&size=200`} alt={member.name} />
                                    </div>
                                </div>
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-2xl">{member.name}</h2>
                                <div className="badge badge-primary badge-outline text-lg p-3 mb-2">{member.role}</div>
                                <div className="divider my-0"></div>
                                <p className="text-slate-500 font-medium">Contact</p>
                                <a href={`mailto:${member.email}`} className="link link-hover text-primary font-semibold break-all">
                                    {member.email}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
