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

// Simple sliding hero using DaisyUI carousel
const SlidingHero = () => {
    return (
        <div className="carousel w-full h-[600px] relative mt-[-64px]">
            <div id="slide1" className="carousel-item relative w-full">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center pl-20">
                    <div className="max-w-md text-white">
                        <h1 className="mb-5 text-5xl font-bold leading-tight">Elevate Your Lifestyle</h1>
                        <p className="mb-5 text-lg">Discover the latest trends in electronics, fashion, and home decor.</p>
                        <button className="btn btn-primary border-none shadow-lg px-8">Shop Now</button>
                    </div>
                </div>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a href="#slide4" className="btn btn-circle glass text-white border-none hover:bg-white/20">❮</a>
                    <a href="#slide2" className="btn btn-circle glass text-white border-none hover:bg-white/20">❯</a>
                </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg" className="w-full object-cover" />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a href="#slide1" className="btn btn-circle">❮</a>
                    <a href="#slide3" className="btn btn-circle">❯</a>
                </div>
            </div>
        </div>
    )
}

export default SlidingHero;
