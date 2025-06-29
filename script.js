document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");
    let isTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;

    function updateSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length) return;
        
        isTransitioning = true;
        
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });

        if (slider) {
            slider.style.transform = `translateY(-${index * 100}vh)`;
        }
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function handleScroll(event) {
        event.preventDefault();
        
        if (event.deltaY > 0 && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        } else if (event.deltaY < 0 && currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    }

    function handleTouchStart(event) {
        touchStartY = event.changedTouches[0].screenY;
    }

    function handleTouchEnd(event) {
        if (isTransitioning) return;
        
        touchEndY = event.changedTouches[0].screenY;
        const touchDifference = touchStartY - touchEndY;

        if (Math.abs(touchDifference) > 50) {
            if (touchDifference > 0 && currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlide(currentIndex);
            } else if (touchDifference < 0 && currentIndex > 0) {
                currentIndex--;
                updateSlide(currentIndex);
            }
        }
    }

    function handleKeyDown(event) {
        if (isTransitioning) return;

        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
            case " ":
                event.preventDefault();
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateSlide(currentIndex);
                }
                break;
            case "ArrowUp":
            case "ArrowLeft":
                event.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlide(currentIndex);
                }
                break;
        }
    }

    function handleClick(event) {
        if (event.target.closest('button, a, .button, .poem-button, .credit-button')) {
            return;
        }

        if (!isTransitioning && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    }

    if (slides.length > 0) {
        document.addEventListener("click", handleClick);
        document.addEventListener("wheel", handleScroll, { passive: false });
        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchend", handleTouchEnd, { passive: true });
        document.addEventListener("keydown", handleKeyDown);
    }

    document.querySelectorAll('a[href="index.html"]').forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.style.transition = "opacity 500ms ease";
            document.body.style.opacity = "0";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        });
    });
});

function goToPoem(url) {
    document.body.style.transition = "opacity 500ms ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}