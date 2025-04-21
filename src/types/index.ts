export interface Monkey {
  id: number;
  name: string;
  power_type: MonkeyPowerType;
  level: number;
  created_at?: string;
}

export type MonkeyPowerType = 
  'None'
  'Normal'
  'Fire'
  'Water'
  'Grass'
  'Electric'
  'Ice'
  'Fighting'
  'Poison'
  'Ground'
  'Flying'
  'Psychic'
  'Bug'
  'Rock'
  'Ghost'
  'Dragon'
  'Dark'
  'Steel'
  'Fairy'



export interface Database {
  public: {
    Tables: {
      Monkeys: {
        Row: Monkey;
        Insert: Omit<Monkey, 'id' | 'created_at'>;
        Update: Partial<Omit<Monkey, 'id' | 'created_at'>>;
      };
    };
  };
}

export const powerTypeColors: Record<MonkeyPowerType, string> = {
  Ninja: 'bg-purple-600',
  Ice: 'bg-blue-500',
  Wizard: 'bg-violet-600',
  Sniper: 'bg-amber-600',
  Boomerang: 'bg-orange-500',
  Super: 'bg-indigo-600',
  Engineer: 'bg-yellow-600',
  Dart: 'bg-emerald-600',
};

export const powerTypeTextColors: Record<MonkeyPowerType, string> = {
  Ninja: 'text-purple-600',
  Ice: 'text-blue-500',
  Wizard: 'text-violet-600',
  Sniper: 'text-amber-600',
  Boomerang: 'text-orange-500',
  Super: 'text-indigo-600',
  Engineer: 'text-yellow-600',
  Dart: 'text-emerald-600',
};