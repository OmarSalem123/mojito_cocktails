"use client";
import { useRef, useState } from "react";
import { sliderLists } from "../../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Menu = () => {
  const contentRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCocktails = sliderLists.length;
  const [lastIndex, setLastIndex] = useState(0);

  const goToSlide = (index) => {
    setLastIndex(currentIndex);
    const newIndex = (index + totalCocktails) % totalCocktails;
    setCurrentIndex(newIndex);
  };

  const getCurrentCocktail = (indexOffset) => {
    return sliderLists[
      (currentIndex + indexOffset + totalCocktails) % totalCocktails
    ];
  };
  const currentCocktail = getCurrentCocktail(0);
  const prevCocktail = getCurrentCocktail(-1);
  const nextCocktail = getCurrentCocktail(1);

  useGSAP(() => {
    const isBackward =
      (lastIndex === 0 && currentIndex === totalCocktails - 1) ||
      (lastIndex > currentIndex &&
        !(lastIndex === totalCocktails - 1 && currentIndex === 0));

    gsap.fromTo(
      "#title",
      { opacity: 0, yPercent: 100 },
      { opacity: 1, duration: 1, yPercent: 0, ease: "power1.inOut" }
    );
    gsap.fromTo(
      ".cocktail img",
      { opacity: 0, xPercent: isBackward ? 100 : -100 },
      { xPercent: 0, opacity: 1, duration: 1, ease: "power1.inOut" }
    );
    gsap.fromTo(
      ".details h2",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power1.inOut" }
    );
    gsap.fromTo(
      ".details p",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power1.inOut",
        delay: 0.2,
      }
    );
  }, [currentIndex]);

  useGSAP(() => {
    const parallaxTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#menu",
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });
    parallaxTimeline
      .from("#m-left-leaf", {
        x: 100,
        y: 100,
        opacity: 0,
        ease: "power2.out",
      })
      .from(
        "#m-right-leaf",
        {
          x: 100,
          y: -100,
          opacity: 0,
          ease: "power2.out",
        },
        "<"
      );
  }, []);
  return (
    <section id="menu" aria-labelledby="menu-heading">
      <img
        src="/images/slider-left-leaf.png"
        alt="left-leaf"
        id="m-left-leaf"
      />
      <img
        src="/images/slider-right-leaf.png"
        alt="right-leaf"
        id="m-right-leaf"
      />
      <h2 id="menu-heading" className="sr-only">
        Cocktails Menu
      </h2>
      <nav className="cocktail-tabs" aria-label="Cocktail Navigation">
        {sliderLists.map((cocktail, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={cocktail.id}
              className={`${
                isActive
                  ? "text-white border-white"
                  : "text-white/50 border-white/50 hover:text-white hover:border-white"
              }`}
              onClick={() => goToSlide(index)}
            >
              {cocktail.name}
            </button>
          );
        })}
      </nav>
      <div className="content">
        <div className="arrows">
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex - 1)}
          >
            <span>{prevCocktail.name}</span>
            <img
              src="/images/right-arrow.png"
              alt="right-arrow"
              aria-label="true"
            />
          </button>
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex + 1)}
          >
            <span>{nextCocktail.name}</span>
            <img
              src="/images/left-arrow.png"
              alt="left-arrow"
              aria-label="true"
            />
          </button>
        </div>
        <div className="cocktail">
          <img src={currentCocktail.image} className="object-contain" />
        </div>
        <div className="recipe">
          <div ref={contentRef} className="info">
            <p>Recipe for:</p>
            <p id="title">{currentCocktail.name}</p>
          </div>
          <div className="details">
            <h2>{currentCocktail.title}</h2>
            <p>{currentCocktail.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
