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
  archetype: string; // e.g., "Logic_Audit", "Emotion_Bomb"
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
}

export interface Scenario {
  aggressorId: string;
  aggressorName: string;
  description: string;
  options: GameOption[];
}

export interface TurnResult {
  outcomeText: string;
  fatigueChange: number;
  suspicionChange: number;
  survived: boolean;
}

export interface GameStats {
  suspicion: number;
  fatigue: number;
  turn: number;
  maxTurns: number;
}

export enum GamePhase {
  MENU,
  PERSONA_SELECT,
  DRAFT,
  PLAYING,
  GAME_OVER,
  VICTORY
}