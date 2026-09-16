/**
 * pdf-import.js - PDF题库导入模块
 * 功能：选择PDF → pdf.js提取文字 → 解析题目 → 预览确认 → 写入localStorage导入题库
 * 依赖：js/lib/pdf.min.js（本地pdf.js）、storage.js、common.js
 *
 * 支持的PDF题目格式（题号、选项、答案、解析均为常见写法）：
 *   1. 题干内容……（ ）
 *      A. 选项一  B. 选项二   （选项可同行或分行，分隔符支持 . 、 ： ）
 *      答案：B
 *      解析：说明文字（可选）
 *
 *   2. 判断题：题干……（ ）  答案：正确/错误/对/错/√/×/T/F
 *      （选项只有"对/错"两样的题自动归类为判断题，A=对 B=错）
 *   3. 计算题：题干……      答案：任意文字（无选项时自动识别为计算题）
 *   4. 内嵌答案：题干（ B ）括号中直接写答案，可省略"答案："行
 *   5. 章节自动识别：单独一行"第X章 xxx"会作为其后题目的章节
 */
const PdfImport = (() => {
  // ==================== 文本解析（纯函数，可单独测试） ====================

  /** 全角数字转半角，统一换行符 */
  function normalizeText(raw) {
    return raw
      .replace(/\r\n?/g, '\n')
      .replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 65248));
  }

  /**
   * 解析PDF提取的纯文本为题目数组
   * @param {string} rawText PDF全文
   * @param {string} defaultChapter 默认章节名
   * @returns {{questions: Array, skipped: Array}} questions为合法题目，skipped为无法识别的块（含原因）
   */
  function parseQuestionText(rawText, defaultChapter) {
    const text = normalizeText(rawText || '');
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 各类行匹配正则
    const chapterRe = /^(第[0-9一二三四五六七八九十百千]+[章节卷部][^\n]{0,20}|[Cc]hapter\s*\d+[^\n]{0,30}|[Uu]nit\s*\d+[^\n]{0,30})[:：]?\s*$/;
    // 段落标题："一、判断题。…" / "二、单项选择题（共20分）"等，题号会重新从1开始
    const sectionRe = /^[一二三四五六七八九十百]+[、.．]\s*\S{0,14}题(?:[^\n]*)?$/;
    const qStartRe = /^(\d{1,3})\s*([.、．,，)）:：])\s*(.*)$/;
    const answerRe = /^【?\s*(?:正确答案|参考答案|答案解析|答案|答)\s*】?\s*[：:．.]?\s*(.+)$/;
    const explanationRe = /^【?\s*(?:解析|解释|解答)\s*】?\s*[：:．.]?\s*(.*)$/;

    // ===== 第一步：按行切分为题目块 =====
    const blocks = [];
    let current = null;
    let currentChapter = defaultChapter || 'PDF导入';
    let lastQNo = 0; // 已出现的题号，用于排除非题号数字

    for (const line of lines) {
      let m;
      if ((m = line.match(chapterRe))) {
        currentChapter = m[1].replace(/[:：]\s*$/, '');
        lastQNo = 0; // 新章节题号可能重新从1开始
        continue;
      }
      if (sectionRe.test(line)) {
        // 段落标题（"一、判断题"）：作为章节名并重置题号
        currentChapter = line.replace(/[。：:，,（(].*$/, '').trim().slice(0, 20);
        lastQNo = 0;
        continue;
      }
      if (/^\d{1,3}$/.test(line) && lastQNo > 0) {
        continue; // 裸数字行 = 页码（题目开始后出现的独立数字行），跳过
      }
      if ((m = line.match(qStartRe))) {
        const no = parseInt(m[1], 10);
        const sep = m[2];
        const content = m[3];
        // 行首小数（如"10.5 MHz"被PDF换行拆出）不是题号：点分隔 + 内容以数字开头且后非字母/汉字
        const isDecimal = /[.．]/.test(sep) && /^\d+($|[^A-Za-z\u4e00-\u9fff])/.test(content);
        // 题号必须递增（或等于1重新开始），解析/正文里的编号（如"3. 因为…"）不算新题
        if (isDecimal || (lastQNo > 0 && no <= lastQNo)) {
          if (current) {
            // 已过答案行的编号行属于解析（如解析内分点），否则属于题干正文（如小数换行续接）
            if (current.answer || current.explanation) {
              current.explanation = (current.explanation ? current.explanation + ' ' : '') + line;
            } else {
              current.lines.push(line);
            }
          }
          continue;
        }
        lastQNo = no;
        current = { chapter: currentChapter, lines: [content], answer: null, explanation: '' };
        blocks.push(current);
        continue;
      }
      if (!current) continue; // 题号出现前的杂项行（标题/说明等）直接跳过
      if ((m = line.match(answerRe))) {
        if (!current.answer) {
          current.answer = m[1].trim();
        } else {
          // 块内第二个"答案/答案解析"行 → 并入解析，避免污染题干
          current.explanation = (current.explanation ? current.explanation + ' ' : '') + m[1].trim();
        }
        continue;
      }
      if ((m = line.match(explanationRe))) {
        current.explanation = (current.explanation ? current.explanation + ' ' : '') + m[1].trim();
        continue;
      }
      current.lines.push(line);
    }

    // ===== 第二步：逐块识别选项、判定题型 =====
    const questions = [];
    const skipped = [];

    blocks.forEach((block, idx) => {
      const body = block.lines.join('\n');
      const reason = buildQuestion(block, body, idx + 1, questions);
      if (reason) skipped.push({ no: idx + 1, text: body.slice(0, 60), reason });
    });

    return { questions, skipped };
  }

  /** 选项标记：字母 + 分隔符，前面须是行首/空白/中文等非字母字符 */
  const OPT_MARKER_RE = /(?:^|\n|[\s\u4e00-\u9fff）)】"”])([A-Ha-h])\s*[.、．:：)）]/g;

  /** 从块文本中按A,B,C…顺序提取选项，返回 {stem, options} */
  function extractOptions(body) {
    const markers = [];
    let m;
    OPT_MARKER_RE.lastIndex = 0;
    while ((m = OPT_MARKER_RE.exec(body)) !== null) {
      markers.push({ letter: m[1].toUpperCase(), start: m.index, contentStart: OPT_MARKER_RE.lastIndex });
    }
    // 只保留从A开始严格递增的标记序列，避免误把正文中的字母当选项
    const accepted = [];
    let expected = 'A';
    for (const mk of markers) {
      if (mk.letter === expected) {
        accepted.push(mk);
        expected = String.fromCharCode(expected.charCodeAt(0) + 1);
        if (expected > 'H') break;
      }
    }
    if (accepted.length < 2) return { stem: body, options: [] };
    const stem = body.slice(0, accepted[0].start).trim();
    const options = accepted.map((mk, i) => {
      const end = i + 1 < accepted.length ? accepted[i + 1].start : body.length;
      return {
        key: mk.letter,
        text: body.slice(mk.contentStart, end).replace(/[\n\s]+/g, ' ').trim()
      };
    });
    return { stem, options };
  }

  /** 识别"对/错"二元选项组（两项文字恰为对/错用语）：返回{yesKey,noKey,yesText,noText}，否则null */
  function trueFalsePair(options) {
    if (!Array.isArray(options) || options.length !== 2) return null;
    const texts = options.map(o => (o.text || '').trim());
    const yesIdx = texts.findIndex(t => /^(正确|对|√|是|True)$/i.test(t));
    const noIdx = texts.findIndex(t => /^(错误|错|×|否|False)$/i.test(t));
    if (yesIdx < 0 || noIdx < 0) return null;
    return { yesKey: options[yesIdx].key, noKey: options[noIdx].key, yesText: texts[yesIdx], noText: texts[noIdx] };
  }

  /** 答案归一化：返回 {type, answer} 或 null（无法识别） */
  function normalizeAnswer(ans, options) {
    if (!ans) return null;
    const s0 = ans.trim();
    // 页码粘连：pdf.js提取时页脚数字直接拼在答案后（如"B2"、"ABC16"），字母/分隔符后跟1-3位数字 → 剥离数字
    const s = /^[A-Ha-h][A-Ha-h、，,\s.．]*\d{1,3}$/.test(s0) ? s0.replace(/\d{1,3}$/, '') : s0;
    // 纯字母答案：允许分隔符/包裹符，如 "B"、"B."、"(AB)"、"A、B、D"、"A B D"、"ABCDE"
    const letterListRe = /^[（(【\s]*[A-Ha-h]([、，,\s.．]*[A-Ha-h]){0,7}[）)】\s。．.，,]*$/;
    if (letterListRe.test(s)) {
      const letters = [...new Set(s.toUpperCase().match(/[A-H]/g) || [])].sort();
      if (letters.length >= 2) return { type: 'multi', answer: letters.join('') };
      const L = letters[0];
      // 选项为"对/错"二元组时，字母答案映射为判断题（A=对 B=错）
      const tf = trueFalsePair(options);
      if (tf && (L === tf.yesKey || L === tf.noKey)) {
        return { type: 'judge', answer: L === tf.yesKey ? 'A' : 'B' };
      }
      return { type: 'single', answer: L };
    }
    // 判断题用语
    if (/^(正确|对|√|T|Y|是)$/i.test(s)) return { type: 'judge', answer: 'A' };
    if (/^(错误|错|×|X|F|N|否)$/i.test(s)) return { type: 'judge', answer: 'B' };
    // "答案：D. 以上都对"这类 字母+选项内容 的写法：取首字母（须存在于选项中）
    if (options.length >= 2) {
      const m2 = s.match(/^[（(【\s]*([A-Ha-h])\s*[.、．:：)）]/);
      if (m2 && options.some(o => o.key === m2[1].toUpperCase())) {
        const L2 = m2[1].toUpperCase();
        const tf2 = trueFalsePair(options);
        if (tf2 && (L2 === tf2.yesKey || L2 === tf2.noKey)) {
          return { type: 'judge', answer: L2 === tf2.yesKey ? 'A' : 'B' };
        }
        return { type: 'single', answer: L2 };
      }
    }
    // 其余文本：选项为"对/错"二元组 → 映射判断题；否则视为计算题文本答案
    const tf3 = trueFalsePair(options);
    if (tf3) {
      return s.includes(tf3.yesText) ? { type: 'judge', answer: 'A' } : { type: 'judge', answer: 'B' };
    }
    return { type: 'calc', answer: s.slice(0, 500) };
  }

  /** 将一个块转换为题目对象；失败返回原因字符串 */
  function buildQuestion(block, body, blockNo, questions) {
    // 先提取并中和题干括号内嵌答案（如"（ B ）"→"（ ）"），避免被误认为选项标记截断题干
    let embeddedAnswer = null;
    body = body.replace(/[（(]\s*([A-Ha-h]|√|×|对|错|正确|错误)\s*[)）]/g, (m, g1) => {
      if (!embeddedAnswer) embeddedAnswer = g1;
      return '（ ）';
    });
    const { stem, options } = extractOptions(body);
    let answerInfo = normalizeAnswer(block.answer, options);
    // 无"答案："行时，使用内嵌答案
    if (!answerInfo && embeddedAnswer) answerInfo = normalizeAnswer(embeddedAnswer, options);
    if (!answerInfo) return '未找到答案';
    if (!stem) return '题干为空';

    let type = answerInfo.type;
    // 有选项且答案是字母 → 单选/多选；无选项且答案是判断用语 → 判断；其余 → 按归一化结果
    if (options.length >= 2 && answerInfo.type === 'single') type = 'single';
    if (options.length >= 2 && answerInfo.type === 'multi') type = 'multi';
    if (options.length === 0 && answerInfo.type === 'judge') type = 'judge';
    if (options.length === 0 && answerInfo.type === 'calc') type = 'calc';
    if (options.length >= 2 && (answerInfo.type === 'judge' || answerInfo.type === 'calc')) {
      // 有选项但答案不是字母（如"答案：正确"）：选项恰为"对/错"二元组 → 判断题，其余保留为单选
      type = (options.length === 2 && trueFalsePair(options)) ? 'judge' : 'single';
    }
    if (options.length < 2 && answerInfo.type === 'multi') {
      // 多选答案但选项不足 → 视为无效题
      return '多选题选项不足';
    }
    if (options.length === 0 && answerInfo.type === 'single') {
      // 无选项但答案是单个字母：题干含括号时视为判断题（A=对 B=错），否则视为无效题
      if (/^[AB]$/.test(answerInfo.answer) && /[（(]/.test(stem)) {
        type = 'judge';
      } else {
        return '单选题缺少选项';
      }
    }
    // 字母答案必须存在于选项中（选项提取不全时暴露问题，而不是产出答案错误的题）
    if ((type === 'single' || type === 'multi') && options.length >= 2) {
      const keys = new Set(options.map(o => o.key));
      const letters = type === 'multi' ? answerInfo.answer.split('') : [answerInfo.answer];
      if (!letters.every(l => keys.has(l))) return '答案字母超出选项范围（选项可能未完整识别）';
    }

    questions.push({
      type,
      chapter: block.chapter,
      question: stem.replace(/[\n\s]+/g, ' ').trim(),
      options: type === 'judge' ? [] : options,
      answer: answerInfo.answer,
      explanation: (block.explanation || '').trim(),
      image: ''
    });
    return null;
  }

  // ==================== PDF文字提取 ====================

  /** 读取PDF文件并提取全部文字（依赖本地pdf.js） */
  async function extractTextFromFile(file, onProgress) {
    if (typeof pdfjsLib === 'undefined') throw new Error('pdf.js库未加载');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/lib/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      for (const item of content.items) {
        text += item.str;
        if (item.hasEOL) text += '\n';
      }
      text += '\n';
      if (onProgress) onProgress(i, pdf.numPages);
    }
    return text;
  }

  // ==================== 页面交互（setting.html调用） ====================

  let parsed = null; // 最近一次解析结果缓存

  /** 文件选择入口 */
  async function handleFileSelect(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) {
      App.showToast('请选择PDF文件', 'error');
      input.value = '';
      return;
    }
    const statusEl = document.getElementById('pdfImportStatus');
    const chapter = (document.getElementById('pdfChapterInput') || {}).value || 'PDF导入';
    try {
      statusEl.textContent = '⏳ 正在读取PDF：' + file.name;
      const text = await extractTextFromFile(file, (i, n) => {
        statusEl.textContent = `⏳ 正在提取文字（第${i}/${n}页）…`;
      });
      if (text.replace(/\s/g, '').length < 10) {
        statusEl.textContent = '';
        App.showToast('未提取到文字，可能是扫描版（图片型）PDF，暂不支持', 'error');
        input.value = '';
        return;
      }
      parsed = parseQuestionText(text, chapter);
      console.log('[PDF导入] 解析完成：识别', parsed.questions.length, '题，跳过', parsed.skipped.length, '块');
      statusEl.textContent = '';
      input.value = '';
      if (parsed.questions.length === 0) {
        App.showToast('未识别到题目，请检查PDF格式是否匹配', 'error');
        return;
      }
      showPreviewModal();
    } catch (e) {
      statusEl.textContent = '';
      input.value = '';
      console.error('[PDF导入] 处理失败:', e, e.stack);
      App.showToast('PDF解析失败：' + e.message, 'error');
    }
  }

  /** 预览弹窗 */
  function showPreviewModal() {
    const typeLabels = { single: '单选', multi: '多选', judge: '判断', calc: '计算' };
    const counts = { single: 0, multi: 0, judge: 0, calc: 0 };
    parsed.questions.forEach(q => counts[q.type]++);
    const listHtml = parsed.questions.slice(0, 50).map((q, i) => `
      <div style="padding:8px 0;border-bottom:1px solid var(--border,#ddd);font-size:0.85em;">
        <span class="badge badge-${q.type}">${typeLabels[q.type] || q.type}</span>
        <span style="margin-left:6px;">${i + 1}. ${escapeHtml(q.question.slice(0, 50))}${q.question.length > 50 ? '…' : ''}</span>
        <span style="color:var(--success,#2e7d32);margin-left:8px;">答案: ${escapeHtml(String(q.answer).slice(0, 20))}</span>
      </div>`).join('');
    const moreHint = parsed.questions.length > 50
      ? `<p style="color:var(--text-secondary,#888);font-size:0.8em;">仅预览前50题，共${parsed.questions.length}题</p>` : '';
    const skippedHint = parsed.skipped.length > 0
      ? `<p style="color:var(--warning,#ed6c02);font-size:0.8em;">⚠️ 有 ${parsed.skipped.length} 个内容块未识别为题目（如缺少答案或格式不符），已跳过</p>
         <details style="font-size:0.78em;margin-bottom:10px;">
           <summary style="cursor:pointer;color:var(--warning,#ed6c02);">🔍 查看未识别内容明细（第几个内容块·失败原因）</summary>
           <div style="max-height:180px;overflow-y:auto;border:1px solid var(--border,#ddd);border-radius:8px;padding:2px 12px;margin-top:6px;">
             ${parsed.skipped.map(s => `<div style="padding:6px 0;border-bottom:1px dashed var(--border,#ddd);">
               <div><span style="color:var(--danger,#c00);font-weight:600;">第${s.no}块</span> <span style="color:var(--warning,#ed6c02);">· ${escapeHtml(s.reason || '格式不符')}</span></div>
               <div style="color:var(--text-secondary,#888);word-break:break-all;">${escapeHtml(s.text)}${(s.text || '').length >= 60 ? '…' : ''}</div>
             </div>`).join('')}
           </div>
         </details>` : '';

    document.getElementById('pdfPreviewBody').innerHTML = `
      <p>共识别 <b>${parsed.questions.length}</b> 题：单选 ${counts.single} · 多选 ${counts.multi} · 判断 ${counts.judge} · 计算 ${counts.calc}</p>
      ${skippedHint}
      <div style="max-height:300px;overflow-y:auto;border:1px solid var(--border,#ddd);border-radius:8px;padding:0 12px;">${listHtml}</div>
      ${moreHint}`;
    document.getElementById('pdfPreviewModal').classList.add('active');
  }

  /** 确认导入：分配ID（基于现有最大ID递增）并去重追加 */
  function confirmImport() {
    if (!parsed || parsed.questions.length === 0) return;
    // 分配不冲突的ID
    const all = App.getQuestions();
    let maxId = all.reduce((mx, q) => Math.max(mx, q.id || 0), 0);
    parsed.questions.forEach(q => { q.id = ++maxId; });
    const added = Storage.appendImportedQuestions(parsed.questions);
    document.getElementById('pdfPreviewModal').classList.remove('active');
    if (added > 0) {
      App.showToast(`✅ 成功导入 ${added} 题（重复 ${parsed.questions.length - added} 题已跳过）`, 'success');
    } else {
      App.showToast('所有题目均与现有题库重复，未导入', 'error');
    }
    parsed = null;
    refreshImportedCount();
  }

  /** 刷新设置页"已导入题数"显示 */
  function refreshImportedCount() {
    const el = document.getElementById('pdfImportedCount');
    if (el) el.textContent = Storage.getImportedQuestions().length;
  }

  /** 清空全部题库（内置+导入，一题不留，含确认） */
  function clearImported() {
    App.showModal('🗑️ 清空全部题库', '将删除全部题目（内置题库 + PDF导入题库）及关联的答题记录、错题本数据，清空后题量为 0。此操作不可恢复，确定吗？', () => {
      Storage.clearAllQuestions();
      App.showToast('✅ 已清空全部题库', 'success');
      refreshImportedCount();
    }, '确认清空', true);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ===== 公共API =====
  return {
    parseQuestionText,          // 纯解析函数（测试用）
    extractTextFromFile,
    handleFileSelect,
    confirmImport,
    clearImported,
    refreshImportedCount
  };
})();
