'use client';
import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickData,
  UTCTimestamp,
  CandlestickSeriesPartialOptions,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
} from 'lightweight-charts';

type Props = {
  data?: CandlestickData[];
};

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const defaultData: CandlestickData[] = [
    { time: 1680000000 as UTCTimestamp, open: 10, high: 12, low: 9, close: 11 },
    {
      time: 1680003600 as UTCTimestamp,
      open: 11,
      high: 13,
      low: 10,
      close: 12,
    },
    {
      time: 1680007200 as UTCTimestamp,
      open: 12,
      high: 14,
      low: 11,
      close: 13,
    },
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // **Fix:** Use the string 'candlestick' to create the series
    const candlestickSeries: ISeriesApi<'Candlestick'> =
      chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#2196f3',
        downColor: '#1565c0',
        borderVisible: true,
        borderUpColor: '#2196f3',
        borderDownColor: '#1565c0',
        wickVisible: true,
        wickUpColor: '#2196f3',
        wickDownColor: '#1565c0',
      });

    candlestickSeries.setData(data && data.length > 0 ? data : defaultData);
    chartRef.current.timeScale().fitContent();

    // --- Resize Logic ---
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]); // Re-run effect if data changes

  return <div ref={chartContainerRef} className="  h-[400px] shadow-lg max-w-[70vw] w-auto mx-[15vw]  max-h-[50vh] my-[10vh] " />;
};

export default CandlestickChart;
