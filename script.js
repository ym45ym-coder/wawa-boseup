const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const programSlider = document.querySelector(".program-slider");

if (programSlider) {
    const track = programSlider.querySelector(".program-slider-track");
    const dots = Array.from(programSlider.querySelectorAll(".slider-dot"));
    const autoPlayDelay = 6000;
    let activeIndex = 0;
    let isInteracting = false;
    let autoPlayTimer;
    let scrollTimer;

    const setActiveDot = (index) => {
        activeIndex = index;
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === index;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", String(isActive));
        });
    };

    const goToSlide = (index) => {
        const targetIndex = (index + dots.length) % dots.length;
        track.scrollTo({ left: track.clientWidth * targetIndex, behavior: "smooth" });
        setActiveDot(targetIndex);
    };

    const stopAutoPlay = () => {
        window.clearTimeout(autoPlayTimer);
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        if (isInteracting || document.hidden) return;

        autoPlayTimer = window.setTimeout(() => {
            goToSlide(activeIndex + 1);
            startAutoPlay();
        }, autoPlayDelay);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            startAutoPlay();
        });
    });

    track.addEventListener("scroll", () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
            const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
            setActiveDot(Math.max(0, Math.min(nextIndex, dots.length - 1)));
            if (!isInteracting) startAutoPlay();
        }, 80);
    }, { passive: true });

    track.addEventListener("pointerdown", () => {
        isInteracting = true;
        stopAutoPlay();
    });

    const resumeAfterInteraction = () => {
        isInteracting = false;
        startAutoPlay();
    };

    track.addEventListener("pointerup", resumeAfterInteraction);
    track.addEventListener("pointercancel", resumeAfterInteraction);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    startAutoPlay();
}
