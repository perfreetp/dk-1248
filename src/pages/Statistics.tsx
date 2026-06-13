import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import Header from '@/components/Header';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BarChart3, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Statistics() {
  const pets = useStore((state) => state.pets);
  const records = useStore((state) => state.records);
  const tasks = useStore((state) => state.tasks);
  
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  
  const selectedPet = pets.find((p) => p.id === selectedPetId);
  
  const filteredRecords = useMemo(() => {
    if (selectedPetId === 'all') return records;
    return records.filter((r) => r.petId === selectedPetId);
  }, [records, selectedPetId]);
  
  const weightRecords = useMemo(() => {
    return filteredRecords
      .filter((r) => r.type === 'weight')
      .sort((a, b) => new Date(a.recordTime).getTime() - new Date(b.recordTime).getTime())
      .slice(-30);
  }, [filteredRecords]);
  
  const recordTypeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredRecords.forEach((record) => {
      stats[record.type] = (stats[record.type] || 0) + 1;
    });
    return stats;
  }, [filteredRecords]);
  
  const healthStatusStats = useMemo(() => {
    if (selectedPetId !== 'all' && selectedPet) {
      return {
        normal: selectedPet.healthStatus === 'normal' ? 1 : 0,
        attention: selectedPet.healthStatus === 'attention' ? 1 : 0,
        abnormal: selectedPet.healthStatus === 'abnormal' ? 1 : 0,
      };
    }
    
    const stats = { normal: 0, attention: 0, abnormal: 0 };
    pets.forEach((pet) => {
      stats[pet.healthStatus]++;
    });
    return stats;
  }, [pets, selectedPetId, selectedPet]);
  
  const taskCompletionStats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const total = tasks.length;
    return {
      completed,
      pending: total - completed,
      rate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [tasks]);
  
  const starredRecords = filteredRecords.filter((r) => r.isStarred);
  
  const weightChartData = {
    labels: weightRecords.map((r) => dayjs(r.recordTime).format('MM/DD')),
    datasets: [
      {
        label: '体重 (kg)',
        data: weightRecords.map((r) => r.content.weight),
        borderColor: '#FF8A65',
        backgroundColor: 'rgba(255, 138, 101, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF8A65',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  
  const healthChartData = {
    labels: ['正常', '需关注', '异常'],
    datasets: [
      {
        data: [
          healthStatusStats.normal,
          healthStatusStats.attention,
          healthStatusStats.abnormal,
        ],
        backgroundColor: ['#81C784', '#FFD54F', '#E57373'],
        borderWidth: 0,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    cutout: '60%',
  };
  
  return (
    <div>
      <Header title="统计分析" />
      
      <div className="px-4 py-4 space-y-6">
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
        
        <div className="grid grid-cols-2 gap-3">
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted">总记录数</span>
            </div>
            <div className="text-3xl font-bold text-text">{filteredRecords.length}</div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-muted">任务完成率</span>
            </div>
            <div className="text-3xl font-bold text-text">
              {taskCompletionStats.rate.toFixed(0)}%
            </div>
          </div>
        </div>
        
        {weightRecords.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text">体重变化</h3>
            </div>
            <div className="h-64">
              <Line data={weightChartData} options={chartOptions} />
            </div>
          </div>
        )}
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-text">健康状态分布</h3>
          </div>
          <div className="h-64">
            <Doughnut data={healthChartData} options={doughnutOptions} />
          </div>
        </div>
        
        <div className="card">
          <h3 className="font-bold text-text mb-4">护理类型统计</h3>
          <div className="space-y-3">
            {Object.entries(recordTypeStats)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text capitalize">
                      {type}
                    </span>
                    <span className="text-sm text-muted">{count} 条</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(count / filteredRecords.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {starredRecords.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="font-bold text-text">异常记录</h3>
              <span className="px-2 py-0.5 bg-danger bg-opacity-20 text-danger text-xs font-medium rounded-full">
                {starredRecords.length}
              </span>
            </div>
            <div className="space-y-2">
              {starredRecords.slice(0, 5).map((record) => {
                const pet = pets.find((p) => p.id === record.petId);
                return (
                  <div
                    key={record.id}
                    className="p-3 bg-danger bg-opacity-5 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-text capitalize">
                        {record.type}
                      </span>
                      <span className="text-xs text-muted">
                        {dayjs(record.recordTime).format('MM/DD HH:mm')}
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
      </div>
    </div>
  );
}
