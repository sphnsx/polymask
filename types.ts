export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  trait: string;
  weakness: string;
  unlockCondition?: string;
}

export interface Man {
  id: string;
  name: string;
  alias: string;
  archetype: string; 
  riskFactor: string;
  dialogueStyle: string;
  status: 'Active' | 'Suspicious' | 'Broken';
  suspicion: number;
}

export interface GameOption {
  id: 'A' | 'B' | 'C';
  text: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  type: string; // "Lie", "Gaslight", "Trait", etc.
  // New fields for static scenarios
  effect?: { fatigue: number; suspicion: number };
  result?: string;
  requirement?: string;
}

export interface Scenario {
  id?: string;
  aggressorId: string;
  aggressorName: string;
  description: string;
  options: GameOption[];
  tags?: string[];
}

export interface TurnResult {
  outcomeText: string;
  fatigueChange: number;
  suspicionChange: number;
  survived: boolean;
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export interface GameStats {
  suspicion: number;
  fatigue: number;
  day: number;
  timeOfDay: TimeOfDay;
  // Tracking for daily summary
  dailyStartSuspicion: number;
  dailyStartFatigue: number;
}

export enum GamePhase {
  MENU,
  PERSONA_SELECT,
  DRAFT,
  PLAYING,
  DAILY_SUMMARY,
  GAME_OVER,
  VICTORY
}