/**
 * home.js — 首页专属脚本
 * Vue 3 打字机效果、GSAP 滚动入场动画、时间线动画
 */

/* ================================================================
   1. Vue 3 应用 — 打字机效果
   ================================================================ */
(function initVueApp() {
  if (typeof Vue === 'undefined') return;

  const { createApp, ref, onMounted, nextTick, onUnmounted } = Vue;

  createApp({
    setup() {
      const typewriterText = ref('');
      const keywords = ['全栈开发者', '数字创作者', '生活美学探索者', '终身学习者'];
      let keywordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typeTimer = null;

      function runTypewriter() {
        const current = keywords[keywordIndex];
        if (!isDeleting) {
          charIndex++;
          typewriterText.value = current.slice(0, charIndex);
          if (charIndex >= current.length) {
            isDeleting = true;
            typeTimer = setTimeout(runTypewriter, 1800);
            return;
          }
          typeTimer = setTimeout(runTypewriter, 90 + Math.random() * 40);
        } else {
          charIndex--;
          typewriterText.value = current.slice(0, charIndex);
          if (charIndex <= 0) {
            isDeleting = false;
            keywordIndex = (keywordIndex + 1) % keywords.length;
            typeTimer = setTimeout(runTypewriter, 300);
            return;
          }
          typeTimer = setTimeout(runTypewriter, 45 + Math.random() * 20);
        }
      }

      onMounted(() => {
        runTypewriter();

        // Hero 逐行动画
        nextTick(() => {
          const heroLines = document.querySelectorAll('.hero-line');
          if (heroLines.length > 0) {
            gsap.fromTo(heroLines,
              { y: 50, opacity: 0 },
              {
                y: 0, opacity: 1,
                duration: 0.8, stagger: 0.15,
                delay: 0.3, ease: 'power3.out',
              }
            );
          }
        });

        // 滚动入场动画
        nextTick(() => { setupScrollReveal(); });
      });

      onUnmounted(() => {
        if (typeTimer) clearTimeout(typeTimer);
      });

      return { typewriterText };
    }
  }).mount('#app');
})();

/* ================================================================
   2. GSAP ScrollTrigger 滚动入场动画
   ================================================================ */
function setupScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // 通用卡片交错滑入
  const revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length > 0) {
    gsap.fromTo(revealEls,
      { y: 48, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: revealEls[0],
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // 关于我 — 左右分别滑入
  const aboutCards = document.querySelectorAll('#about .scroll-reveal');
  if (aboutCards.length >= 2) {
    gsap.fromTo(aboutCards[0],
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: aboutCards[0], start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
    gsap.fromTo(aboutCards[1],
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: aboutCards[1], start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
  }

  // 项目卡片独立触发
  document.querySelectorAll('#projects .scroll-reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.65, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  });

  // 技能卡片 stagger
  document.querySelectorAll('#skills .scroll-reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.55, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  });

  /* ================================================================
     3. 时间线动画
     ================================================================ */
  const timelineLine = document.getElementById('timeline-line');
  const timelineDots = document.querySelectorAll('.timeline-dot-target');
  const timelineCards = document.querySelectorAll('.timeline-card-target');

  if (timelineLine && timelineDots.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#timeline-container',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // 线条延伸
    tl.fromTo(timelineLine,
      { height: 0 },
      { height: '100%', duration: 1.2, ease: 'power2.inOut' }
    );

    // 节点逐个点亮
    timelineDots.forEach((dot, i) => {
      tl.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4,
          ease: 'back.out(1.7)',
          onComplete: () => { dot.classList.add('active'); },
        },
        i === 0 ? '-=0.5' : '-=0.3'
      );
    });

    // 卡片依次滑入
    tl.fromTo(timelineCards,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, stagger: 0.3, ease: 'power3.out' },
      '-=0.9'
    );
  }
}

console.log('🏠 home.js — 首页脚本已就绪');
