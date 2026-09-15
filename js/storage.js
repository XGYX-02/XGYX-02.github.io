/**
 * storage.js - localStorage分片存储封装
 * 独立存储：配置、答题记录、错题、计时、缓存
 * 含校验、压缩、归档、防重复逻辑
 */
const Storage = (() => {
  const KEYS = {
    config: 'csp_config',
    records: 'csp_records',
    recordsArchive: 'csp_records_archive',
    errors: 'csp_errors',
    timer: 'csp_timer',
    cache: 'csp_cache',
    imported: 'csp_imported',
    custom: 'csp_custom',
    session: 'csp_session'
  };
  // ===== 默认配置 =====
  const DEFAULT_CONFIG = {
    theme: 'light',
    fontSize: 'standard',
    formulaMono: true,
    animation: true,
    timerEnabled: true,
    timePerQuestion: 120, // 单题最大秒数
    timeoutWarn: true,
    timeoutMarkError: true,
    wrongShowAnswer: true,
    timerSound: false,
    soundCorrect: false,
    soundWrong: false,
    soundTimeout: false,
    autoCleanErrors: false,
    autoArchive: false,
    archiveDays: 3,
    shortcutEnabled: true,
    scoreSingle: 1,
    scoreMulti: 1,
    scoreJudge: 1,
    scoreCalc: 1,
    weakThreshold: 2,
    autoNextDelay: 300,
    shuffleOptions: false // 打乱选项开关：开=随机打乱单选/多选选项顺序，关=默认选项顺序
  };
  // ===== 配置操作 =====
  /** 类型安全解析：JSON.parse结果为null或类型与fallback不符（如存储值损坏为"null"）时返回fallback */
  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      const val = JSON.parse(raw);
      if (val === null || typeof val !== typeof fallback) return fallback;
      if (Array.isArray(fallback) !== Array.isArray(val)) return fallback;
      return val;
    } catch (e) { return fallback; }
  }
  function getConfig() {
    try {
      const raw = localStorage.getItem(KEYS.config);
      const val = raw ? JSON.parse(raw) : null;
      return (val && typeof val === 'object' && !Array.isArray(val))
        ? Object.assign({}, DEFAULT_CONFIG, val) : { ...DEFAULT_CONFIG };
    } catch(e) {
      return { ...DEFAULT_CONFIG };
    }
  }
  function saveConfig(cfg) {
    try {
      localStorage.setItem(KEYS.config, JSON.stringify(cfg));
    } catch(e) {
      console.warn('保存配置失败:', e.message);
    }
  }
  function updateConfig(key, val) {
    const cfg = getConfig();
    cfg[key] = val;
    saveConfig(cfg);
  }
  function resetConfig() {
    localStorage.setItem(KEYS.config, JSON.stringify(DEFAULT_CONFIG));
  }
  // ===== 答题记录 =====
  function getRecords() {
    const val = safeParse(localStorage.getItem(KEYS.records), {});
    return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {};
  }
  function saveRecords(records) {
    try {
      localStorage.setItem(KEYS.records, JSON.stringify(records));
    } catch(e) {
      console.warn('保存答题记录失败，可能数据量过大:', e.message);
    }
  }
  /** 为某题添加一条答题记录 */
  function addRecord(qid, result) {
    const records = getRecords();
    if (!records[qid]) records[qid] = { correct: 0, wrong: 0, history: [] };
    if (result.correct) {
      records[qid].correct++;
    } else {
      records[qid].wrong++;
    }
    records[qid].history.push({
      time: Date.now(),
      correct: result.correct,
      duration: result.duration || 0
    });
    // 自动归档旧记录
    const cfg = getConfig();
    if (cfg.autoArchive && cfg.archiveDays > 0) {
      const cutoff = Date.now() - cfg.archiveDays * 86400000;
      const archive = getArchiveRecords();
      if (!archive[qid]) archive[qid] = { correct: 0, wrong: 0, history: [] };
      const recent = records[qid].history.filter(h => h.time >= cutoff);
      const old = records[qid].history.filter(h => h.time < cutoff);
      if (old.length > 0) {
        archive[qid].history.push(...old);
        archive[qid].correct += old.filter(h => h.correct).length;
        archive[qid].wrong += old.filter(h => !h.correct).length;
        records[qid].history = recent;
        // 重新统计当前correct/wrong（仅基于近期记录）
        records[qid].correct = recent.filter(h => h.correct).length;
        records[qid].wrong = recent.filter(h => !h.correct).length;
        savArchiveRecords(archive);
      }
    }
    saveRecords(records);
    // 自动清理错题
    if (cfg.autoCleanErrors && records[qid].correct > records[qid].wrong) {
      removeError(qid);
    }
    return records[qid];
  }
  function getArchiveRecords() {
    const val = safeParse(localStorage.getItem(KEYS.recordsArchive), {});
    return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {};
  }
  function savArchiveRecords(archive) {
    try {
      localStorage.setItem(KEYS.recordsArchive, JSON.stringify(archive));
    } catch(e) { console.warn('保存归档失败:', e.message); }
  }
  // ===== 错题操作 =====
  function getErrors() {
    const val = safeParse(localStorage.getItem(KEYS.errors), []);
    return Array.isArray(val) ? val : [];
  }
  function saveErrors(errors) {
    try {
      localStorage.setItem(KEYS.errors, JSON.stringify(errors));
    } catch(e) { console.warn('保存错题失败:', e.message); }
  }
  function addError(qid) {
    const errors = getErrors();
    // 防重复
    if (!errors.includes(qid)) {
      errors.push(qid);
      saveErrors(errors);
    }
  }
  function removeError(qid) {
    let errors = getErrors();
    errors = errors.filter(id => id !== qid);
    saveErrors(errors);
  }
  function clearErrors() {
    localStorage.setItem(KEYS.errors, '[]');
  }
  function batchRemoveErrors(qids) {
    let errors = getErrors();
    errors = errors.filter(id => !qids.includes(id));
    saveErrors(errors);
  }
  // ===== 计时数据 =====
  function getTimer() {
    const val = safeParse(localStorage.getItem(KEYS.timer), { total: 0, perQuestion: {}, overtimes: [] });
    return (val && typeof val === 'object' && !Array.isArray(val)) ? val : { total: 0, perQuestion: {}, overtimes: [] };
  }
  function saveTimer(timer) {
    try {
      localStorage.setItem(KEYS.timer, JSON.stringify(timer));
    } catch(e) { console.warn('保存计时失败:', e.message); }
  }
  function addTime(qid, duration, overtime) {
    const timer = getTimer();
    timer.total += duration;
    if (!timer.perQuestion[qid]) timer.perQuestion[qid] = [];
    timer.perQuestion[qid].push(duration);
    if (overtime) timer.overtimes.push({ qid, time: Date.now(), duration });
    saveTimer(timer);
  }
  // ===== 题型自动归类：选项只有"对/错"两样的单选/多选题 → 判断题（A=对 B=错） =====
  const TF_OPT_YES = /^(正确|对|√|是|True)$/i;
  const TF_OPT_NO = /^(错误|错|×|否|False)$/i;
  /** 单选/多选题选项恰为"对/错"两项且答案指向其一 → 转为判断题，否则原样返回 */
  function toJudgeIfPair(q) {
    if ((q.type === 'single' || q.type === 'multi') && Array.isArray(q.options) && q.options.length === 2) {
      const texts = q.options.map(o => (o.text || '').trim());
      const yesIdx = texts.findIndex(t => TF_OPT_YES.test(t));
      const noIdx = texts.findIndex(t => TF_OPT_NO.test(t));
      if (yesIdx >= 0 && noIdx >= 0) {
        const letters = String(q.answer || '').toUpperCase().replace(/[^A-H]/g, '').split('');
        if (letters.length === 1) {
          const ans = letters[0] === q.options[yesIdx].key ? 'A'
            : letters[0] === q.options[noIdx].key ? 'B' : null;
          if (ans) return { ...q, type: 'judge', options: [], answer: ans };
        }
      }
    }
    return q;
  }
  /** 读取题库时统一归类（幂等，不改动localStorage原始数据） */
  function normalizeQuestionTypes(list) {
    return Array.isArray(list) ? list.map(toJudgeIfPair) : list;
  }
  // ===== 题库缓存 =====
  function getCachedQuestions() {
    const raw = localStorage.getItem(KEYS.cache);
    if (!raw) return null;
    try {
      const val = JSON.parse(raw);
      return Array.isArray(val) ? normalizeQuestionTypes(val) : null;
    } catch(e) { return null; }
  }
  function cacheQuestions(questions) {
    try {
      localStorage.setItem(KEYS.cache, JSON.stringify(questions));
    } catch(e) {
      console.warn('缓存题库失败:', e.message);
      return false;
    }
    return true;
  }
  function clearCache() {
    localStorage.removeItem(KEYS.cache);
  }
  // ===== PDF导入题库 =====
  function getImportedQuestions() {
    const val = safeParse(localStorage.getItem(KEYS.imported), []);
    return Array.isArray(val) ? normalizeQuestionTypes(val) : [];
  }
  function saveImportedQuestions(questions) {
    try {
      localStorage.setItem(KEYS.imported, JSON.stringify(questions));
    } catch(e) {
      console.warn('保存导入题库失败，可能数据量过大:', e.message);
      return false;
    }
    return true;
  }
  /** 追加导入题目（自动跳过同题干重复题） */
  function appendImportedQuestions(newQuestions) {
    const existing = getImportedQuestions();
    const seen = new Set(existing.map(q => q.question));
    // 基础题库与自定义题库题干也计入去重
    let base = getCachedQuestions();
    if (!base) {
      base = (typeof questionList !== 'undefined' && Array.isArray(questionList)) ? questionList : [];
    }
    base.forEach(q => seen.add(q.question));
    getCustomQuestions().forEach(q => seen.add(q.question));
    const added = newQuestions.filter(q => !seen.has(q.question));
    if (added.length === 0) return 0;
    existing.push(...added);
    saveImportedQuestions(existing);
    return added.length;
  }
  function clearImportedQuestions() {
    localStorage.removeItem(KEYS.imported);
  }
  // ===== 用户自定义题目 =====
  function getCustomQuestions() {
    const val = safeParse(localStorage.getItem(KEYS.custom), []);
    return Array.isArray(val) ? normalizeQuestionTypes(val) : [];
  }
  function saveCustomQuestions(questions) {
    try {
      localStorage.setItem(KEYS.custom, JSON.stringify(questions));
    } catch(e) {
      console.warn('保存自定义题目失败，可能数据量过大:', e.message);
      return false;
    }
    return true;
  }
  /** 新增自定义题目（自动分配不冲突ID），返回新题目 */
  function addCustomQuestion(q) {
    const list = getCustomQuestions();
    const all = getImportedQuestions().concat(list);
    let base = getCachedQuestions();
    if (!base && typeof questionList !== 'undefined' && Array.isArray(questionList)) base = questionList;
    const maxId = all.concat(base || []).reduce((mx, item) => Math.max(mx, item.id || 0), 0);
    q.id = maxId + 1;
    list.push(q);
    saveCustomQuestions(list);
    return q;
  }
  /** 更新自定义题目（按id匹配），返回是否成功 */
  function updateCustomQuestion(q) {
    const list = getCustomQuestions();
    const idx = list.findIndex(item => item.id === q.id);
    if (idx === -1) return false;
    list[idx] = q;
    return saveCustomQuestions(list);
  }
  /** 删除自定义题目，同时清理其答题记录/错题 */
  function deleteCustomQuestion(id) {
    const list = getCustomQuestions().filter(q => q.id !== id);
    saveCustomQuestions(list);
    removeError(id);
    const records = getRecords();
    if (records[id]) { delete records[id]; saveRecords(records); }
  }
  function clearCustomQuestions() {
    localStorage.removeItem(KEYS.custom);
  }
  // ===== 全库题目编辑（内置缓存/PDF导入/自定义均可改删） =====
  /** 按id在全部题库中查找题目，返回 {question, source}，找不到返回null */
  function findQuestionAnywhere(id) {
    let q = getCustomQuestions().find(item => item.id === id);
    if (q) return { question: q, source: 'custom' };
    q = getImportedQuestions().find(item => item.id === id);
    if (q) return { question: q, source: 'imported' };
    const cache = getCachedQuestions();
    if (Array.isArray(cache)) {
      q = cache.find(item => item.id === id);
      if (q) return { question: q, source: 'builtin' };
    }
    return null;
  }
  /** 更新任意来源的题目（按id路由到对应存储，保持id不变），返回是否成功 */
  function updateQuestionAnywhere(q) {
    let list = getCustomQuestions();
    let idx = list.findIndex(item => item.id === q.id);
    if (idx !== -1) { list[idx] = q; return saveCustomQuestions(list); }
    list = getImportedQuestions();
    idx = list.findIndex(item => item.id === q.id);
    if (idx !== -1) { list[idx] = q; return saveImportedQuestions(list); }
    const cache = getCachedQuestions();
    if (Array.isArray(cache)) {
      idx = cache.findIndex(item => item.id === q.id);
      if (idx !== -1) { cache[idx] = q; return cacheQuestions(cache); }
    }
    return false;
  }
  /** 删除任意来源的题目，并清理其答题记录/错题，返回是否成功 */
  function deleteQuestionAnywhere(id) {
    let removed = false;
    const custom = getCustomQuestions();
    if (custom.some(q => q.id === id)) { saveCustomQuestions(custom.filter(q => q.id !== id)); removed = true; }
    const imported = getImportedQuestions();
    if (imported.some(q => q.id === id)) { saveImportedQuestions(imported.filter(q => q.id !== id)); removed = true; }
    const cache = getCachedQuestions();
    if (Array.isArray(cache) && cache.some(q => q.id === id)) { cacheQuestions(cache.filter(q => q.id !== id)); removed = true; }
    if (removed) {
      removeError(id);
      const records = getRecords();
      if (records[id]) { delete records[id]; saveRecords(records); }
    }
    return removed;
  }
  // ===== 练习会话（所有答题入口各自保留，退出/切题/答题时写入） =====
  /** 会话存储结构：{ [槽位]: session }，槽位=入口题池+顺序（如 all-seq / wrong-random / type-single-seq）
   *  session={questionIds,currentIndex,answered,userSelectedKeys,currentFilter,savedAt} */
  function getSessionStore() {
    const val = safeParse(localStorage.getItem(KEYS.session), {});
    return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {};
  }
  function saveSession(slot, session) {
    const store = getSessionStore();
    store[slot] = session;
    try {
      localStorage.setItem(KEYS.session, JSON.stringify(store));
    } catch(e) { console.warn('保存练习会话失败:', e.message); }
  }
  function getSession(slot) {
    const s = getSessionStore()[slot];
    return (s && typeof s === 'object' && Array.isArray(s.questionIds)) ? s : null;
  }
  function clearSession(slot) {
    if (!slot) { localStorage.removeItem(KEYS.session); return; }
    const store = getSessionStore();
    if (slot in store) {
      delete store[slot];
      localStorage.setItem(KEYS.session, JSON.stringify(store));
    }
  }
  // ===== 数据导出/导入 =====
  function exportAll() {
    const data = {
      version: 1,
      exportTime: new Date().toISOString(),
      config: getConfig(),
      records: getRecords(),
      archive: getArchiveRecords(),
      errors: getErrors(),
      timer: getTimer()
    };
    return JSON.stringify(data);
  }
  function importAll(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (!data || typeof data !== 'object') throw new Error('无效的数据格式');
      if (data.version !== 1) throw new Error('数据版本不兼容');
      // 校验必需字段
      const required = ['config', 'records', 'errors', 'timer'];
      for (const key of required) {
        if (!(key in data)) throw new Error(`缺少字段: ${key}`);
      }
      if (typeof data.config !== 'object') throw new Error('config不是对象');
      if (typeof data.records !== 'object') throw new Error('records不是对象');
      if (!Array.isArray(data.errors)) throw new Error('errors不是数组');
      if (typeof data.timer !== 'object') throw new Error('timer不是对象');
      // 写入
      saveConfig(data.config);
      saveRecords(data.records);
      if (data.archive) savArchiveRecords(data.archive);
      saveErrors(data.errors);
      saveTimer(data.timer);
      return true;
    } catch(e) {
      console.error('导入失败:', e.message);
      return false;
    }
  }
  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
  /** 清空全部题库：内置缓存题库 + PDF导入题库 + 自定义题库 + 相关答题记录/错题，一题不留
   *  注意：cache写入空数组而非删除key，防止getQuestions从question.js内置题库自动回填 */
  function clearAllQuestions() {
    [KEYS.imported, KEYS.custom, KEYS.records, KEYS.recordsArchive, KEYS.errors, KEYS.timer, KEYS.session].forEach(k => localStorage.removeItem(k));
    localStorage.setItem(KEYS.cache, '[]');
  }
  // ===== 公共API =====
  return {
    KEYS,
    DEFAULT_CONFIG,
    getConfig, saveConfig, updateConfig, resetConfig,
    getRecords, saveRecords, addRecord, getArchiveRecords,
    getErrors, addError, removeError, clearErrors, batchRemoveErrors,
    getTimer, saveTimer, addTime,
    getCachedQuestions, cacheQuestions, clearCache, normalizeQuestionTypes,
    getImportedQuestions, saveImportedQuestions, appendImportedQuestions, clearImportedQuestions, clearAllQuestions,
    getCustomQuestions, saveCustomQuestions, addCustomQuestion, updateCustomQuestion, deleteCustomQuestion, clearCustomQuestions,
    findQuestionAnywhere, updateQuestionAnywhere, deleteQuestionAnywhere,
    saveSession, getSession, clearSession,
    exportAll, importAll, resetAll
  };
})();