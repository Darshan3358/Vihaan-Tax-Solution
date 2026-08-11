import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let styleClasses = 'bg-slate-100 text-slate-800 border-slate-200';

  switch (status) {
    case 'New':
      styleClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold animate-pulse';
      break;
    case 'Contacted':
      styleClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'In Discussion':
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
      break;
    case 'Follow-Up':
      styleClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Converted':
      styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      break;
    case 'Closed':
      styleClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'Rejected':
      styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${styleClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};
