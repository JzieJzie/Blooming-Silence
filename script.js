document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");
    let isTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let lastScrollTime = 0;
    const scrollDelay = 100;

    // Enhanced device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isHighDPI = window.devicePixelRatio > 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const isUltraWide = window.matchMedia('(min-width: 1921px)').matches;
    
    // Dynamic viewport detection
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    // Screen size categories
    const screenSize = getScreenSize();
    
    function getScreenSize() {
        const width = window.innerWidth;
        if (width <= 320) return 'xs';
        if (width <= 480) return 'sm';
        if (width <= 768) return 'md';
        if (width <= 1024) return 'lg';
        if (width <= 1440) return 'xl';
        if (width <= 1920) return 'xxl';
        return 'ultra';
    }

    // Adaptive transition durations based on screen size and preferences
    const getTransitionDuration = () => {
        if (prefersReducedMotion) return 100;
        
        switch (screenSize) {
            case 'xs':
            case 'sm': return 600;
            case 'md': return 700;
            case 'lg': return 800;
            case 'xl': return 900;
            default: return 1000;
        }
    };

    const transitionDuration = getTransitionDuration();
    const blurDuration = prefersReducedMotion ? 50 : Math.min(200, transitionDuration / 4);

    // Enhanced slide update with screen-aware optimizations
    function updateSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length) return;
        
        isTransitioning = true;
        
        // Update active slide with enhanced performance
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
                // Preload content for better performance
                preloadSlideContent(slide);
            }
        });

        // Apply blur effect with screen-aware intensity
        if (!prefersReducedMotion && slider) {
            const blurIntensity = isSmallScreen ? '5px' : isUltraWide ? '15px' : '10px';
            slider.style.filter = `blur(${blurIntensity})`;
            
            setTimeout(() => {
                // Use CSS custom property for dynamic viewport units
                const slideHeight = window.innerHeight;
                slider.style.transform = `translateY(-${index * slideHeight}px)`;
                slider.style.filter = 'blur(0px)';
                
                setTimeout(() => {
                    isTransitioning = false;
                }, transitionDuration / 4);
            }, blurDuration);
        } else {
            // Immediate transition for reduced motion or performance
            if (slider) {
                const slideHeight = window.innerHeight;
                slider.style.transform = `translateY(-${index * slideHeight}px)`;
            }
            setTimeout(() => {
                isTransitioning = false;
            }, 50);
        }
    }

    // Preload slide content for better performance
    function preloadSlideContent(slide) {
        const images = slide.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.loading = 'eager';
            }
        });
    }

    // Enhanced page initialization with screen-aware optimizations
    function initializePage() {
        document.body.style.opacity = "0";
        
        // Faster initialization for smaller screens
        const fadeDelay = isSmallScreen ? 25 : isTouchDevice ? 50 : 100;
        const fadeDuration = prefersReducedMotion ? 100 : 
                           isSmallScreen ? 600 : 
                           isUltraWide ? 1200 : 1000;
        
        // Apply screen-specific optimizations
        applyScreenOptimizations();
        
        setTimeout(() => {
            document.body.style.transition = `opacity ${fadeDuration}ms ease-in-out`;
            document.body.style.opacity = "1";
        }, fadeDelay);
    }

    // Apply screen-specific optimizations
    function applyScreenOptimizations() {
        const body = document.body;
        
        // Add screen size class for CSS targeting
        body.classList.add(`screen-${screenSize}`);
        
        // Touch device optimizations
        if (isTouchDevice) {
            body.classList.add('touch-device');
            // Disable hover effects on touch devices
            body.style.setProperty('--hover-enabled', '0');
        } else {
            body.classList.add('pointer-device');
            body.style.setProperty('--hover-enabled', '1');
        }
        
        // High DPI optimizations
        if (isHighDPI) {
            body.classList.add('high-dpi');
        }
        
        // Landscape optimizations
        if (isLandscape && window.innerHeight < 600) {
            body.classList.add('short-landscape');
        }
        
        // Ultra-wide optimizations
        if (isUltraWide) {
            body.classList.add('ultra-wide');
        }
    }

    // Enhanced scroll handler with screen-aware sensitivity
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < scrollDelay) return;
        lastScrollTime = now;

        event.preventDefault();
        
        // Adjust scroll sensitivity based on screen size
        const scrollSensitivity = isSmallScreen ? 0.5 : isUltraWide ? 2 : 1;
        const deltaY = event.deltaY * scrollSensitivity;
        
        if (deltaY > 0 && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        } else if (deltaY < 0 && currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    }

    // Enhanced touch handling with screen-aware gestures
    function handleTouchStart(event) {
        touchStartY = event.changedTouches[0].screenY;
        
        // Prevent default on touch devices to avoid scrolling issues
        if (isTouchDevice) {
            event.preventDefault();
        }
    }

    function handleTouchEnd(event) {
        if (isTransitioning) return;
        
        touchEndY = event.changedTouches[0].screenY;
        const touchDifference = touchStartY - touchEndY;
        
        // Adaptive swipe distance based on screen size
        const minSwipeDistance = isSmallScreen ? 
                                window.innerHeight * 0.08 : 
                                isUltraWide ? 
                                window.innerHeight * 0.15 : 
                                window.innerHeight * 0.1;

        if (Math.abs(touchDifference) > minSwipeDistance) {
            if (touchDifference > 0 && currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlide(currentIndex);
            } else if (touchDifference < 0 && currentIndex > 0) {
                currentIndex--;
                updateSlide(currentIndex);
            }
        }
        
        if (isTouchDevice) {
            event.preventDefault();
        }
    }

    // Enhanced keyboard navigation with screen awareness
    function handleKeyDown(event) {
        if (isTransitioning) return;

        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
            case " ":
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
                navigateToPage("index.html");
                break;
        }
    }

    // Enhanced click handler with better target detection
    function handleClick(event) {
        // Don't advance on interactive elements
        if (event.target.closest('button, a, .button, .poem-button, .credit-button, input, textarea, select')) {
            return;
        }

        // Only advance on non-touch devices or explicit click areas
        if (!isTouchDevice && !isTransitioning && currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    }

    // Enhanced page navigation with screen-aware transitions
    function navigateToPage(url) {
        const transitionSpeed = isSmallScreen ? 300 : prefersReducedMotion ? 100 : 500;
        
        document.body.style.transition = `opacity ${transitionSpeed}ms ease-out`;
        document.body.style.opacity = "0";
        
        setTimeout(() => {
            window.location.href = url;
        }, transitionSpeed);
    }

    // Enhanced resize handler with debouncing
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update viewport units
            const vh = window.innerHeight * 0.01;
            const vw = window.innerWidth * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            document.documentElement.style.setProperty('--vw', `${vw}px`);
            
            // Recalculate slide positions
            if (slider) {
                const slideHeight = window.innerHeight;
                slider.style.transform = `translateY(-${currentIndex * slideHeight}px)`;
            }
            
            // Update screen size optimizations
            const newScreenSize = getScreenSize();
            if (newScreenSize !== screenSize) {
                document.body.className = document.body.className.replace(/screen-\w+/, `screen-${newScreenSize}`);
                applyScreenOptimizations();
            }
            
            adjustFontSize();
        }, 150);
    }

    // Enhanced orientation change handler
    function handleOrientationChange() {
        setTimeout(() => {
            handleResize();
            
            // Special handling for orientation changes
            const isNowLandscape = window.matchMedia('(orientation: landscape)').matches;
            if (isNowLandscape !== isLandscape) {
                document.body.classList.toggle('landscape', isNowLandscape);
                document.body.classList.toggle('portrait', !isNowLandscape);
                
                if (isNowLandscape && window.innerHeight < 600) {
                    document.body.classList.add('short-landscape');
                } else {
                    document.body.classList.remove('short-landscape');
                }
            }
        }, 100);
    }

    // Responsive font size adjustment
    function adjustFontSize() {
        const poems = document.querySelectorAll('.poem p');
        poems.forEach(poem => {
            const textLength = poem.textContent.length;
            const screenWidth = window.innerWidth;
            
            if (screenWidth <= 480) {
                // Small screens
                if (textLength > 400) {
                    poem.style.fontSize = 'var(--font-sm)';
                } else if (textLength > 200) {
                    poem.style.fontSize = 'var(--font-base)';
                } else {
                    poem.style.fontSize = 'var(--font-lg)';
                }
            } else if (screenWidth <= 1024) {
                // Medium screens
                if (textLength > 500) {
                    poem.style.fontSize = 'var(--font-base)';
                } else if (textLength > 300) {
                    poem.style.fontSize = 'var(--font-lg)';
                } else {
                    poem.style.fontSize = 'var(--font-xl)';
                }
            } else {
                // Large screens
                if (textLength > 600) {
                    poem.style.fontSize = 'var(--font-lg)';
                } else if (textLength > 400) {
                    poem.style.fontSize = 'var(--font-xl)';
                } else {
                    poem.style.fontSize = 'var(--font-2xl)';
                }
            }
        });
    }

    // Initialize page with all enhancements
    initializePage();

    // Event listeners with enhanced error handling
    if (slides.length > 0) {
        try {
            // Desktop interactions
            if (!isTouchDevice) {
                document.addEventListener("click", handleClick, { passive: true });
                document.addEventListener("wheel", handleScroll, { passive: false });
            }

            // Touch interactions with better passive handling
            document.addEventListener("touchstart", handleTouchStart, { passive: false });
            document.addEventListener("touchend", handleTouchEnd, { passive: false });

            // Keyboard navigation
            document.addEventListener("keydown", handleKeyDown, { passive: false });
            
            // Resize and orientation handlers
            window.addEventListener('resize', handleResize, { passive: true });
            window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
            
            // Visibility change handler for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Pause animations when tab is not visible
                    document.body.style.animationPlayState = 'paused';
                } else {
                    document.body.style.animationPlayState = 'running';
                }
            });
            
        } catch (error) {
            console.warn('Error setting up event listeners:', error);
        }
    }

    // Enhanced return button handling
    const returnButtons = document.querySelectorAll('a[href="index.html"], .return');
    returnButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            navigateToPage("index.html");
        }, { passive: false });
    });

    // Performance optimizations
    function optimizePerformance() {
        // Preload critical resources
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            img.loading = 'eager';
        });
        
        // Lazy load non-critical content
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img:not([data-critical])');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Optimize animations based on device capabilities
        if (isSmallScreen || prefersReducedMotion) {
            document.body.classList.add('reduced-animations');
        }
    }

    // Accessibility enhancements
    function enhanceAccessibility() {
        // Add screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.id = 'slide-announcer';
        document.body.appendChild(announcement);
        
        // Add slide labels
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
            slide.setAttribute('role', 'region');
            
            // Add skip links for keyboard users
            if (index === 0) {
                const skipLink = document.createElement('a');
                skipLink.href = '#slide-' + (slides.length - 1);
                skipLink.textContent = 'Skip to last slide';
                skipLink.className = 'sr-only skip-link';
                slide.prepend(skipLink);
            }
        });
        
        // Enhanced focus management
        function manageFocus() {
            const activeSlide = slides[currentIndex];
            if (activeSlide) {
                const focusableElement = activeSlide.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
                if (focusableElement && document.activeElement !== focusableElement) {
                    focusableElement.focus();
                }
                
                // Announce slide change
                const announcer = document.getElementById('slide-announcer');
                if (announcer) {
                    announcer.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
                }
            }
        }
        
        // Update slide function to include accessibility
        const originalUpdateSlide = updateSlide;
        updateSlide = function(index) {
            originalUpdateSlide(index);
            setTimeout(manageFocus, transitionDuration / 2);
        };
    }

    // Initialize all enhancements
    optimizePerformance();
    enhanceAccessibility();
    adjustFontSize();

    // Error handling and fallbacks
    window.addEventListener('error', (event) => {
        console.warn('Script error:', event.error);
        // Fallback to basic functionality
        if (event.error && event.error.message.includes('transition')) {
            document.body.classList.add('fallback-mode');
        }
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            if (loadTime > 3000) {
                console.warn('Page load time is high:', loadTime + 'ms');
                // Apply performance optimizations
                document.body.classList.add('performance-mode');
            }
        });
    }

    // Network-aware optimizations
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            // Reduce animation complexity
            document.body.classList.add('reduced-animations');
        }
    }

    // Battery-aware optimizations
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            if (battery.level < 0.2 || !battery.charging) {
                document.body.classList.add('battery-saver');
                // Reduce animations and effects
                document.body.classList.add('reduced-animations');
            }
        });
    }
});

// Global navigation function with enhanced screen awareness
function goToPoem(url) {
    const isSmallScreen = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionSpeed = isSmallScreen ? 300 : prefersReducedMotion ? 100 : 500;
    
    // Prevent double-clicks
    if (document.body.classList.contains('navigating')) return;
    document.body.classList.add('navigating');
    
    document.body.style.transition = `opacity ${transitionSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    document.body.style.opacity = "0";
    
    setTimeout(() => {
        window.location.href = url;
    }, transitionSpeed);
}

// Enhanced preload function
function preloadPage(url) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    } else {
        setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }, 100);
    }
}

// Service Worker registration for offline support and caching
if ('serviceWorker' in navigator && 'caches' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                
                // Update available
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available, refresh page
                            if (confirm('New content available! Refresh to update?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced error boundary
window.addEventListener('unhandledrejection', event => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Memory management
window.addEventListener('beforeunload', () => {
    // Clean up event listeners and timers
    document.removeEventListener('wheel', handleScroll);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
});