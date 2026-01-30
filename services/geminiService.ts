import { GoogleGenAI, Type } from "@google/genai";
import { Man, Persona, GameStats, Scenario, TurnResult, GameOption } from "../types";
import { SCENARIO_DB } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateScenario = async (
  persona: Persona,
  activeTargets: Man[],
  stats: GameStats
): Promise<Scenario> => {
  
  // 1. Randomly select a scenario from SCENARIO_DB
  const scenarioTemplate = SCENARIO_DB[Math.floor(Math.random() * SCENARIO_DB.length)];

  // 2. Process Options (Check Requirements)
  const processedOptions: GameOption[] = scenarioTemplate.options.map(opt => {
    // If option has a requirement, check if player persona ID matches
    if (opt.requirement) {
      if (persona.id === opt.requirement) {
        return opt as GameOption; // Requirement met
      } else {
        // Requirement NOT met, return Failure Option
        return {
          id: opt.id as any,
          text: "【无特殊技能】 只能保持沉默，祈祷奇迹发生。",
          risk: "High",
          type: "Failure",
          effect: { fatigue: 20, suspicion: 20 },
          result: "沉默被视为默认。气氛尴尬到了极点。"
        } as GameOption;
      }
    }
    // No requirement, return as is
    return opt as GameOption;
  });

  // Inject dynamic time into description if possible, or just append context
  // Note: The static DB descriptions have hardcoded times. We can prepend the dynamic time.
  const timeStr = `Day ${stats.day} - ${stats.timeOfDay}`;
  const dynamicDescription = `[系统时间: ${timeStr}]\n${scenarioTemplate.description}`;

  return {
    id: scenarioTemplate.id,
    aggressorId: "static_aggressor", // Placeholder, usually implied in text
    aggressorName: scenarioTemplate.aggressorName,
    description: dynamicDescription,
    options: processedOptions,
    tags: scenarioTemplate.tags
  };
};

export const resolveTurn = async (
  scenario: Scenario,
  choiceId: string,
  persona: Persona,
  stats: GameStats
): Promise<TurnResult> => {
   
   // 1. Check if the chosen option has a pre-defined result (from SCENARIO_DB)
   const choice = scenario.options.find(o => o.id === choiceId);

   if (choice && choice.result && choice.effect) {
     return {
       outcomeText: choice.result,
       fatigueChange: choice.effect.fatigue,
       suspicionChange: choice.effect.suspicion,
       survived: true
     };
   }

   // 2. Fallback to Gemini if no pre-defined result (Legacy support)
   if (!process.env.API_KEY) {
     return {
       outcomeText: `[离线] 你选择了 ${choice?.type}。效果未知。`,
       fatigueChange: 10,
       suspicionChange: 5,
       survived: true
     };
   }

   const prompt = `
    Game Context: PolyMask.
    Current Time: Day ${stats.day} - ${stats.timeOfDay}.
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