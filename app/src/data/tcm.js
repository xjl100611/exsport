// 中医辨证与穴位参考（按部位）
// 重要：方药部分只标注出处与适用证型，不提供用法用量；
// 中医内容仅供了解，须由执业中医师辨证后处理，不可自行配伍服药。
export const TCM_DISCLAIMER =
  '中医内容仅供了解与参考，不构成诊断或用药建议。方药须由执业中医师辨证后开具，切勿自行配伍服用；穴位按揉在皮肤破损、感染、发热或孕期等情况下需谨慎或避免。'

// 典籍定位：说明每本典籍在本手册里承担什么角色
export const TCM_CANON = [
  { book: '《黄帝内经》', role: '病因病机总纲，如痹证由风寒湿三气杂至而成' },
  { book: '《难经》', role: '脉诊与经络理论的补充，用于判断虚实' },
  { book: '《伤寒杂病论》', role: '经方来源，如葛根汤、芍药甘草汤' },
  { book: '《温病条辨》', role: '湿热、暑湿类痹痛的辨治思路' },
  { book: '《汤头歌诀》', role: '方剂组成与主治的入门记忆' },
  { book: '《药性歌括四百味》', role: '单味药性味功用的速查' },
  { book: '《濒湖脉学》', role: '脉象辨识，辅助判断证型' },
  { book: '《医学三字经》', role: '医学入门纲要，便于整体理解' },
  { book: '《神农本草经》', role: '药物功效的早期经典来源' },
  { book: '《本草纲目》', role: '药物主治与应用的集大成参考' },
  { book: '《医宗金鉴》', role: '伤科与正骨内容，如海桐皮汤外洗、正骨紫金丹' },
  { book: '《诸病源候论》', role: '按病因分候，如腰痛分肾虚、劳损、风寒' },
  { book: '《医学衷中参西录》', role: '活络效灵丹等理气活血止痛方' },
  { book: '《针灸大成》', role: '穴位主治与配穴的针灸学汇编' },
  { book: '《针灸甲乙经》', role: '最早的针灸学专著，腧穴定位依据' },
  { book: '《傅青主女科》', role: '女性经期、产后气血调养的参考' },
  { book: '《外科正宗》', role: '外用药思路，如如意金黄散外敷消肿' },
  { book: '《小儿药证直诀》', role: '六味地黄丸出处，补益肝肾' },
  { book: '《临证指南医案》', role: '叶天士医案，久痛入络、通络止痛的思路' },
  { book: '《名医类案》', role: '历代医案汇编，用于对照不同证型' },
  { book: '《千金方》', role: '独活寄生汤出处，治风寒湿痹、腰膝冷痛' },
  { book: '《医方集解》', role: '方剂分类与配伍讲解' },
]

export const TCM = {
  neck: {
    pattern: '风寒湿痹 · 气滞血瘀',
    patternNote: '受凉或久坐后加重，转头受限，得温则减',
    classic: '《黄帝内经》把风寒湿三气杂至称为痹，颈部受寒僵硬属此类；《诸病源候论》另有「颈项强」的专候。',
    points: [
      { name: '风池', meridian: '足少阳胆经', method: '双手拇指按揉 1 分钟，酸胀为度', caution: '力度放轻，不要向内上方深压' },
      { name: '颈百劳', meridian: '经外奇穴', method: '沿颈后两侧自上而下轻揉 1 分钟' },
      { name: '后溪', meridian: '手太阳小肠经', method: '握拳后按揉，同时缓慢转动颈部' },
    ],
    formula: { name: '葛根汤', source: '《伤寒杂病论》', indication: '项背强、怕风怕冷、无汗的表证' },
  },
  occiput: {
    pattern: '太阳经气不利 · 肝阳上扰',
    patternNote: '后枕部胀痛，低头加重，常伴颈后紧绷或头晕',
    classic: '《临证指南医案》论头痛久发多入络，常用通络之法。',
    points: [
      { name: '风池', meridian: '足少阳胆经', method: '按揉 1 分钟，配合缓慢点头' },
      { name: '天柱', meridian: '足太阳膀胱经', method: '拇指沿枕骨下缘按揉 1 分钟' },
      { name: '昆仑', meridian: '足太阳膀胱经', method: '按揉 30 秒', caution: '孕妇避免按压' },
    ],
    formula: { name: '川芎茶调散', source: '《太平惠民和剂局方》（后世方书如《医方集解》亦有收录）', indication: '风邪头痛，痛连项背' },
  },
  temple: {
    pattern: '少阳经头痛 · 痰湿或肝阳上扰',
    patternNote: '太阳穴附近跳痛或胀痛，情绪紧张、睡眠不足时明显',
    classic: '《名医类案》载头痛分经论治，两侧头痛多从少阳入手。',
    points: [
      { name: '太阳', meridian: '经外奇穴', method: '食指指腹轻揉 1 分钟，力度以舒适为度' },
      { name: '外关', meridian: '手少阳三焦经', method: '腕背横纹上两寸，按揉 1 分钟' },
      { name: '合谷', meridian: '手阳明大肠经', method: '按揉 1 分钟', caution: '孕妇禁用' },
    ],
    formula: { name: '半夏白术天麻汤', source: '《医学心悟》', indication: '痰湿头痛，头重如裹' },
  },
  jaw: {
    pattern: '阳明经筋不利 · 气滞血瘀',
    patternNote: '张口、咬合时耳前疼痛，咀嚼或夜间磨牙后加重',
    classic: '《针灸甲乙经》对颊车、下关等面部腧穴有明确定位与主治记载。',
    points: [
      { name: '颊车', meridian: '足阳明胃经', method: '闭口时按揉下颌角前上方 1 分钟' },
      { name: '下关', meridian: '足阳明胃经', method: '颧弓下缘凹陷处轻揉 1 分钟' },
      { name: '合谷', meridian: '手阳明大肠经', method: '按揉 1 分钟', caution: '孕妇禁用' },
    ],
    formula: { name: '活络效灵丹', source: '《医学衷中参西录》', indication: '气血瘀滞所致的疼痛' },
  },
  shoulder: {
    pattern: '风寒湿痹 · 经筋失养',
    patternNote: '抬举受限、夜间痛醒，遇冷加重',
    classic: '《针灸大成》以肩髃、肩髎、肩贞为主治肩臂疼痛的常用配穴。',
    points: [
      { name: '肩髃', meridian: '手阳明大肠经', method: '肩峰前下方凹陷处按揉 1 分钟' },
      { name: '肩髎', meridian: '手少阳三焦经', method: '肩峰后下方凹陷处按揉 1 分钟' },
      { name: '天宗', meridian: '手太阳小肠经', method: '肩胛冈下窝中央按揉 1 分钟' },
    ],
    formula: { name: '独活寄生汤', source: '《千金方》', indication: '风寒湿痹日久，兼腰膝冷痛、气血不足' },
  },
  elbow: {
    pattern: '劳伤气血 · 筋脉失养',
    patternNote: '肘外侧或内侧反复疼痛，握手、提物时加重',
    classic: '《临证指南医案》治久痛多用养血通络，而非一味止痛。',
    points: [
      { name: '曲池', meridian: '手阳明大肠经', method: '屈肘时肘横纹外侧端按揉 1 分钟' },
      { name: '手三里', meridian: '手阳明大肠经', method: '曲池下两寸按揉 1 分钟' },
      { name: '阿是穴', meridian: '压痛点', method: '以指腹在痛点周围环形轻揉 1 分钟' },
    ],
    formula: { name: '黄芪桂枝五物汤', source: '《金匮要略》', indication: '气血不足、肌肤麻木不仁' },
  },
  forearm: {
    pattern: '手三阳经筋劳损',
    patternNote: '前臂酸胀、握力下降，重复挥拍或打字后加重',
    classic: '《针灸甲乙经》记载手三里、外关主治臂前臂疼痛。',
    points: [
      { name: '手三里', meridian: '手阳明大肠经', method: '按揉 1 分钟，可配合前臂旋转' },
      { name: '外关', meridian: '手少阳三焦经', method: '按揉 1 分钟' },
      { name: '阿是穴', meridian: '压痛点', method: '沿肌肉走向轻推 1 分钟' },
    ],
    formula: { name: '桃红四物汤', source: '《医宗金鉴》', indication: '瘀血阻滞引起的疼痛' },
  },
  wrist: {
    pattern: '经筋劳损 · 寒湿阻络',
    patternNote: '腕部酸痛无力，晨起僵硬，活动后稍缓',
    classic: '《针灸大成》以阳溪、阳池、外关主治腕部疼痛与无力。',
    points: [
      { name: '阳溪', meridian: '手阳明大肠经', method: '拇指上翘时腕背凹陷处按揉 1 分钟' },
      { name: '阳池', meridian: '手少阳三焦经', method: '腕背横纹中点按揉 1 分钟' },
      { name: '外关', meridian: '手少阳三焦经', method: '按揉 1 分钟' },
    ],
    formula: { name: '独活寄生汤', source: '《千金方》', indication: '寒湿痹阻兼气血不足' },
  },
  finger: {
    pattern: '痹证 · 瘀血阻络',
    patternNote: '小关节肿胀、晨僵、屈伸不利，遇冷加重',
    classic: '《诸病源候论》把关节疼痛肿胀归入「历节」范畴，强调风寒湿与气血不足并见。',
    points: [
      { name: '八邪', meridian: '经外奇穴', method: '手指缝间以指腹轻揉，每处 20 秒' },
      { name: '合谷', meridian: '手阳明大肠经', method: '按揉 1 分钟', caution: '孕妇禁用' },
      { name: '外关', meridian: '手少阳三焦经', method: '按揉 1 分钟' },
    ],
    formula: { name: '宣痹汤', source: '《温病条辨》', indication: '湿热痹阻，关节红肿热痛' },
  },
  thumb: {
    pattern: '经筋损伤 · 气血瘀滞',
    patternNote: '拇指根部肿痛，捏握无力，扭伤后加重',
    classic: '《外科正宗》主张新伤先消肿止痛，常用外敷之法。',
    points: [
      { name: '阳溪', meridian: '手阳明大肠经', method: '按揉 1 分钟' },
      { name: '鱼际', meridian: '手太阴肺经', method: '第一掌骨中点桡侧按揉 1 分钟' },
      { name: '合谷', meridian: '手阳明大肠经', method: '按揉 1 分钟', caution: '孕妇禁用' },
    ],
    formula: { name: '如意金黄散', source: '《外科正宗》', indication: '跌打损伤、局部红肿（外用）', note: '外用方，需在医师指导下使用' },
  },
  rib: {
    pattern: '肝气郁结 · 气滞血瘀',
    patternNote: '胸胁胀痛，深呼吸、转身或按压时加重',
    classic: '《黄帝内经》论「肝病者，两胁下痛」，胁痛多与肝经气机不畅相关。',
    points: [
      { name: '期门', meridian: '足厥阴肝经', method: '沿肋间轻揉 1 分钟，不宜深压' },
      { name: '膻中', meridian: '任脉', method: '胸骨正中轻抚加按揉 1 分钟' },
      { name: '内关', meridian: '手厥阴心包经', method: '腕横纹上两寸按揉 1 分钟' },
    ],
    formula: { name: '四逆散', source: '《伤寒杂病论》', indication: '肝气郁滞、胸胁胀满' },
  },
  upperback: {
    pattern: '太阳经气不利 · 湿阻经络',
    patternNote: '肩胛之间酸重，久坐或阴雨天加重',
    classic: '《针灸大成》取天宗、膏肓主治肩胛与背部酸痛。',
    points: [
      { name: '天宗', meridian: '手太阳小肠经', method: '肩胛冈下窝中央按揉 1 分钟' },
      { name: '膏肓', meridian: '足太阳膀胱经', method: '第四胸椎棘突下旁开三寸轻揉 1 分钟' },
      { name: '后溪', meridian: '手太阳小肠经', method: '握拳按揉，配合肩胛后缩' },
    ],
    formula: { name: '羌活胜湿汤', source: '《内外伤辨惑论》', indication: '风湿在表，肩背沉重疼痛' },
  },
  lowback: {
    pattern: '肾虚 · 寒湿 · 瘀血',
    patternNote: '酸软无力多为肾虚，冷痛重着多为寒湿，刺痛固定多为瘀血',
    classic: '《诸病源候论》把腰痛分列肾虚、劳损、风寒等诸候，强调辨证方能施治。',
    points: [
      { name: '肾俞', meridian: '足太阳膀胱经', method: '第二腰椎棘突下旁开一寸半，掌根搓热后按揉 1 分钟' },
      { name: '大肠俞', meridian: '足太阳膀胱经', method: '第四腰椎棘突下旁开一寸半按揉 1 分钟' },
      { name: '委中', meridian: '足太阳膀胱经', method: '膝后横纹中点按揉 1 分钟' },
    ],
    formula: { name: '六味地黄丸', source: '《小儿药证直诀》', indication: '肝肾不足、腰膝酸软（偏虚证）' },
  },
  stomach: {
    pattern: '脾胃虚弱 · 肝胃不和',
    patternNote: '上腹胀痛、饭后加重，或与情绪、紧张相关',
    classic: '《医方集解》收有四君子汤类方，用于脾胃气虚导致的脘腹不适。',
    points: [
      { name: '中脘', meridian: '任脉', method: '肚脐上四寸，掌根顺时针轻揉 2 分钟' },
      { name: '内关', meridian: '手厥阴心包经', method: '按揉 1 分钟，恶心时可稍加力' },
      { name: '足三里', meridian: '足阳明胃经', method: '膝下三寸按揉 1 分钟' },
    ],
    formula: { name: '香砂六君子汤', source: '《古今名医方论》（《医方集解》一类方书亦有收录）', indication: '脾胃气虚兼有气滞、脘腹胀闷' },
  },
  groin: {
    pattern: '肝经气滞 · 经筋损伤',
    patternNote: '大腿内侧根部疼痛，内收或变向时加重',
    classic: '《黄帝内经》论足厥阴肝经循行经过阴部与大腿内侧，内收肌群的不适多从肝经论治。',
    points: [
      { name: '太冲', meridian: '足厥阴肝经', method: '足背第一二跖骨间按揉 1 分钟' },
      { name: '曲泉', meridian: '足厥阴肝经', method: '屈膝时膝内侧横纹端按揉 1 分钟' },
      { name: '维道', meridian: '足少阳胆经', method: '髂前上棘前下方轻揉 30 秒', caution: '腹股沟区域不宜深压，有血管与神经' },
    ],
    formula: { name: '四逆散', source: '《伤寒杂病论》', indication: '肝气郁滞、筋脉拘急' },
  },
  hip: {
    pattern: '痹证 · 肝肾不足',
    patternNote: '髋部活动受限、深部酸痛，久坐后起立困难',
    classic: '《针灸甲乙经》记载环跳、居髎主治髋部与下肢疼痛。',
    points: [
      { name: '环跳', meridian: '足少阳胆经', method: '侧卧屈髋，臀部外上按揉 1 分钟' },
      { name: '居髎', meridian: '足少阳胆经', method: '髂前上棘与股骨大转子连线中点按揉 1 分钟' },
      { name: '阳陵泉', meridian: '足少阳胆经', method: '腓骨小头前下方按揉 1 分钟' },
    ],
    formula: { name: '独活寄生汤', source: '《千金方》', indication: '风寒湿痹日久、肝肾不足' },
  },
  hipflexor: {
    pattern: '肝脾经筋拘急',
    patternNote: '髋前侧牵扯感，久坐后站立腰髋发紧',
    classic: '《黄帝内经》有「肝主筋」之说，筋脉拘急多从肝论治。',
    points: [
      { name: '髀关', meridian: '足阳明胃经', method: '大腿前上方按揉 1 分钟' },
      { name: '太冲', meridian: '足厥阴肝经', method: '足背按揉 1 分钟' },
      { name: '冲门', meridian: '足太阴脾经', method: '腹股沟外侧轻揉 30 秒', caution: '此处有血管，勿深压' },
    ],
    formula: { name: '芍药甘草汤', source: '《伤寒杂病论》', indication: '筋脉挛急、肌肉拘紧' },
  },
  hipside: {
    pattern: '少阳经筋不利 · 痰湿阻络',
    patternNote: '大腿外侧牵扯痛，跑步或侧卧时加重',
    classic: '《临证指南医案》论久痛多属络病，治宜通络和营。',
    points: [
      { name: '风市', meridian: '足少阳胆经', method: '直立时中指尖处按揉 1 分钟' },
      { name: '居髎', meridian: '足少阳胆经', method: '按揉 1 分钟' },
      { name: '阳陵泉', meridian: '足少阳胆经', method: '按揉 1 分钟' },
    ],
    formula: { name: '宣痹汤', source: '《温病条辨》', indication: '湿热痹阻，局部灼热重着' },
  },
  thighfront: {
    pattern: '阳明经筋劳伤',
    patternNote: '大腿前侧酸痛发紧，上下楼梯或下坡后加重',
    classic: '《医宗金鉴》伤科部分强调新伤宜活血消肿，久伤宜和营通络。',
    points: [
      { name: '伏兔', meridian: '足阳明胃经', method: '髌骨外上缘上六寸按揉 1 分钟' },
      { name: '梁丘', meridian: '足阳明胃经', method: '髌骨外上缘上两寸按揉 1 分钟' },
      { name: '足三里', meridian: '足阳明胃经', method: '按揉 1 分钟' },
    ],
    formula: { name: '桃红四物汤', source: '《医宗金鉴》', indication: '瘀血肿痛' },
  },
  thighback: {
    pattern: '太阳经筋损伤 · 瘀血',
    patternNote: '大腿后侧拉伤样疼痛，前屈或加速时明显',
    classic: '《医学衷中参西录》创活络效灵丹，用于气血瘀滞之疼痛。',
    points: [
      { name: '承扶', meridian: '足太阳膀胱经', method: '臀横纹中点按揉 1 分钟' },
      { name: '殷门', meridian: '足太阳膀胱经', method: '承扶下六寸按揉 1 分钟' },
      { name: '委中', meridian: '足太阳膀胱经', method: '膝后横纹中点按揉 1 分钟' },
    ],
    formula: { name: '活络效灵丹', source: '《医学衷中参西录》', indication: '气血瘀滞引起的疼痛' },
  },
  knee: {
    pattern: '痹证 · 肝肾亏虚',
    patternNote: '上下楼梯痛、屈伸不利，遇冷或劳累加重',
    classic: '《针灸大成》以犊鼻、血海、梁丘、阳陵泉为主治膝痛的常用穴组。',
    points: [
      { name: '犊鼻', meridian: '足阳明胃经', method: '屈膝时髌骨外下方凹陷按揉 1 分钟' },
      { name: '血海', meridian: '足太阴脾经', method: '髌骨内上缘上两寸按揉 1 分钟' },
      { name: '阳陵泉', meridian: '足少阳胆经', method: '按揉 1 分钟' },
    ],
    formula: { name: '桂枝芍药知母汤', source: '《金匮要略》', indication: '历节病，关节肿痛、身体消瘦' },
  },
  shin: {
    pattern: '脾肝经筋劳损',
    patternNote: '小腿内侧沿骨缘疼痛，跑量增加后出现',
    classic: '《针灸甲乙经》记载三阴交、阴陵泉主治下肢内侧面疼痛。',
    points: [
      { name: '阴陵泉', meridian: '足太阴脾经', method: '胫骨内侧髁下方凹陷按揉 1 分钟' },
      { name: '三阴交', meridian: '足太阴脾经', method: '内踝上三寸按揉 1 分钟', caution: '孕妇禁用' },
      { name: '足三里', meridian: '足阳明胃经', method: '按揉 1 分钟' },
    ],
    formula: { name: '芍药甘草汤', source: '《伤寒杂病论》', indication: '筋脉拘急疼痛' },
  },
  calf: {
    pattern: '太阳经筋挛急',
    patternNote: '小腿后侧抽筋、酸胀，夜间或运动后易发',
    classic: '《针灸大成》以承山主治小腿转筋与腓肠肌痉挛。',
    points: [
      { name: '承山', meridian: '足太阳膀胱经', method: '小腿后侧正中凹陷按揉 1 分钟' },
      { name: '委中', meridian: '足太阳膀胱经', method: '按揉 1 分钟' },
      { name: '昆仑', meridian: '足太阳膀胱经', method: '外踝后方按揉 30 秒', caution: '孕妇避免按压' },
    ],
    formula: { name: '芍药甘草汤', source: '《伤寒杂病论》', indication: '筋脉挛急、抽筋样疼痛' },
  },
  achilles: {
    pattern: '肝肾不足 · 筋脉失养',
    patternNote: '跟腱处隐痛、晨起僵硬，活动开稍缓但跑后加重',
    classic: '《黄帝内经》有「肝主筋、肾主骨」之说，肌腱劳损多从肝肾不足论治。',
    points: [
      { name: '太溪', meridian: '足少阴肾经', method: '内踝与跟腱之间按揉 1 分钟' },
      { name: '昆仑', meridian: '足太阳膀胱经', method: '外踝后方按揉 30 秒', caution: '孕妇避免按压' },
      { name: '承山', meridian: '足太阳膀胱经', method: '按揉 1 分钟' },
    ],
    formula: { name: '六味地黄丸', source: '《小儿药证直诀》', indication: '肝肾不足、筋骨失养（偏虚证）' },
  },
  ankle: {
    pattern: '筋伤 · 寒湿阻滞',
    patternNote: '崴伤后肿痛、活动受限，遇冷或走久加重',
    classic: '《外科正宗》治跌打损伤主张外用消肿散瘀之品。',
    points: [
      { name: '解溪', meridian: '足阳明胃经', method: '踝关节前方横纹中点按揉 1 分钟' },
      { name: '丘墟', meridian: '足少阳胆经', method: '外踝前下方按揉 1 分钟' },
      { name: '昆仑', meridian: '足太阳膀胱经', method: '按揉 30 秒', caution: '孕妇避免按压；急性肿胀期手法要轻' },
    ],
    formula: { name: '如意金黄散', source: '《外科正宗》', indication: '跌打损伤、红肿热痛（外用）', note: '外用方，需在医师指导下使用' },
  },
  foot: {
    pattern: '肾经不足 · 足底筋脉失养',
    patternNote: '晨起第一步足跟刺痛，久站后加重',
    classic: '《诸病源候论》论足跟痛与肾气虚、劳损相关。',
    points: [
      { name: '涌泉', meridian: '足少阴肾经', method: '足底前三分之一凹陷处按揉 1 分钟' },
      { name: '太溪', meridian: '足少阴肾经', method: '内踝与跟腱之间按揉 1 分钟' },
      { name: '然谷', meridian: '足少阴肾经', method: '足内侧舟骨粗隆下方按揉 1 分钟' },
    ],
    formula: { name: '独活寄生汤', source: '《千金方》', indication: '肝肾不足、风寒湿痹之足膝疼痛' },
  },
  forefoot: {
    pattern: '肝胃经气滞 · 湿热下注',
    patternNote: '前脚掌踩地痛、有异物感，久站或硬底鞋后加重',
    classic: '《黄帝内经》论足阳明胃经循行至足背，前足疼痛常取胃经与肝经穴位。',
    points: [
      { name: '太冲', meridian: '足厥阴肝经', method: '足背第一二跖骨间按揉 1 分钟' },
      { name: '内庭', meridian: '足阳明胃经', method: '足背第二三趾间缝纹端按揉 1 分钟' },
      { name: '涌泉', meridian: '足少阴肾经', method: '足底按揉 1 分钟' },
    ],
    formula: { name: '四妙丸', source: '《成方便读》', indication: '湿热下注，足膝红肿疼痛' },
  },
  toe: {
    pattern: '湿热下注 · 瘀血阻络',
    patternNote: '大脚趾红肿热痛、触痛明显，多见于痛风或外伤',
    classic: '《温病条辨》对湿热痹阻有宣痹、渗湿的治法，足趾红肿属此类。',
    points: [
      { name: '太冲', meridian: '足厥阴肝经', method: '足背按揉 1 分钟，急性红肿期手法要轻' },
      { name: '行间', meridian: '足厥阴肝经', method: '足背第一二趾间缝纹端按揉 30 秒' },
      { name: '内庭', meridian: '足阳明胃经', method: '按揉 30 秒' },
    ],
    formula: { name: '宣痹汤', source: '《温病条辨》', indication: '湿热痹阻，局部红肿热痛' },
  },
  trigger: {
    pattern: '痰湿瘀阻 · 筋络失养',
    patternNote: '手指屈伸卡顿、有弹响，晨起明显，活动后稍缓',
    classic: '《外科正宗》论筋结多从痰湿瘀血互结论治；《针灸甲乙经》记有掌指部腧穴的主治。',
    points: [
      { name: '阿是穴', meridian: '硬结处', method: '在掌指关节硬结周围轻揉 1 分钟，勿强行按压', caution: '急性红肿期不宜推拿' },
      { name: '合谷', meridian: '手阳明大肠经', method: '按揉 1 分钟', caution: '孕妇禁用' },
      { name: '外关', meridian: '手少阳三焦经', method: '按揉 1 分钟' },
    ],
    formula: { name: '活络效灵丹', source: '《医学衷中参西录》', indication: '气血瘀滞引起的疼痛' },
  },
  ribcart: {
    pattern: '肝郁气滞 · 痰瘀互结',
    patternNote: '胸骨旁固定压痛，深呼吸、咳嗽或情绪波动时加重',
    classic: '《黄帝内经》论「肝病者，两胁下痛」，胁肋疼痛多从肝论治。',
    points: [
      { name: '膻中', meridian: '任脉', method: '胸骨正中轻揉 1 分钟，配合深呼吸' },
      { name: '期门', meridian: '足厥阴肝经', method: '沿肋间轻揉 1 分钟，不宜深压' },
      { name: '内关', meridian: '手厥阴心包经', method: '按揉 1 分钟' },
    ],
    formula: { name: '四逆散', source: '《伤寒杂病论》', indication: '肝气郁滞、胸胁胀痛' },
  },
  nerveroot: {
    pattern: '寒湿痹阻 · 瘀血阻络',
    patternNote: '腰痛连及腿后侧，麻木放射，遇冷或久坐加重',
    classic: '《诸病源候论》论腰痛可牵引腰脊与下肢，并区分风寒与劳损；《临证指南医案》主张久痛入络、宜通络止痛。',
    points: [
      { name: '肾俞', meridian: '足太阳膀胱经', method: '掌根搓热后按揉 1 分钟' },
      { name: '环跳', meridian: '足少阳胆经', method: '侧卧屈髋，臀部外上按揉 1 分钟' },
      { name: '委中', meridian: '足太阳膀胱经', method: '膝后横纹中点按揉 1 分钟' },
    ],
    formula: { name: '独活寄生汤', source: '《千金方》', indication: '风寒湿痹日久、腰膝冷痛' },
  },
  sacroiliac: {
    pattern: '肾督虚寒 · 瘀血阻络',
    patternNote: '腰骶深层酸痛，晨僵明显；活动后减轻者偏炎性，休息后减轻者偏劳损',
    classic: '《难经》论督脉与肾的关系，腰骶久痛多从肾与督脉论治。',
    points: [
      { name: '关元俞', meridian: '足太阳膀胱经', method: '第五腰椎棘突下旁开一寸半按揉 1 分钟' },
      { name: '八髎', meridian: '足太阳膀胱经', method: '骶后孔处以掌根上下推擦 1 分钟' },
      { name: '承山', meridian: '足太阳膀胱经', method: '按揉 1 分钟' },
    ],
    formula: { name: '六味地黄丸', source: '《小儿药证直诀》', indication: '肝肾不足、腰膝酸软（偏虚证）' },
  },
  shinfront: {
    pattern: '气滞血瘀 · 壅滞不通',
    patternNote: '小腿前侧胀紧疼痛、活动后加重；若休息时仍剧痛并伴麻木，先排除急性骨筋膜室综合征',
    classic: '《黄帝内经》强调气血壅滞不通可致疼痛，故治以行气活血；急性壅滞属急症，不宜推拿。',
    points: [
      { name: '足三里', meridian: '足阳明胃经', method: '慢性期按揉 1 分钟', caution: '急性肿胀期禁用推拿与热敷' },
      { name: '阳陵泉', meridian: '足少阳胆经', method: '慢性期按揉 1 分钟', caution: '急性肿胀期禁用推拿与热敷' },
      { name: '承山', meridian: '足太阳膀胱经', method: '慢性期按揉 1 分钟', caution: '急性肿胀期禁用推拿与热敷' },
    ],
    formula: { name: '桃红四物汤', source: '《医宗金鉴》', indication: '慢性期瘀血阻滞之疼痛（急性期须先就医）' },
  },
  arch: {
    pattern: '脾肾气虚 · 筋脉失养',
    patternNote: '足弓酸痛、久站后加重，以内侧为主',
    classic: '《黄帝内经》论脾主肌肉、肾主骨，足弓支撑无力多从脾肾论治。',
    points: [
      { name: '三阴交', meridian: '足太阴脾经', method: '内踝上三寸按揉 1 分钟', caution: '孕妇禁用' },
      { name: '太溪', meridian: '足少阴肾经', method: '内踝与跟腱之间按揉 1 分钟' },
      { name: '然谷', meridian: '足少阴肾经', method: '足内侧舟骨粗隆下方按揉 1 分钟' },
    ],
    formula: { name: '六味地黄丸', source: '《小儿药证直诀》', indication: '肝肾不足、筋骨失养（偏虚证）' },
  },
}

export const getTcm = (id) => TCM[id] ?? null
