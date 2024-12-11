async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component from ${componentPath}:`, error);
    }
}

// 加载所有组件
async function loadComponents() {
    await Promise.all([
        loadComponent('header-container', '/components/header.html'),
        loadComponent('footer-container', '/components/footer.html')
    ]);
    
    // 组件加载完成后初始化功能
    initializeLanguageSwitcher();
    initializeNavigation();
} 