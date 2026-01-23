import React, { useRef, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { TimelineDataPoint, StatusDistribution, CaseStatus } from '../../types/dashboard';

interface ChartsProps {
  collectedOverTime: TimelineDataPoint[];
  statusDistribution: StatusDistribution[];
  isLoading?: boolean;
}

const statusColors: Record<CaseStatus, string> = {
  active: '#3b82f6',
  pending: '#f59e0b',
  paid: '#10b981',
  closed: '#6b7280',
  legal: '#f43f5e',
};

const statusLabels: Record<CaseStatus, string> = {
  active: 'Aktiva',
  pending: 'Väntande',
  paid: 'Betalda',
  closed: 'Avslutade',
  legal: 'Rättsliga',
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

// Line Chart Component
const LineChart: React.FC<{ data: TimelineDataPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get min/max values
    const amounts = data.map((d) => d.amount);
    const maxAmount = Math.max(...amounts) * 1.1;
    const minAmount = 0;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxAmount - ((maxAmount - minAmount) / 4) * i;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(value), padding.left - 10, y + 4);
    }

    // Draw data line
    if (data.length > 1) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      // Fill area
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

      // Draw points
      data.forEach((point, i) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * i;
        const y = padding.top + chartHeight - (chartHeight * (point.amount - minAmount)) / (maxAmount - minAmount);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // X-axis labels
    const labelCount = Math.min(data.length, 6);
    const step = Math.floor(data.length / labelCount);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < data.length; i += step) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const date = new Date(data[i].date);
      const label = date.toLocaleDateString('sv-SE', { month: 'short' });
      ctx.fillText(label, x, height - 15);
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

// Donut Chart Component
const DonutChart: React.FC<{ data: StatusDistribution[] }> = ({ data }) => {
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
    const radius = Math.min(width, height) / 2 - 20;
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
      ctx.fillStyle = statusColors[item.status];
      ctx.fill();

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('ärenden', centerX, centerY + 12);
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const Charts: React.FC<ChartsProps> = ({ collectedOverTime, statusDistribution, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="w-48 h-6 bg-white/5 rounded mb-4" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
        <div className="glass border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="w-48 h-6 bg-white/5 rounded mb-4" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Collected Over Time */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              Indrivet belopp
            </h3>
            <p className="text-sm text-gray-500">Senaste 12 månaderna</p>
          </div>
        </div>
        <div className="h-64">
          {collectedOverTime.length > 0 ? (
            <LineChart data={collectedOverTime} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Ingen data tillgänglig
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart - Status Distribution */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-6">
          Statusfördelning
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-48 h-48 flex-shrink-0">
            {statusDistribution.length > 0 ? (
              <DonutChart data={statusDistribution} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Ingen data
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            {statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColors[item.status] }}
                  />
                  <span className="text-sm text-gray-300">{statusLabels[item.status]}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{item.count}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
