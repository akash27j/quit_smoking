import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DailyStats } from '@shared/schema';

interface ChartProps {
  data: DailyStats[];
  type?: 'line' | 'bar';
  dataKey?: string;
  color?: string;
}

export function CigaretteChart({ data, type = 'line', color = '#10B981' }: ChartProps) {
  const chartData = data.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cigarettes: stat.cigaretteCount,
    moneySaved: stat.moneySaved,
  }));

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            stroke="#666"
          />
          <YAxis 
            fontSize={12}
            stroke="#666"
          />
          <Bar 
            dataKey="cigarettes" 
            fill={color}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          fontSize={12}
          stroke="#666"
        />
        <YAxis 
          fontSize={12}
          stroke="#666"
        />
        <Line 
          type="monotone" 
          dataKey="cigarettes" 
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface TriggerChartProps {
  data: Record<string, number>;
}

export function TriggerChart({ data }: TriggerChartProps) {
  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const chartData = Object.entries(data).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: colors[index % colors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
