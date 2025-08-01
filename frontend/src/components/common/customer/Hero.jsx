import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll"; // Importing Link from react-scroll
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      // navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper relative z-[10]"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-pink-100">
          {/* Text Section */}
          <div className="md:w-1/2 text-left">
            <h1 className="text-3xl font-bold text-pink-600 mb-4">
              Discover Your Beauty Essentials
            </h1>
            <p className="text-lg text-pink-500 mb-6">
              Shop the latest in skincare, makeup, and fragrance for a radiant you.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-pink-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-pink-600 transition duration-300"
            >
              Shop Beauty
            </button>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center ml-16">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Beauty Products"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-pink-100">
          <div className="md:w-1/2 text-left">
            <h1 className="text-3xl font-bold text-pink-600 mb-4">
              Glow With Confidence
            </h1>
            <p className="text-lg text-pink-500 mb-6">
              Find your perfect match from our curated beauty collections.
            </p>
            <Link
              to="order-section"
              smooth={true}
              duration={500}
            >
              <button className="bg-pink-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-pink-600 transition duration-300">
                Explore Products
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Glow Beauty"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-pink-100">
          <div className="md:w-1/2 text-left">
            <h1 className="text-3xl font-bold text-pink-600 mb-4">
              Fast & Reliable Delivery
            </h1>
            <p className="text-lg text-pink-500 mb-6">
              Get your favorite beauty products delivered quickly and safely to your home.
            </p>
            <button
              className="bg-pink-500 text-white py-3 px-8 text-lg rounded-lg hover:bg-pink-600 transition duration-300"
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/src/assets/images/restaurant.jpg"
              alt="Beauty Delivery"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Hero;
