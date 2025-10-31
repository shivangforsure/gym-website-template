// === NeoFit Studio - scripts.js (FIXED CAROUSEL) ===

// ===== NAV TOGGLE =====
function initNavToggle() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".main-nav");
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        navToggle.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            navToggle.classList.remove("active");
        });
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.querySelector("form#contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Form submitted — replace with API integration.");
        form.reset();
    });
}

// ===== FOOTER YEAR =====
function updateFooterYear() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== FIXED TESTIMONIALS CAROUSEL =====
function initFinalTestimonialsCarousel() {
    const carousel = document.getElementById("ns-testimonials-carousel");
    if (!carousel) return;

    const windowEl = carousel.querySelector(".ns-window");
    const track = carousel.querySelector(".ns-track");
    const originalSlides = Array.from(track.children);

    if (!originalSlides.length) return;

    // Create clones for infinite loop
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    const allSlides = Array.from(track.children);
    let currentIndex = 1; // Start at first real slide (after lastClone)
    let slideWidth = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let autoplayInterval = null;

    const AUTOPLAY_DELAY = 4000;
    const SWIPE_THRESHOLD = 50;

    // Calculate and set dimensions
    function updateDimensions() {
        slideWidth = windowEl.offsetWidth;
        allSlides.forEach(slide => {
            slide.style.minWidth = slideWidth + 'px';
            slide.style.maxWidth = slideWidth + 'px';
        });
        setSlidePosition(false);
    }

    // Set slide position
    function setSlidePosition(animate = true) {
        const offset = -currentIndex * slideWidth;
        track.style.transition = animate ? 'transform 0.45s ease-out' : 'none';
        track.style.transform = `translateX(${offset}px)`;
        currentTranslate = offset;
        prevTranslate = offset;
    }

    // Handle transition end for infinite loop
    function handleTransitionEnd() {
        if (currentIndex === 0) {
            currentIndex = allSlides.length - 2;
            setSlidePosition(false);
        } else if (currentIndex === allSlides.length - 1) {
            currentIndex = 1;
            setSlidePosition(false);
        }
    }

    // Next slide
    function nextSlide() {
        currentIndex++;
        setSlidePosition(true);
    }

    // Previous slide
    function prevSlide() {
        currentIndex--;
        setSlidePosition(true);
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Touch/Mouse handlers
    function touchStart(e) {
        stopAutoplay();
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        carousel.classList.add("ns-dragging");
        track.style.transition = 'none';
    }

    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove("ns-dragging");

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -SWIPE_THRESHOLD) {
            nextSlide();
        } else if (movedBy > SWIPE_THRESHOLD) {
            prevSlide();
        } else {
            setSlidePosition(true);
        }

        startAutoplay();
    }

    // Event listeners
    track.addEventListener('transitionend', handleTransitionEnd);

    // Mouse events
    track.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);

    // Touch events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        }
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Prevent image dragging
    allSlides.forEach(slide => {
        slide.addEventListener('dragstart', e => e.preventDefault());
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateDimensions();
        }, 250);
    });

    // Initialize
    updateDimensions();
    setTimeout(startAutoplay, 500);
}

// ===== Initialize Everything =====
document.addEventListener("DOMContentLoaded", () => {
    try { initNavToggle(); } catch (e) { console.error(e); }
    try { initBackToTop(); } catch (e) { console.error(e); }
    try { initContactForm(); } catch (e) { console.error(e); }
    try { updateFooterYear(); } catch (e) { console.error(e); }
    try { initFinalTestimonialsCarousel(); } catch (e) { console.error("Carousel error:", e); }
});