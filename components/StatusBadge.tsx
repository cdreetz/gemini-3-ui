import React from 'react';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  isActive: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isActive, className = '' }) => {
  const normalizedStatus = status.toLowerCase();
  
  let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
  let Icon = Clock;

  if (isActive || normalizedStatus === 'active' || normalizedStatus === 'starting') {
    colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    Icon = Activity;
  } else if (normalizedStatus.includes('finished')) {
    colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = CheckCircle;
  } else if (normalizedStatus.includes('error') || normalizedStatus.includes('failed')) {
    colorClass = 'bg-red-50 text-red-700 border-red-200';
    Icon = XCircle;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};