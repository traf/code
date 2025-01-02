// At the very start of content.js
function forceDefaultStyles() {
    // Remove any existing theme elements first
    document.querySelectorAll('[data-aura-theme], [data-aura-fonts]').forEach(element => {
        element.remove();
    });
    
    const resetStyle = document.createElement('style');
    resetStyle.textContent = ``;
    resetStyle.setAttribute('data-aura-reset', 'true');
    document.documentElement.appendChild(resetStyle);
}

// Force default styles immediately
if (!window.auraInitialized) {
    forceDefaultStyles();
    window.auraInitialized = true;
}

// Get the theme file from the current URL first
const siteTheme = window.location.hostname.split('.')[1];
const themeFile = chrome.runtime.getURL(`themes/${siteTheme}.css`);

// Keep track of injected elements
const injectedElements = new Set();

// Track enabled state globally
let isThemeEnabled = false;

// Initialize enabled state before doing anything else
chrome.storage.sync.get([`${siteTheme}-enabled`], (result) => {
    isThemeEnabled = result[`${siteTheme}-enabled`] ?? true;
    
    if (isThemeEnabled) {
        setupTheme();
    }
});

function setupTheme() {
    // Ensure document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectTheme();
            injectFonts();
            setupObserver();
        });
    } else {
        injectTheme();
        injectFonts();
        setupObserver();
    }
}

// CSS preprocessing function
function addImportantToCss(css) {
    return css.replace(/([^{]+\{[^}]+\})/g, match => {
        return match.replace(/([a-zA-Z-]+\s*:\s*[^;\n}]+)(?=[;\n}])/g, '$1 !important');
    });
}

// Inject the processed CSS into the main document
function injectTheme() {
    if (!isThemeEnabled) return;
    
    fetch(themeFile)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(css => {
            const style = document.createElement('style');
            style.textContent = addImportantToCss(css);
            style.setAttribute('data-aura-theme', 'true');
            document.documentElement.appendChild(style);
            injectedElements.add(style);
        })
        .catch(err => console.error('Failed to inject theme:', err));
}

// Theme injection for shadow roots
function injectIntoShadowRoots(node) {
    if (!isThemeEnabled) return;
    
    if (node.shadowRoot) {
        fetch(themeFile)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(css => {
                const style = document.createElement('style');
                style.textContent = addImportantToCss(css);
                style.setAttribute('data-aura-theme', 'true');
                node.shadowRoot.insertBefore(style, node.shadowRoot.firstChild);
                injectedElements.add(style);
            });
    }
    node.childNodes.forEach(child => {
        if (child.nodeType === 1) {
            injectIntoShadowRoots(child);
        }
    });
}

// Listen for messages before doing anything else
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    if (message.action === 'toggleTheme') {
        isThemeEnabled = message.enabled;
        handleThemeToggle(message.enabled);
        sendResponse({success: true});
    }
    return true;
});

function handleThemeToggle(enabled) {
    isThemeEnabled = enabled;
    
    if (enabled) {
        setupTheme();
    } else {
        // Remove all custom styles
        injectedElements.forEach(element => {
            element.remove();
        });
        injectedElements.clear();
        
        // Disconnect observer when disabled
        if (observer) {
            observer.disconnect();
        }
    }
}

// Watch for shadow DOM elements
let observer = null;

function setupObserver() {
    if (observer) {
        observer.disconnect();
    }
    
    observer = new MutationObserver((mutations) => {
        if (isThemeEnabled) {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        injectIntoShadowRoots(node);
                    }
                });
            });
        }
    });

    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    });
}

function injectFonts() {
    if (!isThemeEnabled) return;
    
    if (document.head) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.setAttribute('data-aura-theme', 'true');
        document.head.appendChild(fontLink);
        injectedElements.add(fontLink);
    }
} 