const products = [
    {
        title: "Galaxy Smart Watch 5",
        description: "Advanced health monitoring, sleep tracking, and seamless connectivity. The perfect companion for your active lifestyle.",
        price: 249.99,
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
        category: "Wearables",
        stock: 40
    },
    {
        title: "Fitness Band Pro",
        description: "Slim, lightweight tracker with heart rate monitoring, step counting, and 14-day battery life.",
        price: 49.99,
        imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
        category: "Wearables",
        stock: 100
    },
    {
        title: "Sonic Wireless Earbuds",
        description: "Immersive sound with active noise cancellation. Water-resistant and ergonomic design for all-day comfort.",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
        category: "Audio",
        stock: 60
    },
    {
        title: "Smart WiFi LED Bulb (RGB)",
        description: "Control your lighting with your voice or phone. 16 million colors and dimmable warmth settings.",
        price: 15.99,
        imageUrl: "https://images.pexels.com/photos/20943579/pexels-photo-20943579.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-20943579.jpg&fm=jpg",
        category: "Smart Home",
        stock: 200
    },
    {
        title: "Mini Smart Plug 2-Pack",
        description: "Turn any outlet into a smart outlet. Schedule appliances and control them remotely via the app.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1692052607011-10d51b24223f?w=500&q=80",
        category: "Smart Home",
        stock: 150
    },
    {
        title: "Portable Bluetooth Speaker",
        description: "360-degree sound in a compact, waterproof design. Perfect for outdoor adventures and parties.",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
        category: "Audio",
        stock: 75
    },
    {
        title: "Smart Security Camera",
        description: "Keep an eye on your home 24/7 with 1080p HD video, night vision, and motion detection alerts.",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80",
        category: "Smart Home",
        stock: 30
    },
    {
        title: "VR Headset Elite",
        description: "Step into virtual reality with crystal clear visuals and intuitive controllers. Compatible with PC and console.",
        price: 399.99,
        imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&q=80",
        category: "Wearables",
        stock: 15
    },
    {
        title: "Smart Ring Tracker",
        description: "Discreet health tracking in a stylish ring. Monitors sleep, heart rate, and activity levels.",
        price: 299.00,
        imageUrl: "https://images.unsplash.com/photo-1651752090085-50375d90bf8b?w=500&q=80",
        category: "Wearables",
        stock: 25
    },
    {
        title: "Robot Vacuum X1",
        description: "Automated cleaning for your home. smart mapping, powerful suction, and self-charging capability.",
        price: 249.00,
        imageUrl: "https://images.pexels.com/photos/8566433/pexels-photo-8566433.jpeg?cs=srgb&dl=pexels-kindelmedia-8566433.jpg&fm=jpg",
        category: "Smart Home",
        stock: 10
    },
    {
        title: "Smart Learning Thermostat",
        description: "Saves energy by learning your schedule. Control your home's temperature from anywhere.",
        price: 199.00,
        imageUrl: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500&q=80",
        category: "Smart Home",
        stock: 35
    },
    {
        title: "Video Doorbell Pro",
        description: "See, hear, and speak to visitors from your phone. HD video and two-way audio.",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1633194883650-df448a10d554?w=500&q=80",
        category: "Smart Home",
        stock: 45
    },
    {
        title: "Wireless Charging Pad",
        description: "Fast wireless charging for all your Qi-enabled devices. Sleek and minimal design.",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1633381638729-27f730955c23?w=500&q=80",
        category: "Accessories",
        stock: 120
    },
    {
        title: "Noise Cancelling Headphones",
        description: "Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery.",
        price: 349.99,
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
        category: "Audio",
        stock: 20
    },
    {
        title: "4K Camera Drone",
        description: "Capture stunning aerial footage with this foldable 4K drone. Features GPS return and 30-min flight time.",
        price: 549.99,
        imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80",
        category: "Drones",
        stock: 15
    },
    {
        title: "Action Camera 360",
        description: "Rugged and waterproof action camera with 360-degree recording. Perfect for extreme sports and adventures.",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1564466013-1815137ba0d8?w=500&q=80",
        category: "Cameras",
        stock: 40
    },
    {
        title: "Smart Air Purifier",
        description: "Breathe cleaner air. Monitors air quality in real-time and filters out 99.97% of allergens and dust.",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1632007466851-460d37e6f987?w=500&q=80",
        category: "Smart Home",
        stock: 60
    },
    {
        title: "Smart Coffee Maker",
        description: "Wake up to fresh coffee. Schedule your brew via app or voice control. Adjustable strength settings.",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1520593922312-5b90ce803fc1?w=500&q=80",
        category: "Smart Home",
        stock: 25
    },
    {
        title: "Smart Soundbar",
        description: "Upgrade your TV sound with this sleek soundbar. Built-in voice assistant and Dolby Atmos support.",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1721864455806-69a489728de7?w=500&q=80",
        category: "Audio",
        stock: 30
    },
    {
        title: "Smart Glasses",
        description: "Stylish frames with built-in AR display, speakers, and camera. Stay connected without looking at your phone.",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1579762593430-6d4ec0913c19?w=500&q=80",
        category: "Wearables",
        stock: 10
    }
];

module.exports = products;
