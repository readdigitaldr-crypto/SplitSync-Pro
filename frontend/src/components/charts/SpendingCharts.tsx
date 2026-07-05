import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const colors = ["#4f46e5", "#06b6d4", "#22c55e", "#f97316"];
export function SpendingCharts({
  data,
}: {
  data: { name: string; total: number }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ResponsiveContainer height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer height={260}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="name" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
