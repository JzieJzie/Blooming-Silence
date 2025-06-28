document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");
    let isTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let lastScrollTime = 0;
    const scrollDelay = 100; // Debounce scroll events

    // Detect device capabilities
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isHighDPI = window.devicePixelRatio > 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Optimize for high DPI displays
    if (isHighDPI) {
        document.body.style.textRendering = 'optimizeLegibility';
    }

    // Adjust animations based on motion preferences
    const transitionDuration = prefersReducedMotion ? 100 : 800;
    const blurDuration = prefersReducedMotion ? 50 : 200;

    function updateSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length) return;
        
        isTransitioning = true;
        
        // Update active slide
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });

        // Apply blur effect if motion is allowed
        if (!prefersReducedMotion && slider) {
            slider.classList.add("blurring");
            
            setTimeout(() => {
                slider.style.transform = `translateY(-${index * 100}vh)`;
                slider.classList.remove("blurring");
                isTransitioning = false;
            }, blurDuration);
        } else {
            // Immediate transition for reduced motion
            if (slider) {
                slider.style.transform = `translateY(-${index * 100}vh)`;
            }
            isTransitioning = false;
        }
    }

    // Enhanced fade-in effect with device detection
    function initializePage() {
        document.body.style.opacity = "0";
        
        // Faster fade-in for touch devices
        const fadeDelay = isTouchDevice ? 50 : 100;
        const fadeDuration = prefersReducedMotion ? 100 : 1000;
        
        setTimeout(() => {
            document.body.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
            document.body.style.opacity = "1";
        }, fadeDelay);
    }

    // Debounced scroll handler
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < scrollDelay) return;
        lastScrollTime = now;

        event.preventDefault();
        
        if (event.deltaY > 0 && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        } else if (event.deltaY < 0 && currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    }

    // Enhanced touch handling with better gesture recognition
    function handleTouchStart(event) {
        touchStartY = event.changedTouches[0].screenY;
    }

    function handleTouchEnd(event) {
        if (isTransitioning) return;
        
        touchEndY = event.changedTouches[0].screenY;
        const touchDifference = touchStartY - touchEndY;
        const minSwipeDistance = window.innerHeight * 0.1; // 10% of screen height

        if (Math.abs(touchDifference) > minSwipeDistance) {
            if (touchDifference > 0 && currentIndex < slides.length - 1) {
                // Swipe up - next slide
                currentIndex++;
                updateSlide(currentIndex);
            } else if (touchDifference < 0 && currentIndex > 0) {
                // Swipe down - previous slide
                currentIndex--;
                updateSlide(currentIndex);
            }
        }
    }

    // Enhanced keyboard navigation
    function handleKeyDown(event) {
        if (isTransitioning) return;

        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
            case " ": // Spacebar
            case "PageDown":
                event.preventDefault();
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateSlide(currentIndex);
                }
                break;
            case "ArrowUp":
            case "ArrowLeft":
            case "PageUp":
                event.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlide(currentIndex);
                }
                break;
            case "Home":
                event.preventDefault();
                currentIndex = 0;
                updateSlide(currentIndex);
                break;
            case "End":
                event.preventDefault();
                currentIndex = slides.length - 1;
                updateSlide(currentIndex);
                break;
            case "Escape":
                // Return to menu
                navigateToPage("index.html");
                break;
        }
    }

    // Enhanced click handler with better target detection
    function handleClick(event) {
        // Don't advance on button clicks or links
        if (event.target.closest('button, a, .button, .poem-button, .credit-button')) {
            return;
        }

        if (!isTouchDevice && !isTransitioning && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    }

    // Smooth page navigation
    function navigateToPage(url) {
        document.body.style.transition = "opacity 500ms ease-out";
        document.body.style.opacity = "0";
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    // Initialize page
    initializePage();

    // Event listeners with proper cleanup
    if (slides.length > 0) {
        // Desktop interactions
        if (!isTouchDevice) {
            document.addEventListener("click", handleClick);
            document.addEventListener("wheel", handleScroll, { passive: false });
        }

        // Touch interactions
        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchend", handleTouchEnd, { passive: true });

        // Keyboard navigation
        document.addEventListener("keydown", handleKeyDown);
    }

    // Handle return button with enhanced UX
    const returnButton = document.getElementById("returnButton");
    if (returnButton) {
        returnButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            navigateToPage("index.html");
        });
    }

    // Handle all return links
    document.querySelectorAll('a[href="index.html"]').forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToPage("index.html");
        });
    });

    // Responsive font size adjustment based on content
    function adjustFontSize() {
        const poems = document.querySelectorAll('.poem p');
        poems.forEach(poem => {
            const textLength = poem.textContent.length;
            if (textLength > 500) {
                poem.style.fontSize = 'var(--font-base)';
            } else if (textLength > 300) {
                poem.style.fontSize = 'var(--font-lg)';
            }
        });
    }

    // Handle orientation changes
    function handleOrientationChange() {
        setTimeout(() => {
            // Recalculate slide positions
            if (slider) {
                slider.style.transform = `translateY(-${currentIndex * 100}vh)`;
            }
            adjustFontSize();
        }, 100);
    }

    // Handle resize events
    function handleResize() {
        handleOrientationChange();
    }

    // Add orientation and resize listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    // Initial font size adjustment
    adjustFontSize();

    // Preload next/previous slides for better performance
    function preloadSlides() {
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        const prevIndex = Math.max(currentIndex - 1, 0);
        
        [nextIndex, prevIndex].forEach(index => {
            const slide = slides[index];
            if (slide) {
                slide.style.willChange = 'opacity, transform';
            }
        });
    }

    // Intersection Observer for performance optimization
    if ('IntersectionObserver' in window) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'opacity, transform';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        });

        slides.forEach(slide => slideObserver.observe(slide));
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            if (loadTime > 3000) {
                console.warn('Page load time is high:', loadTime + 'ms');
            }
        });
    }

    // Error handling for missing elements
    if (!slider && slides.length > 0) {
        console.warn('Slider container not found, but slides exist');
    }

    // Accessibility improvements
    function announceSlideChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Add screen reader support
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        slide.setAttribute('role', 'region');
    });

    // Focus management
    function manageFocus() {
        const activeSlide = slides[currentIndex];
        if (activeSlide) {
            const focusableElement = activeSlide.querySelector('button, a, [tabindex]');
            if (focusableElement) {
                focusableElement.focus();
            }
        }
    }

    // Update slide with accessibility
    const originalUpdateSlide = updateSlide;
    updateSlide = function(index) {
        originalUpdateSlide(index);
        announceSlideChange();
        manageFocus();
    };
});

// Global navigation function for menu buttons
function goToPoem(url) {
    document.body.style.transition = "opacity 500ms ease-out";
    document.body.style.opacity = "0";
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Service Worker registration for offline support (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}