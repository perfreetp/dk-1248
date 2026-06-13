import { useState, useMemo, useRef } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { FileText, Download, Printer, Check, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function Handover() {
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const tasks = useStore((state) => state.tasks);
  
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));
  const [selectedPets, setSelectedPets] = useState<string[]>(pets.map((p) => p.id));
  const [showPreview, setShowPreview] = useState(false);
  const [contentOptions, setContentOptions] = useState({
    basicInfo: true,
    healthStatus: true,
    allergies: true,
    medications: true,
    dietaryPreferences: true,
    careNotes: true,
    recentTasks: true,
    abnormalRecords: true,
    medication: true,
  });
  
  const togglePet = (petId: string) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };
  
  const toggleAllPets = () => {
    if (selectedPets.length === pets.length) {
      setSelectedPets([]);
    } else {
      setSelectedPets(pets.map((p) => p.id));
    }
  };
  
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const recordDate = dayjs(record.recordTime);
      const isInRange = recordDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
                       recordDate.isBefore(dayjs(endDate).add(1, 'day'));
      const isSelectedPet = selectedPets.length === 0 || selectedPets.includes(record.petId);
      return isInRange && isSelectedPet;
    });
  }, [records, startDate, endDate, selectedPets]);
  
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dueDate = dayjs(task.dueDate);
      const isInRange = dueDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
                       dueDate.isBefore(dayjs(endDate).add(1, 'day'));
      const isSelectedPet = !task.petId || selectedPets.length === 0 || selectedPets.includes(task.petId);
      return isInRange && isSelectedPet;
    });
  }, [tasks, startDate, endDate, selectedPets]);
  
  const abnormalRecords = useMemo(() => {
    return filteredRecords.filter((r) => r.isStarred);
  }, [filteredRecords]);
  
  const medicationRecords = useMemo(() => {
    return filteredRecords.filter((r) => r.type === 'medication');
  }, [filteredRecords]);
  
  const generatePreview = () => {
    if (selectedPets.length === 0) {
      alert('请选择至少一只宠物');
      return;
    }
    setShowPreview(true);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    const printContent = document.getElementById('handover-preview');
    if (!printContent) return;
    
    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;
    
    const printStyle = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif; padding: 20px; }
        h1 { font-size: 24px; margin-bottom: 8px; }
        h2 { font-size: 18px; margin-top: 16px; margin-bottom: 8px; color: #333; }
        h3 { font-size: 14px; margin-top: 12px; margin-bottom: 6px; }
        p { margin: 4px 0; }
        .text-muted { color: #666; }
        .text-danger { color: #dc3545; }
        .text-warning { color: #ffc107; }
        .text-secondary { color: #28a745; }
        .bg-danger { background-color: #f8d7da; }
        .bg-warning { background-color: #fff3cd; }
        .bg-secondary { background-color: #d4edda; }
      </style>
    `;
    
    document.body.innerHTML = printStyle + printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  
  const contentLabels: Record<string, string> = {
    basicInfo: '宠物基本信息',
    healthStatus: '当前健康状态',
    allergies: '过敏史',
    medications: '常用药',
    dietaryPreferences: '饮食偏好',
    careNotes: '照护备注',
    recentTasks: '近期待办任务',
    abnormalRecords: '近期异常记录',
    medication: '用药记录',
  };
  
  return (
    <div>
      <Header title="看护交接单" />
      
      {!showPreview ? (
        <div className="px-4 py-4 space-y-6">
          <div className="card">
            <h3 className="font-bold text-text mb-4">交接时间范围</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">开始日期</label>
                <input
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">结束日期</label>
                <input
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text">选择宠物</h3>
              <button
                onClick={toggleAllPets}
                className="text-sm text-primary"
              >
                {selectedPets.length === pets.length ? '取消全选' : '全选'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => togglePet(pet.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedPets.includes(pet.id)
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="text-lg font-bold text-text">{pet.name}</div>
                  <div className="text-xs text-muted">{pet.breed || pet.species}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted mt-2">
              已选择 {selectedPets.length} 只宠物
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-bold text-text mb-4">交接内容</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(contentOptions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setContentOptions({ ...contentOptions, [key]: e.target.checked })
                    }
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm text-text">{contentLabels[key]}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-bold text-text mb-4">交接单预览</h3>
            <div className="space-y-2 text-sm text-muted">
              <div>📅 交接时间: {dayjs(startDate).format('YYYY年MM月DD日')} - {dayjs(endDate).format('YYYY年MM月DD日')}</div>
              <div>🐾 宠物数量: {selectedPets.length} 只</div>
              <div>📝 相关记录: {filteredRecords.length} 条</div>
              <div>✅ 待办任务: {filteredTasks.length} 项</div>
              {abnormalRecords.length > 0 && (
                <div className="text-danger">⚠️ 异常记录: {abnormalRecords.length} 条</div>
              )}
              {medicationRecords.length > 0 && (
                <div className="text-secondary">💊 用药记录: {medicationRecords.length} 条</div>
              )}
            </div>
          </div>
          
          <button onClick={generatePreview} className="btn-primary w-full">
            生成交接单
          </button>
        </div>
      ) : (
        <div className="px-4 py-4">
          <div className="card mb-4" id="handover-preview">
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-text mb-2">🐾 宠物看护交接单</h1>
              <p className="text-sm text-muted">
                {dayjs(startDate).format('YYYY年MM月DD日')} - {dayjs(endDate).format('YYYY年MM月DD日')}
              </p>
              <p className="text-xs text-muted mt-1">
                共 {selectedPets.length} 只宠物
              </p>
            </div>
            
            {selectedPets.map((petId) => {
              const pet = pets.find((p) => p.id === petId);
              if (!pet) return null;
              
              const petRecords = filteredRecords.filter((r) => r.petId === petId);
              const petTasks = filteredTasks.filter((t) => t.petId === petId);
              const petAbnormal = petRecords.filter((r) => r.isStarred);
              const petMedication = petRecords.filter((r) => r.type === 'medication');
              
              return (
                <div key={petId} className="mb-6 last:mb-0 border-b border-gray-100 pb-4 last:border-b-0">
                  <h2 className="text-xl font-bold text-text mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    {pet.name}
                    <span className="text-sm font-normal text-muted">({pet.breed || pet.species})</span>
                  </h2>
                  
                  {contentOptions.basicInfo && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">📋 基本信息</h3>
                      <div className="text-sm text-muted space-y-1 pl-2">
                        <p>• 性别: {pet.gender === 'male' ? '公' : '母'}</p>
                        <p>• 年龄: {pet.age}岁 {pet.birthDate && `(${dayjs().year() - dayjs(pet.birthDate).year()}年)`}</p>
                        {pet.weight && <p>• 体重: {pet.weight}kg</p>}
                        {pet.birthDate && <p>• 生日: {dayjs(pet.birthDate).format('YYYY-MM-DD')}</p>}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.healthStatus && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">💚 健康状态</h3>
                      <div className="text-sm pl-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          pet.healthStatus === 'normal'
                            ? 'bg-secondary bg-opacity-20 text-secondary'
                            : pet.healthStatus === 'attention'
                            ? 'bg-warning bg-opacity-20 text-warning'
                            : 'bg-danger bg-opacity-20 text-danger'
                        }`}>
                          {pet.healthStatus === 'normal' ? '✓ 正常' : pet.healthStatus === 'attention' ? '⚠ 需关注' : '✕ 异常'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.allergies && pet.allergies && pet.allergies.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-danger mb-2 text-sm border-b border-gray-100 pb-1">⚠️ 过敏史</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {pet.allergies.map((allergy, index) => (
                          <p key={index} className="text-danger">
                            • {allergy.allergen} → {allergy.reaction} ({allergy.severity === 'mild' ? '轻度' : allergy.severity === 'moderate' ? '中度' : '重度'})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.medications && pet.medications && pet.medications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">💊 常用药</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {pet.medications.map((med, index) => (
                          <p key={index}>
                            • {med.name} | 剂量: {med.dosage} | 频率: {med.frequency}
                            {med.purpose && ` | 用途: ${med.purpose}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.dietaryPreferences && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">🍽️ 饮食偏好</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {pet.dietaryPreferences?.foodTypes && pet.dietaryPreferences.foodTypes.length > 0 && (
                          <p>✓ 常吃: {pet.dietaryPreferences.foodTypes.join('、')}</p>
                        )}
                        {pet.dietaryPreferences?.avoidFoods && pet.dietaryPreferences.avoidFoods.length > 0 && (
                          <p className="text-danger">✕ 禁忌: {pet.dietaryPreferences.avoidFoods.join('、')}</p>
                        )}
                        {pet.dietaryPreferences?.feedingNotes && (
                          <p className="text-muted">备注: {pet.dietaryPreferences.feedingNotes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.careNotes && pet.careNotes && pet.careNotes.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">📝 照护备注</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {pet.careNotes.map((note, index) => (
                          <p key={index}>• {note}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.recentTasks && petTasks.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">📌 待办任务</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {petTasks.map((task) => (
                          <p key={task.id} className={task.status === 'completed' ? 'line-through text-muted' : ''}>
                            {task.status === 'completed' ? '✓' : '○'} {task.title} ({dayjs(task.dueDate).format('MM/DD')})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.abnormalRecords && petAbnormal.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-danger mb-2 text-sm border-b border-gray-100 pb-1">🚨 异常记录</h3>
                      <div className="text-sm space-y-2 pl-2">
                        {petAbnormal.map((record) => (
                          <div key={record.id} className="p-2 bg-danger bg-opacity-10 rounded text-danger">
                            <div className="font-medium">{record.type === 'medication' ? '用药异常' : record.type === 'allergy' ? '过敏' : record.type === 'vomit' ? '呕吐' : record.type}</div>
                            {record.notes && <div className="text-xs mt-1">{record.notes}</div>}
                            <div className="text-xs text-muted mt-1">
                              {dayjs(record.recordTime).format('MM/DD HH:mm')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.medication && petMedication.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-text mb-2 text-sm border-b border-gray-100 pb-1">💉 用药记录</h3>
                      <div className="text-sm space-y-1 pl-2">
                        {petMedication.map((record) => (
                          <p key={record.id}>
                            • {record.content.medicineName} - {record.content.dosage}
                            {record.content.completed ? ' ✓ 已完成' : ' ✗ 未完成'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="mt-6 pt-4 border-t-2 border-gray-200">
              <p className="text-sm text-muted text-center">
                📅 生成时间: {dayjs().format('YYYY年MM月DD日 HH:mm')}
              </p>
              <p className="text-xs text-muted text-center mt-1">
                请妥善保管此交接单，确保照护工作顺利交接
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setShowPreview(false)} className="btn-secondary flex-1">
              返回修改
            </button>
            <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              下载PDF
            </button>
          </div>
          <button onClick={handlePrint} className="btn-secondary w-full mt-3 flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" />
            打印
          </button>
        </div>
      )}
    </div>
  );
}
