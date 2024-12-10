// Banner轮播功能
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

// 自动轮播
setInterval(() => showSlide(currentSlide + 1), 5000);

// 初始化 EmailJS
(function() {
    emailjs.init("aYI6g9vNXr5oOhTyv");
})();

// 处理表单提交
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // 显示发送中状态
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // 使用您的服务 ID 和模板 ID
    emailjs.sendForm(
        'service_og14a2r',    // 您的服务 ID
        'template_u214xzn',   // 您的模板 ID
        this
    )
    .then(function() {
        alert('Message sent successfully!');
        document.getElementById('contactForm').reset();
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

// 处理导航激活状态
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航链接和内容区域
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动类
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // 添加新的活动类
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
});

// Banner显示控制
function updateBannerVisibility() {
    const bannerSection = document.getElementById('banner');
    const currentHash = window.location.hash || '#home';
    
    if (currentHash === '#home') {
        bannerSection.style.display = 'block';
    } else {
        bannerSection.style.display = 'none';
    }
}

// 页面加载时检查
document.addEventListener('DOMContentLoaded', function() {
    updateBannerVisibility();
    
    // 监听 hash 变化
    window.addEventListener('hashchange', updateBannerVisibility);
    
    // 其他现有的 DOMContentLoaded 代码...
});