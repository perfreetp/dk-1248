import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet, CareRecord, FamilyMember, Task, Reminder } from './types';
import { initialPets, initialRecords, initialMembers, initialTasks, initialReminders } from './data/initialData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface AppState {
  pets: Pet[];
  records: CareRecord[];
  members: FamilyMember[];
  tasks: Task[];
  reminders: Reminder[];
  
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  
  addRecord: (record: Omit<CareRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, updates: Partial<CareRecord>) => void;
  deleteRecord: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  
  addMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'stats'>) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      pets: initialPets,
      records: initialRecords,
      members: initialMembers,
      tasks: initialTasks,
      reminders: initialReminders,
      
      addPet: (pet) =>
        set((state) => ({
          pets: [
            ...state.pets,
            {
              ...pet,
              id: generateId(),
              createdAt: dayjs().toISOString(),
              updatedAt: dayjs().toISOString(),
            },
          ],
        })),
      
      updatePet: (id, updates) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: dayjs().toISOString() } : p
          ),
        })),
      
      deletePet: (id) =>
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== id),
        })),
      
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: generateId(),
              createdAt: dayjs().toISOString(),
            },
          ],
        })),
      
      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: generateId(),
              createdAt: dayjs().toISOString(),
            },
          ],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: 'completed' as const, completedAt: dayjs().toISOString() }
              : t
          ),
        })),
      
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            {
              ...reminder,
              id: generateId(),
              createdAt: dayjs().toISOString(),
            },
          ],
        })),
      
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      
      addMember: (member) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              ...member,
              id: generateId(),
              stats: { totalTasks: 0, completedTasks: 0, onTimeRate: 0 },
              createdAt: dayjs().toISOString(),
            },
          ],
        })),
      
      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
    }),
    {
      name: 'pet-diary-storage',
    }
  )
);
