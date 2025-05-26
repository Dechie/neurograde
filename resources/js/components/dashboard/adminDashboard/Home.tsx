import { Card, CardContent } from '@/components/ui/card';
import type { AdminHomePageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = [
  '#323a92', 
  '#4b9cd3', 
  '#9b59b6', 
  '#f39c12', 
  '#2ecc71', 
  '#e74c3c'  
];


type DepartmentData = {
    name: string;
    value: number;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-sm">{payload[0].value} students</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data, colors }: { data: DepartmentData[]; colors: string[] }) => (
  <div className="flex flex-col justify-center space-y-2 pl-4">
    {data.map((entry, index) => (
      <div key={`legend-${index}`} className="flex items-center">
        <div
          className="w-4 h-4 mr-2"
          style={{ backgroundColor: colors[index % colors.length] }}
        />
        <span className="text-sm text-gray-600">{entry.name}</span>
      </div>
    ))}
  </div>
);

export default function HomePage() {
    const { props } = usePage<AdminHomePageProps>();
    
    console.log('Dashboard props:', props);
    
    const {
        studentPerDept = [],
        students = [],
        teachers = [],
        classes = [],
        assignedTeacherCount = 0,
        unassignedTeacherCount = 0,
        assignedStudentCount = 0,
        unassignedStudentCount = 0,
    } = props || {};

    const departmentData: DepartmentData[] = Array.isArray(studentPerDept)
        ? studentPerDept
              .filter((item): item is { name: string; value: number } => 
                  item != null && typeof item === 'object' && 'name' in item && 'value' in item
              )
              .map(item => ({
                  name: String(item.name),
                  value: Number(item.value) || 0,
              }))
        : [];

    const totalStudents = Array.isArray(students) ? students.length : 0;
    const totalTeachers = Array.isArray(teachers) ? teachers.length : 0;
    const totalClasses = Array.isArray(classes) ? classes.length : 0;

    const stats = {
        totalStudents,
        totalTeachers,
        totalClasses,
    };

    const barData = [
        {
            name: 'Teachers',
            Assigned: Number(assignedTeacherCount) || 0,
            Unassigned: Number(unassignedTeacherCount) || 0,
        },
        {
            name: 'Students',
            Assigned: Number(assignedStudentCount) || 0,
            Unassigned: Number(unassignedStudentCount) || 0,
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <h1 className="text-2xl font-bold">Welcome back Admin</h1>
                <p>Here's an overview of the teachers, students, and class status.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Teachers</p>
                    <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="text-2xl font-bold">{stats.totalClasses}</p>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">Students per Department</h2>
                        {departmentData.length > 0 ? (
                            <div className="flex items-center">
                                <div className="w-2/3 h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={departmentData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={renderCustomizedLabel}
                                                labelLine={false}
                                            >
                                                {departmentData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]} 
                                                        stroke="#fff"
                                                        strokeWidth={1}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <CustomLegend data={departmentData} colors={COLORS} />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No department data available</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500 text-center">
                            Total students: {totalStudents}
                        </div>
                    </CardContent>
                </Card>
               <Card>
  <CardContent className="p-6">
    <h2 className="mb-4 text-lg font-semibold">Assignment Status</h2>
    <BarChart width={350} height={300} data={barData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />

      <Tooltip
        formatter={(value, name) => [`${value}`, name]}
        cursor={{ fill: 'rgba(50, 58, 146, 0.1)' }} 
      />

      <Bar dataKey="Assigned" fill="#4b9cd3" name="Assigned">
        <LabelList dataKey="Assigned" position="top" />
      </Bar>
      <Bar dataKey="Unassigned" fill="#e74c3c" name="Unassigned">
        <LabelList dataKey="Unassigned" position="top" />
      </Bar>
    </BarChart>
  </CardContent>
</Card>

            </div>
        </div>
    );
};