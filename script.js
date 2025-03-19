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

    // Fade-in effect when loading a page
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 1s ease-in-out";
        document.body.style.opacity = "1";
    }, 100);

    // Scroll Navigation
    document.addEventListener("wheel", (event) => {
        if (event.deltaY > 0 && currentIndex < slides.length - 1) {
            currentIndex++;
        } else if (event.deltaY < 0 && currentIndex > 0) {
            currentIndex--;
        }
        updateSlide(currentIndex);
    });

    // Mobile Touch Support
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartY = event.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (event) => {
        touchEndY = event.changedTouches[0].screenY;
        if (touchEndY < touchStartY - 50 && currentIndex < slides.length - 1) {
            currentIndex++;
        }
        if (touchEndY > touchStartY + 50 && currentIndex > 0) {
            currentIndex--;
        }
        updateSlide(currentIndex);
    });

    // Return Button Functionality
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