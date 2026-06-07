/**
 * blog.js — 博客 & 摄影墙专属脚本
 * Vue 3 博客筛选与展开、Lightbox 灯箱、GSAP 滚动动画
 */

/* ================================================================
   1. Vue 3 应用 — 博客 + Lightbox
   ================================================================ */
(function initBlogApp() {
  if (typeof Vue === 'undefined') return;

  const { createApp, ref, computed, onMounted, nextTick, onUnmounted } = Vue;

  createApp({
    setup() {
      /* ===========================================================
         博客数据（含完整正文）
         =========================================================== */
      const blogPosts = [
        {
          date: '2026 年 5 月 20 日',
          readTime: '阅读 8 min',
          title: 'Web 动效美学：从 CSS Transition 到 GSAP 交响乐',
          excerpt: '动效不是锦上添花，而是产品语言的一部分。本文深入探讨 Web 动画的四个层级——微交互、转场、叙事动画与数据可视化动效，并分享 GSAP ScrollTrigger 在实际项目中的最佳实践与性能调优策略。',
          content: `<p>动画之于界面，如同语调之于语言——它不是可有可无的装饰，而是决定信息如何被感知的核心要素。</p>
<h3>动画的四个层级</h3>
<p><strong>第一层：微交互（Micro-interactions）</strong></p>
<p>按钮的 hover 态、卡片的按压反馈、加载态的骨架屏——这些毫秒级的细节构成了用户对产品"质感"的第一印象。一个好用的微交互应当遵循<em>预期管理原则</em>：在任何状态变化发生之前，先给用户一个视觉暗示。</p>
<p>比如，当用户将鼠标悬停在一张 Bento 卡片上时，卡片不只是"突然弹起"，而是经历一个流畅的缓出曲线——<code>cubic-bezier(0.23, 1, 0.32, 1)</code>，这正是 Apple 设计师钟爱的"弹性减速"节奏。</p>
<p><strong>第二层：转场（Transitions）</strong></p>
<p>页面切换、路由跳转、模态框的进出——这些"空间移动"需要帮助用户建立心智模型。我喜欢用 GSAP 的 <code>power3.inOut</code> 缓动来实现全屏遮罩转场：自下而上吞噬旧页面，再向上推开露出新页面。这个方向暗示着"翻开新的一页"。</p>
<p><strong>第三层：叙事动画（Narrative Animation）</strong></p>
<p>滚动驱动的叙事动画是近年来网页设计最令人兴奋的趋势之一。通过 GSAP ScrollTrigger，我们可以让 DOM 元素随着用户的滚动位置精确地变换——时间线的线条延伸、技能卡片像多米诺骨牌般依次滑入、Hero 标题逐行升起。</p>
<p>关键在于 <code>stagger</code>（交错延迟）：永远不要让所有元素同时出现。0.08 秒的间隔足以让人眼感知到"流动"而非"闪现"。</p>
<p><strong>第四层：数据可视化动效</strong></p>
<p>当数字从 0 跳动到最终值，当图表从一条平线生长为起伏的曲线——数据不再冰冷，而是有了生命。</p>
<h3>性能调优实践</h3>
<p>在项目中使用 GSAP 时，有几点需要特别注意：始终对 <code>transform</code> 和 <code>opacity</code> 做动画（GPU 加速），避免在动画过程中触发 layout/paint；使用 <code>will-change</code> 提前告知浏览器；在移动端降低动画复杂度（减少 blur 滤镜、简化 stagger 数量）。</p>
<h3>结语</h3>
<p>动效设计的终极目标不是"炫技"，而是让用户感觉不到技术的存在——一切都那么自然、流畅、理所当然。那才是真正的高级感。✨</p>`,
          tags: ['动效设计', 'GSAP', '前端工程'],
        },
        {
          date: '2026 年 4 月 12 日',
          readTime: '阅读 12 min',
          title: '出海全栈实践：从零搭建多区域部署的 Nuxt 3 应用',
          excerpt: '面向全球用户的 Web 应用如何兼顾性能与可靠性？本文记录了一次完整的出海架构实践，涵盖边缘计算、i18n 国际化、Cloudflare R2 静态托管与智能 CDN 回源策略。',
          content: `<p>去年年底，我接到一个任务：为一款面向东南亚和中东市场的 SaaS 产品搭建前端架构。要求很明确——首屏加载不超过 2 秒（含 3G 网络）、支持 5 种语言、99.9% 可用性。这篇文章记录了我从架构设计到上线的完整思考。</p>
<h3>为什么选择 Nuxt 3</h3>
<p>Nuxt 3 的混合渲染模式是这个场景的最佳选择：营销页面（首页、博客）使用 SSG 预渲染为静态 HTML，保证 SEO 和首屏速度；App 控制台使用 SSR，按需获取实时数据。配合 <code>nuxt-content</code> 管理博客和文档，团队的非技术人员也能直接提交 Markdown 更新内容。</p>
<h3>边缘计算与 CDN 策略</h3>
<p>我们将静态资源部署到 Cloudflare R2（兼容 S3 API，但零出站费用），通过 Cloudflare CDN 分发到全球 300+ 边缘节点。动态请求则回源到新加坡的 Node.js 服务器。关键配置项：</p>
<ul><li>图片启用 <code>format=auto</code> 自动转 WebP/AVIF</li><li>HTML 缓存 10 分钟，API 响应不缓存</li><li>启用 Early Hints（103 状态码）预加载关键资源</li></ul>
<h3>i18n 国际化方案</h3>
<p>使用 Nuxt 3 的 <code>@nuxtjs/i18n</code> 模块，配合 URL 前缀策略（<code>/en/</code>、<code>/th/</code>、<code>/ar/</code>）。RTL（阿拉伯语）布局通过 Tailwind 的 <code>dir="rtl"</code> + 逻辑属性无缝支持。翻译文件托管在 Lokalise，CI 流程自动拉取最新翻译并提交 PR。</p>
<h3>监控与灰度发布</h3>
<p>上线不是终点。我们接入了 Cloudflare Analytics + Sentry 进行全链路监控，并通过 Cloudflare Workers 实现基于地理位置的灰度发布——新功能先在新加坡小流量验证，确认无异常后再全量推至其他区域。</p>
<p>这套架构上线三个月后，全球平均 LCP 从 4.8s 降至 1.6s，跳出率下降了 34%。出海不是简单的"翻译一下"，而是对性能、文化和可靠性的一次全面考验。🌏</p>`,
          tags: ['全栈', 'Nuxt 3', 'Cloudflare', '出海'],
        },
        {
          date: '2026 年 3 月 5 日',
          readTime: '阅读 6 min',
          title: '独立开发者的 AI 工具链：让机器写代码的一年',
          excerpt: '用了一年 AI 编程助手后，我重新思考了"效率"的定义。这篇短文不是评测，而是一份关于人机协作的真诚复盘——AI 擅长什么、不擅长什么、以及为什么品味比速度更重要。',
          content: `<p>2025 年初，我决定认真地、系统性地将 AI 编程助手纳入日常工作流。一年后回头看，有些结论和我预想的完全不同。</p>
<h3>AI 真正擅长的事</h3>
<p><strong>样板代码生成：</strong>CRUD 接口、配置文件、单元测试模板——这些重复性工作 AI 完成得又快又好。我现在几乎不手写 <code>package.json</code> 的 scripts 段落了。</p>
<p><strong>陌生领域的快速上手：</strong>当我第一次接触 Cloudflare Durable Objects 时，AI 在 30 秒内给了我一个完整的工作示例。它不会替代阅读文档，但能帮我快速建立心智模型。</p>
<p><strong>重构与翻译：</strong>将一段 Python 脚本翻译为 TypeScript、将 CSS 迁移到 Tailwind、将 Options API 转为 Composition API——这类"翻译类"任务是 AI 的舒适区。</p>
<h3>AI 明显不擅长的事</h3>
<p><strong>架构决策：</strong>AI 可以给你 5 种方案，但它无法理解你的团队背景、历史债务和隐性约束。它不会说"这个方案虽然技术优雅，但你的团队可能维护不了"。</p>
<p><strong>品味与审美：</strong>AI 生成的 UI 通常"可用但不好看"。它缺少对留白、节奏、视觉重心的直觉感知。这就是为什么设计决策仍然需要人来拍板。</p>
<p><strong>调试复杂 Bug：</strong>涉及多个服务交互、竞态条件或非确定性的 bug，AI 的"猜答案"式思维往往会浪费时间。这种时候，传统调试工具（断点、日志、二分法缩小范围）仍然不可替代。</p>
<h3>我的 AI 工具链</h3>
<p>经过一年磨合，我现在的工具链稳定在：<strong>Claude Code</strong>（复杂重构与架构讨论）、<strong>GitHub Copilot</strong>（行级代码补全）、<strong>本地模型</strong>（敏感数据处理）。三种工具各司其职，没有哪一个能包揽一切。</p>
<h3>最重要的心得</h3>
<p>用 AI 写代码像开自动挡车——它让你轻松上路，但不代表你不需要懂发动机原理。那些试图完全依赖 AI、不读文档、不思考架构的人，最终会发现自己困在一堆能跑但无法维护的代码里。</p>
<p><strong>品味比速度更重要。</strong>AI 可以帮你更快地到达目的地，但目的地在哪里、值不值得去——这些问题的答案，仍然需要人来给出。🧠</p>`,
          tags: ['AI', '独立开发', '效率工具'],
        },
      ];

      const selectedTag = ref('全部');
      const expandedIndex = ref(-1);

      function togglePost(idx) {
        expandedIndex.value = expandedIndex.value === idx ? -1 : idx;
      }

      const allTags = computed(() => {
        const tags = new Set(['全部']);
        blogPosts.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags);
      });

      const filteredPosts = computed(() => {
        if (selectedTag.value === '全部') return blogPosts;
        return blogPosts.filter(p => p.tags.includes(selectedTag.value));
      });

      /* ===========================================================
         摄影墙数据
         =========================================================== */
      const galleryImages = [
        { src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=800&fit=crop', alt: '现代建筑外观' },
        { src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=450&fit=crop', alt: '城市天际线' },
        { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=750&fit=crop', alt: '山水自然' },
        { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=500&fit=crop', alt: '都市夜景' },
        { src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&h=700&fit=crop', alt: '城市剪影' },
        { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=550&fit=crop', alt: '自然风光' },
        { src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=650&fit=crop', alt: '都市建筑' },
        { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=500&fit=crop', alt: '城市街道' },
        { src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=720&fit=crop', alt: '自然光影' },
        { src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=580&fit=crop', alt: '城市俯瞰' },
        { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=480&fit=crop', alt: '巴黎街景' },
        { src: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&h=680&fit=crop', alt: '极简建筑' },
      ];

      /* ===========================================================
         Lightbox 灯箱状态
         =========================================================== */
      const lightboxVisible = ref(false);
      const currentLightboxIndex = ref(0);

      function openLightbox(index) {
        currentLightboxIndex.value = index;
        lightboxVisible.value = true;
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightboxVisible.value = false;
        document.body.style.overflow = '';
      }

      function nextImage() {
        currentLightboxIndex.value = (currentLightboxIndex.value + 1) % galleryImages.length;
      }

      function prevImage() {
        currentLightboxIndex.value = (currentLightboxIndex.value - 1 + galleryImages.length) % galleryImages.length;
      }

      function handleKeydown(e) {
        if (!lightboxVisible.value) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }

      onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
        nextTick(() => { setupScrollReveal(); });
      });

      onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
        document.body.style.overflow = '';
      });

      return {
        blogPosts, selectedTag, allTags, filteredPosts,
        expandedIndex, togglePost,
        galleryImages,
        lightboxVisible, currentLightboxIndex,
        openLightbox, closeLightbox, nextImage, prevImage,
      };
    }
  }).mount('#app');
})();

/* ================================================================
   2. GSAP ScrollTrigger 滚动动画
   ================================================================ */
function setupScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length === 0) return;

  gsap.fromTo(revealEls,
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.72,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: revealEls[0],
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );
}

console.log('📝 blog.js — 博客 & 摄影墙脚本已就绪');
