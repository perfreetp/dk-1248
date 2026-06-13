import { Pet, CareRecord, FamilyMember, Task, Reminder } from '../types';
import dayjs from 'dayjs';

export const initialPets: Pet[] = [
  {
    id: 'pet-1',
    name: '小橘',
    species: 'cat',
    breed: '橘猫',
    age: 2,
    birthDate: dayjs().subtract(2, 'year').format('YYYY-MM-DD'),
    gender: 'male',
    weight: 4.5,
    healthStatus: 'normal',
    allergies: [
      { allergen: '海鲜', reaction: '皮肤瘙痒', severity: 'moderate' }
    ],
    medications: [
      { name: '复合维生素', dosage: '1片', frequency: '每天一次', purpose: '补充营养', startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD') }
    ],
    dietaryPreferences: {
      foodTypes: ['猫粮', '罐头'],
      avoidFoods: ['牛奶', '巧克力', '葡萄'],
      feedingNotes: '喜欢少食多餐，每天约3-4顿'
    },
    careNotes: ['胆子较小，陌生人来访会躲藏', '喜欢晒太阳'],
    createdAt: dayjs().subtract(2, 'year').toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: 'pet-2',
    name: '豆豆',
    species: 'dog',
    breed: '柴犬',
    age: 3,
    birthDate: dayjs().subtract(3, 'year').format('YYYY-MM-DD'),
    gender: 'female',
    weight: 12.3,
    healthStatus: 'normal',
    allergies: [],
    medications: [],
    dietaryPreferences: {
      foodTypes: ['狗粮', '鸡肉'],
      avoidFoods: ['洋葱', '大蒜'],
      feedingNotes: '每天两顿，早晚各一次'
    },
    careNotes: ['处于发情期，注意隔离', '遛狗时喜欢追逐猫咪'],
    createdAt: dayjs().subtract(3, 'year').toISOString(),
    updatedAt: dayjs().toISOString(),
  },
  {
    id: 'pet-3',
    name: '小白',
    species: 'rabbit',
    breed: '垂耳兔',
    age: 1,
    birthDate: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    gender: 'male',
    weight: 2.1,
    healthStatus: 'attention',
    allergies: [
      { allergen: '生菜', reaction: '腹泻', severity: 'mild' }
    ],
    medications: [
      { name: '化毛膏', dosage: '2cm', frequency: '每周两次', purpose: '帮助排毛球' }
    ],
    dietaryPreferences: {
      foodTypes: ['提摩西草', '苜蓿草', '兔粮'],
      avoidFoods: ['生菜', '白菜'],
      feedingNotes: '提摩西草无限量供应，每天更换新鲜饮水'
    },
    careNotes: ['最近软便，需要关注饮食', '喜欢啃咬电线，请收好'],
    createdAt: dayjs().subtract(1, 'year').toISOString(),
    updatedAt: dayjs().toISOString(),
  },
];

export const initialMembers: FamilyMember[] = [
  {
    id: 'member-1',
    name: '爸爸',
    role: 'owner',
    stats: { totalTasks: 45, completedTasks: 42, onTimeRate: 0.93 },
    createdAt: dayjs().subtract(1, 'year').toISOString(),
  },
  {
    id: 'member-2',
    name: '妈妈',
    role: 'owner',
    stats: { totalTasks: 52, completedTasks: 50, onTimeRate: 0.96 },
    createdAt: dayjs().subtract(1, 'year').toISOString(),
  },
  {
    id: 'member-3',
    name: '小明',
    role: 'member',
    stats: { totalTasks: 30, completedTasks: 25, onTimeRate: 0.83 },
    createdAt: dayjs().subtract(6, 'month').toISOString(),
  },
];

export const initialRecords: CareRecord[] = [
  {
    id: 'record-1',
    petId: 'pet-1',
    type: 'weight',
    content: { weight: 4.5, unit: 'kg' },
    isStarred: false,
    recordTime: dayjs().subtract(1, 'day').toISOString(),
    createdBy: 'member-2',
    notes: '体重稳定',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'record-2',
    petId: 'pet-1',
    type: 'appetite',
    content: { level: 4, foodType: '猫粮', amount: '50g' },
    isStarred: false,
    recordTime: dayjs().subtract(2, 'day').toISOString(),
    createdBy: 'member-1',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    id: 'record-3',
    petId: 'pet-2',
    type: 'walk',
    content: { duration: 30, distance: 2.5, weather: '晴' },
    isStarred: false,
    recordTime: dayjs().subtract(3, 'hour').toISOString(),
    createdBy: 'member-3',
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
  {
    id: 'record-4',
    petId: 'pet-3',
    type: 'mood',
    content: { status: '活泼', description: '今天很活跃，一直蹦蹦跳跳' },
    isStarred: false,
    recordTime: dayjs().subtract(5, 'hour').toISOString(),
    createdBy: 'member-2',
    createdAt: dayjs().subtract(5, 'hour').toISOString(),
  },
  {
    id: 'record-5',
    petId: 'pet-1',
    type: 'medication',
    content: { medicineName: '驱虫药', dosage: '1片', completed: true },
    isStarred: true,
    recordTime: dayjs().subtract(7, 'day').toISOString(),
    createdBy: 'member-1',
    notes: '发现轻微过敏反应',
    createdAt: dayjs().subtract(7, 'day').toISOString(),
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: '给小橘铲屎',
    type: 'scoop',
    petId: 'pet-1',
    assignedTo: 'member-1',
    priority: 'normal',
    status: 'pending',
    dueDate: dayjs().endOf('day').toISOString(),
    createdAt: dayjs().toISOString(),
  },
  {
    id: 'task-2',
    title: '遛豆豆',
    type: 'walk',
    petId: 'pet-2',
    assignedTo: 'member-3',
    priority: 'important',
    status: 'in_progress',
    dueDate: dayjs().add(2, 'hour').toISOString(),
    createdAt: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 'task-3',
    title: '喂小白吃草',
    type: 'feed',
    petId: 'pet-3',
    assignedTo: 'member-2',
    priority: 'urgent',
    status: 'completed',
    dueDate: dayjs().subtract(1, 'hour').toISOString(),
    completedAt: dayjs().subtract(30, 'minute').toISOString(),
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
];

export const initialReminders: Reminder[] = [
  {
    id: 'reminder-1',
    title: '喂猫粮',
    petId: 'pet-1',
    time: '08:00',
    repeatType: 'daily',
    isEnabled: true,
    createdAt: dayjs().subtract(1, 'month').toISOString(),
  },
  {
    id: 'reminder-2',
    title: '遛狗',
    petId: 'pet-2',
    time: '19:00',
    repeatType: 'daily',
    isEnabled: true,
    createdAt: dayjs().subtract(2, 'month').toISOString(),
  },
  {
    id: 'reminder-3',
    title: '驱虫',
    petId: 'pet-1',
    time: '10:00',
    repeatType: 'monthly',
    isEnabled: true,
    createdAt: dayjs().subtract(3, 'month').toISOString(),
  },
  {
    id: 'reminder-4',
    title: '给兔子换水',
    time: '12:00',
    repeatType: 'daily',
    isEnabled: true,
    createdAt: dayjs().subtract(1, 'month').toISOString(),
  },
];
