const Hero = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    <button className="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';

const SlidingHero = () => {
    return (
        <div className="carousel w-full h-[600px] relative mt-[-64px]">
            {/* Slide 1 */}
            <div id="slide1" className="carousel-item relative w-full">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80" alt="Smart Home Setup" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center pl-20">
                    <div className="max-w-xl text-white">
                        <h1 className="mb-5 text-6xl font-bold leading-tight drop-shadow-lg">Experience the <br /><span className="text-primary">Future of Living</span></h1>
                        <p className="mb-8 text-xl font-light opacity-90">Upgrade your world with cutting-edge smart gadgets designed for modern life.</p>
                        <Link to="/products" className="btn btn-primary border-none shadow-xl px-10 btn-lg rounded-full">Shop Now</Link>
                    </div>
                </div>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-10">
                    <a href="#slide4" className="btn btn-circle glass text-white border-none hover:bg-white/20">❮</a>
                    <a href="#slide2" className="btn btn-circle glass text-white border-none hover:bg-white/20">❯</a>
                </div>
            </div>

            {/* Slide 2 */}
            <div id="slide2" className="carousel-item relative w-full">
                <img src="https://images.unsplash.com/photo-1510017803434-a899398421b3?w=1600&q=80" alt="Smart Watch" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end pb-20 justify-center">
                    <div className="text-center text-white max-w-2xl px-4">
                        <h1 className="mb-4 text-5xl font-bold drop-shadow-lg">Seamless Connectivity</h1>
                        <p className="mb-6 text-lg">Stay connected with our premium range of wearables.</p>
                        <Link to="/products?category=Wearables" className="btn btn-outline btn-wide text-white border-white hover:bg-white hover:text-black">Explore Wearables</Link>
                    </div>
                </div>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-10">
                    <a href="#slide1" className="btn btn-circle glass text-white border-none hover:bg-white/20">❮</a>
                    <a href="#slide3" className="btn btn-circle glass text-white border-none hover:bg-white/20">❯</a>
                </div>
            </div>
        </div>
    )
}

export default SlidingHero;
