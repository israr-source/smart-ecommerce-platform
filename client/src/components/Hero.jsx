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

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SlidingHero = () => {
    const carouselRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 'slide1',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80',
            title: <>Experience the <br /><span className="text-primary">Future of Living</span></>,
            desc: "Upgrade your world with cutting-edge smart gadgets designed for modern life.",
            link: "/products",
            btnText: "Shop Now",
            btnClass: "btn-primary border-none shadow-xl",
            align: 'left',
            bgGradient: 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
        },
        {
            id: 'slide2',
            image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=1600&q=80',
            title: "Seamless Connectivity",
            desc: "Stay connected with our premium range of wearables.",
            link: "/products?category=Wearables",
            btnText: "Explore Wearables",
            btnClass: "btn-outline btn-wide text-white border-white hover:bg-white hover:text-black",
            align: 'center',
            bgGradient: 'bg-gradient-to-t from-black/80 via-transparent to-transparent items-end pb-20 justify-center'
        },
        {
            id: 'slide3',
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80',
            title: <>Smart Home <br /><span className="text-secondary">Revolution</span></>,
            desc: "Seamless Connectivity. Stay connected with our premium range of smart home devices.",
            link: "/products?category=Smart Home",
            btnText: "Shop Smart Home",
            btnClass: "btn-secondary border-none shadow-xl",
            align: 'right',
            bgGradient: 'bg-gradient-to-l from-black/80 via-black/40 to-transparent items-center justify-end pr-20'
        }
    ];

    const scrollToSlide = (index) => {
        if (carouselRef.current) {
            const width = carouselRef.current.clientWidth;
            carouselRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setCurrentSlide(index);
        }
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % slides.length;
        scrollToSlide(next);
    };

    const prevSlide = () => {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        scrollToSlide(prev);
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const width = carouselRef.current.clientWidth;
            const scrollPos = carouselRef.current.scrollLeft;
            const index = Math.round(scrollPos / width);
            setCurrentSlide(index);
        }
    };

    return (
        <div className="relative w-full mt-[-64px]">
            <div
                className="carousel w-full h-[600px] scroll-smooth"
                ref={carouselRef}
                onScroll={handleScroll}
            >
                {slides.map((slide) => (
                    <div key={slide.id} id={slide.id} className="carousel-item relative w-full">
                        <img src={slide.image} alt="Banner" className="w-full object-cover" />
                        <div className={`absolute inset-0 flex ${slide.align === 'center' ? 'text-center' : slide.align === 'left' ? 'items-center pl-20' : ''} ${slide.bgGradient}`}>
                            <div className={`text-white max-w-xl ${slide.align === 'right' ? 'text-right' : ''}`}>
                                <h1 className="mb-5 text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">{slide.title}</h1>
                                <p className="mb-8 text-xl font-light opacity-90">{slide.desc}</p>
                                <Link to={slide.link} className={`btn btn-lg rounded-full px-10 ${slide.btnClass}`}>{slide.btnText}</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons Overlay */}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-10 pointer-events-none">
                <button onClick={prevSlide} className={`btn btn-circle glass text-white border-none hover:bg-white/20 pointer-events-auto ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : ''}`}>❮</button>
                <button onClick={nextSlide} className={`btn btn-circle glass text-white border-none hover:bg-white/20 pointer-events-auto ${currentSlide === slides.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}>❯</button>
            </div>
        </div>
    );
};

export default SlidingHero;
