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

const consultForm = document.querySelector(".consult-apply-form");
const consultResponseFrame = document.querySelector(".google-form-response");
const consultButton = document.querySelector(".floating-item.consult");
const consultSection = document.getElementById("consult-apply");

if (consultButton && consultSection) {
    consultButton.addEventListener("click", (event) => {
        event.preventDefault();
        consultSection.scrollIntoView({ behavior: "smooth", block: "start" });

        window.setTimeout(() => {
            consultSection.scrollIntoView({ behavior: "auto", block: "start" });
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", "#consult-apply");
            }
        }, 700);
    });
}

if (consultForm && consultResponseFrame) {
    let consultSubmitted = false;
    const consultPopup = document.createElement("div");
    consultPopup.className = "consult-complete-popup";
    consultPopup.hidden = true;
    consultPopup.innerHTML = '<div class="consult-complete-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-complete-title"><strong id="consult-complete-title">상담 신청완료</strong><button type="button">확인</button></div>';
    document.body.appendChild(consultPopup);

    const closePopup = () => {
        consultPopup.hidden = true;
    };

    consultPopup.querySelector("button").addEventListener("click", closePopup);
    consultPopup.addEventListener("click", (event) => {
        if (event.target === consultPopup) closePopup();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !consultPopup.hidden) closePopup();
    });

    consultForm.addEventListener("submit", () => {
        consultSubmitted = true;
    });

    consultResponseFrame.addEventListener("load", () => {
        if (!consultSubmitted) return;
        consultSubmitted = false;
        consultForm.reset();
        consultPopup.hidden = false;
        consultPopup.querySelector("button").focus();
    });
}

const footerKeywordRoutes = {
    "중등영어학원": "중등영어학원/",
    "고등영어학원": "고등영어학원/",
    "관리형학원": "관리형학원/",
    "자기주도학습학원": "자기주도학습학원/"
};

document.querySelectorAll(".footer-keywords").forEach((keywordGroup) => {
    const homeLink = keywordGroup.querySelector(".footer-home-link");
    if (!homeLink) return;

    const rootUrl = new URL(homeLink.getAttribute("href"), window.location.href);
    keywordGroup.querySelectorAll("span").forEach((keyword) => {
        const route = footerKeywordRoutes[keyword.textContent.trim()];
        if (!route) return;

        const link = document.createElement("a");
        link.className = "footer-keyword-link";
        link.href = new URL(route, rootUrl).href;
        link.textContent = keyword.textContent;
        keyword.replaceWith(link);
    });
});
