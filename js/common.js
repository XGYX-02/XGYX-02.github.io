/**
 * common.js - 通用工具合集
 * 进度渲染、快捷键、计时控制、防抖切题、动画、公式渲染、
 * 分页懒加载、搜索、导出导入、打印适配、图片容错
 */
const App = (() => {
  // ===== 题库获取 =====
  function getQuestions() {
    // 优先从缓存读取（空数组也是有效缓存：用户可能已清空全部题库）
    let base = Storage.getCachedQuestions();
    if (!Array.isArray(base)) {
      // 从question.js全局变量读取
      if (typeof questionList !== 'undefined' && Array.isArray(questionList) && questionList.length > 0) {
        Storage.cacheQuestions(questionList);
        base = Storage.normalizeQuestionTypes(questionList);
      } else {
        base = [];
      }
    }
    // 合并PDF导入的题目和用户自定义题目
    const imported = Storage.getImportedQuestions();
    const custom = Storage.getCustomQuestions();
    return base.concat(imported, custom);
  }
  /** 仅返回有效题型 */
  function validQuestions() {
    return getQuestions().filter(q => ['single', 'multi', 'judge', 'calc'].includes(q.type));
  }
  /** 按类型过滤 */
  function filterByType(questions, type) {
    if (!type || type === 'all') return questions;
    return questions.filter(q => q.type === type);
  }
  // ===== 进度条渲染 =====
  function renderProgress(container, answered) {
    if (!container) return;
    const total = validQuestions().length;
    const correct = Object.values(answered || {}).filter(v => v === true).length;
    const wrong = Object.values(answered || {}).filter(v => v === false).length;
    const unknown = total - correct - wrong;
    const cPct = total ? (correct / total * 100).toFixed(1) : 0;
    const wPct = total ? (wrong / total * 100).toFixed(1) : 0;
    const uPct = total ? (unknown / total * 100).toFixed(1) : 0;
    container.innerHTML = `
      <div class="progress-bar">
        <div class="seg-correct" style="width:${cPct}%"></div>
        <div class="seg-wrong" style="width:${wPct}%"></div>
        <div class="seg-unknown" style="width:${uPct}%"></div>
      </div>
      <div class="progress-info">
        <span>✅ ${correct}</span>
        <span>❌ ${wrong}</span>
        <span>⬜ ${unknown}</span>
        <span>总计 ${total}题</span>
        <span>正确率 ${total ? (correct/(correct+wrong||1)*100).toFixed(0) : 0}%</span>
      </div>`;
  }
  // ===== 答案校验 =====
  function checkAnswer(question, userAnswer) {
    if (!question || userAnswer == null) return false;
    if (question.type === 'single') {
      return userAnswer.toUpperCase() === question.answer.toUpperCase();
    }
    if (question.type === 'multi') {
      // 多选题：字母集合完全一致才判对（顺序无关，需全对无多选无漏选）
      const norm = (s) => String(s).toUpperCase().replace(/[^A-H]/g, '').split('').sort().join('');
      return norm(userAnswer) === norm(question.answer) && norm(userAnswer).length > 0;
    }
    if (question.type === 'judge') {
      return userAnswer.toUpperCase() === question.answer.toUpperCase();
    }
    if (question.type === 'calc') {
      // 计算题：清洗文本 + 关键词模糊匹配
      const clean = (s) => s.replace(/\s+/g, '').toLowerCase()
        .replace(/[（）()]/g, '').replace(/[，,。；;：:]/g, '');
      const user = clean(String(userAnswer));
      const expected = clean(question.answer);
      // 完全匹配
      if (user === expected) return true;
      // 包含关键词匹配（预期答案的关键词在用户答案中出现）
      const keywords = expected.split(/[+\-*/=×÷]/).filter(k => k.length > 1);
      if (keywords.length === 0) return user === expected;
      const matchCount = keywords.filter(k => user.includes(k)).length;
      return matchCount >= keywords.length * 0.6; // 60%关键词匹配即可
    }
    return false;
  }
  // ===== 计时器 =====
  let timerInterval = null;
  let questionStartTime = 0;
  let sessionTotalTime = 0;
  let currentQid = null;
  let timerCallback = null;
  function startTimer(qid, onUpdate) {
    stopTimer();
    currentQid = qid;
    questionStartTime = Date.now();
    timerCallback = onUpdate;
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      if (timerCallback) timerCallback(elapsed);
    }, 1000);
  }
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      sessionTotalTime += elapsed;
      return elapsed;
    }
    return 0;
  }
  function resetTimer() {
    stopTimer();
    sessionTotalTime = 0;
  }
  function getSessionTime() { return sessionTotalTime; }
  // 后台切页暂停恢复
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else if (currentQid) {
      startTimer(currentQid, timerCallback);
    }
  });
  // 超时判断（在外部onUpdate中检查）
  // ===== 防抖自动切题 =====
  let debounceTimer = null;
  function debounceNext(fn, delay = 300) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, delay);
  }
  function cancelDebounce() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }
  // ===== 快捷键管理 =====
  let shortcutHandler = null;
  function enableShortcuts(handler) {
    shortcutHandler = handler;
  }
  function disableShortcuts() {
    shortcutHandler = null;
  }
  document.addEventListener('keydown', (e) => {
    if (!shortcutHandler) return;
    const cfg = Storage.getConfig();
    if (!cfg.shortcutEnabled) return;
    // 忽略在输入框中的快捷键（Enter除外，计算题用）
    const tag = e.target.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (isInput && e.key !== 'Enter') return;
    shortcutHandler(e);
  });
  // ===== 搜索匹配 =====
  function searchQuestions(query, questions) {
    if (!query || !query.trim()) return questions;
    const q = query.trim().toLowerCase();
    return questions.filter(item => {
      return item.question.toLowerCase().includes(q) ||
             item.answer.toLowerCase().includes(q) ||
             (item.explanation && item.explanation.toLowerCase().includes(q)) ||
             (item.options && item.options.some(o => o.text.toLowerCase().includes(q)));
    });
  }
  // ===== 分页懒加载 =====
  const PAGE_SIZE = 20;
  function setupLazyLoad(container, loadMoreFn) {
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreFn();
      }
    }, { rootMargin: '200px' });
    const sentinel = document.createElement('div');
    sentinel.className = 'load-more';
    sentinel.textContent = '加载更多...';
    container.appendChild(sentinel);
    observer.observe(sentinel);
    return { observer, sentinel };
  }
  function getPageItems(items, page) {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }
  // ===== Toast提示 =====
  let toastTimer = null;
  function showToast(msg, type = '') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.className = 'toast ' + (type ? 'toast-' + type : '');
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }
  // ===== 音效 =====
  function playSound(type) {
    const cfg = Storage.getConfig();
    if (!cfg.timerSound) return;
    if (type === 'correct' && !cfg.soundCorrect) return;
    if (type === 'wrong' && !cfg.soundWrong) return;
    if (type === 'timeout' && !cfg.soundTimeout) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.frequency.value = 880;
        gain.gain.value = 0.15;
      } else if (type === 'wrong') {
        osc.frequency.value = 330;
        gain.gain.value = 0.15;
      } else if (type === 'timeout') {
        osc.frequency.value = 660;
        gain.gain.value = 0.15;
      }
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) { /* 音效不可用时静默 */ }
  }
  // ===== 模态弹窗 =====
  /** onCancel为可选的取消回调（点击取消按钮时触发，未传则仅关闭弹窗） */
  function showModal(title, body, onConfirm, confirmText = '确认', danger = false, onCancel) {
    // 优先复用带标准按钮结构的弹窗，避免误抓页面中其他 .modal-overlay（如备份导入弹窗）
    let overlay = null;
    document.querySelectorAll('.modal-overlay').forEach(o => {
      if (!overlay && o.querySelector('.btn-confirm')) overlay = o;
    });
    if (!overlay) overlay = createModalOverlay();
    overlay.querySelector('.modal h3').textContent = title;
    overlay.querySelector('.modal-body').textContent = body;
    const btn = overlay.querySelector('.btn-confirm');
    btn.textContent = confirmText;
    btn.className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary') + ' btn-confirm';
    btn.onclick = () => {
      overlay.classList.remove('active');
      if (onConfirm) onConfirm();
    };
    overlay.querySelector('.btn-cancel').onclick = () => {
      overlay.classList.remove('active');
      if (onCancel) onCancel();
    };
    overlay.classList.add('active');
  }
  function createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3></h3>
        <div class="modal-body"></div>
        <div class="btn-group">
          <button class="btn btn-cancel">取消</button>
          <button class="btn btn-confirm">确认</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  // ===== 统一导航（全页同一结构：桌面吸顶毛玻璃横导航 + 手机底部Tab栏） =====
  const NAV_PAGES = [
    { key: 'index.html', icon: '🏠', label: '首页' },
    { key: 'exam.html', icon: '📝', label: '刷题' },
    { key: 'wrong.html', icon: '📋', label: '错题本' },
    { key: 'edit.html', icon: '✏️', label: '编辑' },
    { key: 'setting.html', icon: '⚙️', label: '设置' }
  ];
  /** 生成统一导航：替换页面中 nav.nav 占位符，并附加手机端底部Tab栏 */
  function renderNav() {
    const cur = location.pathname.split('/').pop() || 'index.html';
    const curPage = NAV_PAGES.find(p => p.key === cur) || NAV_PAGES[0];
    const oldNav = document.querySelector('nav.nav');
    if (oldNav) {
      const nav = document.createElement('nav');
      nav.className = 'nav';
      nav.innerHTML =
        `<span class="nav-title">${curPage.icon} ${curPage.label}</span>` +
        `<div class="nav-inner">` + NAV_PAGES.map(p =>
          `<a class="nav-item${p.key === curPage.key ? ' active' : ''}" href="${p.key}"><span>${p.icon}</span>${p.label}</a>`
        ).join('') + `</div>`;
      oldNav.replaceWith(nav);
    }
    if (!document.getElementById('mainTabbar')) {
      const bar = document.createElement('nav');
      bar.className = 'tabbar';
      bar.id = 'mainTabbar';
      bar.innerHTML = NAV_PAGES.map(p =>
        `<a class="tab-item${p.key === curPage.key ? ' active' : ''}" href="${p.key}"><span class="tab-ico">${p.icon}</span><span>${p.label}</span></a>`
      ).join('');
      document.body.appendChild(bar);
    }
  }
  function applyFontSize(size) {
    document.documentElement.classList.remove('font-standard', 'font-large', 'font-xlarge');
    document.documentElement.classList.add('font-' + size);
  }
  function applyFormulaMono(enabled) {
    if (enabled) {
      document.documentElement.classList.add('formula-mono');
    } else {
      document.documentElement.classList.remove('formula-mono');
    }
  }
  function applyAnimation(enabled) {
    if (!enabled) {
      document.documentElement.classList.add('anim-off');
    } else {
      document.documentElement.classList.remove('anim-off');
    }
  }
  function applyAllSettings() {
    const cfg = Storage.getConfig();
    applyFontSize(cfg.fontSize);
    applyFormulaMono(cfg.formulaMono);
    applyAnimation(cfg.animation);
  }
  // ===== 图片容错 =====
  function setupImageFallback(imgEl) {
    if (!imgEl) return;
    imgEl.onerror = function() {
      this.style.display = 'none';
      const placeholder = this.nextElementSibling;
      if (placeholder && placeholder.classList.contains('img-placeholder')) {
        placeholder.innerHTML = '📷 图片加载失败';
      }
    };
    imgEl.onload = function() {
      const placeholder = this.previousElementSibling;
      if (placeholder && placeholder.classList.contains('img-placeholder')) {
        placeholder.style.display = 'none';
      }
    };
  }
  function renderImage(imagePath) {
    if (!imagePath) return '';
    var clean = imagePath.replace(/^[\\/]+/, '').replace(/^images[\\/]/i, '');
    return '<div class="img-placeholder"></div>' +
      '<img class="q-image" src="images/' + clean + '" alt="题图" ' +
      'onerror="this.style.display=\'none\';var p=this.parentElement.querySelector(\'.img-placeholder\');if(p)p.innerHTML=\'📷 图片加载失败\';this.remove();">'
  }
  // ===== 薄弱题筛选 =====
  function getWeakQuestions(threshold) {
    const records = Storage.getRecords();
    const questions = validQuestions();
    return questions.filter(q => {
      const r = records[q.id];
      return r && r.wrong >= threshold;
    });
  }
  // ===== 统计计算 =====
  function getStats() {
    const questions = validQuestions();
    const records = Storage.getRecords();
    const errors = Storage.getErrors();
    let total = questions.length;
    let done = 0, correct = 0, wrong = 0, score = 0;
    const cfg = Storage.getConfig();
    for (const q of questions) {
      const r = records[q.id];
      if (r && (r.correct > 0 || r.wrong > 0)) {
        done++;
        correct += r.correct;
        wrong += r.wrong;
        if (q.type === 'single') score += r.correct * cfg.scoreSingle;
        else if (q.type === 'multi') score += r.correct * (cfg.scoreMulti ?? 1);
        else if (q.type === 'judge') score += r.correct * cfg.scoreJudge;
        else if (q.type === 'calc') score += r.correct * cfg.scoreCalc;
      }
    }
    const errorCount = errors.length;
    const weakCount = getWeakQuestions(cfg.weakThreshold).length;
    const correctRate = (correct + wrong) > 0 ? (correct / (correct + wrong) * 100).toFixed(1) : '0.0';
    const totalScore = correct * cfg.scoreSingle + correct * cfg.scoreJudge + correct * cfg.scoreCalc; // approximate
    return { total, done, correct, wrong, score, errorCount, weakCount, correctRate, totalScore };
  }
  // ===== 页面卸载监听 =====
  window.addEventListener('beforeunload', () => {
    // 停止计时器
    stopTimer();
  });
  // ===== 随机打乱 =====
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /** 打乱单选/多选题选项，返回映射；设置开关关闭时保持默认选项顺序 */
  function shuffleOptions(question) {
    if ((question.type !== 'single' && question.type !== 'multi') || !question.options) return { options: question.options, map: null };
    const cfg = Storage.getConfig();
    if (!cfg.shuffleOptions) {
      // 开关关闭：使用原始选项顺序，答案字母不变
      return { options: question.options, map: null, newAnswer: question.answer };
    }
    const shuffled = shuffle(question.options);
    const map = {};
    shuffled.forEach((opt, i) => { map[opt.key] = String.fromCharCode(65 + i); }); // oldKey -> newKey
    // 多选题答案逐字母映射后重排（如"DBA"→"ABD"）
    const newAnswer = question.answer
      .split('')
      .map(ch => map[ch] || ch)
      .sort()
      .join('');
    return {
      options: shuffled.map((opt, i) => ({ key: String.fromCharCode(65 + i), text: opt.text })),
      map,
      originalAnswer: question.answer,
      newAnswer
    };
  }
  // ===== 格式化时间 =====
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  // ===== 打印 =====
  function setupPrint() {
    window.addEventListener('beforeprint', () => {
      document.body.classList.add('printing');
    });
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing');
    });
  }
  // ===== 初始化 =====
  function init() {
    applyAllSettings();
    setupPrint();
    // 题库格式校验
    const questions = getQuestions();
    if (!questions || questions.length === 0) {
      showToast('题库加载失败，请检查 js/question.js 文件', 'error');
    }
  }
  return {
    getQuestions, validQuestions, filterByType,
    renderProgress,
    checkAnswer,
    startTimer, stopTimer, resetTimer, getSessionTime,
    debounceNext, cancelDebounce,
    enableShortcuts, disableShortcuts,
    searchQuestions,
    setupLazyLoad, getPageItems, PAGE_SIZE,
    showToast, playSound, showModal,
    applyFontSize, applyFormulaMono, applyAnimation, applyAllSettings,
    setupImageFallback, renderImage,
    getWeakQuestions, getStats,
    shuffle, shuffleOptions, formatTime,
    renderNav,
    setupPrint, init
  };
})();
// 脚本位于body末尾，DOM已就绪：立即渲染统一导航，再等页面加载完成初始化
App.renderNav();
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});