import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { CareRecord, RecordType } from '@/types';
import { 
  Pill, Scale, Smile, Utensils, AlertTriangle, 
  Footprints, Droplets, AlertCircle, Star 
} from 'lucide-react';
import dayjs from 'dayjs';

const recordTypeConfig: Record<RecordType, { icon: any; color: string; label: string }> = {
  medication: { icon: Pill, color: 'bg-purple-500', label: '喂药' },
  weight: { icon: Scale, color: 'bg-blue-500', label: '体重' },
  mood: { icon: Smile, color: 'bg-yellow-500', label: '精神状态' },
  appetite: { icon: Utensils, color: 'bg-orange-500', label: '食欲' },
  allergy: { icon: AlertTriangle, color: 'bg-red-500', label: '过敏反应' },
  walk: { icon: Footprints, color: 'bg-green-500', label: '外出散步' },
  defecation: { icon: Droplets, color: 'bg-teal-500', label: '排便记录' },
  vomit: { icon: AlertCircle, color: 'bg-pink-500', label: '呕吐记录' },
};

export default function Timeline() {
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const members = useStore((state) => state.members);
  
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');
  
  const filteredRecords = useMemo(() => {
    let filtered = records;
    
    if (selectedPetId !== 'all') {
      filtered = filtered.filter((r) => r.petId === selectedPetId);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter((r) => r.type === selectedType);
    }
    
    return filtered.sort(
      (a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    );
  }, [records, selectedPetId, selectedType]);
  
  const groupedRecords = useMemo(() => {
    const groups: Record<string, CareRecord[]> = {};
    
    filteredRecords.forEach((record) => {
      const date = dayjs(record.recordTime).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    
    return groups;
  }, [filteredRecords]);
  
  const getRecordSummary = (record: CareRecord) => {
    const content = record.content;
    switch (record.type) {
      case 'medication':
        return `${content.medicineName || '药物'} ${content.dosage || ''} ${content.completed ? '✓ 已完成' : '✗ 未完成'}`;
      case 'weight':
        return `体重 ${content.weight || '-'} kg`;
      case 'mood':
        return `精神状态: ${content.status || '-'}`;
      case 'appetite':
        return `食欲 ${content.level || '-'}星`;
      case 'walk':
        return `散步 ${content.duration || '-'}分钟, ${content.distance || '-'}km`;
      case 'allergy':
        return content.description || '过敏反应';
      case 'defecation':
        return `形态: ${content.shape || '-'}`;
      case 'vomit':
        return content.description || '呕吐';
      default:
        return '';
    }
  };
  
  const recordTypes = Object.keys(recordTypeConfig) as RecordType[];
  
  return (
    <div>
      <Header title="时间轴" />
      
      <div className="px-4 py-3 space-y-3">
        <div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setSelectedPetId('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedPetId === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted hover:bg-primary hover:bg-opacity-10'
              }`}
            >
              全部宠物
            </button>
            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedPetId === pet.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted hover:bg-primary hover:bg-opacity-10'
                }`}
              >
                {pet.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedType === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-muted'
            }`}
          >
            全部类型
          </button>
          {recordTypes.map((type) => {
            const config = recordTypeConfig[type];
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted'
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        {Object.keys(groupedRecords).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">暂无记录</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-blue-500" />
            
            <div className="space-y-6">
              {Object.entries(groupedRecords).map(([date, records]) => {
                const displayDate = dayjs(date).isSame(dayjs(), 'day')
                  ? '今天'
                  : dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
                  ? '昨天'
                  : dayjs(date).format('MM月DD日');
                
                return (
                  <div key={date}>
                    <div className="relative mb-4">
                      <div className="absolute -left-6 w-12 h-12 rounded-full bg-white border-4 border-primary flex items-center justify-center">
                        <div className="text-xs font-bold text-primary">
                          {dayjs(date).format('DD')}
                        </div>
                      </div>
                      <div className="ml-10 pt-2">
                        <h3 className="text-lg font-bold text-text">{displayDate}</h3>
                        <p className="text-sm text-muted">
                          {dayjs(date).format('YYYY年MM月DD日 dddd')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-10 space-y-3">
                      {records.map((record) => {
                        const config = recordTypeConfig[record.type];
                        const Icon = config.icon;
                        const pet = pets.find((p) => p.id === record.petId);
                        const member = members.find((m) => m.id === record.createdBy);
                        
                        return (
                          <div
                            key={record.id}
                            className={`card relative ${
                              record.isStarred ? 'ring-2 ring-danger' : ''
                            }`}
                          >
                            {record.isStarred && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center">
                                <Star className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                            
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-text">{config.label}</span>
                                    {pet && (
                                      <span className="text-sm text-muted">{pet.name}</span>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted">
                                    {dayjs(record.recordTime).format('HH:mm')}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-text mb-2">
                                  {getRecordSummary(record)}
                                </p>
                                
                                {record.notes && (
                                  <p className="text-xs text-muted bg-gray-50 p-2 rounded-lg">
                                    {record.notes}
                                  </p>
                                )}
                                
                                {member && (
                                  <p className="text-xs text-muted mt-2">
                                    记录人: {member.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
