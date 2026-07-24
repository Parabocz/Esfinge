import Lenis from '@studio-freight/lenis';
import anime from 'animejs/lib/anime.es.js';
import { gsap } from 'gsap';
import Swiper from 'swiper';
import { Parallax } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/parallax';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis for Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Preloader with Anime.js (DrawSVG alternative)
  const preloader = document.getElementById('preloader');
  
  // Set initial stroke-dasharray and dashoffset
  const paths = document.querySelectorAll('.draw-path');
  
  anime({
    targets: '.draw-path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 2000,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: false,
    complete: function() {
      // Fade out preloader
      gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  });

  // 3. Hero Animations
  function initHeroAnimations() {
    const tl = gsap.timeline();
    tl.to('.eyebrow', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .to('.headline', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .to('.hero .btn-primary', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8');
  }

  // 4. Buttons Char Animation setup
  const animateBtns = document.querySelectorAll('.btn-animate-chars');
  animateBtns.forEach(btn => {
    const textSpan = btn.querySelector('.btn-text');
    const text = textSpan.innerText;
    textSpan.innerHTML = ''; // Clear current text
    
    // Wrap each character in a span
    for (let i = 0; i < text.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.className = 'btn-char';
      charSpan.style.transitionDelay = `${i * 0.02}s`;
      charSpan.innerHTML = text[i] === ' ' ? '&nbsp;' : text[i];
      textSpan.appendChild(charSpan);
    }
  });

  // 5. Marquee Infinite Scroll with GSAP
  const marqueeTrack = document.querySelector('.marquee-track');
  const marqueeContent = document.querySelector('.marquee-content');
  
  if (marqueeTrack && marqueeContent) {
    // Clone the content for seamless loop
    const clone = marqueeContent.cloneNode(true);
    marqueeTrack.appendChild(clone);

    // Calculate width of one content block
    const contentWidth = marqueeContent.offsetWidth;

    gsap.to(marqueeTrack, {
      x: -contentWidth,
      ease: 'none',
      duration: 20, // Adjust speed
      repeat: -1
    });
  }

  // 6. Swiper Parallax Sliders
  const parallaxSliders = document.querySelectorAll('.parallax-slider');
  parallaxSliders.forEach(slider => {
    new Swiper(slider, {
      modules: [Parallax],
      speed: 1000,
      parallax: true,
      slidesPerView: 'auto', // Important for edge-to-edge showing next slide
      spaceBetween: 0,
      grabCursor: true,
    });
  });
});
