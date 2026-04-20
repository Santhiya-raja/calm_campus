import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function StressTrendChart({ assessments }) {
  if (!assessments?.length)
    return <div className="flex items-center justify-center h-48 text-muted text-sm">No assessment data yet.</div>;

  const sorted = [...assessments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const data = {
    labels: sorted.map(a => new Date(a.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })),
    datasets: [{
      label: 'Stress Score',
      data: sorted.map(a => a.totalScore),
      fill: true,
      borderColor: '#4A90D9',
      backgroundColor: 'rgba(74,144,217,0.12)',
      pointBackgroundColor: sorted.map(a =>
        a.totalScore <= 25 ? '#52B788' : a.totalScore <= 50 ? '#F4C543' : a.totalScore <= 75 ? '#F4874B' : '#E05C5C'
      ),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4,
      borderWidth: 2.5,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#2D3748',
        bodyColor: '#718096',
        borderColor: '#4A90D9',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const score = ctx.raw;
            const cat = score <= 25 ? 'Low' : score <= 50 ? 'Moderate' : score <= 75 ? 'High' : 'Severe';
            return ` Score: ${score}/100 (${cat})`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(74,144,217,0.08)' },
        ticks: { color: '#718096', font: { size: 11 }, callback: v => `${v}%` },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#718096', font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ height: 240 }}>
      <Line data={data} options={options} />
    </div>
  );
}
