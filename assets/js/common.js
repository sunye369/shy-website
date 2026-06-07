/**
 * common.js — 全站共享脚本
 * 背景流光、导航栏、页面转场、回到顶部、滚动进度条
 */

/* ================================================================
   1. 背景 Blob 呼吸动画
   ================================================================ */
(function animateBlobs() {
  if (typeof gsap === 'undefined') return;

  gsap.to('#blob1', {
    x: '10%', y: '8%', scale: 1.1,
    duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut',
  });
  gsap.to('#blob2', {
    x: '-6%', y: '-5%', scale: 0.92,
    duration: 15, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.7,
  });
  gsap.to('#blob3', {
    x: '-7%', y: '-8%', scale: 1.06,
    duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4,
  });
  gsap.to('#blob4', {
    x: '5%', y: '-6%', scale: 0.96,
    duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.0,
  });
  gsap.to('#blob5', {
    x: '-4%', y: '7%', scale: 1.04,
    duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3,
  });
})();

/* ================================================================
   2. 导航栏滚动毛玻璃效果
   ================================================================ */
(function navbarEffect() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.style.background = 'rgba(250,250,250,0.78)';
      nav.style.backdropFilter = 'blur(18px)';
      nav.style.WebkitBackdropFilter = 'blur(18px)';
      nav.style.borderBottomColor = 'rgba(0,0,0,0.06)';
    } else {
      nav.style.background = nav.dataset.initialBg || 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.WebkitBackdropFilter = 'none';
      nav.style.borderBottomColor = 'transparent';
    }
  }, { passive: true });

  // 保存初始状态（blog 页默认毛玻璃）
  nav.dataset.initialBg = nav.style.background || 'transparent';
})();

/* ================================================================
   3. 页面转场
   ================================================================ */
(function pageTransition() {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;

  // 入场：从其他页面跳转过来
  if (sessionStorage.getItem('pageTransition') === 'in') {
    overlay.style.transform = 'translateY(0%)';
    gsap.to(overlay, {
      y: '-100%',
      duration: 0.55,
      delay: 0.08,
      ease: 'power3.inOut',
      onComplete: () => { overlay.style.transform = 'translateY(-100%)'; }
    });
    sessionStorage.removeItem('pageTransition');
  }

  // 出场：拦截带 data-transition 的链接
  document.querySelectorAll('a[data-transition]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      gsap.to(overlay, {
        y: '0%',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          sessionStorage.setItem('pageTransition', 'in');
          window.location.href = href;
        }
      });
    });
  });
})();

/* ================================================================
   4. 回到顶部按钮
   ================================================================ */
(function backToTop() {
  // 创建按钮
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  btn.setAttribute('aria-label', '回到顶部');
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 90;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.8); backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08); color: #555;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; opacity: 0; visibility: hidden;
    transform: translateY(8px);
    transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  `;
  document.body.appendChild(btn);

  // 显示/隐藏
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
      btn.style.transform = 'translateY(8px)';
    }
  }, { passive: true });

  // 点击滚动到顶部
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Hover 效果
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'rgba(74,119,177,0.1)';
    btn.style.borderColor = 'rgba(74,119,177,0.3)';
    btn.style.color = '#4a77b1';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'rgba(255,255,255,0.8)';
    btn.style.borderColor = 'rgba(0,0,0,0.08)';
    btn.style.color = '#555';
  });
})();

/* ================================================================
   5. 滚动进度条
   ================================================================ */
(function scrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2.5px;
    background: linear-gradient(90deg, #6b93c7, #9eb8db, #d4b8e8);
    z-index: 100; border-radius: 0 2px 0 0;
    transition: width 0.15s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* ================================================================
   6. 平滑滚动 (降级处理已由 CSS scroll-behavior 覆盖)
   ================================================================ */
(function smoothScrollPolyfill() {
  // 现代浏览器已原生支持 scroll-behavior: smooth
  // 此处为需要自定义 easing 的锚点链接做准备
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

console.log('🌸 common.js — 全站共享脚本已就绪');
