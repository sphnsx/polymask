import { Persona, Man } from './types';

export const PERSONAS: Persona[] = [
  {
    id: "p_01",
    name: "策展人 (The Curator)",
    role: "画廊策展人",
    description: "你在空旷的展厅中策划孤独。深夜是你的不在场证明。",
    trait: "审美特权",
    weakness: "社交圈狭窄"
  },
  {
    id: "p_02",
    name: "深夜DJ (The DJ)",
    role: "深夜电台主播",
    description: "你的声音是一张面具。你在别人入睡时工作。",
    trait: "时间膨胀",
    weakness: "长期疲劳"
  },
  {
    id: "p_03",
    name: "翻译官 (The Translator)",
    role: "翻译官",
    description: "你生活在语言的缝隙中。细微差别是你的武器。",
    trait: "精准措辞",
    weakness: "过度分析"
  },
  {
    id: "p_04",
    name: "瑜伽老师 (The Yogi)",
    role: "瑜伽老师",
    description: "控制身体即控制心灵。你能保持一个姿势——和一个谎言——无限久。",
    trait: "身体闪避",
    weakness: "资金匮乏"
  },
  {
    id: "p_05",
    name: "精算师 (The Actuary)",
    role: "精算师",
    description: "生于逻辑故障。现在，你像报税单一样计算爱情。",
    trait: "概率视界",
    weakness: "情感麻木",
    unlockCondition: "logic_fail"
  },
  {
    id: "p_06",
    name: "调香师 (The Perfumer)",
    role: "调香师",
    description: "生于气味的背叛。你在谎言出口前就能闻到它。",
    trait: "气味伪装",
    weakness: "过敏体质",
    unlockCondition: "sensory_fail"
  }
];

export const MEN_DB: Man[] = [
  { id: "m_01", name: "晏先生", alias: "Mr. Yan", archetype: "Logic_Audit", riskFactor: "检查你收据上的时间戳。", dialogueStyle: "冷酷，分析型，企业化", status: 'Active', suspicion: 0 },
  { id: "m_02", name: "小唐", alias: "Tang", archetype: "Emotion_Bomb", riskFactor: "每小时要求发自拍。", dialogueStyle: "粘人，高能量，肢体接触", status: 'Active', suspicion: 0 },
  { id: "m_03", name: "陆教授", alias: "Prof. Lu", archetype: "Spirit_Check", riskFactor: "测试你的哲学一致性。", dialogueStyle: "学术，枯燥，洞察力强", status: 'Active', suspicion: 0 },
  { id: "m_04", name: "沈医生", alias: "Dr. Shen", archetype: "Sensory_Detail", riskFactor: "注意到你外套上的一根头发。", dialogueStyle: "临床，无菌，犀利", status: 'Active', suspicion: 0 },
  { id: "m_05", name: "霍总", alias: "CEO Huo", archetype: "Social_Web", riskFactor: "他的司机可能会看到你。", dialogueStyle: "支配，忙碌，资源丰富", status: 'Active', suspicion: 0 },
  { id: "m_06", name: "Ian", alias: "Architect", archetype: "Space_Detail", riskFactor: "注意到花瓶移动了2厘米。", dialogueStyle: "浪漫，观察敏锐，不可预测", status: 'Active', suspicion: 0 },
  { id: "m_07", name: "老韩", alias: "Old Han", archetype: "Interrogation", riskFactor: "解读微表情。", dialogueStyle: "愤世嫉俗，粗鲁，直接", status: 'Active', suspicion: 0 },
  { id: "m_08", name: "Berlin", alias: "Curator", archetype: "Gossip_Node", riskFactor: "认识所有你认识的人。", dialogueStyle: "艺术气息，刻薄，人脉广", status: 'Active', suspicion: 0 },
  { id: "m_09", name: "小顾", alias: "Junior Gu", archetype: "Data_Flood", riskFactor: "用链接轰炸你。", dialogueStyle: "顺从，数字化，执着", status: 'Active', suspicion: 0 },
  { id: "m_10", name: "阿亮", alias: "Rocker", archetype: "Chaos_Agent", riskFactor: "凌晨3点醉醺醺地出现。", dialogueStyle: "狂野，不稳定，吵闹", status: 'Active', suspicion: 0 },
];