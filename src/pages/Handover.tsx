import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { FileText, Download, Printer, Check, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function Handover() {
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const tasks = useStore((state) => state.tasks);
  const reminders = useStore((state) => state.reminders);
  
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [contentOptions, setContentOptions] = useState({
    basicInfo: true,
    healthStatus: true,
    recentTasks: true,
    careHabits: true,
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
      alert('请选择要交接的宠物');
      return;
    }
    setShowPreview(true);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    alert('PDF下载功能需要浏览器打印为PDF');
    handlePrint();
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
            <h3 className="font-bold text-text mb-4">选择宠物</h3>
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
              {selectedPets.length === 0
                ? '未选择将包含所有宠物'
                : `已选择 ${selectedPets.length} 只宠物`}
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-bold text-text mb-4">交接内容</h3>
            <div className="space-y-3">
              {Object.entries(contentOptions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setContentOptions({ ...contentOptions, [key]: e.target.checked })
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                  <span className="text-text">
                    {key === 'basicInfo' && '宠物基本信息'}
                    {key === 'healthStatus' && '当前健康状态'}
                    {key === 'recentTasks' && '近期待办任务'}
                    {key === 'careHabits' && '护理习惯和注意事项'}
                    {key === 'abnormalRecords' && '近期异常记录'}
                    {key === 'medication' && '用药情况'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-bold text-text mb-4">交接单预览</h3>
            <div className="space-y-2 text-sm text-muted">
              <div>交接时间: {dayjs(startDate).format('YYYY年MM月DD日')} - {dayjs(endDate).format('YYYY年MM月DD日')}</div>
              <div>宠物数量: {selectedPets.length === 0 ? pets.length : selectedPets.length} 只</div>
              <div>相关记录: {filteredRecords.length} 条</div>
              <div>待办任务: {filteredTasks.length} 项</div>
              {abnormalRecords.length > 0 && (
                <div className="text-danger">异常记录: {abnormalRecords.length} 条</div>
              )}
              {medicationRecords.length > 0 && (
                <div>用药记录: {medicationRecords.length} 条</div>
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
            <div className="text-center border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-text mb-2">宠物看护交接单</h1>
              <p className="text-sm text-muted">
                {dayjs(startDate).format('YYYY年MM月DD日')} - {dayjs(endDate).format('YYYY年MM月DD日')}
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
                <div key={petId} className="mb-6 last:mb-0">
                  <h2 className="text-xl font-bold text-text mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {pet.name}
                  </h2>
                  
                  {contentOptions.basicInfo && (
                    <div className="mb-3">
                      <h3 className="font-bold text-text mb-2">基本信息</h3>
                      <div className="text-sm text-muted space-y-1 pl-4">
                        <p>品种: {pet.breed || pet.species}</p>
                        <p>年龄: {pet.age}岁</p>
                        <p>性别: {pet.gender === 'male' ? '公' : '母'}</p>
                        {pet.weight && <p>体重: {pet.weight}kg</p>}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.healthStatus && (
                    <div className="mb-3">
                      <h3 className="font-bold text-text mb-2">健康状态</h3>
                      <div className="text-sm text-muted pl-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          pet.healthStatus === 'normal'
                            ? 'bg-secondary bg-opacity-20 text-secondary'
                            : pet.healthStatus === 'attention'
                            ? 'bg-warning bg-opacity-20 text-warning'
                            : 'bg-danger bg-opacity-20 text-danger'
                        }`}>
                          {pet.healthStatus === 'normal' ? '正常' : pet.healthStatus === 'attention' ? '需关注' : '异常'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.recentTasks && petTasks.length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-text mb-2">待办任务</h3>
                      <div className="space-y-1 pl-4">
                        {petTasks.map((task) => (
                          <div key={task.id} className="text-sm text-muted">
                            • {task.title} - {dayjs(task.dueDate).format('MM/DD')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentOptions.abnormalRecords && petAbnormal.length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-danger mb-2">⚠️ 异常记录</h3>
                      <div className="space-y-1 pl-4">
                        {petAbnormal.map((record) => (
                          <div key={record.id} className="text-sm text-danger bg-danger bg-opacity-5 p-2 rounded">
                            <div className="font-medium">{record.type}</div>
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
                    <div className="mb-3">
                      <h3 className="font-bold text-text mb-2">用药记录</h3>
                      <div className="space-y-1 pl-4">
                        {petMedication.map((record) => (
                          <div key={record.id} className="text-sm text-muted">
                            • {record.content.medicineName} - {record.content.dosage}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-muted text-center">
                生成时间: {dayjs().format('YYYY年MM月DD日 HH:mm')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setShowPreview(false)} className="btn-secondary flex-1">
              返回修改
            </button>
            <button onClick={handlePrint} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              打印
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
