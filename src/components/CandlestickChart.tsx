
import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandleData[];
}

export const CandlestickChart = ({ data }: CandlestickChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const candleWidth = 8;
  const candleSpacing = 2;
  const totalCandleWidth = candleWidth + candleSpacing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    // Calculate visible range
    const visibleCandles = Math.floor(chartWidth / (totalCandleWidth * zoom));
    const startIndex = Math.max(0, Math.min(data.length - visibleCandles, Math.floor(pan)));
    const endIndex = Math.min(data.length, startIndex + visibleCandles);
    const visibleData = data.slice(startIndex, endIndex);

    if (visibleData.length === 0) return;

    // Calculate price range
    const prices = visibleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const priceScale = chartHeight / priceRange;

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (priceRange / gridLines) * i;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(0)}`, padding - 5, y + 3);
    }

    // Draw candlesticks
    visibleData.forEach((candle, index) => {
      const x = padding + index * totalCandleWidth * zoom;
      const openY = padding + (maxPrice - candle.open) * priceScale;
      const closeY = padding + (maxPrice - candle.close) * priceScale;
      const highY = padding + (maxPrice - candle.high) * priceScale;
      const lowY = padding + (maxPrice - candle.low) * priceScale;

      const isGreen = candle.close > candle.open;
      const bodyHeight = Math.abs(closeY - openY);
      const bodyTop = Math.min(openY, closeY);

      // Draw wick
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth/2, highY);
      ctx.lineTo(x + candleWidth/2, lowY);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.fillRect(x, bodyTop, candleWidth * zoom, Math.max(bodyHeight, 1));

      // Check if mouse is over this candle
      const mouseX = mousePos.x - rect.left;
      const mouseY = mousePos.y - rect.top;
      if (mouseX >= x && mouseX <= x + candleWidth * zoom && mouseY >= padding && mouseY <= height - padding) {
        setHoveredCandle(candle);
        
        // Draw hover line
        ctx.strokeStyle = '#06B6D4';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x + candleWidth/2, padding);
        ctx.lineTo(x + candleWidth/2, height - padding);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw time labels
    const timeLabels = Math.min(6, visibleData.length);
    for (let i = 0; i < timeLabels; i++) {
      const dataIndex = Math.floor((visibleData.length - 1) * i / (timeLabels - 1));
      const candle = visibleData[dataIndex];
      const x = padding + dataIndex * totalCandleWidth * zoom;
      
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(candle.time, x + candleWidth/2, height - 10);
    }

  }, [data, zoom, pan, mousePos]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    
    if (isDragging) {
      const deltaX = e.clientX - lastMouseX;
      const panDelta = deltaX / (totalCandleWidth * zoom);
      setPan(prev => Math.max(0, Math.min(data.length - 10, prev - panDelta)));
      setLastMouseX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="p-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
          className="p-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Tooltip */}
      {hoveredCandle && (
        <div className="absolute top-2 left-2 bg-gray-800 border border-gray-600 rounded p-2 text-xs text-white">
          <div className="font-medium">{hoveredCandle.time}</div>
          <div className="space-y-1 mt-1">
            <div>O: ${hoveredCandle.open.toFixed(2)}</div>
            <div className="text-red-400">H: ${hoveredCandle.high.toFixed(2)}</div>
            <div className="text-green-400">L: ${hoveredCandle.low.toFixed(2)}</div>
            <div>C: ${hoveredCandle.close.toFixed(2)}</div>
            <div className="text-gray-400">Vol: {hoveredCandle.volume.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};
