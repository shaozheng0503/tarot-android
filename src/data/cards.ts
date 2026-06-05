// 78 张塔罗牌元数据(中文为主,英文为辅)
// 大阿卡纳 22 + 小阿卡纳 56
// symbol: 行星/星座 Unicode 符号(占星对应)
// ☉ 太阳(☉) ☽ 月亮 ☿ 水星 ♀ 金星 ♂ 火星 ♃ 木星 ♄ 土星
// 大阿卡纳符号表参考: 0愚者☽ 1魔术师☿ 2女祭司☽ 3皇后♀ 4皇帝♂
//                  5教皇♃ 6恋人♀♂ 7战车☉ 8力量♀ 9隐士♄
//                  10命运之轮♃ 11正义♀ 12倒吊人☿ 13死神♄ 14节制♃
//                  15恶魔♂ 16塔☿ 17星星☉ 18月亮☽ 19太阳☉ 20审判♄ 21世界♃

import type { TarotCard, Suit, SuitSymbol } from '../types';
import { SUIT_ELEMENT, MAJOR_CORRESPONDENCE } from './correspondences';

// 小阿卡纳符号约定
const WAND: SuitSymbol = '☉';   // 权杖 - 火
const CUP: SuitSymbol = '☽';    // 圣杯 - 水
const SWORD: SuitSymbol = '☿';  // 宝剑 - 风
const PENT: SuitSymbol = '♄';   // 星币 - 土

interface CardSeed {
  id: string;
  number: number;
  nameEn: string;
  nameZh: string;
  symbol: SuitSymbol;
  keywordsU: string[];
  keywordsR: string[];
  meaningU: string;
  meaningR: string;
}

const MAJOR: CardSeed[] = [
  {
    id: 'major-00', number: 0,
    nameEn: 'The Fool', nameZh: '愚者',
    symbol: '☉',
    keywordsU: ['新开始', '自由', '纯真', '冒险'],
    keywordsR: ['鲁莽', '犹豫', '迷失', '轻率'],
    meaningU: '一段崭新旅程的起点,保持开放与信任,踏出第一步将获得意外的礼物。',
    meaningR: '可能因为缺乏计划或过于冲动而陷入困境,需要停下脚步重新审视方向。',
  },
  {
    id: 'major-01', number: 1,
    nameEn: 'The Magician', nameZh: '魔术师',
    symbol: '☿',
    keywordsU: ['创造力', '意志力', '专注', '显化'],
    keywordsR: ['欺骗', '犹豫', '才能浪费', '操控'],
    meaningU: '你拥有实现目标所需的一切资源,集中意志力,主动创造你想要的现实。',
    meaningR: '注意身边的欺骗或自我欺骗,能力未能发挥,可能正被他人操控。',
  },
  {
    id: 'major-02', number: 2,
    nameEn: 'The High Priestess', nameZh: '女祭司',
    symbol: '☽',
    keywordsU: ['直觉', '潜意识', '神秘', '智慧'],
    keywordsR: ['忽视直觉', '秘密暴露', '疏离', '混乱'],
    meaningU: '倾听内心的声音,答案不在外部喧嚣中,而在你深藏的直觉里。',
    meaningR: '可能压抑了内在智慧,或被他人的意见左右,需要重新连接内心。',
  },
  {
    id: 'major-03', number: 3,
    nameEn: 'The Empress', nameZh: '皇后',
    symbol: '♀',
    keywordsU: ['丰盛', '母性', '创造', '感官'],
    keywordsR: ['依赖', '停滞', '过度保护', '忽视自我'],
    meaningU: '丰饶与滋养的能量环绕着你,无论是事业、关系还是身心,都处在孕育成长的阶段。',
    meaningR: '可能过度付出而失去自我,或沉溺于安逸中停滞不前。',
  },
  {
    id: 'major-04', number: 4,
    nameEn: 'The Emperor', nameZh: '皇帝',
    symbol: '♂',
    keywordsU: ['权威', '结构', '稳定', '领导'],
    keywordsR: ['专制', '僵化', '控制欲', '权威滥用'],
    meaningU: '建立清晰的规则与边界,以稳健的行动力推动事情发展。',
    meaningR: '可能过于强势或依赖权威,失去灵活性和同理心。',
  },
  {
    id: 'major-05', number: 5,
    nameEn: 'The Hierophant', nameZh: '教皇',
    symbol: '♃',
    keywordsU: ['传统', '教导', '信仰', '制度'],
    keywordsR: ['教条', '反叛', '虚伪', '盲从'],
    meaningU: '寻求智者指引或遵循经过时间检验的道路,适合学习、拜师、入会。',
    meaningR: '可能正被陈规束缚,或对现存体制产生怀疑,需要找到自己的真理。',
  },
  {
    id: 'major-06', number: 6,
    nameEn: 'The Lovers', nameZh: '恋人',
    symbol: '♀',
    keywordsU: ['爱情', '选择', '和谐', '价值观'],
    keywordsR: ['失衡', '犹豫不决', '价值观冲突', '不和谐'],
    meaningU: '一段深层连接的可能性,或面临一个关乎内心的重要选择,听从真心。',
    meaningR: '关系或选择中出现不和谐,内心与外在发生冲突,需要直面。',
  },
  {
    id: 'major-07', number: 7,
    nameEn: 'The Chariot', nameZh: '战车',
    symbol: '☉',
    keywordsU: ['胜利', '意志', '决心', '突破'],
    keywordsR: ['失去方向', '勉强', '失控', '内耗'],
    meaningU: '凭借决心与自律冲破阻碍,目标在前,集中注意力即可达成。',
    meaningR: '可能方向不清或与阻力硬碰硬,需要重新校准内在的方向盘。',
  },
  {
    id: 'major-08', number: 8,
    nameEn: 'Strength', nameZh: '力量',
    symbol: '♀',
    keywordsU: ['勇气', '柔韧', '耐心', '内在力量'],
    keywordsR: ['软弱', '怀疑', '压抑', '失控'],
    meaningU: '真正的力量来自温柔的坚定,以柔克刚,用爱驯服内心的野兽。',
    meaningR: '可能正被恐惧或不自信支配,或压抑了情绪,需要重新找回内在力量。',
  },
  {
    id: 'major-09', number: 9,
    nameEn: 'The Hermit', nameZh: '隐士',
    symbol: '♄',
    keywordsU: ['内省', '独处', '智慧', '指引'],
    keywordsR: ['孤立', '逃避', '固执', '迷失'],
    meaningU: '退后一步,在独处中聆听内在的智慧,这盏灯将照亮他人的路。',
    meaningR: '可能过于封闭自己,或把孤寂当成逃避,需要适度连接外界。',
  },
  {
    id: 'major-10', number: 10,
    nameEn: 'Wheel of Fortune', nameZh: '命运之轮',
    symbol: '♃',
    keywordsU: ['转折', '机遇', '循环', '好运'],
    keywordsR: ['不顺', '抗拒变化', '坏循环', '失控'],
    meaningU: '命运之轮正在转动,顺流而上接受变化,好运将随之而来。',
    meaningR: '感到被命运推着走或抗拒改变,低谷终会过去,需要耐心。',
  },
  {
    id: 'major-11', number: 11,
    nameEn: 'Justice', nameZh: '正义',
    symbol: '♀',
    keywordsU: ['公正', '真相', '因果', '决断'],
    keywordsR: ['不公', '逃避责任', '偏见', '失衡'],
    meaningU: '事情将得到公正的裁决,你的每个行动都有相应的回报,保持诚实。',
    meaningR: '感到不公或逃避该承担的责任,需要直面真相。',
  },
  {
    id: 'major-12', number: 12,
    nameEn: 'The Hanged Man', nameZh: '倒吊人',
    symbol: '☿',
    keywordsU: ['放下', '新视角', '牺牲', '暂停'],
    keywordsR: ['拖延', '抗拒', '无谓牺牲', '困局'],
    meaningU: '换个角度看问题,主动的"暂停"会带来珍贵的洞见,放弃执念即得自由。',
    meaningR: '陷入僵局或无谓的牺牲,需要主动改变现状而不是被动等待。',
  },
  {
    id: 'major-13', number: 13,
    nameEn: 'Death', nameZh: '死神',
    symbol: '♄',
    keywordsU: ['结束', '转化', '重生', '放下'],
    keywordsR: ['抗拒改变', '停滞', '恐惧', '无法割舍'],
    meaningU: '一个阶段正在落幕,这是必要的结束,新生命会从灰烬中诞生。',
    meaningR: '死死抓住已经过去的事物,抗拒必要的告别,导致能量停滞。',
  },
  {
    id: 'major-14', number: 14,
    nameEn: 'Temperance', nameZh: '节制',
    symbol: '♃',
    keywordsU: ['平衡', '耐心', '调和', '中庸'],
    keywordsR: ['失衡', '极端', '不耐', '混乱'],
    meaningU: '在生活中找到恰当的比例,耐心调和不同元素,平衡即是智慧。',
    meaningR: '生活失衡,过度或不足,需要重新审视优先级。',
  },
  {
    id: 'major-15', number: 15,
    nameEn: 'The Devil', nameZh: '恶魔',
    symbol: '♂',
    keywordsU: ['束缚', '欲望', '执念', '阴影'],
    keywordsR: ['挣脱', '觉醒', '直面', '释放'],
    meaningU: '看清自己被困住的地方——欲望、恐惧或关系,锁链只在心中。',
    meaningR: '正在觉醒并打破旧有的束缚,开始夺回对自己生命的主权。',
  },
  {
    id: 'major-16', number: 16,
    nameEn: 'The Tower', nameZh: '塔',
    symbol: '☿',
    keywordsU: ['突变', '崩塌', '觉醒', '真相'],
    keywordsR: ['逃避崩溃', '灾难延后', '内在震荡', '抗拒'],
    meaningU: '虚假的结构正在崩塌,虽然痛苦,但这是重建真实自我的契机。',
    meaningR: '勉强维持的现状已到极限,内在的崩塌正在发生,要主动面对。',
  },
  {
    id: 'major-17', number: 17,
    nameEn: 'The Star', nameZh: '星星',
    symbol: '☉',
    keywordsU: ['希望', '疗愈', '灵感', '宁静'],
    keywordsR: ['失望', '迷失信心', '倦怠', '与本源失联'],
    meaningU: '希望与疗愈的时刻,保持信念,宇宙正在温柔地回应你。',
    meaningR: '暂时失去方向或信心,需要休息与自我照顾,等待内在的明灯重燃。',
  },
  {
    id: 'major-18', number: 18,
    nameEn: 'The Moon', nameZh: '月亮',
    symbol: '☽',
    keywordsU: ['潜意识', '幻象', '直觉', '梦境'],
    keywordsR: ['恐惧浮现', '困惑', '迷雾散开', '真相显现'],
    meaningU: '事情并不像表面那样,潜入潜意识与梦境,答案藏在那里。',
    meaningR: '迷雾正在散去,过去困扰你的幻象将逐渐清晰,恐惧失去力量。',
  },
  {
    id: 'major-19', number: 19,
    nameEn: 'The Sun', nameZh: '太阳',
    symbol: '☉',
    keywordsU: ['成功', '快乐', '活力', '清晰'],
    keywordsR: ['暂时的阴霾', '过度乐观', '延迟的成功', '倦怠'],
    meaningU: '光明、喜悦与成功,事情清晰明朗,享受这份丰盛的阳光。',
    meaningR: '暂时的乌云遮住了阳光,或快乐被延迟,但你内在的光并未熄灭。',
  },
  {
    id: 'major-20', number: 20,
    nameEn: 'Judgement', nameZh: '审判',
    symbol: '♄',
    keywordsU: ['觉醒', '召唤', '原谅', '重生'],
    keywordsR: ['自我怀疑', '逃避召唤', '沉溺过去', '冷漠'],
    meaningU: '听到来自灵魂的召唤,是时候原谅过去、做出决定、开始新生。',
    meaningR: '逃避内心真正的召唤,或无法原谅自己/他人,被困在过去。',
  },
  {
    id: 'major-21', number: 21,
    nameEn: 'The World', nameZh: '世界',
    symbol: '♃',
    keywordsU: ['完成', '成就', '整合', '圆满'],
    keywordsR: ['未完成', '拖延收尾', '缺最后一里路', '循环未闭'],
    meaningU: '一个完整的循环即将结束,庆祝你走过的路,新的循环将开启。',
    meaningR: '事情接近完成但还差临门一脚,需要回头收拾未完的功课。',
  },
];

// 小阿卡纳模板(每花色 14 张)
function makeMinor(
  suit: Suit,
  suitZh: string,
  symbol: SuitSymbol,
  suitThemeU: string[],
  suitThemeR: string[],
  rankMeanings: { id: string; rank: number; nameZh: string; kU: string[]; kR: string[]; mU: string; mR: string }[],
): CardSeed[] {
  return rankMeanings.map(r => ({
    id: `${suit}-${r.id}`,
    number: r.rank,
    nameEn: `${cap(r.id)} of ${cap(suit)}`,
    nameZh: `${suitZh}${r.nameZh}`,
    symbol,
    keywordsU: [...suitThemeU, ...r.kU],
    keywordsR: [...suitThemeR, ...r.kR],
    meaningU: `${r.mU}(${suitZh}能量:创造力与热情。)`,
    meaningR: `${r.mR}(${suitZh}能量受阻:行动力卡顿或过度消耗。)`,
  }));
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const WANDS_RANKS = [
  { id: 'ace', rank: 1, nameZh: '首牌', kU: ['灵感火花', '新机会'], kR: ['延迟', '未引爆'], mU: '新的灵感与创造力火花,把握机会主动出击', mR: '灵感被搁置或被忽视,需要重新点燃热情' },
  { id: 'two', rank: 2, nameZh: '二', kU: ['规划', '抉择'], kR: ['犹豫', '拖延'], mU: '在两个方向之间做选择,保持视野开阔', mR: '难以决断导致原地踏步,需要厘清优先级' },
  { id: 'three', rank: 3, nameZh: '三', kU: ['远见', '扩展'], kR: ['受限', '推迟'], mU: '为更大的图景做准备,远期规划开始显现', mR: '扩展计划遇到阻碍,需要调整节奏' },
  { id: 'four', rank: 4, nameZh: '四', kU: ['庆典', '稳定'], kR: ['过渡', '不协调'], mU: '家与社群的稳定,值得庆祝的阶段', mR: '稳定受到挑战,正处过渡期' },
  { id: 'five', rank: 5, nameZh: '五', kU: ['冲突', '竞争'], kR: ['避免冲突', '内耗'], mU: '良性竞争推动成长,直面分歧', mR: '无谓的冲突与内耗,远离消耗你的人' },
  { id: 'six', rank: 6, nameZh: '六', kU: ['胜利', '认可'], kR: ['延迟成功', '自负'], mU: '赢得认可与胜利,享受成果', mR: '成功被延迟或被骄傲冲昏头' },
  { id: 'seven', rank: 7, nameZh: '七', kU: ['坚持', '防守'], kR: ['压力', '被围攻'], mU: '捍卫你的立场,坚持到底', mR: '感到处处被动,需要调整策略' },
  { id: 'eight', rank: 8, nameZh: '八', kU: ['快速', '消息'], kR: ['匆忙', '延误'], mU: '事情加速推进,行动力爆棚', mR: '节奏过快或被延误,需要喘息' },
  { id: 'nine', rank: 9, nameZh: '九', kU: ['警觉', '防御'], kR: ['偏执', '耗竭'], mU: '最后一关的坚守,胜利在望', mR: '过度警觉导致精力耗竭' },
  { id: 'ten', rank: 10, nameZh: '十', kU: ['责任', '负担'], kR: ['压垮', '卸下重担'], mU: '承担多项责任,合理分配可达成', mR: '肩上担子过重,需要放下一些' },
  { id: 'page', rank: 11, nameZh: '侍从', kU: ['热情', '探索'], kR: ['鲁莽', '半途而废'], mU: '充满好奇与热情的初学者,大胆尝试', mR: '热情有余坚持不足,容易三分钟热度' },
  { id: 'knight', rank: 12, nameZh: '骑士', kU: ['行动', '冒险'], kR: ['冲动', '不耐'], mU: '充满活力的行动派,主动出击', mR: '过于冲动或方向摇摆,需要聚焦' },
  { id: 'queen', rank: 13, nameZh: '王后', kU: ['自信', '魅力'], kR: ['自私', '情绪化'], mU: '独立自信、富有感染力的女性能量', mR: '自信变成自私或情绪化,需要自省' },
  { id: 'king', rank: 14, nameZh: '国王', kU: ['领导', '远见'], kR: ['专横', '独断'], mU: '有远见的领导者,以身作则', mR: '领导力变为专横独断,失去人心' },
];

const CUPS_RANKS = [
  { id: 'ace', rank: 1, nameZh: '首牌', kU: ['情感新生', '爱'], kR: ['压抑', '闭塞'], mU: '情感与爱的崭新开启,丰盛流入', mR: '情感被压抑,心门关闭,需要松动' },
  { id: 'two', rank: 2, nameZh: '二', kU: ['连结', '和谐'], kR: ['失衡', '错位'], mU: '两个人之间深层连接,相互理解', mR: '关系中沟通错位,需要重新对齐' },
  { id: 'three', rank: 3, nameZh: '三', kU: ['庆祝', '友谊'], kR: ['过度社交', '八卦'], mU: '与朋友的欢聚,情感支持充沛', mR: '过度社交消耗能量,远离是非' },
  { id: 'four', rank: 4, nameZh: '四', kU: ['内省', '漠然'], kR: ['接受', '新的看见'], mU: '对周围漠不关心,转向内在反思', mR: '走出漠然,重新对世界产生兴趣' },
  { id: 'five', rank: 5, nameZh: '五', kU: ['失落', '悲伤'], kR: ['走出来', '接受支持'], mU: '关注失去的,忽略仍拥有的', mR: '开始看到身边的支持,情绪回温' },
  { id: 'six', rank: 6, nameZh: '六', kU: ['怀旧', '纯真'], kR: ['困在过去', '不愿长大'], mU: '纯真的相遇或重温美好记忆', mR: '困在过去的甜蜜中,无法活在当下' },
  { id: 'seven', rank: 7, nameZh: '七', kU: ['幻想', '选择'], kR: ['看清', '决断'], mU: '面对多重选择与诱惑,看清真相', mR: '幻想破灭,开始脚踏实地' },
  { id: 'eight', rank: 8, nameZh: '八', kU: ['离开', '寻找'], kR: ['留下', '害怕改变'], mU: '离开不再合适的,寻找更深意义', mR: '害怕改变而留下,需要勇气' },
  { id: 'nine', rank: 9, nameZh: '九', kU: ['满足', '心愿成真'], kR: ['空虚', '错失'], mU: '愿望实现,情感上的满足与感恩', mR: '外在得到但内在空虚,需重整' },
  { id: 'ten', rank: 10, nameZh: '十', kU: ['圆满', '家庭幸福'], kR: ['破裂', '不和谐'], mU: '情感与家庭的圆满时刻', mR: '家庭或社群出现裂痕,需要修复' },
  { id: 'page', rank: 11, nameZh: '侍从', kU: ['敏感', '讯息'], kR: ['情绪化', '不成熟'], mU: '带来情感讯息的小使者,易感细腻', mR: '情绪化或易受伤,需要被温柔对待' },
  { id: 'knight', rank: 12, nameZh: '骑士', kU: ['浪漫', '邀请'], kR: ['不实际', '情绪化承诺'], mU: '浪漫的邀约,跟随心去', mR: '浪漫变得不切实际,需要落地的承诺' },
  { id: 'queen', rank: 13, nameZh: '王后', kU: ['共情', '直觉'], kR: ['情绪依赖', '自溺'], mU: '温柔共情、直觉敏锐的疗愈者', mR: '过度共情失去自我,陷入情绪依赖' },
  { id: 'king', rank: 14, nameZh: '国王', kU: ['情感成熟', '包容'], kR: ['冷漠', '操控情绪'], mU: '情感成熟、包容有智慧', mR: '情感封闭或操控他人情绪' },
];

const SWORDS_RANKS = [
  { id: 'ace', rank: 1, nameZh: '首牌', kU: ['突破', '清晰'], kR: ['混乱', '误用'], mU: '思维的突破与清晰,真相显现', mR: '思维混乱,真相被扭曲' },
  { id: 'two', rank: 2, nameZh: '二', kU: ['僵局', '抉择'], kR: ['打破僵局', '拖延'], mU: '陷入两难,需要做艰难决定', mR: '僵局即将打破,真相浮出' },
  { id: 'three', rank: 3, nameZh: '三', kU: ['心碎', '痛'], kR: ['疗愈', '走出'], mU: '心碎的时刻,允许悲伤存在', mR: '开始走出伤痛,伤口愈合中' },
  { id: 'four', rank: 4, nameZh: '四', kU: ['休息', '复原'], kR: ['倦怠', '过度警觉'], mU: '需要休息与恢复,给身心充电', mR: '无法真正放松,持续紧绷' },
  { id: 'five', rank: 5, nameZh: '五', kU: ['冲突', '争斗'], kR: ['和解', '释怀'], mU: '冲突与争斗,赢了也输了', mR: '开始放下争斗,寻求和解' },
  { id: 'six', rank: 6, nameZh: '六', kU: ['过渡', '放下'], kR: ['卡住', '拒绝放下'], mU: '平静地过渡,放下过往', mR: '被过去卡住,需要主动松手' },
  { id: 'seven', rank: 7, nameZh: '七', kU: ['策略', '机敏'], kR: ['坦白', '自欺'], mU: '用智谋达成目的,但小心欺诈', mR: '真相坦白后,获得真正的自由' },
  { id: 'eight', rank: 8, nameZh: '八', kU: ['束缚', '受限'], kR: ['解放', '看清'], mU: '被自己的想法束缚,意识到是关键', mR: '看清自己设的限,开始挣脱' },
  { id: 'nine', rank: 9, nameZh: '九', kU: ['焦虑', '噩梦'], kR: ['缓解', '看清恐惧'], mU: '焦虑与担忧放大,实际没那么糟', mR: '焦虑开始缓解,看清恐惧真相' },
  { id: 'ten', rank: 10, nameZh: '十', kU: ['终局', '触底'], kR: ['回升', '最坏已过'], mU: '事情触底,但也是新生的起点', mR: '最坏的已经过去,开始回升' },
  { id: 'page', rank: 11, nameZh: '侍从', kU: ['好奇', '学习'], kR: ['八卦', '流言'], mU: '求知欲旺盛,带来新消息', mR: '流言蜚语,需要分辨真伪' },
  { id: 'knight', rank: 12, nameZh: '骑士', kU: ['行动', '雄心'], kR: ['鲁莽', '独裁'], mU: '迅速的行动派,智识充沛', mR: '行动过于鲁莽,可能伤人' },
  { id: 'queen', rank: 13, nameZh: '王后', kU: ['独立', '公正'], kR: ['冷酷', '偏见'], mU: '独立思考、冷静公正的女性力量', mR: '冷静变成冷酷,被偏见主导' },
  { id: 'king', rank: 14, nameZh: '国王', kU: ['权威', '决断'], kR: ['专制', '暴虐'], mU: '智识权威,清晰决断的领导者', mR: '权威变专制,压迫他人' },
];

const PENTACLES_RANKS = [
  { id: 'ace', rank: 1, nameZh: '首牌', kU: ['机会', '丰盛'], kR: ['错失', '短视'], mU: '物质/事业的新机会,把握好开端', mR: '机会被错失或看得太近' },
  { id: 'two', rank: 2, nameZh: '二', kU: ['平衡', '灵活'], kR: ['失衡', '混乱'], mU: '在多个事务中灵活平衡', mR: '多线作战顾此失彼' },
  { id: 'three', rank: 3, nameZh: '三', kU: ['协作', '技艺'], kR: ['缺乏协调', '质量差'], mU: '团队协作与技艺的展现', mR: '协作不佳,产出质量受影响' },
  { id: 'four', rank: 4, nameZh: '四', kU: ['稳定', '持有'], kR: ['吝啬', '恐惧失去'], mU: '稳定保有资源,安全感建立', mR: '守财或害怕失去而不敢投入' },
  { id: 'five', rank: 5, nameZh: '五', kU: ['困境', '孤独'], kR: ['走出', '接受帮助'], mU: '物质或情感上的困难,寻求支持', mR: '困境开始松动,接受他人帮助' },
  { id: 'six', rank: 6, nameZh: '六', kU: ['慷慨', '给予'], kR: ['不公', '剥削'], mU: '慷慨的给予与接受,能量流动', mR: '给予变得不公或被剥削' },
  { id: 'seven', rank: 7, nameZh: '七', kU: ['耐心', '评估'], kR: ['焦虑', '操之过急'], mU: '耐心评估,耕耘终有收获', mR: '急于求成,需要慢下来' },
  { id: 'eight', rank: 8, nameZh: '八', kU: ['勤奋', '精进'], kR: ['匠气', '工作狂'], mU: '持续精进,手艺与成就', mR: '变成机械工作,失去乐趣' },
  { id: 'nine', rank: 9, nameZh: '九', kU: ['丰盛', '独立'], kR: ['依赖', '虚华'], mU: '享受努力的丰盛成果,独立自信', mR: '丰盛被依赖或虚荣消耗' },
  { id: 'ten', rank: 10, nameZh: '十', kU: ['世代', '家业'], kR: ['家族冲突', '遗产纷争'], mU: '家族与家业的丰盛传承', mR: '家族资源引发纷争或不和' },
  { id: 'page', rank: 11, nameZh: '侍从', kU: ['勤学', '新工作'], kR: ['懒散', '无目标'], mU: '踏实好学的学生,带来新机会', mR: '缺乏目标或不够投入' },
  { id: 'knight', rank: 12, nameZh: '骑士', kU: ['稳健', '坚持'], kR: ['停滞', '固执'], mU: '稳健踏实的推进者', mR: '过于保守或陷入停滞' },
  { id: 'queen', rank: 13, nameZh: '王后', kU: ['务实', '滋养'], kR: ['过度关注物质', '忽视精神'], mU: '务实且滋养他人的照顾者', mR: '过度关注物质忽视灵性' },
  { id: 'king', rank: 14, nameZh: '国王', kU: ['富足', '成就'], kR: ['贪婪', '物质主义'], mU: '物质成就的典范,慷慨分享', mR: '成功变贪婪,物质至上' },
];

const WANDS = makeMinor('wands', '权杖', WAND,
  ['激情', '行动'], ['倦怠', '挫败'], WANDS_RANKS);
const CUPS = makeMinor('cups', '圣杯', CUP,
  ['情感', '关系'], ['疏离', '冷漠'], CUPS_RANKS);
const SWORDS = makeMinor('swords', '宝剑', SWORD,
  ['思维', '沟通'], ['混乱', '冲突'], SWORDS_RANKS);
const PENTACLES = makeMinor('pentacles', '星币', PENT,
  ['物质', '身体'], ['匮乏', '失衡'], PENTACLES_RANKS);

export const ALL_CARDS: TarotCard[] = [...MAJOR, ...WANDS, ...CUPS, ...SWORDS, ...PENTACLES]
  .map((c): TarotCard => {
    const isMajor = c.id.startsWith('major-');
    const suit = isMajor ? undefined : (c.id.split('-')[0] as Suit);
    const major = isMajor ? MAJOR_CORRESPONDENCE[c.number] : undefined;
    return {
      id: c.id,
      arcana: isMajor ? 'major' : 'minor',
      suit,
      number: c.number,
      nameEn: c.nameEn,
      nameZh: c.nameZh,
      keywordsUpright: c.keywordsU,
      keywordsReversed: c.keywordsR,
      meaningUpright: c.meaningU,
      meaningReversed: c.meaningR,
      symbol: c.symbol,
      element: major ? major.element : SUIT_ELEMENT[suit as Suit],
      astro: major ? major.astro : '',
    };
  });

export const CARDS_BY_ID: Record<string, TarotCard> =
  ALL_CARDS.reduce((acc, c) => { acc[c.id] = c; return acc; }, {} as Record<string, TarotCard>);

export function getCard(id: string): TarotCard | undefined {
  return CARDS_BY_ID[id];
}

/** 图鉴分组:大阿卡纳 + 四花色 */
export const CARD_GROUPS: { title: string; cards: TarotCard[] }[] = [
  { title: '大阿卡纳', cards: ALL_CARDS.filter(c => c.arcana === 'major') },
  { title: '权杖 · 火', cards: ALL_CARDS.filter(c => c.suit === 'wands') },
  { title: '圣杯 · 水', cards: ALL_CARDS.filter(c => c.suit === 'cups') },
  { title: '宝剑 · 风', cards: ALL_CARDS.filter(c => c.suit === 'swords') },
  { title: '星币 · 土', cards: ALL_CARDS.filter(c => c.suit === 'pentacles') },
];
