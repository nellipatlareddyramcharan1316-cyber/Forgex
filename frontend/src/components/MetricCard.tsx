import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  status?: 'normal' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  status = 'normal'
}) => {
  let accentColor = 'var(--accent-cyan, #38bdf8)';
  if (status === 'success') accentColor = 'var(--accent-emerald, #10b981)';
  if (status === 'warning') accentColor = 'var(--accent-amber, #f59e0b)';
  if (status === 'danger') accentColor = 'var(--accent-rose, #f43f5e)';

  return (
    <div
      data-testid="metric-card"
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        borderLeft: `4px solid ${accentColor}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main, #f8fafc)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {subtext && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim, #64748b)' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};
