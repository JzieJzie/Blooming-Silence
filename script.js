document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");

    function updateSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });

        slider.classList.add("blurring");
        setTimeout(() => {
            slider.style.transform = `translateY(-${index * 100}vh)`;
            slider.classList.remove("blurring");
        }, 200);
    }

    // Fade-in effect
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 1s ease-in-out";
        document.body.style.opacity = "1";
    }, 100);

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ===== DESKTOP Navigation =====
    if (!isTouchDevice) {
        // Click to advance
        document.addEventListener("click", () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlide(currentIndex);
            }
        });

        // Scroll
        document.addEventListener("wheel", (event) => {
            if (event.deltaY > 0 && currentIndex < slides.length - 1) {
                currentIndex++;
            } else if (event.deltaY < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateSlide(currentIndex);
        });

        // Arrow keys
        document.addEventListener("keydown", (event) => {
            if (
                (event.key === "ArrowDown" || event.key === "ArrowRight") &&
                currentIndex < slides.length - 1
            ) {
                currentIndex++;
                updateSlide(currentIndex);
            } else if (
                (event.key === "ArrowUp" || event.key === "ArrowLeft") &&
                currentIndex > 0
            ) {
                currentIndex--;
                updateSlide(currentIndex);
            }
        });
    }

    // ===== MOBILE Swipe =====
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (event) => {
        touchEndY = event.changedTouches[0].screenY;
        if (touchEndY < touchStartY - 50 && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
        if (touchEndY > touchStartY + 50 && currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    });

    // ===== RETURN button =====
    const returnButton = document.getElementById("returnButton");
    if (returnButton) {
        returnButton.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.style.opacity = "0";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        });
    }
});
