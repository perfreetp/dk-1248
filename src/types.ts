export interface Pet {
  id: string;
  name: string;
  species: 'cat' | 'dog' | 'rabbit' | 'other';
  breed?: string;
  age: number;
  gender: 'male' | 'female';
  avatar?: string;
  weight?: number;
  healthStatus: 'normal' | 'attention' | 'abnormal';
  createdAt: string;
  updatedAt: string;
}

export type RecordType = 'medication' | 'weight' | 'mood' | 'appetite' | 'allergy' | 'walk' | 'defecation' | 'vomit';

export interface CareRecord {
  id: string;
  petId: string;
  type: RecordType;
  content: Record<string, any>;
  isStarred: boolean;
  recordTime: string;
  createdBy: string;
  photos?: string[];
  notes?: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'member';
  contact?: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    onTimeRate: number;
  };
  createdAt: string;
}

export type TaskType = 'scoop' | 'walk' | 'feed' | 'bath' | 'deworm' | 'medical' | 'other';
export type TaskPriority = 'normal' | 'important' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  petId?: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
}

export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Reminder {
  id: string;
  title: string;
  petId?: string;
  time: string;
  repeatType: RepeatType;
  repeatInterval?: number;
  weekDays?: number[];
  isEnabled: boolean;
  createdAt: string;
}
