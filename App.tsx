import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, Persona, Man, GameStats, Scenario, TurnResult } from './types';
import { PERSONAS, MEN_DB } from './constants';
import { generateScenario, resolveTurn } from './services/geminiService';
import Button from './components/Button';
import StatsBar from './components/StatsBar';
import Card from './components/Card';
import { Terminal, Activity, AlertTriangle, Eye, Zap, Shield, Heart, Skull } from 'lucide-react';

const MAX_TURNS = 10;

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [playerPersona, setPlayerPersona] = useState<Persona | null>(null);
  const [activeTargets, setActiveTargets] = useState<Man[]>([]);
  const [stats, setStats] = useState<GameStats>({ suspicion: 0, fatigue: 0, turn: 1, maxTurns: MAX_TURNS });
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

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
    // Randomly select 3 targets for demo purposes
    const shuffled = [...MEN_DB].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setActiveTargets(selected);
    addLog(`目标已锁定: ${selected.map(m => m.name).join(', ')}`);
    
    // Initialize Game
    setStats({ suspicion: 0, fatigue: 0, turn: 1, maxTurns: MAX_TURNS });
    setPhase(GamePhase.PLAYING);
    generateNextTurn(selected, { suspicion: 0, fatigue: 0, turn: 1, maxTurns: MAX_TURNS });
  };

  const generateNextTurn = async (targets: Man[], currentStats: GameStats) => {
    if (currentStats.turn > currentStats.maxTurns) {
      setPhase(GamePhase.VICTORY);
      return;
    }

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
    
    // Update Stats
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

    // Check End Game Conditions
    if (newSuspicion >= 100) {
      addLog("严重失败：怀疑度超出阈值");
      setTimeout(() => setPhase(GamePhase.GAME_OVER), 2000);
    } else if (newFatigue >= 100) {
      addLog("严重失败：精神崩溃");
      setTimeout(() => setPhase(GamePhase.GAME_OVER), 2000);
    }
    
    setLoading(false);
  };

  const nextTurn = () => {
    const nextStats = { ...stats, turn: stats.turn + 1 };
    setStats(nextStats);
    generateNextTurn(activeTargets, nextStats);
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'Low': return '低风险';
      case 'Medium': return '中风险';
      case 'High': return '高风险';
      case 'Critical': return '极度危险';
      default: return risk;
    }
  };

  // --- RENDER FUNCTIONS ---

  if (phase === GamePhase.MENU) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950"></div>
        <div className="z-10 text-center max-w-2xl">
          <div className="mb-8 relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
              POLYMASK
            </h1>
            <div className="text-xs font-mono text-zinc-500 tracking-[1em] uppercase">社交协议 (Social Protocol)</div>
          </div>
          <p className="text-zinc-400 mb-12 font-mono text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            你是一个说谎者。一个情人。机器中的幽灵。
            <br/>
            维持多段关系。管理怀疑度。别被抓到。
          </p>
          <Button onClick={startGame} className="animate-pulse">启动协议</Button>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.PERSONA_SELECT) {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-zinc-950 text-white flex flex-col">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold font-mono uppercase flex items-center gap-3">
            <Shield className="w-6 h-6" /> 选择伪装身份 (Identity)
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map(p => (
            <Card 
              key={p.id} 
              title={p.name} 
              active={playerPersona?.id === p.id}
              onClick={() => selectPersona(p)}
              className="group"
            >
              <p className="text-zinc-500 text-xs mb-2 uppercase font-mono">{p.role}</p>
              <p className="mb-4 italic opacity-80">"{p.description}"</p>
              <div className="flex flex-col gap-2 mt-auto text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> 特质: {p.trait}
                </span>
                <span className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> 弱点: {p.weakness}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (phase === GamePhase.DRAFT) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white">
        <div className="max-w-md w-full text-center">
          <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold font-mono uppercase mb-4">正在扫描社交网络...</h2>
          <p className="text-zinc-500 font-mono mb-8">正在识别附近的潜在目标。</p>
          <Button onClick={startDraft} fullWidth>锁定目标</Button>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.GAME_OVER || phase === GamePhase.VICTORY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white text-center">
        {phase === GamePhase.VICTORY ? (
           <Heart className="w-20 h-20 text-emerald-500 mb-6" />
        ) : (
           <Skull className="w-20 h-20 text-red-500 mb-6" />
        )}
        <h1 className="text-5xl font-black mb-4">
          {phase === GamePhase.VICTORY ? "协议完成" : "协议终止"}
        </h1>
        <p className="text-zinc-400 font-mono max-w-lg mb-8">
          {phase === GamePhase.VICTORY 
            ? `你在网罗中幸存。怀疑度: ${stats.suspicion}%. 疲劳度: ${stats.fatigue}%.` 
            : `你被抓住了。纸牌屋已倒塌。`}
        </p>
        <Button onClick={() => setPhase(GamePhase.MENU)}>重启系统</Button>
      </div>
    );
  }

  // GAME LOOP UI
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
      
      {/* HEADER STATS */}
      <div className="fixed top-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-6 items-center">
          <div className="w-full grid grid-cols-3 gap-4">
             <div className="col-span-1">
                <StatsBar label="怀疑度" value={stats.suspicion} color="red" icon={<Eye className="w-3 h-3"/>} />
             </div>
             <div className="col-span-1">
                <StatsBar label="疲劳度" value={stats.fatigue} color="purple" icon={<Activity className="w-3 h-3"/>} />
             </div>
             <div className="col-span-1">
                <StatsBar label={`回合 ${stats.turn}/${stats.maxTurns}`} value={(stats.turn/stats.maxTurns)*100} color="green" icon={<Terminal className="w-3 h-3"/>} />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-28 pb-12 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COL: INFO */}
        <div className="md:col-span-4 space-y-4">
           {/* PLAYER CARD */}
           <Card className="border-l-4 border-l-zinc-100">
             <div className="text-xs font-mono text-zinc-500 mb-1">当前身份 (CURRENT IDENTITY)</div>
             <div className="font-bold text-lg">{playerPersona?.name}</div>
             <div className="text-xs text-emerald-400 mt-1 flex gap-1 items-center"><Zap className="w-3 h-3"/> {playerPersona?.trait}</div>
           </Card>

           {/* TARGETS LIST */}
           <div className="space-y-2">
             <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">活跃目标 (Targets)</div>
             {activeTargets.map(t => (
               <div key={t.id} className={`p-3 border border-zinc-800 bg-zinc-900/50 text-sm flex justify-between items-center ${currentScenario?.aggressorId === t.id ? 'border-red-500/50 bg-red-900/10' : ''}`}>
                 <span className="font-bold">{t.name}</span>
                 <span className="text-xs text-zinc-500 font-mono">{t.archetype}</span>
               </div>
             ))}
           </div>

           {/* LOGS */}
           <div className="hidden md:block h-64 overflow-y-auto font-mono text-xs text-zinc-500 border border-zinc-900 p-2 bg-black/20">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
              <div ref={bottomRef} />
           </div>
        </div>

        {/* RIGHT COL: SCENARIO */}
        <div className="md:col-span-8">
           {loading && !currentScenario && (
             <div className="h-full flex items-center justify-center min-h-[300px]">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin"></div>
                  <div className="text-xs font-mono text-zinc-500 animate-pulse">正在解码传入信息...</div>
               </div>
             </div>
           )}

           {!loading && currentScenario && !turnResult && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <Card className="mb-6 border-red-900/30 bg-gradient-to-br from-zinc-900 to-zinc-950">
                 <div className="flex items-center gap-3 mb-4 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-mono font-bold uppercase tracking-wider">突发冲突: {currentScenario.aggressorName}</span>
                 </div>
                 <p className="text-lg md:text-xl leading-relaxed text-zinc-100 font-serif">
                   "{currentScenario.description}"
                 </p>
               </Card>

               <div className="space-y-3">
                 {currentScenario.options.map(opt => (
                   <button 
                      key={opt.id}
                      onClick={() => handleChoice(opt.id)}
                      className="w-full text-left group relative border border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-900 transition-all hover:border-zinc-600"
                   >
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs text-zinc-500 uppercase">选项 {opt.id} — {opt.type}</span>
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          opt.risk === 'Low' ? 'bg-emerald-900 text-emerald-300' :
                          opt.risk === 'High' ? 'bg-red-900 text-red-300' : 
                          'bg-yellow-900 text-yellow-300'
                        }`}>风险: {getRiskLabel(opt.risk)}</span>
                     </div>
                     <div className="text-zinc-200 font-medium">{opt.text}</div>
                     <div className="absolute inset-0 border-2 border-transparent group-hover:border-zinc-700 pointer-events-none"></div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {turnResult && (
              <div className="animate-in zoom-in-95 duration-300">
                <Card className="mb-6 bg-zinc-900 border-zinc-700">
                  <h3 className="text-lg font-bold mb-2 text-white">结果</h3>
                  <p className="text-zinc-300 mb-6">{turnResult.outcomeText}</p>
                  <div className="flex gap-4 mb-6">
                    {turnResult.suspicionChange > 0 && <span className="text-red-400 text-sm font-mono">+ {turnResult.suspicionChange} 怀疑度</span>}
                    {turnResult.fatigueChange > 0 && <span className="text-purple-400 text-sm font-mono">+ {turnResult.fatigueChange} 疲劳度</span>}
                    {turnResult.suspicionChange === 0 && turnResult.fatigueChange === 0 && <span className="text-emerald-400 text-sm font-mono">完美脱身</span>}
                  </div>
                  <Button onClick={nextTurn} fullWidth>进入下一小时</Button>
                </Card>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}