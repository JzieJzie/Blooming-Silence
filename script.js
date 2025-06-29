document.addEventListener("DOMContentLoaded", () => {
    // Parallax menu functionality
    let currentCardIndex = 0;
    const cards = document.querySelectorAll(".poem-card");
    const slider = document.getElementById("parallaxSlider");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    const readButton = document.getElementById("readButton");
    const indicators = document.querySelectorAll(".indicator");
    let isTransitioning = false;

    function updateParallaxCards(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Add blur effect
        if (slider) {
            slider.classList.add("blurring");
        }

        setTimeout(() => {
            // Update slider position with looping
            if (slider) {
                slider.style.transform = `translateX(-${index * 100}%)`;
            }

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle("active", i === index);
            });

            // Remove blur effect
            if (slider) {
                slider.classList.remove("blurring");
            }

            isTransitioning = false;
        }, 300);
    }

    function goToCard(direction) {
        if (direction === 'next') {
            currentCardIndex = (currentCardIndex + 1) % cards.length; // Loop to beginning
        } else if (direction === 'prev') {
            currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length; // Loop to end
        }
        updateParallaxCards(currentCardIndex);
    }

    function goToPoem(url) {
        document.body.style.transition = "opacity 500ms ease";
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    // Initialize parallax menu if it exists
    if (cards.length > 0 && slider) {
        // Arrow navigation
        if (leftArrow) {
            leftArrow.addEventListener("click", () => goToCard('prev'));
        }
        if (rightArrow) {
            rightArrow.addEventListener("click", () => goToCard('next'));
        }

        // Indicator navigation
        indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                currentCardIndex = index;
                updateParallaxCards(currentCardIndex);
            });
        });

        // Card click navigation
        cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                if (index !== currentCardIndex) {
                    currentCardIndex = index;
                    updateParallaxCards(currentCardIndex);
                }
            });
        });

        // Title click navigation - make titles directly clickable to go to poem
        document.querySelectorAll('.clickable-title').forEach((title, index) => {
            title.addEventListener("click", (event) => {
                event.stopPropagation();
                const card = title.closest('.poem-card');
                const url = card.getAttribute("data-url");
                if (url) {
                    goToPoem(url);
                }
            });
        });

        // Read button functionality
        if (readButton) {
            readButton.addEventListener("click", () => {
                const activeCard = cards[currentCardIndex];
                const url = activeCard.getAttribute("data-url");
                if (url) {
                    goToPoem(url);
                }
            });
        }

        // Keyboard navigation
        document.addEventListener("keydown", (event) => {
            if (isTransitioning) return;

            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    goToCard('prev');
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    goToCard('next');
                    break;
                case "Enter":
                case " ":
                    event.preventDefault();
                    const activeCard = cards[currentCardIndex];
                    const url = activeCard.getAttribute("data-url");
                    if (url) {
                        goToPoem(url);
                    }
                    break;
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener("touchend", (event) => {
            if (isTransitioning) return;
            
            touchEndX = event.changedTouches[0].screenX;
            const touchDifference = touchStartX - touchEndX;

            if (Math.abs(touchDifference) > 50) {
                if (touchDifference > 0) {
                    goToCard('next');
                } else {
                    goToCard('prev');
                }
            }
        }, { passive: true });

        // Initialize first card
        updateParallaxCards(0);
    }

    // Original poem page functionality
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const slideSlider = document.getElementById("slider");
    let isSlideTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;

    function updateSlide(index) {
        if (isSlideTransitioning || index < 0 || index >= slides.length) return;
        
        isSlideTransitioning = true;
        
        // Add blur effect
        if (slideSlider) {
            slideSlider.classList.add("blurring");
        }

        setTimeout(() => {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) {
                    slide.classList.add("active");
                }
            });

            if (slideSlider) {
                slideSlider.style.transform = `translateY(-${index * 100}vh)`;
                slideSlider.classList.remove("blurring");
            }
            
            isSlideTransitioning = false;
        }, 300);
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
        if (isSlideTransitioning) return;
        
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
        if (isSlideTransitioning) return;

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

        if (!isSlideTransitioning && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    }

    // Only add slide functionality if slides exist (poem pages)
    if (slides.length > 0) {
        document.addEventListener("click", handleClick);
        document.addEventListener("wheel", handleScroll, { passive: false });
        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchend", handleTouchEnd, { passive: true });
        document.addEventListener("keydown", handleKeyDown);
    }

    // Return to index functionality
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

// Global function for backward compatibility
function goToPoem(url) {
    document.body.style.transition = "opacity 500ms ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}