import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Mermaid kütüphanesini projenin temasına uygun şekilde yapılandıralım.
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    background: '#1f2937', // bg-gray-800
    primaryColor: '#374151', // bg-gray-700
    primaryTextColor: '#ffffff',
    lineColor: '#6b7280', // text-gray-400
    secondaryColor: '#0ea5e9', // bg-sky-500
  },
});

interface MermaidChartProps {
  chartCode: string;
}

export default function MermaidChart({ chartCode }: MermaidChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // useEffect içinde async fonksiyon kullanmak için bu yapıyı kullanıyoruz.
    const renderChart = async () => {
      if (chartRef.current && chartCode) {
        chartRef.current.innerHTML = ''; // Önceki grafiği temizle
        try {
          // mermaid.render fonksiyonunun sonucunu bekliyoruz (await).
          const { svg } = await mermaid.render('mermaid-graph-' + Date.now(), chartCode);
          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
          }
        } catch (error) {
          // Eğer Mermaid kodu hatalıysa veya bir sorun oluşursa,
          // uygulamamızın çökmesini engelliyor ve bir hata mesajı gösteriyoruz.
          console.error("Mermaid rendering error:", error);
          if (chartRef.current) {
            chartRef.current.innerText = "Kavram haritası çizilirken bir hata oluştu.";
          }
        }
      }
    };

    renderChart();
  }, [chartCode]); // Sadece chartCode değiştiğinde yeniden çiz

  return <div ref={chartRef} className="mermaid-container" />;
}