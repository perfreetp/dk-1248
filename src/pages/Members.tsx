import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { Task, TaskType, TaskPriority } from '@/types';
import { 
  User, Trash2, CheckCircle2, Circle, Clock, 
  Plus, AlertCircle, Star, ArrowLeft, List
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
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'feed' as TaskType,
    petId: '',
    assignedTo: '',
    priority: 'normal' as TaskPriority,
    dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  });
  
  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId);
  }, [members, selectedMemberId]);
  
  const memberTasks = useMemo(() => {
    if (!selectedMemberId) return { pending: [], completed: [] };
    const memberTaskList = tasks.filter((t) => t.assignedTo === selectedMemberId);
    
    const pending = memberTaskList
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf());
    
    const completed = memberTaskList
      .filter((t) => t.status === 'completed')
      .sort((a, b) => dayjs(b.completedAt).valueOf() - dayjs(a.completedAt).valueOf())
      .slice(0, 20);
    
    return { pending, completed };
  }, [tasks, selectedMemberId]);
  
  const pendingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf());
  
  const completedTasks = tasks
    .filter((t) => t.status === 'completed')
    .sort((a, b) => dayjs(b.completedAt).valueOf() - dayjs(a.completedAt).valueOf())
    .slice(0, 10);
  
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
  
  const getMemberTaskStats = (memberId: string) => {
    const memberTaskList = tasks.filter((t) => t.assignedTo === memberId);
    const pending = memberTaskList.filter((t) => t.status !== 'completed').length;
    const completed = memberTaskList.filter((t) => t.status === 'completed').length;
    return { pending, completed, total: memberTaskList.length };
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
            {members.map((member) => {
              const stats = getMemberTaskStats(member.id);
              return (
                <div 
                  key={member.id} 
                  className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedMemberId(member.id)}
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-text">{member.name}</h3>
                  <p className="text-xs text-muted mb-2">
                    {member.role === 'owner' ? '管理员' : '成员'}
                  </p>
                  <div className="flex justify-center gap-2 text-xs">
                    <span className="bg-warning bg-opacity-20 text-warning px-2 py-0.5 rounded-full">
                      {stats.pending} 待办
                    </span>
                    <span className="bg-secondary bg-opacity-20 text-secondary px-2 py-0.5 rounded-full">
                      {stats.completed} 已完成
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-1">
                    共 {stats.total} 项任务
                  </div>
                  <div className="text-xs text-muted mt-1">
                    按时率: {(member.stats.onTimeRate * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {selectedMember && (
          <div className="card bg-primary bg-opacity-5 border-2 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">{selectedMember.name}</h3>
                  <p className="text-sm text-muted">
                    {memberTasks.pending.length} 项待办 · {memberTasks.completed.length} 项已完成
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberId(null)}
                className="text-primary text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
            </div>
            
            {memberTasks.pending.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                  <Circle className="w-4 h-4 text-warning" />
                  待办任务
                </h4>
                <div className="space-y-2">
                  {memberTasks.pending.map((task) => {
                    const pet = pets.find((p) => p.id === task.petId);
                    const priority = priorityConfig[task.priority];
                    const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), 'day');
                    
                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg ${isOverdue ? 'bg-danger bg-opacity-10 border border-danger' : 'bg-white'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-text">{task.title}</p>
                            <p className="text-xs text-muted">
                              {taskTypeLabels[task.type]}{pet && ` · ${pet.name}`}
                              <span className={`ml-2 ${isOverdue ? 'text-danger' : ''}`}>
                                {isOverdue ? '已逾期' : dayjs(task.dueDate).format('MM/DD')}
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() => completeTask(task.id)}
                            className="px-3 py-1 bg-secondary text-white rounded-full text-sm"
                          >
                            完成
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {memberTasks.completed.length > 0 && (
              <div>
                <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  最近完成
                </h4>
                <div className="space-y-1">
                  {memberTasks.completed.slice(0, 10).map((task) => {
                    const pet = pets.find((p) => p.id === task.petId);
                    
                    return (
                      <div key={task.id} className="p-2 bg-white rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                          <span className="text-sm text-muted line-through">{task.title}</span>
                          {pet && <span className="text-xs text-muted">· {pet.name}</span>}
                        </div>
                        <span className="text-xs text-muted">
                          {task.completedAt ? dayjs(task.completedAt).format('MM/DD HH:mm') : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {memberTasks.pending.length === 0 && memberTasks.completed.length === 0 && (
              <div className="text-center py-4 text-muted">
                暂无任务记录
              </div>
            )}
          </div>
        )}
        
        {!selectedMember && (
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
