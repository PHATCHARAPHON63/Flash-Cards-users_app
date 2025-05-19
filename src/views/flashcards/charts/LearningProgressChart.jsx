import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ข้อมูลตัวอย่างสำหรับกราฟความก้าวหน้า
const data = [
  { วัน: '1 พ.ค.', คำศัพท์ที่ท่อง: 15, คำศัพท์ที่จำได้: 8 },
  { วัน: '2 พ.ค.', คำศัพท์ที่ท่อง: 20, คำศัพท์ที่จำได้: 12 },
  { วัน: '3 พ.ค.', คำศัพท์ที่ท่อง: 25, คำศัพท์ที่จำได้: 15 },
  { วัน: '4 พ.ค.', คำศัพท์ที่ท่อง: 18, คำศัพท์ที่จำได้: 13 },
  { วัน: '5 พ.ค.', คำศัพท์ที่ท่อง: 22, คำศัพท์ที่จำได้: 18 },
  { วัน: '6 พ.ค.', คำศัพท์ที่ท่อง: 30, คำศัพท์ที่จำได้: 22 },
  { วัน: '7 พ.ค.', คำศัพท์ที่ท่อง: 28, คำศัพท์ที่จำได้: 23 },
  { วัน: '8 พ.ค.', คำศัพท์ที่ท่อง: 35, คำศัพท์ที่จำได้: 28 },
  { วัน: '9 พ.ค.', คำศัพท์ที่ท่อง: 32, คำศัพท์ที่จำได้: 27 },
  { วัน: '10 พ.ค.', คำศัพท์ที่ท่อง: 40, คำศัพท์ที่จำได้: 32 },
  { วัน: '11 พ.ค.', คำศัพท์ที่ท่อง: 38, คำศัพท์ที่จำได้: 33 },
  { วัน: '12 พ.ค.', คำศัพท์ที่ท่อง: 42, คำศัพท์ที่จำได้: 36 },
  { วัน: '13 พ.ค.', คำศัพท์ที่ท่อง: 45, คำศัพท์ที่จำได้: 40 },
  { วัน: '14 พ.ค.', คำศัพท์ที่ท่อง: 50, คำศัพท์ที่จำได้: 43 },
];

const LearningProgressChart = () => {
  const theme = useTheme();

  // กำหนดสีตามธีม
  const colorPrimary = theme.palette.primary.main;
  const colorSuccess = theme.palette.success.main;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{ 
            backgroundColor: '#fff', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ margin: '0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p 
              key={`item-${index}`} 
              style={{ 
                margin: '5px 0', 
                color: entry.color
              }}
            >
              {entry.name}: {entry.value} คำ
            </p>
          ))}
          <p 
            style={{ 
              margin: '5px 0', 
              color: theme.palette.text.secondary,
              fontSize: '0.8rem'
            }}
          >
            อัตราความสำเร็จ: {Math.round((payload[1].value / payload[0].value) * 100)}%
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis 
          dataKey="วัน" 
          stroke={theme.palette.text.secondary}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke={theme.palette.text.secondary}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="คำศัพท์ที่ท่อง"
          stroke={colorPrimary}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="คำศัพท์ที่จำได้" 
          stroke={colorSuccess} 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LearningProgressChart;