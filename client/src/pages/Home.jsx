import Hero from '../components/Hero';

const Home = () => {
    return (
        <div>
            <Hero />
            <div className="container mx-auto py-10">
                <h2 className="text-3xl font-bold text-center mb-6">Featured Products</h2>
                {/* Featured products carousel or grid could go here */}
            </div>
        </div>
    );
};

export default Home;
