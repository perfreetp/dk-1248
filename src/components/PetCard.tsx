import { Pet, CareRecord, Task } from '@/types';
import { Cat, Dog, Rabbit, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface PetCardProps {
  pet: Pet;
  recentRecords: CareRecord[];
  todayTasks: Task[];
  onClick?: () => void;
}

const speciesIcons = {
  cat: Cat,
  dog: Dog,
  rabbit: Rabbit,
  other: Rabbit,
};

const statusConfig = {
  normal: { color: 'bg-secondary', text: '正常', textColor: 'text-secondary' },
  attention: { color: 'bg-warning', text: '需关注', textColor: 'text-warning' },
  abnormal: { color: 'bg-danger', text: '异常', textColor: 'text-danger' },
};

const recordTypeLabels: Record<string, string> = {
  medication: '喂药',
  weight: '体重',
  mood: '精神',
  appetite: '食欲',
  allergy: '过敏',
  walk: '散步',
  defecation: '排便',
  vomit: '呕吐',
};

export default function PetCard({ pet, recentRecords, todayTasks, onClick }: PetCardProps) {
  const SpeciesIcon = speciesIcons[pet.species];
  const status = statusConfig[pet.healthStatus];
  const incompleteTasks = todayTasks.filter((t) => t.status !== 'completed').length;
  const starredRecords = recentRecords.filter((r) => r.isStarred);

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <SpeciesIcon className="w-8 h-8 text-primary" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${status.color} border-2 border-white`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-text truncate">{pet.name}</h3>
            <span className={`text-xs font-medium ${status.textColor}`}>{status.text}</span>
          </div>

          <p className="text-sm text-muted mb-2">
            {pet.breed || pet.species} · {pet.age}岁 · {pet.gender === 'male' ? '公' : '母'}
          </p>

          {pet.weight && (
            <p className="text-sm text-muted mb-2">体重: {pet.weight}kg</p>
          )}

          {incompleteTasks > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                今日待办 {incompleteTasks} 项
              </span>
            </div>
          )}

          {starredRecords.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-danger" />
              <span className="text-sm font-medium text-danger">
                有 {starredRecords.length} 条异常记录
              </span>
            </div>
          )}

          {recentRecords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-muted mb-2">最近记录</p>
              <div className="flex flex-wrap gap-2">
                {recentRecords.slice(0, 3).map((record) => (
                  <span key={record.id} className="tag">
                    {recordTypeLabels[record.type]}
                    {record.isStarred && <span className="ml-1">⚠️</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
