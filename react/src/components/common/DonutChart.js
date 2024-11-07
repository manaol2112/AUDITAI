import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell, Tooltip } from 'recharts';

const DonutChart = ({ data, title, desc }) => {
  // Function to generate random bluish or greyish color
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 240); // 0 to 240 (bluish range in HSL)
    const saturation = Math.floor(Math.random() * 20) + 60; // 60 to 80 (saturated)
    const lightness = Math.floor(Math.random() * 30) + 50; // 50 to 80 (light to medium)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="90%"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={generateRandomColor()} />
          ))}
        </Pie>
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize={20} fill="#333">
          {title}
        </text>
        <text x="50%" y={"55%"} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#666">
          {desc}
        </text>
        <Tooltip />
        
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
