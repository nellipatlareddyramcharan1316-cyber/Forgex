import React from 'react';

interface TrustBadgeProps {
  score: number;
  verdict?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ score, verdict, size = 'md' }) => {
  let badgeColor = '#ef4444'; // Red (Blocked)
  let statusText = verdict || 'BLOCKED';
  let glow = '0 0 15px rgba(239, 68, 68, 0.4)';

  if (score >= 85) {
    badgeColor = '#10b981'; // Green (Safe)
    statusText = verdict || 'SAFE TO REVIEW';
    glow = '0 0 15px rgba(16, 185, 129, 0.4)';
  } else if (score >= 65) {
    badgeColor = '#f59e0b'; // Amber (Requires approval)
    statusText = verdict || 'REQUIRES APPROVAL';
    glow = '0 0 15px rgba(245, 158, 11, 0.4)';
  }

  const padding = size === 'sm' ? '0.2rem 0.5rem' : size === 'lg' ? '0.5rem 1.2rem' : '0.35rem 0.85rem';
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '1.1rem' : '0.88rem';

  return (
    <div
      data-testid="trust-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding,
        borderRadius: '9999px',
        backgroundColor: `${badgeColor}18`,
        border: `1px solid ${badgeColor}60`,
        boxShadow: glow,
        color: badgeColor,
        fontWeight: 700,
        fontSize,
        fontFamily: 'var(--font-mono, monospace)',
        letterSpacing: '0.02em'
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '6px' : '8px',
          height: size === 'sm' ? '6px' : '8px',
          borderRadius: '50%',
          backgroundColor: badgeColor,
          display: 'inline-block'
        }}
      />
      <span>{score} / 100</span>
      <span style={{ opacity: 0.85, fontWeight: 500, fontSize: '0.85em' }}>• {statusText}</span>
    </div>
  );
};
