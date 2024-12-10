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

    // 获取当前语言设置
    function getCurrentLang() {
        return localStorage.getItem('language') || 'en';
    }

    // 创建 toast 容器
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        // 3秒后自动消失
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = translations[getCurrentLang()].contact.form.sending;

        emailjs.sendForm(
            'service_og14a2r',
            'template_u214xzn',
            this
        )
        .then(() => {
            showToast(translations[getCurrentLang()].contact.form.success);
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showToast(translations[getCurrentLang()].contact.form.error, 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}

// 导航功能初始化
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // 显示指定部分
    function showSection(sectionId) {
        // 移除所有活动状态
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // 添加新的活动状态
        const targetSection = document.getElementById(sectionId);
        const targetNav = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (targetSection && targetNav) {
            targetSection.classList.add('active');
            targetNav.classList.add('active');
        }
    }

    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1); // 移除 '#' 符号
            showSection(sectionId);
        });
    });

    // 处理 CTA 按钮点击
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // 处理 URL hash 变化
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash) {
            const sectionId = hash.substring(1);
            showSection(sectionId);
        }
    });

    // 初始加载时检查 URL hash
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    }
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
        const traceSection = document.querySelector('#product-trace');
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

        // 更新联系我们部分
        const contactSection = document.querySelector('#contact');
        if (contactSection && translations[lang]?.contact) {
            const contact = translations[lang].contact;
            const elements = {
                title: contactSection.querySelector('h1'),
                subtitle: contactSection.querySelector('.contact-intro h2'),
                desc: contactSection.querySelector('.contact-intro p'),
                infoTitle: contactSection.querySelector('.contact-left h3'),
                infoDesc: contactSection.querySelector('.contact-desc'),
                formTitle: contactSection.querySelector('.contact-right h3'),
                nameLabel: contactSection.querySelector('label[for="name"]'),
                emailLabel: contactSection.querySelector('label[for="email"]'),
                messageLabel: contactSection.querySelector('label[for="message"]'),
                submitButton: contactSection.querySelector('button[type="submit"]')
            };

            if (elements.title) elements.title.textContent = contact.title;
            if (elements.subtitle) elements.subtitle.textContent = contact.subtitle;
            if (elements.desc) elements.desc.textContent = contact.description;
            if (elements.infoTitle) elements.infoTitle.textContent = contact.info.title;
            if (elements.infoDesc) elements.infoDesc.textContent = contact.info.desc;
            if (elements.formTitle) elements.formTitle.textContent = contact.form.title;
            if (elements.nameLabel) elements.nameLabel.textContent = contact.form.name;
            if (elements.emailLabel) elements.emailLabel.textContent = contact.form.email;
            if (elements.messageLabel) elements.messageLabel.textContent = contact.form.message;
            if (elements.submitButton) elements.submitButton.textContent = contact.form.button;
        }

        // 更新文章部分
        const articlesSection = document.querySelector('#articles');
        if (articlesSection && translations[lang]?.articles) {
            const articles = translations[lang].articles;
            const title = articlesSection.querySelector('h2');
            if (title) title.textContent = articles.title;

            const articleCards = articlesSection.querySelectorAll('.article-card');
            articleCards.forEach((card, index) => {
                if (articles.items[index]) {
                    const h3 = card.querySelector('h3');
                    const p = card.querySelector('p');
                    const readMore = card.querySelector('.read-more');
                    
                    if (h3) h3.textContent = articles.items[index].title;
                    if (p) p.textContent = articles.items[index].desc;
                    if (readMore) readMore.textContent = articles.readMore;
                }
            });
        }

        // 更新页脚
        const footer = document.querySelector('footer');
        if (footer && translations[lang]?.footer) {
            const footerTrans = translations[lang].footer;
            
            const companyDesc = footer.querySelector('.footer-section p');
            const quickLinksTitle = footer.querySelector('.footer-section:nth-child(2) h4');
            const contactTitle = footer.querySelector('.footer-section:nth-child(3) h4');
            
            if (companyDesc) companyDesc.textContent = footerTrans.company.desc;
            if (quickLinksTitle) quickLinksTitle.textContent = footerTrans.quickLinks.title;
            if (contactTitle) contactTitle.textContent = footerTrans.contact.title;

            // 更新快速链接
            const quickLinks = footer.querySelectorAll('.footer-section:nth-child(2) ul li a');
            quickLinks.forEach(link => {
                const key = link.getAttribute('href').substring(1);
                if (footerTrans.quickLinks.links[key]) {
                    link.textContent = footerTrans.quickLinks.links[key];
                }
            });
        }

        // 更新产品部分
        const productsSection = document.querySelector('#products');
        if (productsSection && translations[lang]?.products) {
            const products = translations[lang].products;
            const title = productsSection.querySelector('h2');
            if (title) title.textContent = products.title;

            const productCards = productsSection.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
                if (products.items[index]) {
                    const h3 = card.querySelector('h3');
                    const p = card.querySelector('p');
                    if (h3) h3.textContent = products.items[index].title;
                    if (p) p.textContent = products.items[index].desc;
                }
            });
        }

        // 更新定制部分
        const customizationSection = document.querySelector('#customization');
        if (customizationSection && translations[lang]?.customization) {
            const customization = translations[lang].customization;
            const title = customizationSection.querySelector('h2');
            if (title) title.textContent = customization.title;

            const customOptions = customizationSection.querySelectorAll('.custom-option');
            customOptions.forEach((option, index) => {
                if (customization.items[index]) {
                    const h3 = option.querySelector('h3');
                    const p = option.querySelector('p');
                    if (h3) h3.textContent = customization.items[index].title;
                    if (p) p.textContent = customization.items[index].desc;
                }
            });
        }

        // 更新案例部分
        const casesSection = document.querySelector('#cases');
        if (casesSection && translations[lang]?.cases) {
            const cases = translations[lang].cases;
            const title = casesSection.querySelector('h2');
            if (title) title.textContent = cases.title;

            const caseItems = casesSection.querySelectorAll('.case');
            caseItems.forEach((item, index) => {
                if (cases.items[index]) {
                    const h3 = item.querySelector('h3');
                    const p = item.querySelector('p');
                    if (h3) h3.textContent = cases.items[index].title;
                    if (p) p.textContent = cases.items[index].desc;
                }
            });
        }

        // 更新关于我们部分
        const aboutSection = document.querySelector('#about');
        if (aboutSection && translations[lang]?.about) {
            const about = translations[lang].about;
            const title = aboutSection.querySelector('h2');
            if (title) title.textContent = about.title;

            const storyTitle = aboutSection.querySelector('.about-text h3:first-child');
            const storyDesc = aboutSection.querySelector('.about-text p:first-of-type');
            const missionTitle = aboutSection.querySelector('.about-text h3:last-child');
            const missionDesc = aboutSection.querySelector('.about-text p:last-of-type');

            if (storyTitle) storyTitle.textContent = about.story.title;
            if (storyDesc) storyDesc.textContent = about.story.desc;
            if (missionTitle) missionTitle.textContent = about.mission.title;
            if (missionDesc) missionDesc.textContent = about.mission.desc;
        }
    }
}