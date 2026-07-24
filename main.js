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

  // 2. Preloader with GSAP (Logo animation)
  const preloader = document.getElementById('preloader');
  const logo = document.querySelector('.preloader-logo');
  
  const tl = gsap.timeline();
  
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: 'power3.out'
  })
  .to(logo, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    delay: 0.5
  })
  .to(preloader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.style.display = 'none';
      initHeroAnimations();
    }
  }, '-=0.4');

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

  // 5. Feature Card and Slider Swing Animations (Intersection Observer)
  const observerOptions = {
    threshold: 0.2
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Feature Card Entrance
        if (entry.target.classList.contains('feature-card')) {
          gsap.to(entry.target, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
          });
          
          // Animate numbers
          const nums = entry.target.querySelectorAll('.stat-num');
          nums.forEach(num => {
            const finalVal = parseInt(num.getAttribute('data-val'));
            anime({
              targets: num,
              innerHTML: [0, finalVal],
              round: 1,
              easing: 'easeOutExpo',
              duration: 2000,
              update: function(a) {
                num.innerHTML = (finalVal === 30 ? '+' : '') + num.innerHTML;
              }
            });
          });
          observer.unobserve(entry.target);
        }
        
        // Slider Swing Entrance
        if (entry.target.classList.contains('parallax-slider')) {
          const wrapper = entry.target.querySelector('.swiper-wrapper');
          gsap.fromTo(wrapper, 
            { x: 50 }, 
            { x: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
          );
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  const featureCard = document.querySelector('.feature-card');
  if (featureCard) observer.observe(featureCard);
  
  const sliders = document.querySelectorAll('.parallax-slider');
  sliders.forEach(slider => observer.observe(slider));

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
