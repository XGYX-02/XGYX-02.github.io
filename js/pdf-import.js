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
 *   6. 表格式题库（Excel/WPS表格导出的PDF）：表头为"题型|题目|选项A…|答案"列，
 *      按pdf.js提取的文字坐标重建表格行列后解析，选项/答案均在各自单元格内
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

  // ==================== 表格式题库识别 ====================
  // 支持Excel/WPS表格导出的PDF题库：表头为"题型/题目/选项A…/答案"等列。
  // pdf.js会把每个单元格提取为独立文字块（带x/y坐标），先按坐标重建表格行列，
  // 再逐行解析为题目。列边界由"内容区间合并→贪心映射到表头列"自动推断，
  // 每行的"题型"词作为行锚点（单元格内换行的题干/选项按最近的锚点归并）。

  /** 题型列常见取值（整词匹配，用于定位表格行） */
  const TYPE_WORD_RE = /^(题型|类型|单选题|单项选择题|多选题|多项选择题|不定项选择题?|不定项|判断题|填空题|简答题|计算题|问答题|分析题|案例分析题|选择题)$/;
  /** 全角/中文字符（拼接单元格文字时判断是否需要补空格） */
  const WIDE_CHAR_RE = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;

  /** 同一水平线（y差<2）的文字项聚成行带；带内按x升序，带间自上而下 */
  function buildBands(items) {
    const bands = [];
    for (const it of items) {
      if (!it.str || !it.str.trim()) continue;
      let band = bands.find(b => Math.abs(b.y - it.y) < 2);
      if (!band) { band = { y: it.y, items: [] }; bands.push(band); }
      band.items.push(it);
    }
    bands.forEach(b => b.items.sort((a, c) => a.x - c.x));
    bands.sort((a, b) => b.y - a.y);
    return bands;
  }

  /**
   * 识别表头行带：至少3列，且同时含"题型"列、"题目/题干"列和"答案"列
   * @returns {{roles: string[], centers: number[], xs: number[]}|null} 每列角色：type/stem/option/answer/extra
   */
  function detectTableHeader(band) {
    if (band.items.length < 3) return null;
    const roles = [];
    let hasType = false, hasStem = false, hasAnswer = false;
    for (const it of band.items) {
      const t = it.str.trim();
      if (/^(题型|类型|题目类型)$/.test(t)) { roles.push('type'); hasType = true; }
      else if (/^(题目|题干|问题)$/.test(t)) { roles.push('stem'); hasStem = true; }
      else if (/^(答案|正确答案|参考答案|标准答案)$/.test(t)) { roles.push('answer'); hasAnswer = true; }
      else if (/^(解析|答案解析|解答|解释|说明)$/.test(t)) roles.push('extra');
      else if (/^(选项\s*)?[A-Ha-h]$/.test(t)) roles.push('option');
      else roles.push('extra');
    }
    if (!hasType || !hasStem || !hasAnswer) return null;
    // 选项列必须位于题目列与答案列之间，其余未知列（序号/分值等）忽略
    const stemIdx = roles.indexOf('stem');
    const ansIdx = roles.indexOf('answer');
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] === 'option' && (i < stemIdx || i > ansIdx)) roles[i] = 'extra';
    }
    return {
      roles,
      centers: band.items.map(it => it.x + (it.w || 0) / 2),
      xs: band.items.map(it => it.x)
    };
  }

  /**
   * 把一页所有文字项的[x, x+w]区间按空隙合并成"覆盖段"（近似各列内容范围）。
   * 空隙阈值自适应：列间留白明显大于列内间隙时取两者中点，否则默认4
   */
  function mergeCoverRuns(items) {
    const ivs = items.filter(it => it.str && it.str.trim())
      .map(it => [it.x, it.x + (it.w || 0)])
      .sort((a, b) => a[0] - b[0]);
    if (!ivs.length) return [];
    const gaps = [];
    for (let i = 1; i < ivs.length; i++) {
      const g = ivs[i][0] - ivs[i - 1][1];
      if (g > 0.01) gaps.push(g);
    }
    let tol = 4;
    if (gaps.length >= 2) {
      const uniq = [...new Set(gaps)].sort((a, b) => a - b);
      // 自小到大找第一个"显著跳变"作为列内间隙与列间留白的分界。
      // 注意：两端对齐的表格里列内间隙常为0，此时间隙列表只含列间留白，
      // 跳变点会落在列间留白内部（算出偏大的tol），因此上限压到5：
      // 列内间隙>5只是无害的"列内分裂"（仍映射回同列），而列间留白通常>5。
      for (let i = 0; i + 1 < uniq.length; i++) {
        const jump = uniq[i + 1] - uniq[i];
        const ratio = uniq[i + 1] / uniq[i];
        if (jump >= 2 && ratio >= 1.5) { tol = Math.min((uniq[i] + uniq[i + 1]) / 2, 5); break; }
      }
    }
    const runs = [];
    for (const [s, e] of ivs) {
      const last = runs[runs.length - 1];
      if (last && s - last[1] <= tol) last[1] = Math.max(last[1], e);
      else runs.push([s, e]);
    }
    return runs;
  }

  /** 单元格内多段文字拼接：中文相连不加空格，两侧均为西文/数字时补空格 */
  function joinCellText(parts) {
    let s = '';
    for (const p of parts) {
      const t = String(p).trim();
      if (!t) continue;
      if (!s) { s = t; continue; }
      if (!WIDE_CHAR_RE.test(s[s.length - 1]) && !WIDE_CHAR_RE.test(t[0])) s += ' ';
      s += t;
    }
    return s.trim();
  }

  /** 把一行（若干行带）按列边界组装为题目；失败记入skipped */
  function buildTableQuestion(parts, roles, edges, chapter, no, questions, skipped) {
    const n = roles.length;
    const cells = Array.from({ length: n }, () => []);
    for (const band of parts) {
      for (const it of band.items) {
        let k = 0;
        for (let j = 0; j < n; j++) if (edges[j] <= it.x + 2) k = j;
        cells[k].push(it.str);
      }
    }
    const cell = k => (k >= 0 ? joinCellText(cells[k]) : '');
    const typeText = cell(roles.indexOf('type'));
    const stem = cell(roles.indexOf('stem'));
    const answerText = cell(roles.lastIndexOf('answer'));
    const explanation = roles.map((r, k) => (r === 'extra' ? cell(k) : '')).filter(Boolean).join(' ').trim();
    const options = [];
    roles.forEach((r, k) => {
      if (r === 'option') {
        const t = cell(k);
        if (t) options.push({ key: String.fromCharCode(65 + options.length), text: t });
      }
    });
    const fail = reason => skipped.push({ no, text: (stem || typeText).slice(0, 60), reason });

    if (!stem) return fail('题干为空');
    const ansInfo = normalizeAnswer(answerText, options);
    let type = null, answer = null;
    if (/判断/.test(typeText)) {
      type = 'judge';
      if (ansInfo && ansInfo.type === 'judge') answer = ansInfo.answer;
      else if (ansInfo && ansInfo.type === 'single' && /^[AB]$/.test(ansInfo.answer)) answer = ansInfo.answer;
      else if (/正确|对|√|是/.test(answerText)) answer = 'A';
      else if (/错误|错|×|否/.test(answerText)) answer = 'B';
      if (!answer) return fail('判断题答案无法识别');
    } else if (/选|不定/.test(typeText)) {
      if (!ansInfo) return fail('未找到答案');
      if (ansInfo.type === 'single' || ansInfo.type === 'multi') {
        type = ansInfo.type;
        answer = ansInfo.answer;
        const keys = new Set(options.map(o => o.key));
        const letters = type === 'multi' ? answer.split('') : [answer];
        if (options.length < 2 || !letters.every(l => keys.has(l))) return fail('答案字母超出选项范围（选项可能未完整识别）');
      } else if (ansInfo.type === 'judge') {
        type = 'judge';
        answer = ansInfo.answer;
      } else {
        return fail('答案无法识别');
      }
    } else {
      // 填空/简答/计算等题型：答案为单元格文本
      if (!answerText) return fail('未找到答案');
      type = 'calc';
      answer = answerText.slice(0, 500);
    }
    questions.push({
      type,
      chapter,
      question: stem,
      options: type === 'judge' ? [] : options,
      answer,
      explanation,
      image: ''
    });
  }

  /**
   * 解析"表格式"题库PDF（每页一张表格，表头：题型|题目|选项…|答案）
   * @param {Array<{items: Array<{str,x,y,w}>}>} pages 每页文字项（含坐标）
   * @param {string} defaultChapter 默认章节名
   * @returns {{questions: Array, skipped: Array}|null} 非表格式PDF返回null
   */
  function parseTablePages(pages, defaultChapter) {
    if (!Array.isArray(pages) || !pages.length) return null;
    const pageBands = pages.map(p => buildBands(p.items || []));
    // 1) 全文寻找表头（任一页命中即认定为表格式题库）
    let header = null;
    for (const bands of pageBands) {
      for (const band of bands) {
        const h = detectTableHeader(band);
        if (h) { header = h; break; }
      }
      if (header) break;
    }
    if (!header) return null;
    const n = header.roles.length;
    const stemCol = header.roles.indexOf('stem');
    // 2) 推断各列内容起始x（跨页取最小）：每页区间合并成覆盖段后贪心映射到表头列
    const starts = new Array(n).fill(null);
    for (const bands of pageBands) {
      const dataItems = [];
      for (const b of bands) if (!detectTableHeader(b)) dataItems.push(...b.items);
      const runs = mergeCoverRuns(dataItems);
      let col = 0;
      for (const run of runs) {
        const rc = (run[0] + run[1]) / 2;
        let best = -1, bestD = Infinity;
        for (let k = col; k < n; k++) {
          const d = Math.abs(header.centers[k] - rc);
          if (d < bestD) { bestD = d; best = k; }
        }
        if (best >= 0) {
          if (starts[best] === null || run[0] < starts[best]) starts[best] = run[0];
          col = best;
        }
      }
    }
    // 空列（如判断题页未用到的选项列）回退为表头锚点x；列起始须严格递增
    const edges = starts.map((s, k) => (s !== null ? s : header.xs[k]));
    for (let k = 1; k < n; k++) {
      if (edges[k] <= edges[k - 1]) edges[k] = header.xs[k] > edges[k - 1] ? header.xs[k] : edges[k - 1] + 1;
    }
    // 3) 逐页按行组装题目：题型词所在行带为行锚点，其余行带归并到最近的锚点
    const questions = [];
    const skipped = [];
    let no = 0;
    for (const bands of pageBands) {
      const dataBands = bands.filter(b => !detectTableHeader(b));
      if (!dataBands.length) continue;
      // 行距 = 相邻行带的最小间距（用于识别孤带：页眉页脚/页码等）
      let lineGap = Infinity;
      for (let i = 1; i < dataBands.length; i++) lineGap = Math.min(lineGap, dataBands[i - 1].y - dataBands[i].y);
      if (!isFinite(lineGap) || lineGap <= 0) lineGap = 10;
      const labelIdx = [];
      dataBands.forEach((b, i) => {
        if (b.items.some(it => TYPE_WORD_RE.test(it.str.trim()) && it.x < edges[stemCol] - 2)) labelIdx.push(i);
      });
      if (!labelIdx.length) continue;
      const labelYs = labelIdx.map(i => dataBands[i].y);
      const rows = labelIdx.map(() => []);
      dataBands.forEach(b => {
        let bestR = 0, bestD = Infinity;
        for (let r = 0; r < labelYs.length; r++) {
          const d = Math.abs(b.y - labelYs[r]);
          if (d < bestD) { bestD = d; bestR = r; }
        }
        if (bestD <= lineGap * 4) rows[bestR].push(b);
      });
      for (const parts of rows) {
        parts.sort((a, b) => b.y - a.y);
        buildTableQuestion(parts, header.roles, edges, defaultChapter || 'PDF导入', ++no, questions, skipped);
      }
    }
    return { questions, skipped };
  }

  // ==================== PDF文字提取 ====================

  /**
   * 读取PDF并提取每页文字及其坐标（依赖本地pdf.js）
   * @returns {{text: string, pages: Array<{items: Array<{str,x,y,w}>}>}}
   *          text为全文纯文本（与坐标解析失败时的回退路径共用），pages供表格式识别
   */
  async function extractPagesFromFile(file, onProgress) {
    if (typeof pdfjsLib === 'undefined') throw new Error('pdf.js库未加载');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/lib/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      for (const item of content.items) {
        text += item.str;
        if (item.hasEOL) text += '\n';
      }
      text += '\n';
      pages.push({
        items: content.items.map(it => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width || 0 }))
      });
      if (onProgress) onProgress(i, pdf.numPages);
    }
    return { text, pages };
  }

  /** 读取PDF文件并提取全部文字（依赖本地pdf.js） */
  async function extractTextFromFile(file, onProgress) {
    return (await extractPagesFromFile(file, onProgress)).text;
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
      const { text, pages } = await extractPagesFromFile(file, (i, n) => {
        statusEl.textContent = `⏳ 正在提取文字（第${i}/${n}页）…`;
      });
      if (text.replace(/\s/g, '').length < 10) {
        statusEl.textContent = '';
        App.showToast('未提取到文字，可能是扫描版（图片型）PDF，暂不支持', 'error');
        input.value = '';
        return;
      }
      // 表格式题库优先（表头含"题型/题目/答案"列）；未命中或无产出时走普通文档式解析
      const tableParsed = parseTablePages(pages, chapter);
      if (tableParsed && tableParsed.questions.length > 0) {
        parsed = tableParsed;
        console.log('[PDF导入] 表格式题库解析完成：识别', parsed.questions.length, '题，跳过', parsed.skipped.length, '行');
      } else {
        parsed = parseQuestionText(text, chapter);
        console.log('[PDF导入] 解析完成：识别', parsed.questions.length, '题，跳过', parsed.skipped.length, '块');
      }
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
    // 设置页"全局设置"概览同步刷新（题库总量等随导入/清空变化）
    if (typeof updateOverview === 'function') updateOverview();
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
    parseTablePages,           // 表格式题库纯解析函数（测试用）
    extractTextFromFile,
    extractPagesFromFile,
    handleFileSelect,
    confirmImport,
    clearImported,
    refreshImportedCount
  };
})();
