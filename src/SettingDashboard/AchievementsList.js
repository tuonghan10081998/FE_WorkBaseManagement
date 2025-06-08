import React, { useRef } from "react";
import Slider from "react-slick";
import AchievementCard from "./AchievementCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="slick-prev custom-arrow"
      onClick={onClick}
      style={{
        position: "absolute",
        left: "-35px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        background: "transparent",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
      }}
      aria-label="Previous"
    >
      &#8592;
    </button>
  );
};

// Nút Next tùy chỉnh
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="slick-next custom-arrow"
      onClick={onClick}
      style={{
        position: "absolute",
        right: "-35px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        background: "transparent",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
      }}
      aria-label="Next"
    >
      &#8594;
    </button>
  );
};
const AchievementsList = ({ achievements }) => {
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    infinite: achievements.length > 1, // chỉ bật infinite nếu có hơn 1
    speed: 500,
    slidesToShow: Math.min(4, achievements.length), // không cho hiển thị quá số lượng
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: achievements.length > 1,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, achievements.length) },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };
  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };
  return (
    <section
      className="mt-3 pt-3"
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        borderRadius: "8px",
      }}
    >
      <div
        className="border_item"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px",
          paddingRight: "10px",
        }}
      >
        <div>
          <h2 className="section-heading mb-0">
            {" "}
            <i class="fas fa-trophy text-success"></i>Thành tích
          </h2>
        </div>
        <div>
          <button
            class="btn btn-outline-primary me-2"
            type="button"
            data-bs-target="#achievementCarousel"
            data-bs-slide="prev"
            aria-label="Trước"
            onClick={prevSlide}
            style={{ padding: "0px 12px" }}
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            class="btn btn-outline-primary"
            type="button"
            data-bs-target="#achievementCarousel"
            data-bs-slide="next"
            aria-label="Tiếp"
            onClick={nextSlide}
            style={{ padding: "0px 12px" }}
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </Slider>
    </section>
  );
};
export default AchievementsList;
