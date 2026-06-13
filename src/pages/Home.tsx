import { useStore } from '@/store';
import Header from '@/components/Header';
import PetCard from '@/components/PetCard';
import { BarChart3, Plus, PlusCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function Home() {
  const navigate = useNavigate();
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const tasks = useStore((state) => state.tasks);

  const today = dayjs();
  const todayTasks = tasks.filter((task) =>
    dayjs(task.dueDate).isSame(today, 'day')
  );

  const getRecentRecordsForPet = (petId: string) => {
    return records
      .filter((r) => r.petId === petId)
      .sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
      .slice(0, 5);
  };

  const getTodayTasksForPet = (petId: string) => {
    return todayTasks.filter((task) => task.petId === petId);
  };

  const incompleteTasks = todayTasks.filter((t) => t.status !== 'completed').length;
  const starredRecords = records.filter((r) => r.isStarred);

  return (
    <div>
      <Header
        title="宠物日记"
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/timeline')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="时间轴"
            >
              <FileText className="w-5 h-5 text-text" />
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="统计"
            >
              <BarChart3 className="w-5 h-5 text-text" />
            </button>
            <button
              onClick={() => navigate('/handover')}
              className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition-colors"
            >
              交接单
            </button>
          </div>
        }
      />

      <div className="px-4 space-y-4">
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-text mb-2">
            欢迎回来！👋
          </h2>
          <p className="text-muted">
            今天有 {pets.length} 只小可爱需要照顾
          </p>
          {(incompleteTasks > 0 || starredRecords.length > 0) && (
            <div className="flex justify-center gap-4 mt-2">
              {incompleteTasks > 0 && (
                <span className="text-sm text-warning">
                  ⚠ {incompleteTasks} 项待办
                </span>
              )}
              {starredRecords.length > 0 && (
                <span className="text-sm text-danger">
                  ⭐ {starredRecords.length} 条异常
                </span>
              )}
            </div>
          )}
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">还没有添加宠物</p>
            <button
              onClick={() => navigate('/pet/new')}
              className="btn-primary"
            >
              添加第一个宠物
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-text">我的宠物</h3>
              <button
                onClick={() => navigate('/pet/new')}
                className="text-sm text-primary flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                添加宠物
              </button>
            </div>
            <div className="space-y-4">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  recentRecords={getRecentRecordsForPet(pet.id)}
                  todayTasks={getTodayTasksForPet(pet.id)}
                  onClick={() => navigate(`/pet/${pet.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {todayTasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-text mb-3">今日任务</h3>
            <div className="space-y-2">
              {todayTasks.slice(0, 3).map((task) => {
                const pet = pets.find((p) => p.id === task.petId);
                return (
                  <div
                    key={task.id}
                    className="card flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-text">{task.title}</p>
                      {pet && (
                        <p className="text-sm text-muted">{pet.name}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-secondary bg-opacity-20 text-secondary'
                          : task.priority === 'urgent'
                          ? 'bg-danger bg-opacity-20 text-danger'
                          : task.priority === 'important'
                          ? 'bg-warning bg-opacity-20 text-warning'
                          : 'bg-gray-100 text-muted'
                      }`}
                    >
                      {task.status === 'completed' ? '已完成' : task.priority === 'urgent' ? '紧急' : task.priority === 'important' ? '重要' : '普通'}
                    </span>
                  </div>
                );
              })}
            </div>
            {todayTasks.length > 3 && (
              <button
                onClick={() => navigate('/members')}
                className="w-full mt-3 text-sm text-primary"
              >
                查看全部 {todayTasks.length} 项任务 →
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/record/new')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
