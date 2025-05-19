import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts';

// ข้อมูลตัวอย่างสำหรับการเข้าเรียน
const data = [
  { month: 'ม.ค.', present: 20, absent: 2, late: 3 },
  { month: 'ก.พ.', present: 18, absent: 1, late: 2 },
  { month: 'มี.ค.', present: 22, absent: 0, late: 1 },
  { month: 'เม.ย.', present: 15, absent: 3, late: 4 },
  { month: 'พ.ค.', present: 19, absent: 2, late: 2 },
];

const StudentAttendanceChart = () => {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>{`เดือน ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ margin: '5px 0', color: entry.color }}>
              {entry.name === 'present' && 'เข้าเรียน: '}
              {entry.name === 'absent' && 'ขาดเรียน: '}
              {entry.name === 'late' && 'มาสาย: '}
              {entry.value} วัน
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="present" name="เข้าเรียน" stackId="a" fill={theme.palette.success.main} />
        <Bar dataKey="late" name="มาสาย" stackId="a" fill={theme.palette.warning.main} />
        <Bar dataKey="absent" name="ขาดเรียน" stackId="a" fill={theme.palette.error.main} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudentAttendanceChart;
