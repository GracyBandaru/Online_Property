import React from 'react';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import './Hero.css';
//import heroVideo from '../../public/assets/hero/bg-video.mp4'; // Adjust path based on your actual file location

const Hero = () => {
  return (
    <section className="hero">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
      >
        <source src={process.env.PUBLIC_URL + '/assets/hero/bg-video.mp4'} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Hero Content */}
      <div className="hero-content">
        <h2>Discover Your Ideal Rental Home</h2>
        <p className="hero-subtitle">Explore a wide selection of properties in prime locations.</p>
        <div className="features">
          <div className="feature">
            <FaBed />
            <span>2+ Beds</span>
          </div>
          <div className="feature">
            <FaBath />
            <span>Private Bath</span>
          </div>
          <div className="feature">
            <FaRulerCombined />
            <span>800+ sqft</span>
          </div>
          <div className="feature">
            <FaMapMarkerAlt />
            <span>Prime Locations</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;