import { useState } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { Reminder, RepeatType } from '@/types';
import { Bell, Plus, Trash2, Clock, Repeat } from 'lucide-react';
import dayjs from 'dayjs';

const repeatTypeLabels: Record<RepeatType, string> = {
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
  custom: '自定义',
};

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function Reminders() {
  const pets = useStore((state) => state.pets);
  const reminders = useStore((state) => state.reminders);
  const addReminder = useStore((state) => state.addReminder);
  const updateReminder = useStore((state) => state.updateReminder);
  const deleteReminder = useStore((state) => state.deleteReminder);
  
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    petId: '',
    time: '08:00',
    repeatType: 'daily' as RepeatType,
    repeatInterval: 1,
    weekDays: [1, 2, 3, 4, 5],
  });
  
  const enabledReminders = reminders.filter((r) => r.isEnabled);
  const disabledReminders = reminders.filter((r) => !r.isEnabled);
  
  const handleAdd = () => {
    if (!newReminder.title) {
      alert('请输入提醒标题');
      return;
    }
    
    addReminder({
      ...newReminder,
      isEnabled: true,
    });
    
    setShowAdd(false);
    setNewReminder({
      title: '',
      petId: '',
      time: '08:00',
      repeatType: 'daily',
      repeatInterval: 1,
      weekDays: [1, 2, 3, 4, 5],
    });
  };
  
  const toggleReminder = (id: string, isEnabled: boolean) => {
    updateReminder(id, { isEnabled: !isEnabled });
  };
  
  return (
    <div>
      <Header
        title="提醒管理"
        rightElement={
          <button
            onClick={() => setShowAdd(true)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        }
      />
      
      <div className="px-4 py-4 space-y-6">
        {enabledReminders.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-text mb-3">已启用</h2>
            <div className="space-y-3">
              {enabledReminders.map((reminder) => {
                const pet = pets.find((p) => p.id === reminder.petId);
                
                return (
                  <div key={reminder.id} className="card">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-bold text-text">{reminder.title}</h3>
                            {pet && (
                              <p className="text-sm text-muted">{pet.name}</p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleReminder(reminder.id, reminder.isEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              reminder.isEnabled ? 'bg-secondary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              reminder.isEnabled ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {reminder.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Repeat className="w-4 h-4" />
                            {repeatTypeLabels[reminder.repeatType]}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-gray-300 hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {disabledReminders.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-text mb-3">已禁用</h2>
            <div className="space-y-3">
              {disabledReminders.map((reminder) => {
                const pet = pets.find((p) => p.id === reminder.petId);
                
                return (
                  <div key={reminder.id} className="card opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-6 h-6 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text">{reminder.title}</h3>
                        {pet && (
                          <p className="text-sm text-muted">{pet.name}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted mt-1">
                          <span>{reminder.time}</span>
                          <span>{repeatTypeLabels[reminder.repeatType]}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleReminder(reminder.id, reminder.isEnabled)}
                        className="px-3 py-1 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition-colors"
                      >
                        启用
                      </button>
                      
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-gray-300 hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {reminders.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-muted mb-4">还没有设置提醒</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              添加第一个提醒
            </button>
          </div>
        )}
      </div>
      
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">添加提醒</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">提醒标题</label>
                <input
                  type="text"
                  className="input"
                  placeholder="如: 喂猫粮、遛狗"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">关联宠物</label>
                <select
                  className="input"
                  value={newReminder.petId}
                  onChange={(e) => setNewReminder({ ...newReminder, petId: e.target.value })}
                >
                  <option value="">不关联</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">提醒时间</label>
                <input
                  type="time"
                  className="input"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">重复周期</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['daily', 'weekly', 'monthly', 'custom'] as RepeatType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewReminder({ ...newReminder, repeatType: type })}
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        newReminder.repeatType === type
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {repeatTypeLabels[type]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {newReminder.repeatType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-text mb-2">选择星期</label>
                  <div className="flex gap-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const days = newReminder.weekDays.includes(index)
                            ? newReminder.weekDays.filter((d) => d !== index)
                            : [...newReminder.weekDays, index];
                          setNewReminder({ ...newReminder, weekDays: days });
                        }}
                        className={`flex-1 py-2 rounded-lg border-2 transition-all text-xs font-medium ${
                          newReminder.weekDays.includes(index)
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200'
                        }`}
                      >
                        {day.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button onClick={handleAdd} className="btn-primary w-full">
                创建提醒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
