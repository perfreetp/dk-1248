import { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, AlertTriangle, Pill, Utensils, FileText, Save, ArrowRight, Clock } from 'lucide-react';
import dayjs from 'dayjs';

const speciesOptions = [
  { value: 'cat', label: '猫咪', emoji: '🐱' },
  { value: 'dog', label: '狗狗', emoji: '🐕' },
  { value: 'rabbit', label: '兔子', emoji: '🐰' },
  { value: 'other', label: '其他', emoji: '🐾' },
];

const severityOptions = [
  { value: 'mild', label: '轻度', color: 'text-warning' },
  { value: 'moderate', label: '中度', color: 'text-orange-500' },
  { value: 'severe', label: '重度', color: 'text-danger' },
];

const foodTypeOptions = ['猫粮', '狗粮', '罐头', '零食', '自制', '提摩西草', '苜蓿草', '兔粮', '鸡肉', '其他'];

export default function PetProfile() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const addPet = useStore((state) => state.addPet);
  const updatePet = useStore((state) => state.updatePet);
  
  const isEditing = !!petId;
  const existingPet = pets.find((p) => p.id === petId);
  
  const recentMedicationRecords = useMemo(() => {
    if (!petId) return [];
    return records
      .filter((r) => r.petId === petId && r.type === 'medication')
      .sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
      .slice(0, 5);
  }, [records, petId]);
  
  const recentAbnormalRecords = useMemo(() => {
    if (!petId) return [];
    return records
      .filter((r) => r.petId === petId && (r.type === 'allergy' || r.type === 'vomit' || r.isStarred))
      .sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
      .slice(0, 5);
  }, [records, petId]);
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'cat' as 'cat' | 'dog' | 'rabbit' | 'other',
    breed: '',
    age: 1,
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    weight: 0,
    healthStatus: 'normal' as 'normal' | 'attention' | 'abnormal',
    allergies: [] as { allergen: string; reaction: string; severity: 'mild' | 'moderate' | 'severe' }[],
    medications: [] as { name: string; dosage: string; frequency: string; purpose: string; startDate?: string; notes?: string }[],
    dietaryPreferences: {
      foodTypes: [] as string[],
      avoidFoods: [] as string[],
      feedingNotes: '' as string | undefined,
    },
    careNotes: [] as string[],
  });
  
  const [activeTab, setActiveTab] = useState<'basic' | 'allergy' | 'medication' | 'diet' | 'care' | 'recent'>('basic');
  
  useEffect(() => {
    if (existingPet && petId) {
      setFormData({
        name: existingPet.name,
        species: existingPet.species,
        breed: existingPet.breed || '',
        age: existingPet.age,
        birthDate: existingPet.birthDate || '',
        gender: existingPet.gender,
        weight: existingPet.weight || 0,
        healthStatus: existingPet.healthStatus,
        allergies: existingPet.allergies || [],
        medications: existingPet.medications || [],
        dietaryPreferences: {
          foodTypes: existingPet.dietaryPreferences?.foodTypes || [],
          avoidFoods: existingPet.dietaryPreferences?.avoidFoods || [],
          feedingNotes: existingPet.dietaryPreferences?.feedingNotes,
        },
        careNotes: existingPet.careNotes || [],
      });
    }
  }, [existingPet, petId]);
  
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入宠物名称');
      return;
    }
    
    if (isEditing && petId) {
      updatePet(petId, formData);
    } else {
      addPet(formData);
    }
    
    navigate('/');
  };
  
  const addAllergy = () => {
    setFormData({
      ...formData,
      allergies: [...formData.allergies, { allergen: '', reaction: '', severity: 'mild' }],
    });
  };
  
  const updateAllergy = (index: number, field: string, value: string) => {
    const updated = [...formData.allergies];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, allergies: updated });
  };
  
  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index),
    });
  };
  
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', purpose: '' }],
    });
  };
  
  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...formData.medications];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, medications: updated });
  };
  
  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };
  
  const toggleFoodType = (food: string) => {
    const types = formData.dietaryPreferences.foodTypes.includes(food)
      ? formData.dietaryPreferences.foodTypes.filter((f) => f !== food)
      : [...formData.dietaryPreferences.foodTypes, food];
    setFormData({
      ...formData,
      dietaryPreferences: { ...formData.dietaryPreferences, foodTypes: types },
    });
  };
  
  const toggleAvoidFood = (food: string) => {
    const foods = formData.dietaryPreferences.avoidFoods.includes(food)
      ? formData.dietaryPreferences.avoidFoods.filter((f) => f !== food)
      : [...formData.dietaryPreferences.avoidFoods, food];
    setFormData({
      ...formData,
      dietaryPreferences: { ...formData.dietaryPreferences, avoidFoods: foods },
    });
  };
  
  const addCareNote = () => {
    setFormData({
      ...formData,
      careNotes: [...formData.careNotes, ''],
    });
  };
  
  const updateCareNote = (index: number, value: string) => {
    const updated = [...formData.careNotes];
    updated[index] = value;
    setFormData({ ...formData, careNotes: updated });
  };
  
  const removeCareNote = (index: number) => {
    setFormData({
      ...formData,
      careNotes: formData.careNotes.filter((_, i) => i !== index),
    });
  };
  
  const tabs = [
    { key: 'basic', label: '基本信息', icon: FileText },
    { key: 'allergy', label: '过敏史', icon: AlertTriangle, badge: formData.allergies.length },
    { key: 'medication', label: '常用药', icon: Pill, badge: formData.medications.length },
    { key: 'diet', label: '饮食偏好', icon: Utensils },
    { key: 'care', label: '照护备注', icon: FileText, badge: formData.careNotes.length },
    { key: 'recent', label: '最近记录', icon: Clock, badge: recentMedicationRecords.length + recentAbnormalRecords.length },
  ];
  
  return (
    <div>
      <Header
        title={isEditing ? '编辑档案' : '新增宠物'}
        showBack
        rightElement={
          <button onClick={handleSubmit} className="text-primary font-medium">
            <Save className="w-5 h-5" />
          </button>
        }
      />
      
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? 'bg-white bg-opacity-20' : 'bg-primary bg-opacity-10 text-primary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="space-y-4">
          {activeTab === 'basic' && (
            <>
              <div className="card">
                <h3 className="font-bold text-text mb-4">基本信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">宠物名称 *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入宠物名称"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">物种</label>
                    <div className="grid grid-cols-4 gap-2">
                      {speciesOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData({ ...formData, species: opt.value as any })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formData.species === opt.value
                              ? 'border-primary bg-primary bg-opacity-10'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{opt.emoji}</div>
                          <div className="text-xs font-medium">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">品种</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="如: 橘猫"
                        value={formData.breed}
                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">年龄（岁）</label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">出生日期</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">性别</label>
                      <select
                        className="input"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      >
                        <option value="male">公</option>
                        <option value="female">母</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">体重 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="input"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">健康状态</label>
                    <div className="flex gap-2">
                      {(['normal', 'attention', 'abnormal'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setFormData({ ...formData, healthStatus: status })}
                          className={`flex-1 py-2 px-4 rounded-xl border-2 transition-all ${
                            formData.healthStatus === status
                              ? status === 'normal'
                                ? 'border-secondary bg-secondary bg-opacity-10'
                                : status === 'attention'
                                ? 'border-warning bg-warning bg-opacity-10'
                                : 'border-danger bg-danger bg-opacity-10'
                              : 'border-gray-200'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {status === 'normal' ? '✓ 正常' : status === 'attention' ? '⚠ 需关注' : '✕ 异常'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'allergy' && (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text">过敏史</h3>
                  <button onClick={addAllergy} className="btn-secondary text-sm py-2">
                    <Plus className="w-4 h-4 mr-1" /> 添加
                  </button>
                </div>
                
                {formData.allergies.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无过敏史记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.allergies.map((allergy, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-text">过敏源 {index + 1}</span>
                          <button onClick={() => removeAllergy(index)} className="text-danger">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="input"
                            placeholder="过敏源（如：海鲜）"
                            value={allergy.allergen}
                            onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="过敏反应（如：皮肤瘙痒）"
                            value={allergy.reaction}
                            onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                          />
                          <div className="flex gap-2">
                            {severityOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => updateAllergy(index, 'severity', opt.value)}
                                className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                                  allergy.severity === opt.value
                                    ? `border-primary ${opt.color}`
                                    : 'border-gray-200'
                                }`}
                              >
                                <span className="text-sm">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          {activeTab === 'medication' && (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text">常用药物</h3>
                  <button onClick={addMedication} className="btn-secondary text-sm py-2">
                    <Plus className="w-4 h-4 mr-1" /> 添加
                  </button>
                </div>
                
                {formData.medications.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无常用药物记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.medications.map((med, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-text">药物 {index + 1}</span>
                          <button onClick={() => removeMedication(index)} className="text-danger">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="input"
                            placeholder="药物名称"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              className="input"
                              placeholder="剂量（如：1片）"
                              value={med.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            />
                            <input
                              type="text"
                              className="input"
                              placeholder="频率（如：每天一次）"
                              value={med.frequency}
                              onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            />
                          </div>
                          <input
                            type="text"
                            className="input"
                            placeholder="用途（如：补充营养）"
                            value={med.purpose}
                            onChange={(e) => updateMedication(index, 'purpose', e.target.value)}
                          />
                          <input
                            type="date"
                            className="input"
                            placeholder="开始日期"
                            value={med.startDate || ''}
                            onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          {activeTab === 'diet' && (
            <>
              <div className="card">
                <h3 className="font-bold text-text mb-4">饮食偏好</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">常吃食物</label>
                    <div className="flex flex-wrap gap-2">
                      {foodTypeOptions.map((food) => (
                        <button
                          key={food}
                          onClick={() => toggleFoodType(food)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                            formData.dietaryPreferences.foodTypes.includes(food)
                              ? 'border-primary bg-primary bg-opacity-10 text-primary'
                              : 'border-gray-200 text-muted'
                          }`}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">不能吃的食物</label>
                    <div className="flex flex-wrap gap-2">
                      {foodTypeOptions.map((food) => (
                        <button
                          key={food}
                          onClick={() => toggleAvoidFood(food)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                            formData.dietaryPreferences.avoidFoods.includes(food)
                              ? 'border-danger bg-danger bg-opacity-10 text-danger'
                              : 'border-gray-200 text-muted'
                          }`}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">喂食备注</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      placeholder="描述喂食习惯、注意事项等..."
                      value={formData.dietaryPreferences.feedingNotes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dietaryPreferences: { ...formData.dietaryPreferences, feedingNotes: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'care' && (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text">照护备注</h3>
                  <button onClick={addCareNote} className="btn-secondary text-sm py-2">
                    <Plus className="w-4 h-4 mr-1" /> 添加
                  </button>
                </div>
                
                {formData.careNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无照护备注</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.careNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <textarea
                          className="input resize-none flex-1"
                          rows={2}
                          placeholder="输入照护注意事项..."
                          value={note}
                          onChange={(e) => updateCareNote(index, e.target.value)}
                        />
                        <button
                          onClick={() => removeCareNote(index)}
                          className="p-2 text-danger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          {activeTab === 'recent' && (
            <>
              {!isEditing ? (
                <div className="card">
                  <div className="text-center py-8 text-muted">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>请先保存宠物档案后查看最近记录</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMedicationRecords.length > 0 && (
                    <div className="card">
                      <h3 className="font-bold text-text mb-3 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-purple-500" />
                        喂药记录
                      </h3>
                      <div className="space-y-2">
                        {recentMedicationRecords.map((record) => (
                          <div key={record.id} className="p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-text">
                                {record.content.medicineName || '未知药物'}
                              </span>
                              <span className="text-xs text-muted">
                                {dayjs(record.recordTime).format('MM/DD HH:mm')}
                              </span>
                            </div>
                            <div className="text-sm text-muted">
                              剂量: {record.content.dosage || '-'}
                              {record.content.completed !== undefined && (
                                <span className={`ml-2 ${record.content.completed ? 'text-secondary' : 'text-danger'}`}>
                                  {record.content.completed ? '✓ 已完成' : '✗ 未完成'}
                                </span>
                              )}
                            </div>
                            {record.notes && (
                              <p className="text-xs text-muted mt-1 bg-yellow-50 p-2 rounded">{record.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recentAbnormalRecords.length > 0 && (
                    <div className="card">
                      <h3 className="font-bold text-danger mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        异常记录
                      </h3>
                      <div className="space-y-2">
                        {recentAbnormalRecords.map((record) => (
                          <div key={record.id} className="p-3 bg-danger bg-opacity-5 rounded-xl border border-danger">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-danger">
                                {record.type === 'allergy' ? '过敏反应' : record.type === 'vomit' ? '呕吐记录' : '异常标记'}
                              </span>
                              <span className="text-xs text-muted">
                                {dayjs(record.recordTime).format('MM/DD HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-text">
                              {record.content.description || record.content.reaction || '无描述'}
                            </p>
                            {record.notes && (
                              <p className="text-xs text-muted mt-1">{record.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recentMedicationRecords.length === 0 && recentAbnormalRecords.length === 0 && (
                    <div className="card">
                      <div className="text-center py-8 text-muted">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>暂无最近记录</p>
                        <button
                          onClick={() => navigate('/record/new?petId=' + petId)}
                          className="btn-primary mt-4"
                        >
                          添加记录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        <button onClick={handleSubmit} className="btn-primary w-full mt-6">
          {isEditing ? '保存修改' : '创建宠物'}
        </button>
      </div>
    </div>
  );
}
