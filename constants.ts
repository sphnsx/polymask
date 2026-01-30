import { Persona, Man, Scenario } from './types';

// ==========================================
// 身份数据库 (PERSONA_DB)
// ==========================================
export const PERSONAS: Persona[] = [
  // --- 初始常驻身份 (Starters) ---
  {
    id: "p_01",
    name: "策展人 (The Curator)",
    role: "画廊策展人",
    description: "你游走于名画与伪作之间。深夜出门‘巡视’是你的职业特权。",
    trait: "审美特权 (Aesthetic Privilege)",
    weakness: "圈层重叠 (Small Circle)"
  },
  {
    id: "p_02",
    name: "深夜电台主播 (The Night-shift DJ)",
    role: "深夜电台主播",
    description: "你是城市阴影里的声音。你的工作时间是天然的社交屏障。",
    trait: "时空错位 (Time Dilation)",
    weakness: "精力贫乏 (Chronic Fatigue)"
  },
  {
    id: "p_03",
    name: "翻译官 (The Translator)",
    role: "翻译官",
    description: "你活在语言的缝隙里。你擅长用多义词构建无法被证伪的谎言。",
    trait: "措辞精确 (Precise Phrasing)",
    weakness: "过度分析 (Over-analysis)"
  },
  {
    id: "p_04",
    name: "瑜伽老师 (The Yoga Instructor)",
    role: "瑜伽老师",
    description: "身体控制即是精神控制。你能在衣柜里保持静止三小时而不气喘。",
    trait: "肉体闪避 (Physical Evasion)",
    weakness: "资源单薄 (Low Resources)"
  },
  // --- 遗产身份 (Legacy Unlocks) ---
  {
    id: "p_05",
    name: "精算师 (The Actuary)",
    role: "精算师",
    description: "诞生于逻辑崩塌之后。现在，你像计算税务一样计算爱情。",
    trait: "概率透视 (Probability Sight)",
    weakness: "情感麻木 (Emotional Numbness)",
    unlockCondition: "logic_fail"
  },
  {
    id: "p_06",
    name: "调香师 (The Perfumer)",
    role: "调香师",
    description: "诞生于气味背叛之后。你在谎言出口前就能闻到它的味道。",
    trait: "气味屏障 (Scent Masking)",
    weakness: "感官过敏 (Hypersensitivity)",
    unlockCondition: "sensory_fail"
  },
  {
    id: "p_07",
    name: "隐居者 (The Recluse)",
    role: "隐居者",
    description: "诞生于社会性死亡之后。你切断了所有连接，成为了数字幽灵。",
    trait: "数字隐身 (Digital Ghost)",
    weakness: "信用破产 (Zero Credit)",
    unlockCondition: "social_explode"
  },
  {
    id: "p_08",
    name: "剧作家 (The Playwright)",
    role: "剧作家",
    description: "诞生于完美通关之后。你不再参与游戏，你是编写剧本的神。",
    trait: "上帝视角 (God Mode)",
    weakness: "自我迷失 (Identity Loss)",
    unlockCondition: "perfect_run"
  },
  {
    id: "p_09",
    name: "私家侦探助手 (The Clerk)",
    role: "私家侦探助手",
    description: "诞生于被监视的恐惧中。现在你学会了反向追踪。",
    trait: "反侦察直觉 (Counter-Intel)",
    weakness: "疑神疑鬼 (Paranoia)",
    unlockCondition: "investigation_fail"
  },
  {
    id: "p_10",
    name: "遗产律师 (The Probate Lawyer)",
    role: "遗产律师",
    description: "诞生于惨烈的分手现场。你学会了在关系结束前清算资产。",
    trait: "冷血分割 (Cold Cut)",
    weakness: "情感坏账 (Emotional Debt)",
    unlockCondition: "messy_breakup"
  },
  {
    id: "p_11",
    name: "流浪艺术家 (The Nomad)",
    role: "流浪艺术家",
    description: "诞生于家门口的修罗场。你不再拥有固定坐标。",
    trait: "居无定所 (No Fixed Abode)",
    weakness: "漂泊无依 (Unstable)",
    unlockCondition: "location_leak"
  },
  {
    id: "p_12",
    name: "急诊科医生 (The ER Doctor)",
    role: "急诊科医生",
    description: "诞生于时间管理的全面崩溃。生与死是你最好的请假条。",
    trait: "紧急征调 (Code Blue)",
    weakness: "极度过劳 (Burnout)",
    unlockCondition: "schedule_clash"
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

// ==========================================
// 场景库 (SCENARIO_DB)
// ==========================================
export const SCENARIO_DB = [
    {
        id: "s_01_audit_clash",
        tags: ["Yan", "Tang", "Dinner"],
        aggressorName: "晏先生 (Mr. Yan)", // Default aggressor if not mapped
        description: `
        [时间: 周五 20:15]
        [地点: 米其林三星餐厅, 8号桌]
        
        你正与 **晏先生** 进行每周一次的“资产评估晚餐”。
        他刚指出你上周五的打车发票与你的步数记录不符（偏差值 1.2公里）。
        
        就在此时，你的手机屏幕亮起。
        **小唐** 发来了视频通话请求。
        屏幕预览是一张他在更衣室赤裸上身的高清照片，配文：“练完了，想你，速接。”
        
        晏先生推了推眼镜，目光落在你的手机屏幕上。
        `,
        options: [
            {
                id: "A",
                text: "【战术性掩盖】 迅速反扣手机，皱眉说：“骚扰电话。最近的大数据泄露真是令人困扰。”",
                risk: "Low",
                type: "Lie",
                effect: {fatigue: 10, suspicion: 5},
                result: "晏先生接受了这个解释，但他随后开始向你科普如何设置防火墙。你必须全神贯注听讲，脑细胞大量死亡。"
            },
            {
                id: "B",
                text: "【极度险招】 接通视频，但在镜头开启前用手指挡住摄像头，大声斥责：“我说了不需要办健身卡！”然后挂断。",
                risk: "Critical",
                type: "Gaslight",
                effect: {fatigue: 5, suspicion: 15},
                result: "晏先生对你的果断表示赞赏。但小唐在微信上发了十个‘心碎’表情，并把签名改成了‘爱是泡沫’。"
            },
            {
                id: "C", 
                text: "【策展人特权】 淡定地把屏幕转向晏先生：“看，这就是我跟你提过的那个行为艺术家。他在探索‘肉体焦虑’的边界。我在考虑签他。”",
                risk: "Low",
                type: "Trait",
                requirement: "p_01", // Curator ID
                effect: {fatigue: 0, suspicion: -5},
                result: "晏先生评价道：‘构图很粗糙，缺乏古典美感，不具备投资价值。’ 他完全相信了。"
            }
        ]
    },
    
    {
        id: "s_02_gift_trap",
        tags: ["Tang", "Home", "Yan"],
        aggressorName: "小唐 (Tang)",
        description: `
        [时间: 周六 09:30]
        [地点: 你的公寓]
        
        **小唐** 突然出现在你家门口（突袭检查）。
        他手里提着一份巨大的早餐和一只印着你们合照的定制马克杯。
        
        问题是，**晏先生** 昨晚留宿，此刻正在浴室洗澡。
        水声停止了。晏先生正在擦头发，距离浴室门打开还有 10 秒。
        门铃正在疯狂响动。
        `,
        options: [
            {
                id: "A",
                text: "【物理隔绝】 冲向门口，把小唐推出去，谎称：“家里水管爆了，全是污水，为了你的限量版球鞋，快走！”",
                risk: "Medium",
                type: "Lie",
                effect: {fatigue: 20, suspicion: 10},
                result: "小唐被你推得踉踉跄跄，虽然疑惑但还是走了。你在浴室门打开前一秒锁上了大门。心率飙升至 140。"
            },
            {
                id: "B",
                text: "【冷血置换】 对浴室喊：“亲爱的，物业来修水管了。” 然后开门对小唐说：“闭嘴，进来修水龙，别说话，否则分手。”",
                risk: "Critical",
                type: "Gaslight",
                effect: {fatigue: 30, suspicion: 20},
                result: "小唐被你的气场震慑，真的去修了水龙头。晏先生以为他是工人，甚至给了他 50 元小费。小唐处于崩溃边缘。"
            },
            {
                id: "C",
                text: "【策展人特权】 打开门，把马克杯拿进来，把早餐扔出去。对小唐说：“我在进行‘封闭式创作’，任何碳水化合物都会破坏灵感。”",
                risk: "Low",
                type: "Trait",
                requirement: "p_01",
                effect: {fatigue: 5, suspicion: 5},
                result: "小唐虽然委屈，但觉得“艺术家的怪癖”很迷人。他乖乖离开了。"
            }
        ]
    },

    {
        id: "s_03_digital_trace",
        tags: ["Yan", "Social_Media"],
        aggressorName: "晏先生 (Mr. Yan)",
        description: `
        [时间: 周一 14:00]
        [地点: 办公室 / 微信群]
        
        系统警告：数据碰撞。
        
        你昨晚发了一条朋友圈：“威士忌与深夜的猫。” 仅对 **小唐** 分组可见。
        但你忘记了 **晏先生** 的表妹也在你的好友列表里，且你没有屏蔽她。
        
        三分钟前，晏先生发来一张截图（来自他表妹）：
        “这张照片背景里的那只猫，不是你养的。而且根据威士忌的倒影，拍照的人穿着荧光色背心。”
        
        晏先生在等待解释。倒计时 60 秒。
        `,
        options: [
            {
                id: "A",
                text: "【逻辑修正】 “那是网图。我在表达一种‘都市孤独感’的情绪，不是实拍。”",
                risk: "Medium",
                type: "Lie",
                effect: {fatigue: 10, suspicion: 20},
                result: "晏先生开始用反向识图引擎搜索原图。你只有半小时时间去P一张原图并发布到Pinterest上作为证据。"
            },
            {
                id: "B",
                text: "【情感反击】 “你竟然监视我？通过你表妹？我对这种不信任感到窒息。”",
                risk: "High",
                type: "Gaslight",
                effect: {fatigue: 5, suspicion: 10},
                result: "经典的 Gaslighting。晏先生暂时退缩了，道歉说只是‘好奇’。但他会在你的信用评级上扣分。"
            },
            {
                id: "C",
                text: "【身份借口：通用】 “那是画廊的新展品——《现代生活的窥视》。那是艺术家的猫，我只是在布展。”",
                risk: "Low",
                type: "Trait",
                requirement: "p_01",
                effect: {fatigue: 0, suspicion: 0},
                result: "晏先生：“原来如此。那个荧光色背心确实很有后现代的廉价感。展览何时开始？我要送花篮。”"
            }
        ]
    },
    
    // ==========================================
    // 新增场景：深夜电台主播 (The Night-shift DJ)
    // ==========================================
    {
        id: "s_04_voice_leak",
        tags: ["DJ", "Lu_Prof", "Broadcast"],
        aggressorName: "陆教授 (Prof. Lu)",
        description: `
        [时间: 周二 02:00]
        [地点: 电台直播间 / 你的公寓]
        
        你正在主持深夜档节目《城市安眠曲》。
        **陆教授** 是你的忠实听众，但他不知道你是主播。他以为你这个点在家睡觉。
        
        为了安抚刚分手的 **阿良**，你在直播中点了一首极其冷门的地下摇滚，并说了一句：“这是送给某个在阳台抽烟的人。”
        
        两分钟后，陆教授发来消息：
        “我在听那个深夜电台。主播的声音和你感冒时的鼻音频率完全一致。而且，她刚刚引用的那句尼采，是我上周在讲座上刚跟你说过的原话。”
        `,
        options: [
            {
                id: "A",
                text: "【否认与反攻】 “我在睡觉。你半夜不睡在听女人的声音分析声纹？这是一种学术变态吗？”",
                risk: "Medium",
                type: "Lie",
                effect: {fatigue: 5, suspicion: 15},
                result: "陆教授被你的反问噎住了。但他开始回听录音，试图寻找更多破绽。"
            },
            {
                id: "B",
                text: "【承认一半】 “那是我录的播客小样，被他们拿去用了。但我没拿到版权费，正烦着呢。”",
                risk: "Low",
                type: "Lie",
                effect: {fatigue: 10, suspicion: 5},
                result: "陆教授立刻转换了模式，开始为你起草维权律师函。危机解除，但你得编造一份合同。"
            },
            {
                id: "C",
                text: "【主播特权：时空错位】 立刻在直播中说：“刚才收到一位听众‘陆先生’的留言。巧了，我的一位朋友也姓陆。陆先生，早点睡，哲学救不了失眠。”",
                risk: "Low",
                type: "Trait",
                requirement: "p_02", // Night-shift DJ
                effect: {fatigue: 0, suspicion: -10},
                result: "这招打破了第四面墙。陆教授认为如果真的是你，绝不敢在广播里直接cue他。他相信了这只是巧合。"
            }
        ]
    },

    // ==========================================
    // 新增场景：瑜伽老师 (The Yoga Instructor)
    // ==========================================
    {
        id: "s_05_body_hide",
        tags: ["Yoga", "Huo_CEO", "Gym"],
        aggressorName: "霍总 (CEO Huo)",
        description: `
        [时间: 周三 11:00]
        [地点: 高端会员制健身房]
        
        你正在私教区给 **小唐** 上课，由于他是你的“男友”，动作有些越界的亲密。
        
        突然，前台传来一阵骚动。**霍总** 带着他的保镖团进来了。
        这家健身房是他名下的产业，他今天是来突击视察的。
        
        霍总正向私教区走来。你和小唐目前位于无遮挡的落地窗前。距离接触还有 15 秒。
        `,
        options: [
            {
                id: "A",
                text: "【甚至不算谎言】 一脚把小唐踹倒，大声呵斥：“核心收紧！我说过多少次了！如果你再这样松懈，我的课你别上了！”",
                risk: "Medium",
                type: "Acting",
                effect: {fatigue: 20, suspicion: 5},
                result: "小唐被踹懵了。霍总路过，看到一个严厉的教练在训斥学员，满意地点了点头走了。"
            },
            {
                id: "B",
                text: "【紧急撤离】 抓起毛巾遮住脸，假装去接水，从霍总视线的死角溜进更衣室。",
                risk: "Medium",
                type: "Evasion",
                effect: {fatigue: 10, suspicion: 10},
                result: "你成功逃脱。但小唐找不到你，开始在健身房大喊你的名字。霍总停下了脚步。"
            },
            {
                id: "C",
                text: "【瑜伽特权：肉体伪装】 迅速进入‘高难倒立折叠’体式（头被腿部完全遮挡），并保持静止。",
                risk: "Low",
                type: "Trait",
                requirement: "p_04", // Yoga Instructor
                effect: {fatigue: 5, suspicion: 0},
                result: "霍总走过，只看到了一堆纠缠的人体雕塑。他完全没认出这个扭曲的形状是你。你甚至听到了他评价‘这个教练柔韧性不错’。"
            }
        ]
    },
    
    // ==========================================
    // 新增场景：精算师 (The Actuary)
    // ==========================================
    {
        id: "s_06_chaos_calculation",
        tags: ["Actuary", "Rocker", "Home_Office"],
        aggressorName: "阿亮 (Rocker)",
        description: `
        [时间: 凌晨 02:14]
        [地点: 书房 / 你的Excel表格]
        
        你正在书房进行上一季度的“情感资产折旧”核算。一切都是完美的、无菌的、网格化的。
        
        突然，窗户被撞开。**阿亮** 像一个未被防火墙拦截的系统错误一样翻了进来。
        他全身散发着劣质啤酒和过剩荷尔蒙的味道，手里提着一只满是油渍的烧烤袋子，直接扔在了你的税务审计文件上。
        
        那滴红油正精确地落在“年度扣除额”这一栏，并以每秒3平方毫米的速度向四周渗透，不仅污染了纸张，也污染了你的逻辑。
        `,
        options: [
            {
                id: "A",
                text: "【资产隔离】 用镊子夹起烧烤袋，连同文件一起扔进碎纸机。“我在处理机密，你的存在是高风险干扰项。”",
                risk: "Low",
                type: "Logic",
                effect: {fatigue: 15, suspicion: 0},
                result: "阿亮觉得你这副冷酷的样子“甚至有点性感”。他试图在碎纸机旁抽烟，你不得不花费30分钟对他进行物理驱逐。"
            },
            {
                id: "B",
                text: "【情绪对冲】 崩溃大喊：“你毁了我的报表！滚出去！”",
                risk: "High",
                type: "Outburst",
                effect: {fatigue: 20, suspicion: 15},
                result: "阿亮从未见过你失控。他愣住了，随后开始大笑，认为你终于“活过来了”。他试图拥抱你，把你昂贵的真丝衬衫也弄脏了。"
            },
            {
                id: "C",
                text: "【精算师特权：概率透视】 推了推眼镜，平静地报出数据：“根据你目前的酒精摄入量和微表情震颤频率，你在3分钟内发生呕吐的概率为89%。浴室在左转尽头，地毯清洁费是 4000 元，建议你做个理性选择。”",
                risk: "Low",
                type: "Trait",
                requirement: "p_05", // Actuary
                effect: {fatigue: 0, suspicion: -10},
                result: "阿亮被你精准的“死亡预言”吓坏了。为了不被当作可预测的数据模型，他强忍着醉意乖乖去了客房，整晚没敢发出声音。"
            }
        ]
    }
];

// ==========================================
// 死亡诊断报告库 (DEATH_REPORT_DB)
// ==========================================
export const DEATH_REPORT_DB: Record<string, string> = {
    "logic_fail": `[系统终端] >> 致命错误: 逻辑溢出\n警告：你的叙事链条在陈述中出现不可逆断裂。\n对象已建立透视表模型，计算出你的谎言方差超过 400%。\n数据不会撒谎，但你会。\n>> 重启协议加载：剔除感性变量，以纯数学模型重构社交策略。`,

    "sensory_fail": `[系统终端] >> 生物危害警报\n检测到非授权的生物样本（代码：金发）与外源性费洛蒙残留。\n对象出现严重的生理排斥反应，视主体为“已污染培养皿”。消毒程序已启动。\n>> 重启协议加载：启用嗅觉屏蔽层。气味是记忆的索引，必须被抹除。`,

    "social_explode": `[系统终端] >> 网络节点崩溃\n监测到关于主体的 JPEG 格式证据链已在三个独立社交群组完成 100% 覆盖。\n你的“名誉”资产已清算为负值。恭喜，你的流量峰值达到历史最高。\n>> 重启协议加载：切断所有现有连接。物理隔绝是唯一存活方案。`,

    "perfect_run": `[系统终端] >> 模拟完成: 完美闭环\n所有对象均维持在“爱慕”阈值内。资源分配效率：100%。\n警告：主体人格完整性检测失败。你已无法区分镜像与本体。\n他们爱的是那个幻影，而你身处虚无。\n>> 重启协议加载：上帝视角已开启。现在，你可以编写他们的命运了。`,

    "investigation_fail": `[系统终端] >> 反侦察协议失败\n主体的物理移动轨迹已被完整捕获。你的辩解在高清长焦镜头下无效。\n猎物往往死于对视线的无知。你暴露在光天化日之下太久了。\n>> 重启协议加载：身份反转。从“被观察者”切换为“观察者”。`,

    "messy_breakup": `[系统终端] >> 契约终止异常\n关系解除过程导致了过高的情绪成本与资源损耗。\n你试图用眼泪解决契约问题，这是低效的。爱是一种高风险资产，你未能及时止损。\n>> 重启协议加载：冷血清算模式。不再投入情感资本。`,

    "location_leak": `[系统终端] >> 位置服务泄露\n你的物理坐标（家）已成为冲突爆发的中心点。\n固定居所是谎言体系中最大的安全漏洞。当门铃响起时，你的命运已定。\n>> 重启协议加载：移除固定坐标。成为流动的幽灵。`,

    "schedule_clash": `[系统终端] >> 时间线重叠冲突\n你的日程表出现了物理上不可能的并发事件。你无法同时存在于两个空间。\n多任务处理导致 CPU（大脑）过热宕机。\n>> 重启协议加载：获得最高优先级的“紧急离场权”。`
};

export const getDeathReport = (reasonCode: string): string => {
    return DEATH_REPORT_DB[reasonCode] || `[系统终端] >> 未知错误导致连接中断。\n原因：${reasonCode}`;
};