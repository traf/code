document.addEventListener('DOMContentLoaded', () => {
    const siteRows = document.querySelectorAll('.site-row');
    
    siteRows.forEach(row => {
        const site = row.dataset.site;
        const toggle = row.querySelector(`input[data-site="${site}"]`);
        
        // Load saved states for each site
        chrome.storage.sync.get([`${site}-enabled`], (result) => {
            toggle.checked = result[`${site}-enabled`] ?? true;
        });

        // Handle row clicks
        row.addEventListener('click', (e) => {
            // Don't trigger if clicking the actual switch (prevents double toggle)
            if (!e.target.closest('.switch')) {
                toggle.checked = !toggle.checked;
                handleToggle(site, toggle.checked);
            }
        });

        // Still handle the switch change event
        toggle.addEventListener('change', () => {
            handleToggle(site, toggle.checked);
        });
    });

    function handleToggle(site, isEnabled) {
        chrome.storage.sync.set({ [`${site}-enabled`]: isEnabled });
        
        // Get all tabs that match the site
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.url.includes(site)) {
                    // First clear the theme
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleTheme',
                        enabled: isEnabled
                    }).then(() => {
                        // Then force a hard reload
                        chrome.tabs.reload(tab.id, { bypassCache: true });
                    }).catch(err => console.log('Tab not ready yet'));
                }
            });
        });
    }
}); 