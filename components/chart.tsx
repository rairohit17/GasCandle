'use client';
import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,

  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries,
} from 'lightweight-charts';

type Props = {
  data: CandlestickData[];
};

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
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

    
      seriesRef.current = chartRef.current.addSeries(CandlestickSeries,{
        upColor: '#2196f3',
        downColor: '#1565c0',
        borderVisible: true,
        borderUpColor: '#2196f3',
        borderDownColor: '#1565c0',
        wickVisible: true,
        wickUpColor: '#2196f3',
        wickDownColor: '#1565c0',
      });
    }

    
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

   
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  
  useEffect(() => {
    if (seriesRef.current && data) {
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  
  return (
    <div
      ref={chartContainerRef}
      className="h-[400px] shadow-lg max-w-[70vw] w-auto mx-[15vw] max-h-[50vh] my-[10vh]"
    />
  );
};

export default CandlestickChart;