function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('language') || 'en';

    setLanguage(currentLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });

    function setLanguage(lang) {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        updateTranslations(lang);
    }
} 