'use client';

interface CircleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'cyan' | 'green';
  className?: string;
}

export function CircleLoader({ size = 'md', color = 'pink', className = '' }: CircleLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    pink: 'border-pink-500',
    cyan: 'border-cyan-500',
    green: 'border-green-500',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

