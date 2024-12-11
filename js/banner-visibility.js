function initializeBannerVisibility() {
    function updateBannerVisibility() {
        const bannerSection = document.getElementById('banner');
        if (!bannerSection) return;

        const currentHash = window.location.hash || '#home';
        bannerSection.style.display = currentHash === '#home' ? 'block' : 'none';
    }

    updateBannerVisibility();
    window.addEventListener('hashchange', updateBannerVisibility);
} 