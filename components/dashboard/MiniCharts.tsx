import React, { useRef, useEffect } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';
import { TimelineDataPoint, StatusDistribution } from '../../types/dashboard';

interface MiniChartsProps {
  collectedOverTime: TimelineDataPoint[];
  statusDistribution: StatusDistribution[];
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  active: '#3b82f6',
  pending: '#f59e0b',
  paid: '#10b981',
  closed: '#6b7280',
  legal: '#f43f5e',
  in_collection: '#8b5cf6',
  new: '#06b6d4',
  paused: '#f59e0b',
  handed_off: '#f43f5e',
};

const statusLabels: Record<string, string> = {
  active: 'Aktiva',
  pending: 'Väntande',
  paid: 'Betalda',
  closed: 'Avslutade',
  legal: 'Rättsliga',
  in_collection: 'Under bevakning',
  new: 'Nya',
  paused: 'Pausade',
  handed_off: 'Överlämnade',
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} mkr`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} tkr`;
  }
  return `${amount} kr`;
};

// Sparkline Chart Component
const SparklineChart: React.FC<{ data: TimelineDataPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 5, right: 5, bottom: 5, left: 5 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const amounts = data.map((d) => d.amount);
    const maxAmount = Math.max(...amounts) * 1.1;
    const minAmount = 0;

    if (data.length > 1) {
      // Fill area
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.beginPath();
      data.forEach((point, i) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * i;
        const y = padding.top + chartHeight - (chartHeight * (point.amount - minAmount)) / (maxAmount - minAmount);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      data.forEach((point, i) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * i;
        const y = padding.top + chartHeight - (chartHeight * (point.amount - minAmount)) / (maxAmount - minAmount);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Mini Donut Chart Component
const MiniDonutChart: React.FC<{ data: StatusDistribution[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 2;
    const innerRadius = radius * 0.6;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;
    const total = data.reduce((sum, d) => sum + d.count, 0);

    data.forEach((item) => {
      const sliceAngle = (item.count / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = statusColors[item.status] || '#6b7280';
      ctx.fill();

      startAngle = endAngle;
    });
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const MiniCharts: React.FC<MiniChartsProps> = ({ collectedOverTime, statusDistribution, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass border border-white/10 rounded-xl p-4 animate-pulse">
          <div className="w-32 h-4 bg-white/5 rounded mb-3" />
          <div className="h-20 bg-white/5 rounded" />
        </div>
        <div className="glass border border-white/10 rounded-xl p-4 animate-pulse">
          <div className="w-32 h-4 bg-white/5 rounded mb-3" />
          <div className="h-20 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  // Calculate totals for display
  const totalCollected = collectedOverTime.reduce((sum, d) => sum + d.amount, 0);
  const latestMonth = collectedOverTime.length > 0 ? collectedOverTime[collectedOverTime.length - 1] : null;
  const totalCases = statusDistribution.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sparkline Chart - Collected Over Time */}
      <div className="glass border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Återvunnet</h4>
              <p className="text-xs text-gray-500">Senaste 12 mån</p>
            </div>
          </div>
          {latestMonth && (
            <div className="text-right">
              <p className="text-sm font-bold text-white">{formatCurrency(latestMonth.amount)}</p>
              <p className="text-xs text-gray-500">senaste månaden</p>
            </div>
          )}
        </div>
        <div className="h-16">
          {collectedOverTime.length > 0 ? (
            <SparklineChart data={collectedOverTime} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
              Ingen data
            </div>
          )}
        </div>
      </div>

      {/* Mini Donut - Status Distribution */}
      <div className="glass border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Statusfördelning</h4>
              <p className="text-xs text-gray-500">{totalCases} ärenden</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            {statusDistribution.length > 0 ? (
              <MiniDonutChart data={statusDistribution} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                -
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
            {statusDistribution.slice(0, 4).map((item) => (
              <div key={item.status} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusColors[item.status] || '#6b7280' }}
                />
                <span className="text-xs text-gray-400 truncate">
                  {statusLabels[item.status] || item.status}
                </span>
                <span className="text-xs text-white font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCharts;
