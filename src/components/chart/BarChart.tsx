import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderRadius?: number;
  }[];
}

const BarChart: React.FC<{ chartData: IChartData; chartTitle?: string }> = (
  props
) => {
  const { chartTitle } = props;
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            font: {
              size: 13,
              weight: "600" as const,
            },
            color: "#334155",
            usePointStyle: true,
            boxWidth: 8,
          },
        },
        title: {
          display: !!chartTitle,
          text: chartTitle || "",
          color: "#0f172a",
          font: { size: 14, weight: "bold" as const },
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#f8fafc",
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#64748b",
            font: { size: 12 },
          },
        },
        y: {
          grid: {
            color: "#f1f5f9",
          },
          ticks: {
            color: "#64748b",
            font: { size: 12 },
          },
        },
      },
    }),
    [chartTitle]
  );
  return <Bar options={options} data={props.chartData} />;
};

export default BarChart;
