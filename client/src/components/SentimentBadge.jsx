const config = {
  Positive: { bg: 'bg-green-100',  text: 'text-green-700',  icon: '😊', bar: 'bg-green-400'  },
  Neutral:  { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: '😐', bar: 'bg-blue-400'   },
  Negative: { bg: 'bg-red-100',    text: 'text-red-700',    icon: '😔', bar: 'bg-red-400'    },
};

export default function SentimentBadge({ label, score }) {
  const c = config[label] || config.Neutral;
  const barWidth = `${Math.min(100, Math.max(0, Math.round(((score + 1) / 2) * 100)))}%`;

  return (
    <div className={`inline-flex flex-col gap-1.5 px-3 py-2 rounded-xl ${c.bg} ${c.text} text-sm font-medium`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{c.icon}</span>
        <span>{label}</span>
      </div>
      <div className="w-24 h-1.5 bg-white/50 rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: barWidth }} />
      </div>
    </div>
  );
}
