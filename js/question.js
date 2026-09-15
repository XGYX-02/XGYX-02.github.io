/**
 * 内置题库 - 唯一静态数据源
 * 题目来源：理论复习卷(电子设备装接工高级)，第二批.pdf（PDF解析导入）
 * 含题型：单选题(single)、多选题(multi)、判断题(judge)、计算题(calc)
 * 首次加载自动缓存至localStorage，优化二次打开速度
 */
const questionList = [
  {
    id: 1,
    type: 'judge',
    chapter: '一、判断题',
    question: 'BGA是目前封装比最接近1的一种元器件封装方式。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 2,
    type: 'judge',
    chapter: '一、判断题',
    question: '电阻、电流和电压都是电路中的基本物理量。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 3,
    type: 'judge',
    chapter: '一、判断题',
    question: '当集成运算放大器的输出达到正电源电压时，其增益最大。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 4,
    type: 'judge',
    chapter: '一、判断题',
    question: '在IE中，“向后”按钮指的是移到上次查看过的Web页（ ）',
    options: [],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 5,
    type: 'judge',
    chapter: '一、判断题',
    question: '电动机的各种故障最终大多引起电流增大，温升过高。',
    options: [],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 6,
    type: 'judge',
    chapter: '一、判断题',
    question: '差动放大电路的差模放大倍数和共模放大倍数相等',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 7,
    type: 'judge',
    chapter: '一、判断题',
    question: '示波器的垂直偏移旋钮可以改变波形的垂直位置，但不改变其幅度。',
    options: [],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 8,
    type: 'judge',
    chapter: '一、判断题',
    question: '引入电压串联负反馈后，电路的电压放大倍数提高了，电路稳定了。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 9,
    type: 'judge',
    chapter: '一、判断题',
    question: '线性电路中的电流、电压和功率计算均可应用叠加定理。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 10,
    type: 'judge',
    chapter: '一、判断题',
    question: '主令电器的主要作用是控制电路的分合。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 11,
    type: 'judge',
    chapter: '一、判断题',
    question: '烙铁温度就是要保证锡丝熔化并与元件连接，所以说，温度设置越高越好。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 12,
    type: 'judge',
    chapter: '一、判断题',
    question: '所有低压熔断器都适用于交流电路。',
    options: [],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 13,
    type: 'judge',
    chapter: '一、判断题',
    question: '在反接制动的控制线路中，必须采用时间为变化参量进行控制。',
    options: [],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 14,
    type: 'judge',
    chapter: '一、判断题',
    question: '一个长方体和圆柱体的组合体，其中长方体在圆柱体的上方，并且它们接触面的一条边是重合 的，那么这个组合体的形状可以被视为一个台体。',
    options: [],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 15,
    type: 'single',
    chapter: '二、单选题',
    question: '对电感意义的叙述，()的说法不正确',
    options: [
      { key: 'A', text: '线圈中的自感电动势为零时，线圈的电感为零' },
      { key: 'B', text: '电感是线圈的固有参数' },
      { key: 'C', text: '电感的大小决定于线圈的几何尺寸和介质的磁导率' },
      { key: 'D', text: '电感反映了线圈产生自感电动势的能力' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 16,
    type: 'single',
    chapter: '二、单选题',
    question: '在机械图纸中，通常用哪种线型来表示轮廓线？',
    options: [
      { key: 'A', text: '实线' },
      { key: 'B', text: '点划线' },
      { key: 'C', text: '虚线' },
      { key: 'D', text: '双点划线' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 17,
    type: 'single',
    chapter: '二、单选题',
    question: 'MSNMessenger是微软公司推出的（）。',
    options: [
      { key: 'A', text: '电子公告板' },
      { key: 'B', text: '媒体播放器' },
      { key: 'C', text: '即时通讯软件' },
      { key: 'D', text: '博客' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 18,
    type: 'single',
    chapter: '二、单选题',
    question: '在Z37型摇臂钻床的电气控制电路中，冷却泵电动机M3的控制方式是什么？',
    options: [
      { key: 'A', text: '正反转控制' },
      { key: 'B', text: '点动控制' },
      { key: 'C', text: '直接启动控制' },
      { key: 'D', text: '星三角启动控制' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 19,
    type: 'single',
    chapter: '二、单选题',
    question: '电烙铁短时间不使用时，应（）。',
    options: [
      { key: 'A', text: '给烙铁头加少量锡' },
      { key: 'B', text: '关闭电烙铁电源' },
      { key: 'C', text: '不用对烙铁进行处理' },
      { key: 'D', text: '随意放置' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 20,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪个符号代表交流电压档？',
    options: [
      { key: 'A', text: 'Ω' },
      { key: 'B', text: 'V' },
      { key: 'C', text: 'A' },
      { key: 'D', text: 'mA' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 21,
    type: 'single',
    chapter: '二、单选题',
    question: '四位移位寄存器，经过()个CP脉冲后，四位数码恰好全部移入寄存器',
    options: [
      { key: 'A', text: '3' },
      { key: 'B', text: '4' },
      { key: 'C', text: '7' },
      { key: 'D', text: '8' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 22,
    type: 'single',
    chapter: '二、单选题',
    question: '强化职业责任是（）职业道德规范的具体要求。',
    options: [
      { key: 'A', text: '团结协作' },
      { key: 'B', text: '诚实守信' },
      { key: 'C', text: '勤劳节俭' },
      { key: 'D', text: '爱岗敬业' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 23,
    type: 'single',
    chapter: '二、单选题',
    question: '要使放大器的输入电阻提高，输出电阻减小，该放大器应选()',
    options: [
      { key: 'A', text: '电流串联负反馈' },
      { key: 'B', text: '电压并联负反馈' },
      { key: 'C', text: '电流并联负反馈' },
      { key: 'D', text: '电压串联负反馈' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 24,
    type: 'single',
    chapter: '二、单选题',
    question: '职业道德修养的主要内容不包括（）。',
    options: [
      { key: 'A', text: '学习职业道德规范' },
      { key: 'B', text: '遵守职业道德准则' },
      { key: 'C', text: '提高职业道德素质' },
      { key: 'D', text: '实践职业道德行为' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 25,
    type: 'single',
    chapter: '二、单选题',
    question: '差分放大器由双端输入变为单端输入，差模电压增益()',
    options: [
      { key: 'A', text: '增加一倍' },
      { key: 'B', text: '为双端输入时的1/2' },
      { key: 'C', text: '不变' },
      { key: 'D', text: '无法确定' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 26,
    type: 'single',
    chapter: '二、单选题',
    question: '哪个符号通常用于表示开关？',
    options: [
      { key: 'A', text: 'L' },
      { key: 'B', text: 'S' },
      { key: 'C', text: 'C' },
      { key: 'D', text: 'R' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 27,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪一种低压电器不属于低压开关？',
    options: [
      { key: 'A', text: '刀开关' },
      { key: 'B', text: '交流接触器' },
      { key: 'C', text: '断路器' },
      { key: 'D', text: '电阻器' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 28,
    type: 'single',
    chapter: '二、单选题',
    question: '使用数字式万用表测量电阻时，为什么要进行放电()',
    options: [
      { key: 'A', text: '因为电阻会储存电荷' },
      { key: 'B', text: '因为电阻会发热' },
      { key: 'C', text: '因为测量需要消耗电能' },
      { key: 'D', text: '因为放电可以提高测量精度' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 29,
    type: 'single',
    chapter: '二、单选题',
    question: '以下哪个选项是用于将模拟信号转换为数字信号的电子测量器件？',
    options: [
      { key: 'A', text: '示波器' },
      { key: 'B', text: '信号发生器' },
      { key: 'C', text: 'A/D转换器' },
      { key: 'D', text: 'D/A转换器' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 30,
    type: 'single',
    chapter: '二、单选题',
    question: '轴测图的最大特点是什么？',
    options: [
      { key: 'A', text: '立体感强' },
      { key: 'B', text: '三视图复杂' },
      { key: 'C', text: '不需要准确的尺寸标注' },
      { key: 'D', text: '可自由选择投影方向' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 31,
    type: 'single',
    chapter: '二、单选题',
    question: '在多级放大电路中，哪种级间反馈形式可以减小输出电阻？',
    options: [
      { key: 'A', text: '直流反馈' },
      { key: 'B', text: '交流反馈' },
      { key: 'C', text: '射极反馈' },
      { key: 'D', text: '跨级反馈' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 32,
    type: 'single',
    chapter: '二、单选题',
    question: '以下哪个不是组合体的组成部分？',
    options: [
      { key: 'A', text: '基本几何体' },
      { key: 'B', text: '切割体' },
      { key: 'C', text: '叠加体' },
      { key: 'D', text: '旋转体' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 33,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪一种操作可以保护二次回路免受电气干扰？',
    options: [
      { key: 'A', text: '滤波操作' },
      { key: 'B', text: '加热操作' },
      { key: 'C', text: '电阻接地' },
      { key: 'D', text: '以上都不是' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 34,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪类电器属于低压电器？',
    options: [
      { key: 'A', text: '电压互感器' },
      { key: 'B', text: '断路器' },
      { key: 'C', text: '照明开关' },
      { key: 'D', text: '隔离开关' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 35,
    type: 'single',
    chapter: '二、单选题',
    question: '电气图形符号的形式有()种',
    options: [
      { key: 'A', text: '1' },
      { key: 'B', text: '2' },
      { key: 'C', text: '3' },
      { key: 'D', text: '4' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 36,
    type: 'single',
    chapter: '二、单选题',
    question: '职业道德是指从事一定职业的人们在职业活动中应该遵循的（）和准则。',
    options: [
      { key: 'A', text: '行为规范' },
      { key: 'B', text: '道德规范' },
      { key: 'C', text: '行业规定' },
      { key: 'D', text: '价值观念' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 37,
    type: 'single',
    chapter: '二、单选题',
    question: '一个电路有n个节点，根据尔霍夫第一定律能列出()独立方程',
    options: [
      { key: 'A', text: 'n-1' },
      { key: 'B', text: 'n' },
      { key: 'C', text: 'n+1' },
      { key: 'D', text: 'n-2' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 38,
    type: 'single',
    chapter: '二、单选题',
    question: '三相笼型异步电动机的自锁正转控制线路中的自锁环节主要由哪个电器元件实现？',
    options: [
      { key: 'A', text: '接触器' },
      { key: 'B', text: '继电器' },
      { key: 'C', text: '电动机' },
      { key: 'D', text: '开关' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 39,
    type: 'single',
    chapter: '二、单选题',
    question: '一个组合体的形状是一个立方体，它的体积取决于什么？',
    options: [
      { key: 'A', text: '边长的大小' },
      { key: 'B', text: '每一条边的长度和角度的大小' },
      { key: 'C', text: '每一条边的长度和角度的大小，以及它们之间的相对位置' },
      { key: 'D', text: '以上都可以' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 40,
    type: 'single',
    chapter: '二、单选题',
    question: '在CA6140型车床电气控制线路中，M1和M2的启动和停止是由哪个电器控制的？',
    options: [
      { key: 'A', text: 'SQ1和KM1' },
      { key: 'B', text: 'SQ2和KM2' },
      { key: 'C', text: 'SQ3和KM3' },
      { key: 'D', text: 'SQ4和KM4' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 41,
    type: 'single',
    chapter: '二、单选题',
    question: '在对导线强度有高要求的场合，哪种导线材料最为合适？',
    options: [
      { key: 'A', text: '铜' },
      { key: 'B', text: '铝' },
      { key: 'C', text: '铁' },
      { key: 'D', text: '镍' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 42,
    type: 'single',
    chapter: '二、单选题',
    question: '当Z37型摇臂钻床的主轴箱未夹紧工件时，哪个保护继电器会动作？',
    options: [
      { key: 'A', text: 'KA1' },
      { key: 'B', text: 'KA2' },
      { key: 'C', text: 'KA3' },
      { key: 'D', text: 'KA4' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 43,
    type: 'single',
    chapter: '二、单选题',
    question: '角频率Ω与频率?之间的关系为()',
    options: [
      { key: 'A', text: 'Ω=2π?' },
      { key: 'B', text: 'Ω=1/?' },
      { key: 'C', text: 'Ω=π?' },
      { key: 'D', text: 'Ω=?' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 44,
    type: 'single',
    chapter: '二、单选题',
    question: '在X62W型万能铣床电气控制电路中，工作台快速移动电动机M4是怎样控制的？',
    options: [
      { key: 'A', text: '通过按动SQ1按钮实现控制' },
      { key: 'B', text: '通过按动SQ2按钮实现控制' },
      { key: 'C', text: '通过按动SQ3按钮实现控制' },
      { key: 'D', text: '通过按动SQ4按钮实现控制' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 45,
    type: 'single',
    chapter: '二、单选题',
    question: '根据国际相关规定，电压（）以下不必考虑防止电击的安全。',
    options: [
      { key: 'A', text: '36V' },
      { key: 'B', text: '48V' },
      { key: 'C', text: '65V' },
      { key: 'D', text: '25V' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 46,
    type: 'single',
    chapter: '二、单选题',
    question: 'DZ5-20系列低压断路器中的电磁脱扣器的作用是()。',
    options: [
      { key: 'A', text: '欠压保护' },
      { key: 'B', text: '短路保护' },
      { key: 'C', text: '过载保护' },
      { key: 'D', text: '断相保护' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 47,
    type: 'single',
    chapter: '二、单选题',
    question: '如果你需要测量电路中的交流电压，你应该使用什么类型的电压表？',
    options: [
      { key: 'A', text: '直流电压表' },
      { key: 'B', text: '交流电压表' },
      { key: 'C', text: '电流表' },
      { key: 'D', text: '电阻计' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 48,
    type: 'single',
    chapter: '二、单选题',
    question: '交流接触器的最常见应用是什么？',
    options: [
      { key: 'A', text: '直流电路' },
      { key: 'B', text: '交流电路' },
      { key: 'C', text: '电子设备' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 49,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪一种设备属于二次设备的辅助设备？',
    options: [
      { key: 'A', text: '电压互感器' },
      { key: 'B', text: '电流互感器' },
      { key: 'C', text: '断路器' },
      { key: 'D', text: '隔离开关和熔断器' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 50,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪类电器属于控制电器？',
    options: [
      { key: 'A', text: '电压互感器' },
      { key: 'B', text: '断路器' },
      { key: 'C', text: '接触器' },
      { key: 'D', text: '高压断路器' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 51,
    type: 'single',
    chapter: '二、单选题',
    question: '在下列哪个应用场景中，集成运放最适合被使用？',
    options: [
      { key: 'A', text: '音频信号放大' },
      { key: 'B', text: '数字信号运算' },
      { key: 'C', text: '高频信号放大' },
      { key: 'D', text: '功率控制' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 52,
    type: 'single',
    chapter: '二、单选题',
    question: '在电气识图中，变压器的符号是什么？',
    options: [
      { key: 'A', text: 'T' },
      { key: 'B', text: 'C' },
      { key: 'C', text: 'R' },
      { key: 'D', text: 'L' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 53,
    type: 'single',
    chapter: '二、单选题',
    question: '集成运算放大器可以用来实现哪种基本运算？',
    options: [
      { key: 'A', text: '加法运算' },
      { key: 'B', text: '减法运算' },
      { key: 'C', text: '乘法运算' },
      { key: 'D', text: '除法运算' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 54,
    type: 'single',
    chapter: '二、单选题',
    question: '与甲类功率放大方式相比，乙类OCL互补对称功放的主要优点是()',
    options: [
      { key: 'A', text: '不用输出变压器' },
      { key: 'B', text: '效率高' },
      { key: 'C', text: '不用输出端大电容' },
      { key: 'D', text: '无交越失真' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 55,
    type: 'single',
    chapter: '二、单选题',
    question: '焊接时，当烙铁头上有锡氧化的焊锡或锡渣，正确的做法是（）。',
    options: [
      { key: 'A', text: '不用理会，继续焊接' },
      { key: 'B', text: '在纸筒或烙铁架上敲掉' },
      { key: 'C', text: '在烙铁架的海绵上擦掉' },
      { key: 'D', text: '用力甩' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 56,
    type: 'single',
    chapter: '二、单选题',
    question: 'Windows的文件夹组织结构是一种（）。',
    options: [
      { key: 'A', text: '表格结构' },
      { key: 'B', text: '树形结构' },
      { key: 'C', text: '网状结构' },
      { key: 'D', text: '线形结构' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 57,
    type: 'single',
    chapter: '二、单选题',
    question: '（）是指由国家法律统一规定的用于开展庆祝、纪念活动的休息时间。',
    options: [
      { key: 'A', text: '法定节日' },
      { key: 'B', text: '公休假日' },
      { key: 'C', text: '间歇时间' },
      { key: 'D', text: '休息时间' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 58,
    type: 'single',
    chapter: '二、单选题',
    question: '劳动合同关系的双方为（）。',
    options: [
      { key: 'A', text: '劳动者和用人单位' },
      { key: 'B', text: '工会与企业' },
      { key: 'C', text: '劳动者与劳动行政部门' },
      { key: 'D', text: '工会与劳动行政部门' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 59,
    type: 'single',
    chapter: '二、单选题',
    question: '串励电动机和并励电动机一样,常采用电枢回路串联启动电阻的方法进行启动,目的是()。',
    options: [
      { key: 'A', text: '增大启动转矩' },
      { key: 'B', text: '限制启动电流' },
      { key: 'C', text: '减小能量损耗' },
      { key: 'D', text: '增大能量损耗' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 60,
    type: 'single',
    chapter: '二、单选题',
    question: '在正投影中，当直线与投影面倾斜时，该直线的投影具有什么特性？',
    options: [
      { key: 'A', text: '积聚性' },
      { key: 'B', text: '类似性' },
      { key: 'C', text: '显实性' },
      { key: 'D', text: '无界性' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 61,
    type: 'single',
    chapter: '二、单选题',
    question: '胶接工具的常见故障有哪些？如何排除？',
    options: [
      { key: 'A', text: '胶水无法流出，可调整工具的压杆压力' },
      { key: 'B', text: '胶水凝固在工具内，可进行清洗保养' },
      { key: 'C', text: '工具漏气，可更换密封圈或调整气压阀' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 62,
    type: 'single',
    chapter: '二、单选题',
    question: 'Word具有的功能是（）。',
    options: [
      { key: 'A', text: '表格处理' },
      { key: 'B', text: '绘制图形' },
      { key: 'C', text: '自动更正' },
      { key: 'D', text: '以上三项都是' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 63,
    type: 'single',
    chapter: '二、单选题',
    question: '输出电压与输入电压反相且输出电压幅度大于输入电压的放大器为()',
    options: [
      { key: 'A', text: '共发射极放大器' },
      { key: 'B', text: '共基极放大器和共集电极放大器' },
      { key: 'C', text: '共集电极放大器' },
      { key: 'D', text: '共集电极放大器和共发射极放大器' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 64,
    type: 'single',
    chapter: '二、单选题',
    question: '在多级放大电路中，常见的级间反馈形式不包括哪种？',
    options: [
      { key: 'A', text: '直流反馈' },
      { key: 'B', text: '交流反馈' },
      { key: 'C', text: '射极反馈' },
      { key: 'D', text: '跨级反馈' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 65,
    type: 'single',
    chapter: '二、单选题',
    question: '在图(1)所示的放大电路中，当用直流电压表测得VCE?VCC时，有可能是因为()；当测得VCE?0时 ,有可能是因为()',
    options: [
      { key: 'A', text: 'Rb开路' },
      { key: 'B', text: 'Rc开路' },
      { key: 'C', text: 'RL短路' },
      { key: 'D', text: 'Rb过小' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 66,
    type: 'single',
    chapter: '二、单选题',
    question: '当一个立体表面与投影面垂直时，其交线的投影有何特点？',
    options: [
      { key: 'A', text: '与实际交线相同' },
      { key: 'B', text: '与实际交线垂直' },
      { key: 'C', text: '与实际交线平行' },
      { key: 'D', text: '没有实际意义' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 67,
    type: 'single',
    chapter: '二、单选题',
    question: '吸锡器的主要部件是什么？',
    options: [
      { key: 'A', text: '吸嘴和活塞' },
      { key: 'B', text: '吸嘴和电热元件' },
      { key: 'C', text: '活塞和电热元件' },
      { key: 'D', text: '吸嘴、活塞和电热元件' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 68,
    type: 'single',
    chapter: '二、单选题',
    question: '在正投影中，当光线与投影面垂直时，所得到的投影称为：',
    options: [
      { key: 'A', text: '中心投影' },
      { key: 'B', text: '平行投影' },
      { key: 'C', text: '正投影' },
      { key: 'D', text: '斜投影' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 69,
    type: 'single',
    chapter: '二、单选题',
    question: '当一个应用程序窗口被最小化后，该应用程序将（）。',
    options: [
      { key: 'A', text: '被终止执行' },
      { key: 'B', text: '继续在前台执行' },
      { key: 'C', text: '被暂停执行' },
      { key: 'D', text: '被转入后台执行' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 70,
    type: 'single',
    chapter: '二、单选题',
    question: '戴维南定理用于分析电路的性质，它主要考虑的是在开路状态下，电路的（）。',
    options: [
      { key: 'A', text: '电压和电流' },
      { key: 'B', text: '电阻和电导' },
      { key: 'C', text: '电动势和内阻' },
      { key: 'D', text: '电压和电阻' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 71,
    type: 'single',
    chapter: '二、单选题',
    question: '职业道德修养是指从业人员在道德意识、道德行为方面的自我锻炼、（）和自我提高，在职业 实践中所形成的道德品质以及应达到的职业道德境界。',
    options: [
      { key: 'A', text: '自我改造' },
      { key: 'B', text: '自我强化' },
      { key: 'C', text: '自我要求' },
      { key: 'D', text: '自我熏陶' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 72,
    type: 'single',
    chapter: '二、单选题',
    question: '在进行二次回路的检查和维修时，应注意哪些安全事项？',
    options: [
      { key: 'A', text: '必须在切断电源的情况下进行' },
      { key: 'B', text: '可以带电进行检修，但必须使用绝缘工具' },
      { key: 'C', text: '应避免在带电的情况下进行检修，防止发生触电事故' },
      { key: 'D', text: '以上所有选项都是正确的安全注意事项' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 73,
    type: 'single',
    chapter: '二、单选题',
    question: '在整流电路中，通常使用哪种连接方式？',
    options: [
      { key: 'A', text: '串联' },
      { key: 'B', text: '并联' },
      { key: 'C', text: '星形连接' },
      { key: 'D', text: '三角形连接' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 74,
    type: 'single',
    chapter: '二、单选题',
    question: '在三相笼型异步电动机的点动正转控制线路中，以下哪个按钮可以实现电动机的正转运转？',
    options: [
      { key: 'A', text: '点动运转按钮' },
      { key: 'B', text: '单次运转按钮' },
      { key: 'C', text: '正转运转按钮' },
      { key: 'D', text: '停止按钮' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 75,
    type: 'single',
    chapter: '二、单选题',
    question: '发现计算机病毒后，最彻底的清除方法是（）。',
    options: [
      { key: 'A', text: '删除磁盘文件' },
      { key: 'B', text: '格式化磁盘' },
      { key: 'C', text: '用查毒软件处理' },
      { key: 'D', text: '用杀毒软件处理' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 76,
    type: 'single',
    chapter: '二、单选题',
    question: '无线电监测中，常用一些单位有dBuv、dBm等，dBm是()单位。',
    options: [
      { key: 'A', text: '电压' },
      { key: 'B', text: '带宽' },
      { key: 'C', text: '功率' },
      { key: 'D', text: '增益' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 77,
    type: 'single',
    chapter: '二、单选题',
    question: '在什么情况下，主令电器需要更换新的触头？',
    options: [
      { key: 'A', text: '触头磨损' },
      { key: 'B', text: '触头变形' },
      { key: 'C', text: '触头开裂' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 78,
    type: 'single',
    chapter: '二、单选题',
    question: '由激光头中光电二极管得到的（A+C+B+D）是()',
    options: [
      { key: 'A', text: '聚焦误差信号' },
      { key: 'B', text: '循迹误差信号' },
      { key: 'C', text: '图像与声音信号' },
      { key: 'D', text: '同步信号' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 79,
    type: 'single',
    chapter: '二、单选题',
    question: 'X62W型万能铣床电气控制电路中，下列哪个按钮可用于控制主轴的正反转？',
    options: [
      { key: 'A', text: 'SQ1按钮' },
      { key: 'B', text: 'SQ2按钮' },
      { key: 'C', text: 'SQ3按钮' },
      { key: 'D', text: 'SQ4按钮' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 80,
    type: 'single',
    chapter: '二、单选题',
    question: '在电路叠加定理中，当多个电源同时作用时，每个电源单独作用时产生的电压与总电压之间的 关系是（）。',
    options: [
      { key: 'A', text: '加成关系' },
      { key: 'B', text: '减法关系' },
      { key: 'C', text: '除法关系' },
      { key: 'D', text: '乘法关系' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 81,
    type: 'single',
    chapter: '二、单选题',
    question: '在FrontPage中，我们可以使用下列（）方法进行页面布局，使图文整齐有序的放在想要的位置 上。',
    options: [
      { key: 'A', text: '表格' },
      { key: 'B', text: '书签' },
      { key: 'C', text: '表单' },
      { key: 'D', text: '单元格' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 82,
    type: 'single',
    chapter: '二、单选题',
    question: '哪种电气图类型通常用于表示电路中的电源、电阻、电容和电感元件？',
    options: [
      { key: 'A', text: '过程控制图' },
      { key: 'B', text: '功能图' },
      { key: 'C', text: '接线图' },
      { key: 'D', text: '线路图' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 83,
    type: 'single',
    chapter: '二、单选题',
    question: '以下哪种设备不属于通用变频的组成部分？',
    options: [
      { key: 'A', text: '输入滤波器' },
      { key: 'B', text: '整流器' },
      { key: 'C', text: '负载电阻' },
      { key: 'D', text: '逆变器' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 84,
    type: 'single',
    chapter: '二、单选题',
    question: '某复杂电路计算结果是：I2＝2A，I3＝-3A，这个结果表明()',
    options: [
      { key: 'A', text: '电流I2和I3的方向相反' },
      { key: 'B', text: '电流I2大于电流I3' },
      { key: 'C', text: '电流I3大于电流I2' },
      { key: 'D', text: 'I2是从电源正极流出的电流' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 85,
    type: 'single',
    chapter: '二、单选题',
    question: '电能表的作用是用来测量（）的仪表。',
    options: [
      { key: 'A', text: '电能' },
      { key: 'B', text: '电功率' },
      { key: 'C', text: '电源电压' },
      { key: 'D', text: '负荷电流' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 86,
    type: 'single',
    chapter: '二、单选题',
    question: '在三相笼型异步电动机的自锁正转控制线路中，按下停止按钮后，下列哪个元件会自动断开电 源？',
    options: [
      { key: 'A', text: '交流接触器' },
      { key: 'B', text: '按钮开关' },
      { key: 'C', text: '热继电器' },
      { key: 'D', text: '时间继电器' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 87,
    type: 'single',
    chapter: '二、单选题',
    question: '根据表达信息的内容，电气图分为()种',
    options: [
      { key: 'A', text: '1' },
      { key: 'B', text: '2' },
      { key: 'C', text: '3' },
      { key: 'D', text: '4' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 88,
    type: 'single',
    chapter: '二、单选题',
    question: '为了连入internet，以下（）是可以不需要的。',
    options: [
      { key: 'A', text: '一条电话线' },
      { key: 'B', text: '一个调制解器' },
      { key: 'C', text: '一个internet帐号' },
      { key: 'D', text: '一台打印机' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 89,
    type: 'single',
    chapter: '二、单选题',
    question: '热继电器作电动机的保护时，适用于()',
    options: [
      { key: 'A', text: '重载起动间断工作时的过载保护' },
      { key: 'B', text: '频繁起动时的过载保护' },
      { key: 'C', text: '轻载起动连续工作时的过载保护' },
      { key: 'D', text: '任何负载、任何工作制的过载保护' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 90,
    type: 'single',
    chapter: '二、单选题',
    question: '在下列哪个参数的影响下，集成运放的带宽会受到影响？',
    options: [
      { key: 'A', text: '输入电阻' },
      { key: 'B', text: '输出电阻' },
      { key: 'C', text: '开环增益' },
      { key: 'D', text: '闭环增益' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 91,
    type: 'single',
    chapter: '二、单选题',
    question: '正弦交流电路的视在功率是表征该电路的()',
    options: [
      { key: 'A', text: '电压有效值与电流有效值乘积' },
      { key: 'B', text: '平均功率' },
      { key: 'C', text: '瞬时功率最大值' },
      { key: 'D', text: '无法确定' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 92,
    type: 'single',
    chapter: '二、单选题',
    question: '温度升高时，三极管参数正确变化的是()',
    options: [
      { key: 'A', text: 'Icbo，Ube，β均增大' },
      { key: 'B', text: 'Icbo，Ube，β均减小' },
      { key: 'C', text: 'Icbo及β增大，Ube下降' },
      { key: 'D', text: 'Icbo及β下降，Ube增大' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 93,
    type: 'single',
    chapter: '二、单选题',
    question: '滤波电路的作用是？',
    options: [
      { key: 'A', text: '提高电源效率' },
      { key: 'B', text: '去除交流分量' },
      { key: 'C', text: '增大直流电压范围' },
      { key: 'D', text: '减小直流电压波动' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 94,
    type: 'single',
    chapter: '二、单选题',
    question: '用热电阻传感器测温时,经常使用的配用测量电路是()。',
    options: [
      { key: 'A', text: '交流电桥' },
      { key: 'B', text: '差动电桥' },
      { key: 'C', text: '直流电桥' },
      { key: 'D', text: '以上几种均可' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 95,
    type: 'single',
    chapter: '二、单选题',
    question: 'R1和R2是两个串联电阻，已知R1=2R2，若R1上消耗的功率为1W，则R2上消耗的功率为（）。',
    options: [
      { key: 'A', text: '5W' },
      { key: 'B', text: '2W' },
      { key: 'C', text: '0.5W' },
      { key: 'D', text: '0.2W' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 96,
    type: 'single',
    chapter: '二、单选题',
    question: '在CMOS门电路中，当输入为高电平时，输出为低电平的逻辑门是？',
    options: [
      { key: 'A', text: '与门' },
      { key: 'B', text: '或门' },
      { key: 'C', text: '非门' },
      { key: 'D', text: '与非门' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 97,
    type: 'single',
    chapter: '二、单选题',
    question: '在无线通信系统中，自动增益控制（AGC）电路的主要作用是什么？',
    options: [
      { key: 'A', text: '自动调整信号强度以避免过饱和' },
      { key: 'B', text: '自动调整信号频率以避免干扰' },
      { key: 'C', text: '自动调整信号波形以避免失真' },
      { key: 'D', text: '自动调整信号功率以避免信号衰减' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 98,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪种数据库对象用于实现表之间的关联关系？',
    options: [
      { key: 'A', text: '索引' },
      { key: 'B', text: '外键' },
      { key: 'C', text: '主键' },
      { key: 'D', text: '触发器' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 99,
    type: 'single',
    chapter: '二、单选题',
    question: '下列说法错误的是()',
    options: [
      { key: 'A', text: '一个非正弦交流电有效值的平方等于该非正弦量各次谐波有效值的平方和' },
      { key: 'B', text: '非正弦交流电路不能使用叠加原理分析' },
      { key: 'C', text: '非正弦交流电功率等于直流功率及各次谐波功率之和' },
      { key: 'D', text: '电路中只要有非线性元件，就能产生非正弦交流电' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 100,
    type: 'single',
    chapter: '二、单选题',
    question: '三相笼型异步电动机的连续正转控制线路中，自锁环节的主要作用是什么？',
    options: [
      { key: 'A', text: '防止电动机过载' },
      { key: 'B', text: '防止电源中断' },
      { key: 'C', text: '保持电动机连续正转运转' },
      { key: 'D', text: '保护线路免受短路影响' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 101,
    type: 'single',
    chapter: '二、单选题',
    question: '电感线圈的单位符号是（）。',
    options: [
      { key: 'A', text: 'L' },
      { key: 'B', text: 'H' },
      { key: 'C', text: 'R' },
      { key: 'D', text: 'D' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 102,
    type: 'single',
    chapter: '二、单选题',
    question: '网络N1，N2如图所示，已知I1=5A，I2=6A，则I3=（）。',
    options: [
      { key: 'A', text: '－11A' },
      { key: 'B', text: '11A' },
      { key: 'C', text: '1A' },
      { key: 'D', text: '－1A' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 103,
    type: 'single',
    chapter: '二、单选题',
    question: '使用差动放大电路的目的是为了提高()',
    options: [
      { key: 'A', text: '输入电阻' },
      { key: 'B', text: '电压放大倍数' },
      { key: 'C', text: '抑制零点漂移能力' },
      { key: 'D', text: '电流放大倍数' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 104,
    type: 'single',
    chapter: '二、单选题',
    question: '高电导材料性能不随（）变化',
    options: [
      { key: 'A', text: '温度' },
      { key: 'B', text: '湿度' },
      { key: 'C', text: '时间' },
      { key: 'D', text: '厚度' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 105,
    type: 'single',
    chapter: '二、单选题',
    question: '下列说法正确的是（）。',
    options: [
      { key: 'A', text: '若电容器不带电，则电容C为零' },
      { key: 'B', text: '电容C与所带电量Q成正比，与电压U成反比' },
      { key: 'C', text: '电容两端电压增加，其所带电荷量不变' },
      { key: 'D', text: '电容C与所带的电量Q多少无关' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 106,
    type: 'single',
    chapter: '二、单选题',
    question: '根据作业指导书或样板之要求，该焊元件没焊，焊成其它元件叫()',
    options: [
      { key: 'A', text: '焊反' },
      { key: 'B', text: '漏焊' },
      { key: 'C', text: '错焊' },
      { key: 'D', text: '虚焊' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 107,
    type: 'single',
    chapter: '二、单选题',
    question: '下面哪项是继电器的主要优点？',
    options: [
      { key: 'A', text: '能够控制较大电流和电压' },
      { key: 'B', text: '具有过热保护和过流保护功能' },
      { key: 'C', text: '具有电气隔离功能，可用于数字信号控制' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 108,
    type: 'single',
    chapter: '二、单选题',
    question: '分立元件门电路中的电阻的主要作用是什么？',
    options: [
      { key: 'A', text: '提供电压降' },
      { key: 'B', text: '控制电流大小' },
      { key: 'C', text: '提供能量消耗' },
      { key: 'D', text: '改变信号波形' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 109,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪种方法是绘制轴测图最常用的方法？',
    options: [
      { key: 'A', text: '三视图方法' },
      { key: 'B', text: '二视图方法' },
      { key: 'C', text: '正投影法' },
      { key: 'D', text: '反投影法' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 110,
    type: 'single',
    chapter: '二、单选题',
    question: '在机械制图中，表面粗糙度的参数Rz代表什么？',
    options: [
      { key: 'A', text: '微观不平度十点高度' },
      { key: 'B', text: '轮廓最大高度' },
      { key: 'C', text: '间距更大的峰和谷的最大深度' },
      { key: 'D', text: '以上都不正确' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 111,
    type: 'single',
    chapter: '二、单选题',
    question: 'R1和R2是两个并联电阻，已知R1上消耗的功率为0．5W，R2上消耗的功率为1W，则R1:R2为 ()。',
    options: [
      { key: 'A', text: '1:2' },
      { key: 'B', text: '2:1' },
      { key: 'C', text: '1:4' },
      { key: 'D', text: '4:1' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 112,
    type: 'single',
    chapter: '二、单选题',
    question: '晶体管的“放大”实质上是()。',
    options: [
      { key: 'A', text: '将小能量放大成大能量' },
      { key: 'B', text: '将低电压放大成高电压' },
      { key: 'C', text: '将小电流放大成大电流' },
      { key: 'D', text: '用较小的电流变化去控制较大的电流变化' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 113,
    type: 'single',
    chapter: '二、单选题',
    question: 'CA6140型车床电气控制线路中，M1和M2的转向是怎样的？',
    options: [
      { key: 'A', text: '同向' },
      { key: 'B', text: '反向' },
      { key: 'C', text: 'M1正转，M2反转' },
      { key: 'D', text: 'M1反转，M2正转' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 114,
    type: 'single',
    chapter: '二、单选题',
    question: '电容器并联电路有如下特点（）。',
    options: [
      { key: 'A', text: '并联电路的等效电容量等于各个电容器的容量之和' },
      { key: 'B', text: '每个电容两端的电流相等' },
      { key: 'C', text: '并联电路的总电量等于最大电容器的电量' },
      { key: 'D', text: '电容器上的电压与电容量成正比' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 115,
    type: 'single',
    chapter: '二、单选题',
    question: '吸锡器的优点是什么？',
    options: [
      { key: 'A', text: '可以快速清理电路板上的焊锡' },
      { key: 'B', text: '可以降低清理成本' },
      { key: 'C', text: '可以提高工作效率' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 116,
    type: 'single',
    chapter: '二、单选题',
    question: '在集成电路中，电容器的主要作用是什么？',
    options: [
      { key: 'A', text: '放大信号' },
      { key: 'B', text: '控制电流' },
      { key: 'C', text: '存储电荷' },
      { key: 'D', text: '以上都不正确' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 117,
    type: 'single',
    chapter: '二、单选题',
    question: '在下列主令电器中，哪个具有防水性能？',
    options: [
      { key: 'A', text: '按钮开关' },
      { key: 'B', text: '行程开关' },
      { key: 'C', text: '脚踏开关' },
      { key: 'D', text: '以上都是' }
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 118,
    type: 'single',
    chapter: '二、单选题',
    question: '企业依法制定要求员工在劳动过程中必须遵守的行为规范为（）。',
    options: [
      { key: 'A', text: '岗位规范' },
      { key: 'B', text: '岗位培训规范' },
      { key: 'C', text: '岗位员工规范' },
      { key: 'D', text: '岗位劳动规则' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 119,
    type: 'single',
    chapter: '二、单选题',
    question: '逻辑代数式F=A+B属于()',
    options: [
      { key: 'A', text: '与非门电路' },
      { key: 'B', text: '或非门电路' },
      { key: 'C', text: '与门电路' },
      { key: 'D', text: '或门电路' }
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 120,
    type: 'single',
    chapter: '二、单选题',
    question: '熔断器在电动机控制线路中的作用是()',
    options: [
      { key: 'A', text: '短路保护' },
      { key: 'B', text: '过载保护' },
      { key: 'C', text: '缺相保护' },
      { key: 'D', text: '电流不平衡运行保护' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 121,
    type: 'single',
    chapter: '二、单选题',
    question: '下列选项中，属于职业道德基本准则的是（）。',
    options: [
      { key: 'A', text: '提高职业素养' },
      { key: 'B', text: '维护职业形象' },
      { key: 'C', text: '增强职业意识' },
      { key: 'D', text: '遵守职业纪律' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 122,
    type: 'single',
    chapter: '二、单选题',
    question: '下列哪种电气图类型通常用于表示控制系统中的定时器、计数器和逻辑元件？',
    options: [
      { key: 'A', text: '框图' },
      { key: 'B', text: '过程控制图' },
      { key: 'C', text: '功能图' },
      { key: 'D', text: '线路图' }
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 123,
    type: 'single',
    chapter: '二、单选题',
    question: '在集成逻辑门电路中，能够实现逻辑与功能的电路是？',
    options: [
      { key: 'A', text: 'TTL门电路' },
      { key: 'B', text: 'CMOS门电路' },
      { key: 'C', text: '多路复用器' },
      { key: 'D', text: '解码器' }
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 124,
    type: 'multi',
    chapter: '三、多选题',
    question: '爱岗敬业的具体要求包括以下哪些方面？()',
    options: [
      { key: 'A', text: '尽职尽责' },
      { key: 'B', text: '提高素质' },
      { key: 'C', text: '勤奋工作' },
      { key: 'D', text: '无私奉献' },
      { key: 'E', text: '团结协作' }
    ],
    answer: 'ABCD',
    explanation: '',
    image: ''
  },
  {
    id: 125,
    type: 'multi',
    chapter: '三、多选题',
    question: '下列哪些是使用万用表测量电压时的注意事项？（多选）',
    options: [
      { key: 'A', text: '必须选择合适的量程' },
      { key: 'B', text: '测量时必须注意红黑表笔的正确连接' },
      { key: 'C', text: '不能测交流电压' },
      { key: 'D', text: '不能测直流电压' },
      { key: 'E', text: '必须注意正负极性的正确连接' }
    ],
    answer: 'ABE',
    explanation: '',
    image: ''
  },
  {
    id: 126,
    type: 'multi',
    chapter: '三、多选题',
    question: '下列哪些属于二次设备的分类？',
    options: [
      { key: 'A', text: '继电保护装置' },
      { key: 'B', text: '电力电子设备' },
      { key: 'C', text: '测量表计' },
      { key: 'D', text: '控制设备和自动装置' },
      { key: 'E', text: '直流电源设备' }
    ],
    answer: 'ABCDE',
    explanation: '',
    image: ''
  },
  {
    id: 127,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下哪些是电气图的基本组成元素？',
    options: [
      { key: 'A', text: '电路元件符号' },
      { key: 'B', text: '文字符号' },
      { key: 'C', text: '线路' },
      { key: 'D', text: '注释' }
    ],
    answer: 'ABCD',
    explanation: '',
    image: ''
  },
  {
    id: 128,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下哪些是常见的信息传输导线？',
    options: [
      { key: 'A', text: '光纤' },
      { key: 'B', text: '同轴电缆' },
      { key: 'C', text: '双绞线' },
      { key: 'D', text: '电力线' }
    ],
    answer: 'ABC',
    explanation: '',
    image: ''
  },
  {
    id: 129,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下哪些设备使用的是交流电？',
    options: [
      { key: 'A', text: '灯泡' },
      { key: 'B', text: '电视' },
      { key: 'C', text: '电冰箱' },
      { key: 'D', text: '直流电源' }
    ],
    answer: 'ABC',
    explanation: '',
    image: ''
  },
  {
    id: 130,
    type: 'multi',
    chapter: '三、多选题',
    question: '下列哪些属于贴片类元器件？（多选）',
    options: [
      { key: 'A', text: '电阻' },
      { key: 'B', text: '电容' },
      { key: 'C', text: '二极管' },
      { key: 'D', text: '集成电路' }
    ],
    answer: 'ABC',
    explanation: '',
    image: ''
  },
  {
    id: 131,
    type: 'multi',
    chapter: '三、多选题',
    question: '在CA6140型车床的电气控制线路中，以下哪些回路是基本的控制回路？',
    options: [
      { key: 'A', text: '主电动机的启动和停止控制回路' },
      { key: 'B', text: '冷却泵电动机的启动和停止控制回路' },
      { key: 'C', text: '主轴正反转控制回路' },
      { key: 'D', text: '照明电路' }
    ],
    answer: 'ABD',
    explanation: '',
    image: ''
  },
  {
    id: 132,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下关于电路和电路图的描述中，（）是正确的',
    options: [
      { key: 'A', text: '电路是用于传输和分配电能的装置。' },
      { key: 'B', text: '电路图是一种用图形符号表示电路组成部分的简化形式。' },
      { key: 'C', text: '电路图中的箭头表示电流的方向。' },
      { key: 'D', text: '电源在电路图中可以用符号表示为“+”和“-”。' },
      { key: 'E', text: '所有的电路都包含电源、电阻和导线三个基本组成部分。' }
    ],
    answer: 'BCD',
    explanation: '',
    image: ''
  },
  {
    id: 133,
    type: 'multi',
    chapter: '三、多选题',
    question: '使用电烙铁时，以下哪些操作是正确的？（多选）',
    options: [
      { key: 'A', text: '使用前先检查电源线是否完好' },
      { key: 'B', text: '焊接过程中，烙铁头应保持清洁' },
      { key: 'C', text: '焊接完成后，立即将电源关闭' },
      { key: 'D', text: '烙铁头出现氧化时应立即更换' },
      { key: 'E', text: '焊接完成后，立即将烙铁头离开被焊物体' }
    ],
    answer: 'ABDE',
    explanation: '',
    image: ''
  },
  {
    id: 134,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下哪些是触发器的主要作用？',
    options: [
      { key: 'A', text: '保证数据完整性' },
      { key: 'B', text: '强制执行特定操作' },
      { key: 'C', text: '优化性能' },
      { key: 'D', text: '关联表之间的同步' }
    ],
    answer: 'AC',
    explanation: '',
    image: ''
  },
  {
    id: 135,
    type: 'multi',
    chapter: '三、多选题',
    question: '时序逻辑电路的分类方式有哪几种？',
    options: [
      { key: 'A', text: '根据触发器的类型' },
      { key: 'B', text: '根据电路的特点' },
      { key: 'C', text: '根据输入信号的形式' },
      { key: 'D', text: '根据输出信号的形式' }
    ],
    answer: 'ABCD',
    explanation: '',
    image: ''
  },
  {
    id: 136,
    type: 'multi',
    chapter: '三、多选题',
    question: '下列哪些是IP地址？',
    options: [
      { key: 'A', text: '192.168.1.1' },
      { key: 'B', text: '202.100.200.250' },
      { key: 'C', text: '10.1.2.3' },
      { key: 'D', text: '172.16.45.67' }
    ],
    answer: 'ABC',
    explanation: '',
    image: ''
  },
  {
    id: 137,
    type: 'multi',
    chapter: '三、多选题',
    question: '以下哪些是继电器的常见控制方式？',
    options: [
      { key: 'A', text: '电流控制' },
      { key: 'B', text: '电压控制' },
      { key: 'C', text: '脉冲控制' },
      { key: 'D', text: '温度控制' }
    ],
    answer: 'ABC',
    explanation: '',
    image: ''
  }
];
// 首次加载时缓存到localStorage（版本号 v4：更换为电子设备装接工高级理论复习卷第二批题库）
(function() {
  try {
    var cacheVer = localStorage.getItem('csp_cache_ver');
    if (!localStorage.getItem('csp_cache') || cacheVer !== '4') {
      localStorage.setItem('csp_cache', JSON.stringify(questionList));
      localStorage.setItem('csp_cache_ver', '4');
      console.log('题库缓存已更新 v4 (' + questionList.length + ' 题)');
    }
  } catch(e) {
    console.warn('题库缓存失败:', e.message);
  }
})();
