// 测试 pdf-import.js 的纯解析函数 parseQuestionText
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'js', 'pdf-import.js'), 'utf8');
// 模块加载期不依赖浏览器API，用vm在全局执行并导出PdfImport
require('vm').runInThisContext(src + '\n;globalThis.PdfImport = PdfImport;');

const sample = `
通信原理期末复习题库

第1章 绪论

1. 从信号频谱的特点来考虑，周期信号的频谱是（ ）。
A. 周期的
B. 连续的
C. 离散的
D. 发散的
答案：C
解析：周期信号频谱为离散谱。

2. 消息中所含信息量的多少与消息的种类无关（ ）。
答案：错误

3. 已知某信源产生A、B、C、D四种符号，等概出现，求该信源的熵。
答案：H=2 bit/符号

4. 高斯白噪声是指噪声功率谱密度服从高斯分布的噪声（ B ）。

第2章 随机过程

5. 下列属于广义平稳过程的是（ ）
A. 数学期望与时间无关 B. 自相关函数只与时间间隔有关
C. 方差为常数 D. 以上全部
答案：D

6. 窄带高斯噪声的同相分量与正交分量统计独立（ ）
答案：对

7. 下列哪些属于模拟调制方式？（ ）
A. AM
B. FM
C. PCM
D. DSB
答案：ABD
解析：PCM是数字调制方式

8. 这道题没有答案，应该被跳过。
A. 选项1
B. 选项2

9. 香农公式中信道容量的单位是（ ）。
A. bit/s
B. Baud
C. Hz
D. W
正确答案：A

第3章 修复回归

10. 载波频率为
10.5 MHz的信号属于（ ）。
A. 低频信号
B. 高频信号
答案：B
解析：注意上一行的"10.5 MHz"不应被当成第10题的题号。这里补充说明：
3. 因为编号小于当前题号，此行是解析内容而非新题。

11. 眼图可以用来观察（ ）。
A. 码间串扰
B. 噪声影响
C. 以上都对
D. 以上都不对
答案：A、C
解析：多选答案带顿号分隔符

12. 该说法正确吗？判断题的选项是正确/错误（ ）
A. 正确
B. 错误
答案：A

13. 多选答案带空格（ ）
A. 选项一
B. 选项二
C. 选项三
D. 选项四
答案：A C D

14. 答案字母超出选项范围（ ）
A. 选项一
B. 选项二
C. 选项三
答案：D

15. 答案带选项内容的写法（ ）
A. 选项一
B. 选项二
C. 选项三
D. 以上都对
答案：D. 以上都对

16. 对错选项配字母答案（ ）
A. 对
B. 错
答案：B

17. 对错选项配选项内容答案（ ）
A. 正确
B. 错误
答案：B. 错误

18. 对错选项答案字母越界（ ）
A. 对
B. 错
答案：C

四、多选题。每题有多个正确的答案。

1、五个字母的多选答案（ ）
A、选项一
B、选项二
C、选项三
D、选项四
E、选项五
正确答案：ABCDE
2
2、页码后的多选题（ ）
A、选项甲
B、选项乙
C、选项丙
D、选项丁
E、选项戊
正确答案：B、C、E
3、页码粘连答案的多选题（ ）
A、选项子
B、选项丑
C、选项寅
D、选项卯
正确答案：BC3
`;

const { questions, skipped } = PdfImport.parseQuestionText(sample, 'PDF测试');
console.log('=== 解析结果 ===');
questions.forEach((q, i) => {
  console.log(`[${i + 1}] type=${q.type} chapter=${q.chapter} answer=${q.answer}`);
  console.log(`    题干: ${q.question.slice(0, 40)}`);
  if (q.options.length) console.log(`    选项: ${q.options.map(o => o.key + '.' + o.text).join(' | ')}`);
  if (q.explanation) console.log(`    解析: ${q.explanation.slice(0, 50)}`);
});
console.log('=== 跳过块 ===');
skipped.forEach(s => console.log(`#${s.no} [${s.reason}] ${s.text}`));
console.log(`\n共解析 ${questions.length} 题，跳过 ${skipped.length} 块`);

// 断言
const assert = require('assert');
assert.strictEqual(questions.length, 18, '应解析出18题（含段落重启的3道多选；第8/14/18题被跳过）');
assert.strictEqual(questions[0].type, 'single');
assert.strictEqual(questions[0].answer, 'C');
assert.strictEqual(questions[0].options.length, 4);
assert.strictEqual(questions[0].explanation.includes('离散谱'), true);
assert.strictEqual(questions[0].chapter, '第1章 绪论');
assert.strictEqual(questions[1].type, 'judge');
assert.strictEqual(questions[1].answer, 'B'); // 错误 → B
assert.strictEqual(questions[2].type, 'calc');
assert.strictEqual(questions[3].answer, 'B'); // 内嵌答案（ B ）→ 无选项+括号 → 判断题
assert.strictEqual(questions[3].type, 'judge');
assert.strictEqual(questions[4].options.length, 4); // 同行选项
assert.strictEqual(questions[4].answer, 'D');
assert.strictEqual(questions[5].answer, 'A'); // "对" → A
assert.strictEqual(questions[5].chapter, '第2章 随机过程');
assert.strictEqual(questions[6].type, 'multi'); // "答案：ABD" → 多选
assert.strictEqual(questions[6].answer, 'ABD');
assert.strictEqual(questions[6].options.length, 4);
assert.strictEqual(questions[6].explanation.includes('PCM'), true);
assert.strictEqual(questions[7].answer, 'A'); // "正确答案：A"
// 第9题（index 8）：小数"10.5 MHz"并入了题干而非生成幻影题块
assert.strictEqual(questions[8].type, 'single');
assert.strictEqual(questions[8].answer, 'B');
assert.ok(questions[8].question.includes('10.5 MHz'), '小数应保留在题干中');
assert.strictEqual(questions[8].options.length, 2);
assert.strictEqual(questions[8].options[1].text, '高频信号', '选项B不应混入解析编号行');
// 解析中的"3. 因为…"编号行不应生成新题块，且并入解析
assert.ok(questions[8].explanation.includes('因为编号小于当前题号'), '解析编号行应并入解析');
// 第11题（index 9）：多选答案带顿号 "A、C"
assert.strictEqual(questions[9].type, 'multi');
assert.strictEqual(questions[9].answer, 'AC');
// 第12题（index 10）：选项为正确/错误、答案字母A → 自动归类为判断题（A=对）
assert.strictEqual(questions[10].type, 'judge');
assert.strictEqual(questions[10].answer, 'A');
assert.strictEqual(questions[10].options.length, 0); // 判断题不保留选项
// 第13题（index 11）：多选答案带空格 "A C D"
assert.strictEqual(questions[11].type, 'multi');
assert.strictEqual(questions[11].answer, 'ACD');
// 第15题（index 12）："答案：D. 以上都对" → 取首字母D
assert.strictEqual(questions[12].type, 'single');
assert.strictEqual(questions[12].answer, 'D');
// 第16题（index 13）：对/错选项配字母答案B → 自动归类为判断题
assert.strictEqual(questions[13].type, 'judge');
assert.strictEqual(questions[13].answer, 'B');
assert.strictEqual(questions[13].options.length, 0);
assert.strictEqual(questions[13].chapter, '第3章 修复回归');
// 第17题（index 14）："答案：B. 错误"（字母+选项内容）→ 判断题B
assert.strictEqual(questions[14].type, 'judge');
assert.strictEqual(questions[14].answer, 'B');
assert.strictEqual(questions[14].options.length, 0);
// 段落标题"四、多选题"后题号重置，章节名为段落标题
assert.strictEqual(questions[15].chapter, '四、多选题');
assert.strictEqual(questions[15].type, 'multi');   // 5字母答案 ABCDE
assert.strictEqual(questions[15].answer, 'ABCDE');
assert.strictEqual(questions[15].options.length, 5);
// 页码行"2"被过滤，其后题目正常解析
assert.strictEqual(questions[16].type, 'multi');   // "B、C、E" → BCE
assert.strictEqual(questions[16].answer, 'BCE');
assert.strictEqual(questions[16].options.length, 5);
assert.strictEqual(questions[16].chapter, '四、多选题');
// 页码粘连答案 "正确答案：BC3" → 剥离页码3 → 多选BC
assert.strictEqual(questions[17].type, 'multi');
assert.strictEqual(questions[17].answer, 'BC');
assert.strictEqual(questions[17].options.length, 4);
// 跳过：第8题无答案、第14/18题答案字母超出选项范围
assert.strictEqual(skipped.length, 3);
assert.strictEqual(skipped[0].reason, '未找到答案');
assert.strictEqual(skipped[1].reason, '答案字母超出选项范围（选项可能未完整识别）');
assert.strictEqual(skipped[2].reason, '答案字母超出选项范围（选项可能未完整识别）');

// ==================== 表格式题库（坐标重建）解析测试 ====================
console.log('\n=== 表格式题库（坐标重建）解析测试 ===');
// 模拟Excel/WPS表格导出的PDF：每格为独立文字项（含x/y/w坐标），
// 几何关系仿照真实表格式题库（题干/选项在单元格内换行、题型词垂直居中）
const it = (str, x, y, w) => ({ str, x, y, w });
const tablePages = [{
  items: [
    // 表头
    it('题型', 58, 566, 23), it('题目', 216, 566, 23), it('选项 A', 400, 566, 35),
    it('选项 B', 488, 566, 35), it('选项 C', 557, 566, 35), it('答案', 692, 566, 23),
    // 行1：单选题，题干两行、选项B跨两行
    it('欧姆定律描述的是导体中', 94, 549, 126),
    it('单选题', 54, 542, 32), it('电流与电压成正比', 400, 542, 80),
    it('与电流成反', 488, 542, 58), it('适用于线性电路', 557, 542, 80), it('C', 700, 542, 6),
    it('电流与电压的关系？', 94, 535, 110), it('比的关系', 488, 535, 58),
    // 行2：判断题（选项列为正确/错误）
    it('判断题', 54, 520, 32), it('同轴电缆适合传输高频信号。', 94, 520, 149),
    it('正确', 406, 520, 21), it('错误', 494, 520, 21), it('正确', 692, 520, 21),
    // 行3：多选题
    it('多选题', 54, 498, 32), it('下列属于无源器件的是？', 94, 498, 126),
    it('电阻器', 400, 498, 35), it('电容器', 488, 498, 35), it('电感器', 557, 498, 35),
    it('ABC', 700, 498, 18),
    // 行4：填空题（选项列全空，答案为文本）
    it('填空题', 54, 476, 32), it('1度电等于____焦耳。', 94, 476, 110),
    it('3.6×10^6J', 692, 476, 48),
    // 行5：答案列为空 → 应跳过
    it('单选题', 54, 454, 32), it('这道题的答案列是空的？', 94, 454, 126),
    it('选项甲', 400, 454, 35), it('选项乙', 488, 454, 35), it('选项丙', 557, 454, 35)
  ]
}];
const t = PdfImport.parseTablePages(tablePages, '表格测试');
t.questions.forEach((q, i) => {
  console.log(`[${i + 1}] type=${q.type} answer=${q.answer} :: ${q.question}`);
  if (q.options.length) console.log(`    选项: ${q.options.map(o => o.key + '.' + o.text).join(' | ')}`);
});
t.skipped.forEach(s => console.log(`#${s.no} [${s.reason}] ${s.text}`));
console.log(`共解析 ${t.questions.length} 题，跳过 ${t.skipped.length} 行`);

assert.strictEqual(t.questions.length, 4, '表格应解析出4题');
assert.strictEqual(t.skipped.length, 1, '空答案行应跳过');
// 行1：跨行带的题干与选项B重组
assert.strictEqual(t.questions[0].type, 'single');
assert.strictEqual(t.questions[0].answer, 'C');
assert.strictEqual(t.questions[0].question, '欧姆定律描述的是导体中电流与电压的关系？');
assert.strictEqual(t.questions[0].options.length, 3);
assert.strictEqual(t.questions[0].options[1].text, '与电流成反比的关系', '选项B两行应拼为一个单元格');
// 行2：判断题，答案"正确"→A，不保留选项
assert.strictEqual(t.questions[1].type, 'judge');
assert.strictEqual(t.questions[1].answer, 'A');
assert.strictEqual(t.questions[1].options.length, 0);
// 行3：多选答案ABC
assert.strictEqual(t.questions[2].type, 'multi');
assert.strictEqual(t.questions[2].answer, 'ABC');
assert.strictEqual(t.questions[2].options.length, 3);
// 行4：填空题按calc处理，答案为单元格文本
assert.strictEqual(t.questions[3].type, 'calc');
assert.strictEqual(t.questions[3].answer, '3.6×10^6J');
assert.strictEqual(t.questions[3].options.length, 0);
// 空答案行跳过原因
assert.strictEqual(t.skipped[0].reason, '未找到答案');
// 非表格式输入返回null（走普通文档式解析路径）
assert.strictEqual(PdfImport.parseTablePages([{ items: [it('1. 普通文档式题干', 50, 50, 90)] }], 'x'), null);

console.log('\n✅ 全部断言通过');
