import { useState } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { Task, TaskType, TaskPriority } from '@/types';
import { 
  User, Trash2, CheckCircle2, Circle, Clock, 
  Plus, AlertCircle, Star 
} from 'lucide-react';
import dayjs from 'dayjs';

const taskTypeLabels: Record<TaskType, string> = {
  scoop: '铲屎',
  walk: '遛狗',
  feed: '喂食',
  bath: '洗澡',
  deworm: '驱虫',
  medical: '就医',
  other: '其他',
};

const priorityConfig = {
  normal: { label: '普通', color: 'bg-gray-100 text-muted' },
  important: { label: '重要', color: 'bg-warning bg-opacity-20 text-warning' },
  urgent: { label: '紧急', color: 'bg-danger bg-opacity-20 text-danger' },
};

export default function Members() {
  const pets = useStore((state) => state.pets);
  const members = useStore((state) => state.members);
  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const completeTask = useStore((state) => state.completeTask);
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'feed' as TaskType,
    petId: '',
    assignedTo: '',
    priority: 'normal' as TaskPriority,
    dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  });
  
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed').slice(0, 5);
  
  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert('请填写任务名称和分配成员');
      return;
    }
    
    addTask({
      ...newTask,
      status: 'pending',
      dueDate: dayjs(newTask.dueDate).endOf('day').toISOString(),
    });
    
    setShowAddTask(false);
    setNewTask({
      title: '',
      type: 'feed',
      petId: '',
      assignedTo: '',
      priority: 'normal',
      dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    });
  };
  
  return (
    <div>
      <Header
        title="成员管理"
        rightElement={
          <button
            onClick={() => setShowAddTask(true)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        }
      />
      
      <div className="px-4 py-4 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-text mb-3">家庭成员</h2>
          <div className="grid grid-cols-3 gap-3">
            {members.map((member) => (
              <div key={member.id} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-text">{member.name}</h3>
                <p className="text-xs text-muted mb-2">
                  {member.role === 'owner' ? '管理员' : '成员'}
                </p>
                <div className="text-xs text-muted">
                  <div>完成任务: {member.stats.completedTasks}</div>
                  <div className="text-secondary">
                    按时率: {(member.stats.onTimeRate * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-text">待办任务</h2>
            <span className="text-sm text-muted">{pendingTasks.length} 项</span>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-secondary" />
              <p className="text-muted">太棒了，所有任务都已完成！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const pet = pets.find((p) => p.id === task.petId);
                const member = members.find((m) => m.id === task.assignedTo);
                const priority = priorityConfig[task.priority];
                const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), 'day');
                
                return (
                  <div
                    key={task.id}
                    className={`card ${
                      isOverdue ? 'ring-2 ring-danger' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        <Circle className="w-6 h-6 text-gray-300 hover:text-secondary transition-colors" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-text">{task.title}</h3>
                            <p className="text-sm text-muted">
                              {taskTypeLabels[task.type]}
                              {pet && ` · ${pet.name}`}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {member && (
                              <span className="text-muted">
                                分配给: {member.name}
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 ${
                            isOverdue ? 'text-danger' : 'text-muted'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {isOverdue ? '已逾期' : dayjs(task.dueDate).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-text mb-3">最近完成</h2>
            <div className="space-y-2">
              {completedTasks.map((task) => {
                const pet = pets.find((p) => p.id === task.petId);
                const priority = priorityConfig[task.priority];
                
                return (
                  <div key={task.id} className="card opacity-60">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text line-through">
                          {task.title}
                        </h3>
                        {pet && (
                          <p className="text-xs text-muted">{pet.name}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                        {priority.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">添加任务</h2>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-muted hover:text-text"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">任务名称</label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入任务名称"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">任务类型</label>
                <select
                  className="input"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
                >
                  {Object.entries(taskTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">关联宠物</label>
                <select
                  className="input"
                  value={newTask.petId}
                  onChange={(e) => setNewTask({ ...newTask, petId: e.target.value })}
                >
                  <option value="">不关联</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">分配给</label>
                <select
                  className="input"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">选择成员</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">优先级</label>
                <div className="flex gap-2">
                  {(['normal', 'important', 'urgent'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 transition-all ${
                        newTask.priority === p
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {priorityConfig[p].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">截止日期</label>
                <input
                  type="date"
                  className="input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              
              <button onClick={handleAddTask} className="btn-primary w-full">
                创建任务
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
