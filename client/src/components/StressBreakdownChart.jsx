import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StressBreakdownChart({ scores }) {
  if (!scores) return null;

  // Convert raw scores to % of their max
  const pssPercent      = Math.round((scores.pss      / 40) * 100);
  const workloadPercent = Math.round((scores.workload  / 20) * 100);
  const sleepPercent    = Math.round((scores.sleep     / 20) * 100);
  const peerPercent     = Math.round((scores.peer      / 20) * 100);

  const data = {
    labels: ['Perceived Stress (PSS)', 'Academic Workload', 'Sleep Disruption', 'Peer Pressure'],
    datasets: [{
      data:            [pssPercent, workloadPercent, sleepPercent, peerPercent],
      backgroundColor: ['#4A90D9', '#52B788', '#9B59B6', '#F4874B'],
      borderColor:     ['#fff'],
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, font: { size: 12 }, color: '#4A5568', usePointStyle: true },
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#2D3748',
        bodyColor: '#718096',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` },
      },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
