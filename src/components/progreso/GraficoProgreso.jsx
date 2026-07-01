import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./GraficoProgreso.module.css";

export const GraficoProgreso = ({ datos, ejercicio }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || datos.length === 0) return;

    // Destruir gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: datos.map((d) => d.fecha.slice(5)), // MM-DD
        datasets: [
          {
            label: "Carga (kg)",
            data: datos.map((d) => d.carga),
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "RPE",
            data: datos.map((d) => d.rpe),
            borderColor: "#764ba2",
            backgroundColor: "rgba(118, 75, 162, 0.1)",
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#764ba2",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              boxWidth: 10,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) label += ": ";
                label += context.parsed.y;
                if (context.dataset.label === "Carga (kg)") label += " kg";
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Carga (kg)",
              color: "#667eea",
            },
            beginAtZero: true,
            grid: {
              color: "#e2e8f0",
            },
          },
          y1: {
            position: "right",
            title: {
              display: true,
              text: "RPE",
              color: "#764ba2",
            },
            min: 0,
            max: 10,
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            title: {
              display: true,
              text: "Fecha",
              color: "#718096",
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [datos]);

  if (datos.length === 0) {
    return (
      <div className="grafico-progreso__vacio">
        <p>No hay suficientes datos para mostrar el gráfico</p>
      </div>
    );
  }

  return (
    <div className="grafico-progreso">
      <h4 className="grafico-progreso__titulo">Evolución de {ejercicio}</h4>
      <div className="grafico-progreso__contenedor">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};
