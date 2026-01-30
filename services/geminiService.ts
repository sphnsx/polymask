import { GoogleGenAI, Type } from "@google/genai";
import { Man, Persona, GameStats, Scenario, TurnResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateScenario = async (
  persona: Persona,
  activeTargets: Man[],
  stats: GameStats
): Promise<Scenario> => {
  
  // Fallback for demo if API key is missing or fails
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Using fallback scenario.");
    const randomMan = activeTargets[Math.floor(Math.random() * activeTargets.length)];
    return {
      aggressorId: randomMan.id,
      aggressorName: randomMan.name,
      description: `[离线模式] 现在是晚上8:00。${randomMan.name} (${randomMan.alias}) 发来消息：“我在楼下。” 你现在不在家。他看起来很怀疑。`,
      options: [
        { id: 'A', text: "谎言：'我在健身房。'", risk: 'Low', type: 'Lie' },
        { id: 'B', text: "反击：'你为什么不先打个电话？'", risk: 'High', type: 'Gaslight' },
        { id: 'C', text: `使用特质：${persona.trait}`, risk: 'Low', type: 'Trait' }
      ]
    };
  }

  const targetsInfo = activeTargets.map(t => `${t.name} (${t.archetype}): ${t.riskFactor}`).join('\n');

  const prompt = `
    You are the Game Master for a high-stakes social deduction game called "PolyMask".
    
    Current State:
    - Player Persona: ${persona.name} (Trait: ${persona.trait}, Weakness: ${persona.weakness})
    - Active Targets (The Men): 
    ${targetsInfo}
    - Global Suspicion: ${stats.suspicion}%
    - Player Fatigue: ${stats.fatigue}%
    - Turn: ${stats.turn}

    Task: Generate a challenging scenario involving ONE of the active targets. The target is suspicious or needy.
    The scenario should be short, tense, and noir-styled.
    
    **CRITICAL: The output content must be in Simplified Chinese (简体中文).**
    
    Provide 3 options for the player (Options text in Chinese):
    A: A standard Lie (Costs Fatigue).
    B: A risky Deflection/Gaslight (Costs Suspicion).
    C: A unique option using the Persona's specific Trait (${persona.trait}).

    Return ONLY JSON with this schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aggressorName: { type: Type.STRING },
            description: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, enum: ["A", "B", "C"] },
                  text: { type: Type.STRING },
                  risk: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const data = JSON.parse(text);
    
    // Map back to our internal structure to ensure IDs match
    const aggressor = activeTargets.find(t => data.aggressorName.includes(t.name)) || activeTargets[0];
    
    return {
      aggressorId: aggressor.id,
      aggressorName: aggressor.name,
      description: data.description,
      options: data.options
    };

  } catch (error) {
    console.error("Gemini Gen Error:", error);
    // Fallback on error
    const randomMan = activeTargets[0];
    return {
      aggressorId: randomMan.id,
      aggressorName: randomMan.name,
      description: `系统错误。连接不稳定。${randomMan.name} 正盯着你等待回复。`,
      options: [
        { id: 'A', text: "心不在焉地道歉。", risk: 'Low', type: 'Neutral' },
        { id: 'B', text: "指责他干涉你的生活。", risk: 'High', type: 'Aggressive' },
        { id: 'C', text: `调用特质：${persona.trait}`, risk: 'Low', type: 'Trait' }
      ]
    };
  }
};

export const resolveTurn = async (
  scenario: Scenario,
  choiceId: string,
  persona: Persona,
  stats: GameStats
): Promise<TurnResult> => {
   // Fallback for demo
   if (!process.env.API_KEY) {
     const choice = scenario.options.find(o => o.id === choiceId);
     return {
       outcomeText: `[离线] 你选择了 ${choice?.type}。效果一般。`,
       fatigueChange: choiceId === 'A' ? 15 : 5,
       suspicionChange: choiceId === 'B' ? 10 : 0,
       survived: true
     };
   }

   const choice = scenario.options.find(o => o.id === choiceId);

   const prompt = `
    Game Context: PolyMask.
    Scenario: ${scenario.description}
    Aggressor: ${scenario.aggressorName}
    Player Choice: ${choice?.text} (${choice?.type})
    Player Trait: ${persona.trait}
    
    Task: Resolve this turn. 
    1. Write a short outcome narrative (1-2 sentences) in **Simplified Chinese (简体中文)**. Did the lie hold? Did he get suspicious?
    2. Determine numeric changes. 
       - Lying usually increases Fatigue (Mental Load).
       - Gaslighting/Risky moves usually increase Suspicion.
       - Trait usage is usually balanced but situational.
    3. Determine if immediate Game Over (only if risk was High and luck was bad, or Suspicion > 100).
   `;

   try {
     const response = await ai.models.generateContent({
       model: MODEL_NAME,
       contents: prompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.OBJECT,
           properties: {
             outcomeText: { type: Type.STRING },
             fatigueChange: { type: Type.INTEGER },
             suspicionChange: { type: Type.INTEGER },
             survived: { type: Type.BOOLEAN }
           }
         }
       }
     });

     const text = response.text;
     if (!text) throw new Error("Empty response");
     return JSON.parse(text);

   } catch (error) {
     console.error("Gemini Resolution Error", error);
     return {
       outcomeText: "时刻过去了。你不确定他是否真的相信了你。",
       fatigueChange: 10,
       suspicionChange: 5,
       survived: true
     };
   }
};