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
        set((state) => {
          const newRecord: CareRecord = {
            ...record,
            id: generateId(),
            createdAt: dayjs().toISOString(),
          };
          
          let updatedPets = [...state.pets];
          
          if (record.type === 'weight' && record.content.weight) {
            updatedPets = updatedPets.map((p) =>
              p.id === record.petId
                ? { ...p, weight: record.content.weight, updatedAt: dayjs().toISOString() }
                : p
            );
          }
          
          if (record.isStarred) {
            const hasRecentStarred = state.records.some(
              (r) => r.petId === record.petId && r.isStarred && 
              dayjs(r.recordTime).isAfter(dayjs().subtract(7, 'day'))
            );
            
            if (!hasRecentStarred) {
              updatedPets = updatedPets.map((p) =>
                p.id === record.petId
                  ? { ...p, healthStatus: 'attention' as const, updatedAt: dayjs().toISOString() }
                  : p
              );
            }
          }
          
          if (record.type === 'medication' && record.isStarred) {
            updatedPets = updatedPets.map((p) =>
              p.id === record.petId
                ? { ...p, healthStatus: 'abnormal' as const, updatedAt: dayjs().toISOString() }
                : p
            );
          }
          
          return { records: [...state.records, newRecord], pets: updatedPets };
        }),
      
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
        set((state) => {
          const newTask: Task = {
            ...task,
            id: generateId(),
            createdAt: dayjs().toISOString(),
          };
          
          const updatedTasks = [...state.tasks, newTask];
          const memberTasks = updatedTasks.filter((t) => t.assignedTo === task.assignedTo);
          const completedCount = memberTasks.filter((t) => t.status === 'completed').length;
          const totalCount = memberTasks.length;
          
          const onTimeTasks = memberTasks.filter((t) => 
            t.status === 'completed' && t.completedAt && dayjs(t.completedAt).isBefore(dayjs(t.dueDate))
          );
          const onTimeRate = completedCount > 0 ? onTimeTasks.length / completedCount : 0;
          
          const updatedMembers = state.members.map((m) =>
            m.id === task.assignedTo
              ? { 
                  ...m, 
                  stats: { 
                    totalTasks: totalCount, 
                    completedTasks: completedCount, 
                    onTimeRate 
                  } 
                }
              : m
          );
          
          return { tasks: updatedTasks, members: updatedMembers };
        }),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      completeTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task || task.status === 'completed') return state;
          
          const updatedTasks = state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: 'completed' as const, completedAt: dayjs().toISOString() }
              : t
          );
          
          const memberTasks = updatedTasks.filter((t) => t.assignedTo === task.assignedTo);
          const completedCount = memberTasks.filter((t) => t.status === 'completed').length;
          const totalCount = memberTasks.length;
          
          const onTimeTasks = memberTasks.filter((t) => 
            t.status === 'completed' && t.completedAt && dayjs(t.completedAt).isBefore(dayjs(t.dueDate))
          );
          const onTimeRate = completedCount > 0 ? onTimeTasks.length / completedCount : 0;
          
          const updatedMembers = state.members.map((m) =>
            m.id === task.assignedTo
              ? { 
                  ...m, 
                  stats: { 
                    totalTasks: totalCount, 
                    completedTasks: completedCount, 
                    onTimeRate 
                  } 
                }
              : m
          );
          
          return { tasks: updatedTasks, members: updatedMembers };
        }),
      
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
