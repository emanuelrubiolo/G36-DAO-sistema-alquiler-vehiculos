import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function QuarterlyRentalsChart({ data }) {
  const quarterlyData = [
    { quarter: "Q1", rentals: 120 },
    { quarter: "Q2", rentals: 155 },
    { quarter: "Q3", rentals: 190 },
    { quarter: "Q4", rentals: 215 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl lg:col-span-2">
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
        Alquileres Registrados por Trimestre
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={quarterlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
              formatter={(value) => [`${value} Alquileres`, "Total"]}
            />
            <Bar
              dataKey="rentals"
              name="Alquileres"
              fill="#FFC74F"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
