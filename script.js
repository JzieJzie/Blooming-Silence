document.addEventListener("DOMContentLoaded", () => {
    const themeStorageKey = "blooming-silence-theme";

    function getInitialTheme() {
        const savedTheme = window.localStorage.getItem(themeStorageKey);

        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.body.dataset.theme = theme;
        window.localStorage.setItem(themeStorageKey, theme);

        const themeToggle = document.querySelector("[data-theme-toggle]");
        if (themeToggle) {
            themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
        }
    }

    function goHome() {
        document.body.style.transition = "opacity 500ms ease";
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    }

    function createSiteControls() {
        if (document.querySelector(".site-controls")) {
            return;
        }

        const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/") || window.location.pathname === "";

        const controls = document.createElement("div");
        controls.className = "site-controls";

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.className = "site-back-button";
        backButton.textContent = "Back";
        backButton.addEventListener("click", goHome);

        const themeToggle = document.createElement("button");
        themeToggle.type = "button";
        themeToggle.className = "site-theme-toggle";
        themeToggle.setAttribute("data-theme-toggle", "true");
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
            applyTheme(currentTheme === "dark" ? "light" : "dark");
        });

        if (!isIndexPage) {
            controls.append(backButton);
        }
        controls.append(themeToggle);
        document.body.appendChild(controls);
        applyTheme(getInitialTheme());
    }

    // Return to index functionality
    document.querySelectorAll('a[href="index.html"]').forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            goHome();
        });
    });

    createSiteControls();
});

// Global function for backward compatibility
function goToPoem(url) {
    document.body.style.transition = "opacity 500ms ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}