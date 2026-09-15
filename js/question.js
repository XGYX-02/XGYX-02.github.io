/**
 * 内置题库 - 唯一静态数据源
 * 仅包含：单选题(single)、判断题(judge)、计算题(calc)
 * 首次加载自动缓存至localStorage，优化二次打开速度
 */
const questionList = [
  {
    id: 1,
    type: 'single',
    chapter: '第1-2章小测',
    question: '从信号频谱的特点来考虑，周期信号的频谱是（ ）。',
    options: [
      { key: 'A', text: '周期的' },
      { key: 'B', text: '连续的' },
      { key: 'C', text: '离散的' },
      { key: 'D', text: '发散的' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 2,
    type: 'single',
    chapter: '第1-2章小测',
    question: '已知随机相位θ 在（ -π   , π)服从均匀分布，求随机变量Y=cosθ的数学期望。',
    options: [
      { key: 'A', text: 'π' },
      { key: 'B', text: '-π' },
      { key: 'C', text: '0' },
      { key: 'D', text: '2π' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 3,
    type: 'single',
    chapter: '第1-2章小测',
    question: '周期矩形脉冲的谱线间隔与（ ）有关。',
    options: [
      { key: 'A', text: '脉冲幅度' },
      { key: 'B', text: '脉冲周期' },
      { key: 'C', text: '脉冲宽度' },
      { key: 'D', text: '脉冲宽度和幅度' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 4,
    type: 'single',
    chapter: '第1-2章小测',
    question: '某信息源的符号集由四种符号组成，每一符号等概出现，且各符号的出现统计独立，则该信源的熵为（ ）。',
    options: [
      { key: 'A', text: '1bit/符号' },
      { key: 'B', text: '2bit/符号' },
      { key: 'C', text: '3bit/符号' },
      { key: 'D', text: '4bit/符号' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 5,
    type: 'single',
    chapter: '第1-2章小测',
    question: '下列三项技术指标，可作为数字通信系统有效性性能指标的是（）。（1）码元速率；（2）信息速率；（3）频带利用率。',
    options: [
      { key: 'A', text: '（1）和（2）' },
      { key: 'B', text: '（1）、（2）和（3）' },
      { key: 'C', text: '（2）和（3）' },
      { key: 'D', text: '（1）和（3）' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 6,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '消息中所含信息量的多少与消息的种类无关（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 7,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '传统的无线电广播通信方式是单工的（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 8,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '高斯白噪声通常是指噪声的功率谱密度服从高斯分布（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 9,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '通信系统中不管有没有信号，加性噪声是始终存在的（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 10,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '两个周期信号相加也一定是周期信号（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 11,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '若矩形脉冲信号的宽度加宽，则它的频谱带宽也加宽（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 12,
    type: 'judge',
    chapter: '第1-2章小测',
    question: '周期信号的频谱是离散谱，非周期信号的频谱是连续谱',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 13,
    type: 'calc',
    chapter: '第1-2章小测',
    question: '已知随机过程X(t)=Acos(2πf0t+θ)其中A  f0为常数,随机相位θ在[0,2π]内均匀分布， 自相关函数为RX(τ)=A22cos2πf0τ，求X(t)的功率谱密度及平均功率。',
    answer: 'X(t)功率谱密度 P_X(f)=(A²/4)[δ(f-f₀)+δ(f+f₀)]，平均功率 P=A²/2',
    explanation: '由维纳-辛钦定理，功率谱密度是自相关函数的傅里叶变换',
    image: ''
  },
  {
    id: 14,
    type: 'single',
    chapter: '第3章小测',
    question: '以下不属于线性调制的调制方式是（ ）。',
    options: [
      { key: 'A', text: 'DSB' },
      { key: 'B', text: 'SSB' },
      { key: 'C', text: 'AM' },
      { key: 'D', text: 'FM' },
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 15,
    type: 'single',
    chapter: '第3章小测',
    question: '将信道的可用频带划分为若干个相互不重叠的频段，每路信号占用其中的一个频段传送，从而能同时传送若干路信号的通信系统称为（ ）。',
    options: [
      { key: 'A', text: '时分复用系统' },
      { key: 'B', text: '频分复用系统' },
      { key: 'C', text: '码分复用系统' },
      { key: 'D', text: '波分复用系统' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 16,
    type: 'single',
    chapter: '第3章小测',
    question: '模拟调幅中DSB、SSB、VSB的已调信号所占用带宽大小关系为（ ）。',
    options: [
      { key: 'A', text: 'DSB＞SSB＞VSB' },
      { key: 'B', text: 'DSB＞VSB＞SSB' },
      { key: 'C', text: 'SSB ＞DSB＞VSB' },
      { key: 'D', text: 'VSB＞SSB ＞DSB' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 17,
    type: 'single',
    chapter: '第3章小测',
    question: 'SSB短波通信电台，如果基带调制信号的频率范围为0~4000Hz ，载频为 10MHz ，则该SSB信号的带宽为（ ）。',
    options: [
      { key: 'A', text: '4KHz' },
      { key: 'B', text: '8KHz' },
      { key: 'C', text: '10MHz' },
      { key: 'D', text: '20MHz' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 18,
    type: 'single',
    chapter: '第3章小测',
    question: '各模拟线性调制中，已调信号占用频带最小的调制是(  )',
    options: [
      { key: 'A', text: 'AM' },
      { key: 'B', text: 'DSB' },
      { key: 'C', text: 'SSB' },
      { key: 'D', text: 'FM' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 19,
    type: 'judge',
    chapter: '第3章小测',
    question: 'DSB和SSB解调只能采用相干解调（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 20,
    type: 'judge',
    chapter: '第3章小测',
    question: '通信系统的噪声只存在于信道中（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 21,
    type: 'judge',
    chapter: '第3章小测',
    question: 'DSB调制信号的制度增益是SSB的一倍，所以其抗噪声性能比SSB好一倍（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 22,
    type: 'single',
    chapter: '第4-5章小测',
    question: '以下不属于线性调制的调制方式是（ ）。',
    options: [
      { key: 'A', text: 'DSB' },
      { key: 'B', text: 'SSB' },
      { key: 'C', text: 'AM' },
      { key: 'D', text: 'FM' },
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 23,
    type: 'single',
    chapter: '第4-5章小测',
    question: '将信道的可用频带划分为若干个相互不重叠的频段，每路信号占用其中的一个频段传送，从而能同时传送若干路信号的通信系统称为（ ）。',
    options: [
      { key: 'A', text: '时分复用系统' },
      { key: 'B', text: '频分复用系统' },
      { key: 'C', text: '码分复用系统' },
      { key: 'D', text: '波分复用系统' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 24,
    type: 'single',
    chapter: '第4-5章小测',
    question: '无码间串扰的数字基带传输系统的最高频带利用率为（ ）。',
    options: [
      { key: 'A', text: '2Baud/Hz' },
      { key: 'B', text: '1Baud/Hz' },
      { key: 'C', text: '2bit/Hz' },
      { key: 'D', text: '1bit/Hz' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 25,
    type: 'single',
    chapter: '第4-5章小测',
    question: '在数字通信系统中，取样判决的定时信息被称为（ ）。',
    options: [
      { key: 'A', text: '载波同步信息' },
      { key: 'B', text: '位同步信息' },
      { key: 'C', text: '网同步信息' },
      { key: 'D', text: '群同步信息' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 26,
    type: 'single',
    chapter: '第4-5章小测',
    question: '模拟调幅中DSB、SSB、VSB的已调信号所占用带宽大小关系为（ ）。',
    options: [
      { key: 'A', text: 'DSB＞SSB＞VSB' },
      { key: 'B', text: 'DSB＞VSB＞SSB' },
      { key: 'C', text: 'SSB ＞DSB＞VSB' },
      { key: 'D', text: 'VSB＞SSB ＞DSB' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 27,
    type: 'single',
    chapter: '第4-5章小测',
    question: 'SSB短波通信电台，如果基带调制信号的频率范围为0~4000Hz ，载频为 10MHz ，则该SSB信号的带宽为（ ）。',
    options: [
      { key: 'A', text: '4KHz' },
      { key: 'B', text: '8KHz' },
      { key: 'C', text: '10MHz' },
      { key: 'D', text: '20MHz' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 28,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '理论上无限长的横向均衡器可以完全消除抽样时刻上的码间串扰（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 29,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '当脉冲宽度相同时 ,升余弦脉冲信号的带宽是矩形脉冲信号带宽的2倍。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 30,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '眼图张开越大，信号传输质量越好（ ）。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 31,
    type: 'judge',
    chapter: '第4-5章小测',
    question: 'DSB调制信号的制度增益是SSB的一倍，所以其抗噪声性能比SSB好一倍（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 32,
    type: 'judge',
    chapter: '第4-5章小测',
    question: 'AM的解调即可以采用包络解调 ,也可以采用相干解调。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 33,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '多进制线性调制可以提高频带利用率。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 34,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '数字基带信号的功率谱形状仅取决于数字基带信号的码型。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 35,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '数字基带信号的功率谱形状仅取决于数字基带信号的波形',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 36,
    type: 'judge',
    chapter: '第4-5章小测',
    question: '双极性数字基带信号功率谱的第一个零点频率是矩形波宽度的倒数。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 37,
    type: 'calc',
    chapter: '第4-5章小测',
    question: '已知调制信号m(t)=cos2000πt,载波为2cos10000πt ，分别画出DSB、SSB （下边带）信号的频谱。',
    answer: 'DSB频谱：载频10kHz处有冲激，±4kHz边带各一对冲激；SSB下边带：仅保留载频以下频谱分量（见题图）',
    explanation: 'DSB含上下边带对称频谱，SSB仅取一个边带',
    image: '图片1.png'
  },
  {
    id: 38,
    type: 'calc',
    chapter: '第4-5章小测',
    question: '已知矩形、升余弦传输特性如下图所示。当采用以下速率传输时，指出哪些是无码间干扰的，哪些会引起码间干扰？ （1） RS=1000Baud, （2） RS=2000Baud, （3） RS=1500Baud, （4） RS=3000Baud',
    answer: '理想低通滤波器带宽为1000Hz ，此系统所有的无码间干扰速率有2×1000/n(n=1,2,3, …),当n=1,2时得无码间干扰速率为2000Baud和1000Baud。所以这两个速率无码间干扰，而RS=1500Baud和RS=3000Baud则有码间干扰。当升余弦特性带宽为2000Hz ，其所有的无码间干扰速率2×2000/n(n=2,3,4, …), 所以2000Baud和1000Baud是无码间干扰的，而RS=1500Baud和RS=3000Baud则有码间干扰。',
    explanation: '',
    image: '图片2.png'
  },
  {
    id: 39,
    type: 'calc',
    chapter: '第4-5章小测',
    question: '已知HDB3码波形如下图所示，求其原基带信息。',
    answer: '101100001100000000',
    explanation: '',
    image: '图片3.png'
  },
  {
    id: 40,
    type: 'single',
    chapter: '第6-8章小测',
    question: '已知某信号的时域表达式为m(t)=200Sa2(200πt)，对此信号取样时，其Nyquist取样速率fs 应取',
    options: [
      { key: 'A', text: '100Hz' },
      { key: 'B', text: '200Hz' },
      { key: 'C', text: '300Hz' },
      { key: 'D', text: '400Hz' },
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 41,
    type: 'single',
    chapter: '第6-8章小测',
    question: '已知某信号的时域表达式为m(t)=200Sa2(200πt)，当采用取样速率fs =500Hz对此信号取样时，要恢复原信号，低通滤波器的截止频率应选',
    options: [
      { key: 'A', text: '100-200Hz' },
      { key: 'B', text: '200-300Hz' },
      { key: 'C', text: '400Hz' },
      { key: 'D', text: '500Hz' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 42,
    type: 'single',
    chapter: '第6-8章小测',
    question: '在对语音信号进行均匀量化的PCM编码中，设取样速率为8kHz ，若增加编码位数使编码后的速率由40kbit/s增加到6 4kbit/s ，则量化信噪比增加了多少？',
    options: [
      { key: 'A', text: '6dB' },
      { key: 'B', text: '12dB' },
      { key: 'C', text: '18dB' },
      { key: 'D', text: '24dB' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 43,
    type: 'single',
    chapter: '第6-8章小测',
    question: '如果接收机输入端信噪比相同，那么采用相干解调时四种二进制数字调制方式抗高斯白噪声性能的优劣顺序是：',
    options: [
      { key: 'A', text: '2PSK>2DPSK>2FSK>2ASK' },
      { key: 'B', text: '2PSK>2FSK>2DPSK>2ASK' },
      { key: 'C', text: '2DPSK>2PSK>2FSK>2ASK' },
      { key: 'D', text: '2DPSK>2FSK>2PSK>2ASK' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 44,
    type: 'single',
    chapter: '第6-8章小测',
    question: '某均匀量化器输入样值范围[-10, 10] ，量化电平数M=8 ，则量化区间间隔Δ为（ ）。',
    options: [
      { key: 'A', text: '1' },
      { key: 'B', text: '1.25' },
      { key: 'C', text: '2.5' },
      { key: 'D', text: '5' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 45,
    type: 'single',
    chapter: '第6-8章小测',
    question: '若发送“0”符号和发送“1”符号的概率相等，则2PSK信号的功率谱中（ ）。',
    options: [
      { key: 'A', text: '离散谱和连续谱都有' },
      { key: 'B', text: '只有离散谱' },
      { key: 'C', text: '只有连续谱' },
      { key: 'D', text: '以上都错' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 46,
    type: 'single',
    chapter: '第6-8章小测',
    question: '在误码率相同的条件下，三种数字调制方式之间抗干扰性能好坏的关系为（ ）。',
    options: [
      { key: 'A', text: '2ASK>2FSK>2PSK' },
      { key: 'B', text: '2FSK>2PSK>2ASK' },
      { key: 'C', text: '2PSK>2ASK>2FSK' },
      { key: 'D', text: '2PSK>2FSK>2ASK' },
    ],
    answer: 'D',
    explanation: '',
    image: ''
  },
  {
    id: 47,
    type: 'single',
    chapter: '第6-8章小测',
    question: '三种数字调制方式之间，其已调信号占用频带的大小关系为（ ）。',
    options: [
      { key: 'A', text: '2ASK=2PSK=2FSK' },
      { key: 'B', text: '2ASK=2PSK＞2FSK' },
      { key: 'C', text: '2FSK＞2PSK=2ASK' },
      { key: 'D', text: '2FSK＞2PSK＞2ASK' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 48,
    type: 'single',
    chapter: '第6-8章小测',
    question: '如果数字通信系统的码元速率为1200Baud ，当采用八进制时，其信息速率为',
    options: [
      { key: 'A', text: '3600bit/s' },
      { key: 'B', text: '2400bit/s' },
      { key: 'C', text: '1200bit/s' },
      { key: 'D', text: '400bit/s' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 49,
    type: 'single',
    chapter: '第6-8章小测',
    question: 'ASK、 FSK、 PSK、QAM信号中可采用非相干解调的频带信号是（ ）。',
    options: [
      { key: 'A', text: 'ASK、FSK' },
      { key: 'B', text: 'FSK、PSK' },
      { key: 'C', text: 'PSK、QAM' },
      { key: 'D', text: 'ASK、QAM' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 50,
    type: 'single',
    chapter: '第6-8章小测',
    question: '对于2PSK采用直接法载波同步会带来载波相位模糊是（ ）。    ',
    options: [
      { key: 'A', text: '90∘和180∘不定' },
      { key: 'B', text: '0∘和180∘不定' },
      { key: 'C', text: '0∘和90∘不定' },
      { key: 'D', text: '90∘和360∘不定' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 51,
    type: 'single',
    chapter: '第6-8章小测',
    question: '在数字调制技术中，其采用的进制数越高，则（ ）。',
    options: [
      { key: 'A', text: '抗干扰能力越强' },
      { key: 'B', text: '占用的频带越宽' },
      { key: 'C', text: '频谱利用率越高' },
      { key: 'D', text: '实现越简单' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 52,
    type: 'single',
    chapter: '第6-8章小测',
    question: '对均匀量化的样值进行编码时，当编码位数增加一位时，其量化信噪比将增加约（ ）dB。',
    options: [
      { key: 'A', text: '2' },
      { key: 'B', text: '3' },
      { key: 'C', text: '6' },
      { key: 'D', text: '4' },
    ],
    answer: 'C',
    explanation: '',
    image: ''
  },
  {
    id: 53,
    type: 'single',
    chapter: '第6-8章小测',
    question: '已知某PCM编码器输入信号的归一化样值 Is=+436△ ,则该 PCM编码器输出的8位码字为（），量化误差为（）。',
    options: [
      { key: 'A', text: '11011011         4△' },
      { key: 'B', text: '11011011         8△' },
      { key: 'C', text: '10111101         4△' },
      { key: 'D', text: '10111101         6△' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 54,
    type: 'single',
    chapter: '第6-8章小测',
    question: '已知PCM编译器收到的码组为11101000 ，如果最小量化级为 1mV,则译码器输出电压值为',
    options: [
      { key: 'A', text: '784mv' },
      { key: 'B', text: '786mv' },
      { key: 'C', text: '864mv' },
      { key: 'D', text: '698mv' },
    ],
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 55,
    type: 'single',
    chapter: '第6-8章小测',
    question: 'QPSK信号解调时',
    options: [
      { key: 'A', text: '存在180度相位模糊问题' },
      { key: 'B', text: '存在90度相位模糊问题' },
      { key: 'C', text: '不存在相位模糊问题' },
      { key: 'D', text: '可以采用相位比较法解调' },
    ],
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 56,
    type: 'judge',
    chapter: '第6-8章小测',
    question: 'MQAM和MPSK具有相同的频带利用率',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 57,
    type: 'judge',
    chapter: '第6-8章小测',
    question: 'QPSK调制方式中当信码从00变为11时，或者从11变为00时，其相位跳变均为180度。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 58,
    type: 'judge',
    chapter: '第6-8章小测',
    question: 'QPSK的最大相位跳变是90度',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 59,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '增量调制系统中如果量化台阶选大有利于减小过载噪声 ，但一般量化噪声增大。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 60,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '增量调制系统中减小过载噪声的方法之一是选择大的抽样速率fs',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 61,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '均匀量化时量化噪声功率N q大小与信号样值大小无关，仅与量化间隔   V 有关。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 62,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '如果信噪比r一定，相同调制方式时有Pe相干<Pe非相干.',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 63,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '多进制数字调制随着M增大，相邻信号点的距离会逐渐减小，抗噪声性能会下降。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 64,
    type: 'judge',
    chapter: '第6-8章小测',
    question: 'QPSK调制方式中载波相位与基带信号双比特的关系是唯一的。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 65,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '2ASK、2PSK、2FSK频带信号的带宽都是其数字基带调制信号带宽的两倍（ ）。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 66,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '量化时采用的量化台阶数越多其量化信噪比就越小。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 67,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '4DPSK解调器既可以采用相干解调+码反变换，也可以采用差分相干解调。',
    answer: 'A',
    explanation: '',
    image: ''
  },
  {
    id: 68,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '2DPSK解调器可以采用差分相干解调，但4DPSK不可以采用差分相干解调。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 69,
    type: 'judge',
    chapter: '第6-8章小测',
    question: 'QPSK调制方式中当信码从01变为10时，其相位跳变90度。',
    answer: 'B',
    explanation: '',
    image: ''
  },
  {
    id: 70,
    type: 'judge',
    chapter: '第6-8章小测',
    question: '多进制线性调制可以提高频带利用率。',
    answer: 'A',
    explanation: '',
    image: ''
  },
];
// 首次加载时缓存到localStorage（版本号 v2：强制刷新含图片路径的题库）
(function() {
  try {
    var cacheVer = localStorage.getItem('csp_cache_ver');
    if (!localStorage.getItem('csp_cache') || cacheVer !== '3') {
      localStorage.setItem('csp_cache', JSON.stringify(questionList));
      localStorage.setItem('csp_cache_ver', '3');
      console.log('题库缓存已更新 v3 (' + questionList.length + ' 题)');
    }
  } catch(e) {
    console.warn('题库缓存失败:', e.message);
  }
})();
