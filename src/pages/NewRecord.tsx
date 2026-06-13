import { useState } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Pill, Scale, Smile, Utensils, AlertTriangle, 
  Footprints, Droplets, AlertCircle, Check 
} from 'lucide-react';
import dayjs from 'dayjs';

const recordTypes = [
  { type: 'medication', label: '喂药', icon: Pill, color: 'bg-purple-500' },
  { type: 'weight', label: '体重', icon: Scale, color: 'bg-blue-500' },
  { type: 'mood', label: '精神状态', icon: Smile, color: 'bg-yellow-500' },
  { type: 'appetite', label: '食欲', icon: Utensils, color: 'bg-orange-500' },
  { type: 'allergy', label: '过敏反应', icon: AlertTriangle, color: 'bg-red-500' },
  { type: 'walk', label: '外出散步', icon: Footprints, color: 'bg-green-500' },
  { type: 'defecation', label: '排便记录', icon: Droplets, color: 'bg-teal-500' },
  { type: 'vomit', label: '呕吐记录', icon: AlertCircle, color: 'bg-pink-500' },
] as const;

const moodOptions = [
  { value: '活泼', label: '活泼', emoji: '😄' },
  { value: '正常', label: '正常', emoji: '🙂' },
  { value: '萎靡', label: '萎靡', emoji: '😔' },
  { value: '嗜睡', label: '嗜睡', emoji: '😴' },
];

const foodTypeOptions = ['猫粮', '狗粮', '罐头', '零食', '自制', '其他'];
const defecationOptions = ['正常', '稀软', '干硬', '带血'];
const weatherOptions = ['晴', '阴', '雨', '雪'];

export default function NewRecord() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPetId = searchParams.get('petId') || '';
  
  const pets = useStore((state) => state.pets);
  const members = useStore((state) => state.members);
  const addRecord = useStore((state) => state.addRecord);
  
  const [selectedPet, setSelectedPet] = useState(initialPetId);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isStarred, setIsStarred] = useState(false);
  const [notes, setNotes] = useState('');
  const [recordTime, setRecordTime] = useState(dayjs().format('YYYY-MM-DD HH:mm'));
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleSubmit = () => {
    if (!selectedPet || !selectedType) {
      alert('请选择宠物和记录类型');
      return;
    }
    
    addRecord({
      petId: selectedPet,
      type: selectedType as any,
      content: formData,
      isStarred,
      recordTime: dayjs(recordTime).toISOString(),
      createdBy: members[0]?.id || 'member-1',
      notes,
    });
    
    navigate('/');
  };
  
  const renderForm = () => {
    switch (selectedType) {
      case 'medication':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">药品名称</label>
              <input
                type="text"
                className="input"
                placeholder="请输入药品名称"
                value={formData.medicineName || ''}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">剂量</label>
                <input
                  type="text"
                  className="input"
                  placeholder="如: 1片"
                  value={formData.dosage || ''}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">是否完成</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.completed === true}
                      onChange={() => setFormData({ ...formData, completed: true })}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.completed === false}
                      onChange={() => setFormData({ ...formData, completed: false })}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">否</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'weight':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="如: 4.5"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );
      
      case 'mood':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">精神状态</label>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, status: option.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.status === option.value
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-sm font-medium text-text">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">详细描述</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="描述宠物的精神状态..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'appetite':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">食欲等级</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, level })}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      formData.level === level
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {level}星
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">食物种类</label>
                <select
                  className="input"
                  value={formData.foodType || ''}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                >
                  <option value="">选择食物</option>
                  {foodTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">进食量</label>
                <input
                  type="text"
                  className="input"
                  placeholder="如: 50g"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      
      case 'walk':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">散步时长 (分钟)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="如: 30"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">距离 (km)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="如: 2.5"
                  value={formData.distance || ''}
                  onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">天气</label>
              <div className="flex gap-2 flex-wrap">
                {weatherOptions.map((weather) => (
                  <button
                    key={weather}
                    onClick={() => setFormData({ ...formData, weather })}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${
                      formData.weather === weather
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {weather}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'defecation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">形态</label>
              <div className="grid grid-cols-2 gap-3">
                {defecationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, shape: option })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.shape === option
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="text-sm font-medium text-text">{option}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'allergy':
      case 'vomit':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">描述</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder={`描述${selectedType === 'allergy' ? '过敏' : '呕吐'}情况...`}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div>
      <Header title="新增记录" showBack />
      
      <div className="px-4 py-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">选择宠物</label>
          <div className="grid grid-cols-3 gap-3">
            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedPet === pet.id
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="text-lg font-bold text-text">{pet.name}</div>
                <div className="text-xs text-muted">{pet.breed || pet.species}</div>
              </button>
            ))}
          </div>
        </div>
        
        {!selectedType && (
          <div>
            <label className="block text-sm font-medium text-text mb-2">记录类型</label>
            <div className="grid grid-cols-4 gap-3">
              {recordTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-primary transition-all flex flex-col items-center gap-2"
                  >
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-medium text-text">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {selectedType && (
          <>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text">
                  {recordTypes.find((t) => t.type === selectedType)?.label}
                </h3>
                <button
                  onClick={() => {
                    setSelectedType('');
                    setFormData({});
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  重新选择
                </button>
              </div>
              {renderForm()}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">记录时间</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={recordTime}
                  onChange={(e) => setRecordTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">备注</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  placeholder="添加备注信息..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <label className="flex items-center gap-3 p-4 bg-danger bg-opacity-10 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStarred}
                  onChange={(e) => setIsStarred(e.target.checked)}
                  className="w-5 h-5 text-danger rounded"
                />
                <div>
                  <div className="font-medium text-danger">异常标记</div>
                  <div className="text-sm text-muted">勾选后此记录将标记为星标异常</div>
                </div>
              </label>
            </div>
            
            <button onClick={handleSubmit} className="btn-primary w-full">
              保存记录
            </button>
          </>
        )}
      </div>
    </div>
  );
}
