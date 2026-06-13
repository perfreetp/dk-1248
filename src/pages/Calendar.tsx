import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function Calendar() {
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const tasks = useStore((state) => state.tasks);
  const reminders = useStore((state) => state.reminders);
  
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();
  
  const days = useMemo(() => {
    const daysArray: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }, [startDay, daysInMonth]);
  
  const checkReminderHit = (reminder: any, date: any) => {
    if (!reminder.isEnabled) return false;
    
    const dayOfWeek = date.day();
    const dayOfMonth = date.date();
    
    switch (reminder.repeatType) {
      case 'daily':
        return true;
      case 'weekly':
        return reminder.weekDays?.includes(dayOfWeek) || false;
      case 'monthly':
        return dayOfMonth === 1;
      case 'custom':
        return date.diff(dayjs(reminder.createdAt), 'day') % (reminder.repeatInterval || 1) === 0;
      default:
        return false;
    }
  };
  
  const getDateInfo = (day: number) => {
    const date = currentDate.date(day);
    const isToday = date.isSame(dayjs(), 'day');
    const isSelected = date.isSame(selectedDate, 'day');
    
    const dayRecords = records.filter((r) =>
      dayjs(r.recordTime).isSame(date, 'day')
    );
    
    const dayTasks = tasks.filter((t) =>
      dayjs(t.dueDate).isSame(date, 'day')
    );
    
    const incompleteTasks = dayTasks.filter((t) => t.status !== 'completed');
    const hasReminders = reminders.some((rem) => checkReminderHit(rem, date));
    
    return {
      isToday,
      isSelected,
      records: dayRecords,
      tasks: dayTasks,
      incompleteTasks,
      hasReminders,
      hasStarred: dayRecords.some((r) => r.isStarred),
    };
  };
  
  const selectedDateInfo = useMemo(() => {
    const dayRecords = records
      .filter((r) => dayjs(r.recordTime).isSame(selectedDate, 'day'))
      .sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime());
    
    const dayTasks = tasks
      .filter((t) => dayjs(t.dueDate).isSame(selectedDate, 'day'))
      .sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return 0;
      });
    
    const dayReminders = reminders.filter((rem) => checkReminderHit(rem, selectedDate));
    
    return { records: dayRecords, tasks: dayTasks, reminders: dayReminders };
  }, [selectedDate, records, tasks, reminders]);
  
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };
  
  const goToToday = () => {
    setCurrentDate(dayjs());
    setSelectedDate(dayjs());
  };
  
  const taskTypeLabels: Record<string, string> = {
    scoop: '铲屎',
    walk: '遛狗',
    feed: '喂食',
    bath: '洗澡',
    deworm: '驱虫',
    medical: '就医',
    other: '其他',
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
  
  return (
    <div>
      <Header title="照护日历" />
      
      <div className="px-4 py-4">
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold text-text">
                {currentDate.format('YYYY年MM月')}
              </h2>
              <button
                onClick={goToToday}
                className="text-xs text-primary"
              >
                回到今天
              </button>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-xs text-muted py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square" />;
              }
              
              const info = getDateInfo(day);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(currentDate.date(day))}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    info.isSelected
                      ? 'bg-primary text-white'
                      : info.isToday
                      ? 'bg-primary bg-opacity-10 text-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${info.isSelected ? 'text-white' : ''}`}>
                    {day}
                  </span>
                  {(info.incompleteTasks.length > 0 || info.hasStarred || info.hasReminders) && (
                    <div className="flex gap-0.5 mt-0.5">
                      {info.incompleteTasks.length > 0 && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          info.isSelected ? 'bg-white' : 'bg-warning'
                        }`} />
                      )}
                      {info.hasStarred && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          info.isSelected ? 'bg-white' : 'bg-danger'
                        }`} />
                      )}
                      {info.hasReminders && (
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          info.isSelected ? 'bg-white' : 'bg-secondary'
                        }`} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-muted">待办</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-danger" />
              <span className="text-muted">异常</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-muted">提醒</span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-text">
              {selectedDate.isSame(dayjs(), 'day')
                ? '今天'
                : selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')
                ? '昨天'
                : selectedDate.format('MM月DD日')}
            </h3>
            <span className="text-sm text-muted">
              {selectedDate.format('dddd')}
            </span>
          </div>
          
          {selectedDateInfo.records.length === 0 && 
           selectedDateInfo.tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-muted">这一天没有安排</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateInfo.tasks.length > 0 && (
                <div className="card">
                  <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                    <Circle className="w-4 h-4 text-warning" />
                    待办任务 ({selectedDateInfo.tasks.filter((t) => t.status !== 'completed').length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateInfo.tasks.map((task) => {
                      const pet = pets.find((p) => p.id === task.petId);
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg ${
                            task.status === 'completed'
                              ? 'bg-gray-50 opacity-60'
                              : 'bg-warning bg-opacity-10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-secondary" />
                            ) : (
                              <Circle className="w-5 h-5 text-warning" />
                            )}
                            <div className="flex-1">
                              <p className={`font-medium ${
                                task.status === 'completed' ? 'line-through text-muted' : 'text-text'
                              }`}>
                                {task.title}
                              </p>
                              {pet && (
                                <p className="text-xs text-muted">{pet.name}</p>
                              )}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              task.status === 'completed'
                                ? 'bg-secondary bg-opacity-20 text-secondary'
                                : task.priority === 'urgent'
                                ? 'bg-danger bg-opacity-20 text-danger'
                                : 'bg-gray-100 text-muted'
                            }`}>
                              {taskTypeLabels[task.type]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {selectedDateInfo.records.length > 0 && (
                <div className="card">
                  <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    护理记录 ({selectedDateInfo.records.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateInfo.records.map((record) => {
                      const pet = pets.find((p) => p.id === record.petId);
                      return (
                        <div
                          key={record.id}
                          className={`p-3 rounded-lg ${
                            record.isStarred
                              ? 'bg-danger bg-opacity-10 border border-danger'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text">
                                {recordTypeLabels[record.type]}
                              </span>
                              {record.isStarred && (
                                <span className="px-1.5 py-0.5 bg-danger bg-opacity-20 text-danger text-xs rounded">
                                  异常
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted">
                              {dayjs(record.recordTime).format('HH:mm')}
                            </span>
                          </div>
                          {pet && (
                            <p className="text-sm text-muted">{pet.name}</p>
                          )}
                          {record.notes && (
                            <p className="text-xs text-muted mt-1">{record.notes}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {selectedDateInfo.reminders.length > 0 && (
                <div className="card">
                  <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-secondary" />
                    提醒 ({selectedDateInfo.reminders.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateInfo.reminders.map((reminder) => {
                      const pet = pets.find((p) => p.id === reminder.petId);
                      return (
                        <div key={reminder.id} className="p-3 bg-secondary bg-opacity-10 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="font-medium text-text">{reminder.title}</span>
                            <span className="text-sm text-muted">{reminder.time}</span>
                          </div>
                          {pet && (
                            <p className="text-xs text-muted mt-1">{pet.name}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
