import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, Persona, Man, GameStats, Scenario, TurnResult, TimeOfDay } from './types';
import { PERSONAS, MEN_DB, getDeathReport } from './constants';
import { generateScenario, resolveTurn } from './services/geminiService';
import Button from './components/Button';
import StatsBar from './components/StatsBar';
import Card from './components/Card';
import { Terminal, Activity, AlertTriangle, Eye, Zap, Shield, Heart, Skull, MessageSquare, User, Menu, Moon, Clock, Calendar, Lock, Image as ImageIcon, Trash2, ChevronDown, ChevronRight, AlertOctagon } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [playerPersona, setPlayerPersona] = useState<Persona | null>(null);
  const [activeTargets, setActiveTargets] = useState<Man[]>([]);
  const [stats, setStats] = useState<GameStats>({ 
    suspicion: 0, 
    fatigue: 0, 
    day: 1, 
    timeOfDay: 'Morning',
    dailyStartSuspicion: 0,
    dailyStartFatigue: 0
  });
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameOverReason, setGameOverReason] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Panic Button State
  const [isDestructConfirm, setIsDestructConfirm] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, currentScenario]);

  const addLog = (text: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('zh-CN', {hour12: false})}] ${text}`]);
  };

  const startGame = () => {
    setPhase(GamePhase.PERSONA_SELECT);
    addLog("协议已启动...");
  };

  const selectPersona = (p: Persona) => {
    setPlayerPersona(p);
    addLog(`身份面具: ${p.name}`);
    setPhase(GamePhase.DRAFT);
  };

  const startDraft = () => {
    const shuffled = [...MEN_DB].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setActiveTargets(selected);
    addLog(`目标已锁定: ${selected.map(m => m.name).join(', ')}`);
    
    // Initialize Stats for Day 1
    const initialStats: GameStats = { 
      suspicion: 0, 
      fatigue: 0, 
      day: 1, 
      timeOfDay: 'Morning',
      dailyStartSuspicion: 0,
      dailyStartFatigue: 0
    };
    setStats(initialStats);
    setPhase(GamePhase.PLAYING);
    generateNextTurn(selected, initialStats);
  };

  const generateNextTurn = async (targets: Man[], currentStats: GameStats) => {
    setLoading(true);
    setTurnResult(null);
    setCurrentScenario(null);

    if (playerPersona) {
      const scenario = await generateScenario(playerPersona, targets, currentStats);
      setCurrentScenario(scenario);
      addLog(`收到通讯: ${scenario.aggressorName}`);
    }
    setLoading(false);
  };

  const handleChoice = async (choiceId: string) => {
    if (!currentScenario || !playerPersona) return;
    
    setLoading(true);
    const result = await resolveTurn(currentScenario, choiceId, playerPersona, stats);
    
    const newSuspicion = Math.max(0, Math.min(100, stats.suspicion + result.suspicionChange));
    const newFatigue = Math.max(0, Math.min(100, stats.fatigue + result.fatigueChange));
    
    const newStats = {
      ...stats,
      suspicion: newSuspicion,
      fatigue: newFatigue,
    };
    
    setStats(newStats);
    setTurnResult(result);
    addLog(`结果: ${result.outcomeText}`);

    // Immediate Game Over Checks
    if (newSuspicion >= 100) {
      addLog("严重失败：怀疑度超出阈值");
      const reasons = ['social_explode', 'investigation_fail', 'location_leak', 'sensory_fail'];
      setGameOverReason(reasons[Math.floor(Math.random() * reasons.length)]);
      setTimeout(() => setPhase(GamePhase.GAME_OVER), 2000);
    } else if (newFatigue >= 100) {
      addLog("严重失败：精神崩溃");
      const reasons = ['logic_fail', 'schedule_clash', 'messy_breakup'];
      setGameOverReason(reasons[Math.floor(Math.random() * reasons.length)]);
      setTimeout(() => setPhase(GamePhase.GAME_OVER), 2000);
    }
    
    setLoading(false);
  };

  const advanceTime = () => {
    let nextTime: TimeOfDay = 'Morning';
    let shouldSummarize = false;

    if (stats.timeOfDay === 'Morning') nextTime = 'Afternoon';
    else if (stats.timeOfDay === 'Afternoon') nextTime = 'Evening';
    else if (stats.timeOfDay === 'Evening') shouldSummarize = true;

    if (shouldSummarize) {
      setPhase(GamePhase.DAILY_SUMMARY);
    } else {
      const nextStats = { ...stats, timeOfDay: nextTime };
      setStats(nextStats);
      generateNextTurn(activeTargets, nextStats);
    }
  };

  const startNextDay = () => {
    // Difficulty Scaling & Sleep Recovery
    // Recovery decreases as days pass: Day 1->2 (30), Day 2->3 (25), etc.
    const sleepRecovery = Math.max(10, 35 - (stats.day * 5)); 
    
    const newFatigue = Math.max(0, stats.fatigue - sleepRecovery);
    const nextDay = stats.day + 1;
    
    const nextStats: GameStats = {
      ...stats,
      day: nextDay,
      timeOfDay: 'Morning',
      fatigue: newFatigue,
      dailyStartFatigue: newFatigue,
      dailyStartSuspicion: stats.suspicion
    };

    setStats(nextStats);
    setPhase(GamePhase.PLAYING);
    addLog(`进入第 ${nextDay} 天。昨晚睡眠恢复了 ${sleepRecovery} 点脑力。`);
    generateNextTurn(activeTargets, nextStats);
  };

  const handlePanicDestruct = () => {
    if (isDestructConfirm) {
        if (stats.fatigue + 50 > 100) {
            addLog("系统警告：脑力不足，无法执行物理销毁。");
            setIsDestructConfirm(false);
            return;
        }
        
        const newFatigue = stats.fatigue + 50;
        const newSuspicion = Math.max(0, stats.suspicion - 30); // Significant reward
        setStats({ ...stats, fatigue: newFatigue, suspicion: newSuspicion });
        addLog(">>> 紧急协议已执行。物理证据已销毁。多疑度大幅下降。");
        addLog(">>> 警告：精神状态接近临界值。");
        setIsDestructConfirm(false);
    } else {
        setIsDestructConfirm(true);
    }
  };

  // --- UI COMPONENTS ---
  
  const Expander = ({ title, icon, children, defaultOpen = false }: any) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                </div>
                {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {isOpen && (
                <div className="p-3 border-t border-zinc-800 bg-black/20 text-sm text-zinc-400 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
  };

  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 transition-transform duration-300
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto custom-scrollbar
    `}>
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-6 shrink-0">
        <div className="w-8 h-8 bg-zinc-100 rounded-sm flex items-center justify-center text-black font-black text-xl">P</div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">PolyMask</h1>
          <div className="text-xs text-zinc-500 font-mono">DASHBOARD v2.0</div>
        </div>
      </div>

      <div className="space-y-6 shrink-0">
        {/* Day/Time Info */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
             <Calendar className="w-4 h-4 text-emerald-500" />
             <span className="font-mono text-sm font-bold">DAY {stats.day}</span>
           </div>
           <div className="flex items-center gap-2">
             <Clock className="w-4 h-4 text-zinc-500" />
             <span className="font-mono text-xs text-zinc-400 uppercase">{stats.timeOfDay}</span>
           </div>
        </div>

        {/* Status Section */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3 h-3" /> 实时状态 (Live Status)
          </div>
          <StatsBar label="多疑度 (Suspicion)" value={stats.suspicion} color="red" icon={<Eye className="w-3 h-3"/>} />
          <StatsBar label="脑力值 (Fatigue)" value={stats.fatigue} color="blue" icon={<Zap className="w-3 h-3"/>} />
        </div>
      </div>
      
      {/* Phone OS Section */}
      <div className="space-y-2 shrink-0">
         <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Lock className="w-3 h-3" /> 个人终端 (OS)
         </div>
         
         <Expander title="日程表 (Calendar)" icon={<Calendar className="w-3 h-3" />}>
             <div className="space-y-3 font-mono text-xs">
                 <div className={`flex gap-3 items-center ${stats.timeOfDay === 'Morning' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                     <span className="opacity-70">09:00</span>
                     <span className="border-l border-zinc-700 pl-2">晨间瑜伽 (Private)</span>
                 </div>
                 <div className={`flex gap-3 items-center ${stats.timeOfDay === 'Afternoon' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                     <span className="opacity-70">14:00</span>
                     <span className="border-l border-zinc-700 pl-2">画廊例会 / 咖啡</span>
                 </div>
                 <div className={`flex gap-3 items-center ${stats.timeOfDay === 'Evening' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                     <span className="opacity-70">20:00</span>
                     <span className="border-l border-zinc-700 pl-2 font-bold">与晏先生晚餐</span>
                 </div>
                  <div className="flex gap-3 items-center text-zinc-500">
                     <span className="opacity-70">23:00</span>
                     <span className="border-l border-zinc-700 pl-2 text-zinc-600 italic">阿良 (未读消息 x3)</span>
                 </div>
             </div>
         </Expander>

         <Expander title="加密相册 (Gallery)" icon={<ImageIcon className="w-3 h-3" />}>
             <div className="space-y-2">
                 <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex gap-3 items-center hover:bg-zinc-800 transition-colors cursor-help group">
                     <div className="w-8 h-8 bg-black flex items-center justify-center rounded text-zinc-700 group-hover:text-zinc-500">
                         <ImageIcon className="w-4 h-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="text-[10px] text-zinc-400 truncate font-mono">IMG_20241024_NIGHT.jpg</div>
                         <div className="text-[10px] text-red-500 font-bold">RISK: HIGH (反射倒影)</div>
                     </div>
                 </div>
                 <div className="p-2 bg-zinc-900 rounded border border-zinc-800 flex gap-3 items-center hover:bg-zinc-800 transition-colors cursor-help group">
                     <div className="w-8 h-8 bg-black flex items-center justify-center rounded text-zinc-700 group-hover:text-zinc-500">
                         <ImageIcon className="w-4 h-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="text-[10px] text-zinc-400 truncate font-mono">SCREENSHOT_CHAT_03.png</div>
                         <div className="text-[10px] text-zinc-600">SAFE (已归档)</div>
                     </div>
                 </div>
             </div>
         </Expander>
      </div>

      {/* Target List filler if space permits */}
      {activeTargets.length > 0 && (
         <div className="space-y-2 shrink-0">
             <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-3 h-3" /> 活跃对象 (Targets)
             </div>
             <div className="space-y-2">
                {activeTargets.map(t => (
                  <div key={t.id} className={`p-2 rounded border text-xs flex justify-between items-center ${currentScenario?.aggressorName.includes(t.name) ? 'bg-red-950/20 border-red-900/50 text-red-200' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                    <span>{t.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  </div>
                ))}
             </div>
         </div>
      )}

      {/* Panic Button */}
      <div className="mt-auto pt-6 border-t border-zinc-800 shrink-0">
          <button 
              onClick={handlePanicDestruct}
              className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase transition-all duration-200
                  ${isDestructConfirm 
                      ? 'bg-red-950/50 border-red-500 text-red-500 animate-pulse' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-red-900 hover:text-red-900'}
              `}
          >
              {isDestructConfirm ? (
                  <>
                      <AlertOctagon className="w-4 h-4" />
                      确认销毁 (-50脑力)
                  </>
              ) : (
                  <>
                      <Trash2 className="w-4 h-4" />
                      一键销毁 (PANIC)
                  </>
              )}
          </button>
      </div>
    </aside>
  );

  // --- MAIN RENDER ---

  if (phase === GamePhase.MENU) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950"></div>
        <div className="z-10 text-center max-w-2xl animate-in fade-in zoom-in duration-1000">
          <div className="mb-10 relative inline-block">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              POLYMASK
            </h1>
            <div className="text-sm font-mono text-zinc-500 tracking-[0.5em] uppercase border-t border-zinc-800 pt-4">Social Protocol V2.0</div>
          </div>
          <p className="text-zinc-400 mb-12 font-mono text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            <span className="text-zinc-500">&lt;system&gt;</span> 初始化多线程情感模拟... <br/>
            在高风险的社交网络中，你的每一个谎言都是必须维护的资产。
            <span className="text-zinc-500">&lt;/system&gt;</span>
          </p>
          <Button onClick={startGame} className="animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.2)]">接入系统</Button>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.PERSONA_SELECT) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <div className="container mx-auto p-6 md:p-12 max-w-6xl">
          <header className="mb-12">
            <div className="text-xs font-mono text-zinc-500 mb-2">SETUP PHASE 01</div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <User className="w-8 h-8" /> 选择你的伪装 (Identity)
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAS.map(p => (
              <Card 
                key={p.id} 
                title={p.name} 
                active={playerPersona?.id === p.id}
                onClick={() => selectPersona(p)}
                className="group h-full flex flex-col hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <p className="text-zinc-500 text-xs mb-4 uppercase font-mono tracking-wide">{p.role}</p>
                <p className="mb-6 text-sm text-zinc-300 leading-relaxed flex-1">"{p.description}"</p>
                <div className="flex flex-col gap-2 mt-auto text-xs font-mono pt-4 border-t border-zinc-800/50">
                  <span className="text-emerald-400 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> {p.trait}
                  </span>
                  <span className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> {p.weakness}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.GAME_OVER || phase === GamePhase.VICTORY) {
    const report = getDeathReport(gameOverReason);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white text-center">
        {phase === GamePhase.VICTORY ? (
           <Heart className="w-24 h-24 text-emerald-500 mb-8 animate-bounce" />
        ) : (
           <Skull className="w-24 h-24 text-red-500 mb-8 animate-pulse" />
        )}
        <h1 className="text-6xl font-black mb-2 tracking-tight">
          {phase === GamePhase.VICTORY ? "完美闭环" : "系统崩溃"}
        </h1>
        <div className="text-zinc-500 font-mono mb-8 uppercase tracking-widest text-sm">Session Terminated</div>
        
        <div className="max-w-xl w-full mx-auto mb-10 bg-black border border-zinc-800 p-8 rounded-xl text-left font-mono text-sm leading-relaxed text-zinc-300 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
           <pre className="whitespace-pre-wrap font-mono text-zinc-400">{report}</pre>
        </div>

        <Button onClick={() => setPhase(GamePhase.MENU)}>重启协议</Button>
      </div>
    );
  }

  // --- DAILY SUMMARY SCREEN ---
  if (phase === GamePhase.DAILY_SUMMARY) {
     const suspicionChange = stats.suspicion - stats.dailyStartSuspicion;
     const fatigueChange = stats.fatigue - stats.dailyStartFatigue;

     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white font-sans">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in duration-500">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-emerald-500 to-zinc-800"></div>
             
             <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-4">
                 <Moon className="w-6 h-6 text-zinc-400" />
               </div>
               <h2 className="text-2xl font-bold tracking-tight">每日生存报告</h2>
               <p className="text-zinc-500 font-mono text-sm mt-1">DAY {stats.day} COMPLETE</p>
             </div>

             <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                   <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-red-500" />
                      <span className="text-zinc-400 text-sm">今日多疑度变化</span>
                   </div>
                   <span className={`font-mono font-bold ${suspicionChange > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                     {suspicionChange > 0 ? '+' : ''}{suspicionChange}%
                   </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                   <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <span className="text-zinc-400 text-sm">今日脑力消耗</span>
                   </div>
                   <span className={`font-mono font-bold ${fatigueChange > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                     {fatigueChange > 0 ? '+' : ''}{fatigueChange}%
                   </span>
                </div>
             </div>
             
             <div className="text-center">
                <div className="inline-block px-4 py-1 bg-emerald-950/30 border border-emerald-900/50 rounded-full text-emerald-400 text-xs font-mono mb-6 animate-pulse">
                   SURVIVAL CONFIRMED
                </div>
                <Button onClick={startNextDay} fullWidth>
                   进入下一天
                </Button>
                <p className="text-[10px] text-zinc-600 mt-4 max-w-xs mx-auto">
                   警告：随着时间推移，脑力恢复效率将逐渐降低。
                </p>
             </div>
          </div>
       </div>
     );
  }

  // --- PLAYING LOOP LAYOUT ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex">
      <Sidebar />
      
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-800 rounded-md border border-zinc-700"
      >
        <Menu className="w-6 h-6 text-zinc-300" />
      </button>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 p-6 md:p-12 flex flex-col min-h-screen max-w-5xl mx-auto">
        
        {phase === GamePhase.DRAFT ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 relative">
                <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-ping"></div>
                <Activity className="w-10 h-10 text-emerald-500" />
             </div>
             <h2 className="text-3xl font-bold font-mono uppercase mb-4">扫描社交网络</h2>
             <p className="text-zinc-500 font-mono mb-8 max-w-sm">正在检索附近的活跃节点与潜在冲突...</p>
             <Button onClick={startDraft} className="w-64">开始检索</Button>
           </div>
        ) : (
          <div className="flex-1 flex flex-col justify-end max-w-3xl mx-auto w-full">
             
             {/* Dynamic Time Header for Mobile / Desktop Main View */}
             <div className="mb-auto pt-10 md:pt-0">
               <div className="flex items-center gap-2 text-zinc-600 font-mono text-xs uppercase tracking-widest border-b border-zinc-800 pb-2">
                 <span>Day {stats.day}</span>
                 <span className="text-zinc-800">//</span>
                 <span className={stats.timeOfDay === 'Evening' ? 'text-indigo-400' : 'text-zinc-400'}>{stats.timeOfDay}</span>
               </div>
             </div>

             {/* Current Scenario Bubble */}
             {loading && !currentScenario && (
               <div className="flex items-start gap-4 mb-8 animate-pulse mt-8">
                 <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700"></div>
                 <div className="h-20 bg-zinc-800 rounded-2xl w-2/3"></div>
               </div>
             )}

             {!loading && currentScenario && !turnResult && (
               <div className="animate-in slide-in-from-bottom-4 duration-500 mt-8">
                 {/* Incoming Message */}
                 <div className="flex items-start gap-4 mb-8 group">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0 text-lg font-bold text-zinc-500">
                      {currentScenario.aggressorName.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1 max-w-2xl w-full">
                      <div className="text-xs text-zinc-500 font-mono ml-1 flex gap-2">
                        <span>{currentScenario.aggressorName}</span>
                        <span>•</span>
                        <span>Now</span>
                      </div>
                      <div className="bg-zinc-800/80 border border-zinc-700 p-6 rounded-2xl rounded-tl-sm shadow-xl backdrop-blur-sm relative">
                        {/* Tags */}
                        {currentScenario.tags && (
                          <div className="flex gap-2 mb-4">
                            {currentScenario.tags.map(tag => (
                              <span key={tag} className="text-[10px] uppercase font-mono bg-black/30 text-zinc-400 px-2 py-1 rounded border border-zinc-700/50">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="prose prose-invert prose-sm leading-7 text-zinc-200 whitespace-pre-line font-medium">
                          {currentScenario.description.trim()}
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Options */}
                 <div className="grid grid-cols-1 gap-3 pl-14">
                   {currentScenario.options.map(opt => (
                     <button 
                        key={opt.id}
                        onClick={() => handleChoice(opt.id)}
                        className="group relative w-full text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 p-5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99]"
                     >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                             选项 {opt.id}
                          </span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider border ${
                            opt.risk === 'Low' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' :
                            opt.risk === 'High' ? 'bg-red-950/30 text-red-400 border-red-900/50' :
                            'bg-yellow-950/30 text-yellow-400 border-yellow-900/50'
                          }`}>
                            {opt.risk} Risk
                          </span>
                        </div>
                        <div className="text-zinc-200 font-medium pr-8">{opt.text}</div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MessageSquare className="w-4 h-4 text-zinc-500" />
                        </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* Turn Result Bubble */}
             {turnResult && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pl-14 mb-8 mt-8">
                  <div className="bg-zinc-900 border border-emerald-900/30 p-6 rounded-2xl rounded-tr-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Terminal className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs font-mono text-emerald-500 mb-2 uppercase flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        系统推演结果
                      </div>
                      <p className="text-zinc-200 text-lg leading-relaxed mb-6">{turnResult.outcomeText}</p>
                      
                      <div className="flex gap-2 flex-wrap mb-6">
                        {turnResult.suspicionChange !== 0 && (
                           <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${turnResult.suspicionChange > 0 ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'}`}>
                             {turnResult.suspicionChange > 0 ? '+' : ''}{turnResult.suspicionChange} 怀疑度
                           </span>
                        )}
                        {turnResult.fatigueChange !== 0 && (
                           <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${turnResult.fatigueChange > 0 ? 'bg-blue-950 text-blue-400 border border-blue-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'}`}>
                             {turnResult.fatigueChange > 0 ? '+' : ''}{turnResult.fatigueChange} 脑力值
                           </span>
                        )}
                        {turnResult.suspicionChange === 0 && turnResult.fatigueChange === 0 && (
                          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                             无数值变动
                           </span>
                        )}
                      </div>

                      <Button onClick={advanceTime} fullWidth className="bg-zinc-100 hover:bg-white text-black border-none">
                        {stats.timeOfDay === 'Evening' ? '结束今日行程' : '继续'}
                      </Button>
                    </div>
                  </div>
                </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}