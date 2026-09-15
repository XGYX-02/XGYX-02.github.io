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
console.log('\n✅ 全部断言通过');
