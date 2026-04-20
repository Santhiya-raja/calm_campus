const typeIcons = {
  breathing:   '🌬️',
  meditation:  '🧘',
  study:       '📖',
  sleep:       '😴',
  productivity:'⏱️',
  anxiety:     '💭',
  exercise:    '🤸',
  social:      '🤝',
  wellness:    '📓',
  mindset:     '🌱',
  counselor:   '🏥',
};

const priorityColors = {
  critical: 'border-l-4 border-red-400 bg-red-50',
  high:     'border-l-4 border-orange-400 bg-orange-50',
  medium:   'border-l-4 border-blue-400 bg-blue-50',
  low:      'border-l-4 border-green-400 bg-green-50',
};

const priorityBadge = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-blue-100 text-blue-700',
  low:      'bg-green-100 text-green-700',
};

export default function ActionPlanCard({ item, index }) {
  return (
    <div className={`rounded-xl p-4 ${priorityColors[item.priority] || 'border-l-4 border-gray-300 bg-gray-50'} hover:shadow-md transition-all duration-200 animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{typeIcons[item.type] || '📌'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[item.priority]}`}>
              {item.priority?.toUpperCase()}
            </span>
            {item.duration && (
              <span className="text-xs text-muted bg-white px-2 py-0.5 rounded-full border">⏱ {item.duration}</span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{item.description}</p>
          <p className="text-xs text-muted italic mb-2">💡 {item.reason}</p>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark hover:underline transition-colors">
              {item.type === 'counselor' ? '🔗 Visit Resource' : '▶ Watch on YouTube'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
