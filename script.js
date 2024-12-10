// 将所有功能包装在一个主函数中
document.addEventListener('DOMContentLoaded', function() {
    // Banner轮播功能
    initializeSlider();
    
    // 初始化 EmailJS
    initializeEmailJS();
    
    // 初始化导航
    initializeNavigation();
    
    // 初始化溯源码查询
    initializeTraceCode();
    
    // 初始化语言切换
    initializeLanguageSwitcher();
    
    // 初始化 Banner 显示控制
    initializeBannerVisibility();
});

// Banner轮播功能
function initializeSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (!slides.length || !prevButton || !nextButton) return;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

    // 自动轮播
    setInterval(() => showSlide(currentSlide + 1), 5000);
}

// EmailJS初始化
function initializeEmailJS() {
    emailjs.init("aYI6g9vNXr5oOhTyv");

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        emailjs.sendForm(
            'service_og14a2r',
            'template_u214xzn',
            this
        )
        .then(function() {
            alert('Message sent successfully!');
            contactForm.reset();
        })
        .catch(function(error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}

// 导航功能初始化
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // 处理 CTA 按钮点击
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            const targetSection = document.getElementById(targetId);
            const targetNav = document.querySelector(`.nav-link[data-section="${targetId}"]`);
            
            if (targetSection && targetNav) {
                targetSection.classList.add('active');
                targetNav.classList.add('active');
            }
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// Banner显示控制初始化
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

// 溯源码查询功能初始化
function initializeTraceCode() {
    const verifyButton = document.getElementById('verifyButton');
    const traceInput = document.getElementById('traceCode');
    const resultContainer = document.getElementById('resultContainer');

    if (!verifyButton || !traceInput || !resultContainer) return;

    verifyButton.addEventListener('click', verifyTraceCode);
    traceInput.addEventListener('input', function() {
        resultContainer.style.display = 'none';
        resultContainer.className = 'result-container';
    });

    async function verifyTraceCode() {
        const code = traceInput.value.trim();
        if (!code) {
            showError('Please enter a trace code');
            return;
        }

        verifyButton.disabled = true;
        verifyButton.textContent = 'Verifying...';

        try {
            const response = await fetch(`https://your-api-endpoint/trace/${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                showResult(data);
            } else {
                showError(data.message || 'Verification failed');
            }
        } catch (error) {
            showError('Network error, please try again later');
        } finally {
            verifyButton.disabled = false;
            verifyButton.textContent = 'Verify';
        }
    }

    function showResult(data) {
        resultContainer.innerHTML = `
            <div class="result-item">
                <div class="result-label">Product Name:</div>
                <div>${data.productName || 'N/A'}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Manufacturing Date:</div>
                <div>${data.manufactureDate || 'N/A'}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Batch Number:</div>
                <div>${data.batchNumber || 'N/A'}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Status:</div>
                <div>${data.status || 'N/A'}</div>
            </div>
        `;
        resultContainer.className = 'result-container success';
        resultContainer.style.display = 'block';
    }

    function showError(message) {
        resultContainer.innerHTML = `<p>${message}</p>`;
        resultContainer.className = 'result-container error';
        resultContainer.style.display = 'block';
    }
}

// 语言切换功能初始化
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

        // 更新所有需要翻译的内容
        updateTranslations(lang);
    }

    function updateTranslations(lang) {
        // 更新导航链接文本
        document.querySelectorAll('.nav-link').forEach(link => {
            const key = link.dataset.section;
            if (translations[lang]?.nav?.[key]) {
                link.textContent = translations[lang].nav[key];
            }
        });

        // 更新首页内容
        const introContent = document.querySelector('.intro-content');
        if (introContent) {
            const h1 = introContent.querySelector('h1');
            const tagline = introContent.querySelector('.tagline');
            if (h1) h1.textContent = translations[lang].home.welcome;
            if (tagline) tagline.textContent = translations[lang].home.tagline;
        }

        // 更新特性内容
        const features = document.querySelectorAll('.feature');
        const featureKeys = ['quality', 'innovation', 'global'];
        features.forEach((feature, index) => {
            const key = featureKeys[index];
            const h3 = feature.querySelector('h3');
            const p = feature.querySelector('p');
            if (h3 && p && translations[lang]?.home?.features?.[key]) {
                h3.textContent = translations[lang].home.features[key].title;
                p.textContent = translations[lang].home.features[key].desc;
            }
        });

        // 更新 CTA 按钮
        const ctaButtons = document.querySelectorAll('.cta-button');
        if (ctaButtons.length >= 2) {
            ctaButtons[0].textContent = translations[lang].home.cta.explore;
            ctaButtons[1].textContent = translations[lang].home.cta.contact;
        }

        // 更新溯源验证部分
        const traceSection = document.querySelector('#private-label');
        if (traceSection && translations[lang]?.trace) {
            const elements = {
                h2: traceSection.querySelector('h2'),
                h3: traceSection.querySelector('h3'),
                p: traceSection.querySelector('.trace-content p'),
                input: traceSection.querySelector('#traceCode'),
                button: traceSection.querySelector('#verifyButton')
            };

            if (elements.h2) elements.h2.textContent = translations[lang].trace.title;
            if (elements.h3) elements.h3.textContent = translations[lang].trace.subtitle;
            if (elements.p) elements.p.textContent = translations[lang].trace.description;
            if (elements.input) elements.input.placeholder = translations[lang].trace.placeholder;
            if (elements.button) elements.button.textContent = translations[lang].trace.button;
        }
    }
}