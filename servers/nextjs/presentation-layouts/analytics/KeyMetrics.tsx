import * as z from "zod";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Layout metadata
export const layoutId = "key-metrics-template-slide";
export const layoutName = "Key Metrics Template Slide";
export const layoutDescription =
  "A flexible template slide for visualizing key metrics, including employee productivity, revenue growth, and distribution. All content is placeholder and customizable.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1)
    .max(20)
    .default("Key Metrics")
    .meta({ description: "Main title for the slide (placeholder)" }),

  // Employee Productivity Section
  employeeProductivityTitle: z
    .string()
    .min(1)
    .max(30)
    .default("Employee Productivity")
    .meta({
      description: "Title for the employee productivity section (placeholder)",
    }),
  division1Name: z
    .string()
    .min(1)
    .max(20)
    .default("Division 1")
    .meta({ description: "Name for division 1 (placeholder)" }),
  division1Percentage: z
    .number()
    .min(0)
    .max(100)
    .default(90)
    .meta({ description: "Percentage for division 1 (placeholder)" }),
  division2Name: z
    .string()
    .min(1)
    .max(20)
    .default("Division 2")
    .meta({ description: "Name for division 2 (placeholder)" }),
  division2Percentage: z
    .number()
    .min(0)
    .max(100)
    .default(80)
    .meta({ description: "Percentage for division 2 (placeholder)" }),
  division3Name: z
    .string()
    .min(1)
    .max(20)
    .default("Division 3")
    .meta({ description: "Name for division 3 (placeholder)" }),
  division3Percentage: z
    .number()
    .min(0)
    .max(100)
    .default(76)
    .meta({ description: "Percentage for division 3 (placeholder)" }),
  division4Name: z
    .string()
    .min(1)
    .max(20)
    .default("Division 4")
    .meta({ description: "Name for division 4 (placeholder)" }),
  division4Percentage: z
    .number()
    .min(0)
    .max(100)
    .default(88)
    .meta({ description: "Percentage for division 4 (placeholder)" }),

  // Revenue Growth Section
  revenueGrowthTitle: z.string().min(1).max(30).default("Revenue Growth").meta({
    description: "Title for the revenue growth section (placeholder)",
  }),
  revenueData: z
    .array(
      z.object({
        month: z
          .string()
          .min(1)
          .max(10)
          .meta({ description: "Month label (placeholder)" }),
        revenuePerCustomer: z
          .number()
          .min(0)
          .meta({ description: "Revenue per customer value (placeholder)" }),
        monthlyRevenue: z
          .number()
          .min(0)
          .meta({ description: "Monthly revenue value (placeholder)" }),
        revenueGrowth: z
          .number()
          .min(0)
          .meta({ description: "Revenue growth value (placeholder)" }),
      }),
    )
    .min(6)
    .max(6)
    .default([
      {
        month: "Jan",
        revenuePerCustomer: 8,
        monthlyRevenue: 12,
        revenueGrowth: 15,
      },
      {
        month: "Feb",
        revenuePerCustomer: 15,
        monthlyRevenue: 18,
        revenueGrowth: 20,
      },
      {
        month: "Mar",
        revenuePerCustomer: 20,
        monthlyRevenue: 22,
        revenueGrowth: 25,
      },
      {
        month: "Apr",
        revenuePerCustomer: 25,
        monthlyRevenue: 28,
        revenueGrowth: 30,
      },
      {
        month: "May",
        revenuePerCustomer: 30,
        monthlyRevenue: 32,
        revenueGrowth: 35,
      },
      {
        month: "Jun",
        revenuePerCustomer: 35,
        monthlyRevenue: 38,
        revenueGrowth: 40,
      },
    ])
    .meta({ description: "Revenue data for the bar chart (placeholder)" }),

  // Pie Chart Data
  pieChartData: z
    .array(
      z.object({
        label: z
          .string()
          .min(1)
          .max(30)
          .meta({ description: "Label for pie chart segment (placeholder)" }),
        value: z
          .number()
          .min(0)
          .max(100)
          .meta({ description: "Value for pie chart segment (placeholder)" }),
        color: z
          .string()
          .min(1)
          .max(20)
          .meta({ description: "Color for pie chart segment (placeholder)" }),
      }),
    )
    .min(3)
    .max(3)
    .default([
      { label: "Revenue per Customer", value: 37.3, color: "#8B5CF6" },
      { label: "Monthly Revenue", value: 44.8, color: "#EC4899" },
      { label: "Revenue Growth", value: 17.9, color: "#F472B6" },
    ])
    .meta({
      description: "Pie chart data for revenue distribution (placeholder)",
    }),

  // Net Promoter Score
  npsTitle: z
    .string()
    .min(1)
    .max(30)
    .default("Net Promoter Score")
    .meta({ description: "Title for NPS section (placeholder)" }),
  npsScore: z
    .number()
    .min(0)
    .max(100)
    .default(70)
    .meta({ description: "NPS score value (placeholder)" }),
  npsTotal: z
    .number()
    .min(0)
    .max(100)
    .default(100)
    .meta({ description: "NPS total value (placeholder)" }),
  npsSubtitle: z
    .string()
    .min(1)
    .max(20)
    .default("Last 6 Month")
    .meta({ description: "Subtitle for NPS section (placeholder)" }),

  // Gauge Charts
  revenuePerCustomerGauge: z.number().min(0).max(100).default(75).meta({
    description: "Gauge value for revenue per customer (placeholder)",
  }),
  monthlyRevenueGauge: z
    .number()
    .min(0)
    .max(100)
    .default(85)
    .meta({ description: "Gauge value for monthly revenue (placeholder)" }),
  revenueGrowthGauge: z
    .number()
    .min(0)
    .max(100)
    .default(70)
    .meta({ description: "Gauge value for revenue growth (placeholder)" }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Helper to calculate the max Y value for the bar chart, rounded up to a nice value
function getBarChartMaxY(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) return 100;
  let max = 0;
  data.forEach((row) => {
    max = Math.max(
      max,
      row.revenuePerCustomer ?? 0,
      row.monthlyRevenue ?? 0,
      row.revenueGrowth ?? 0,
    );
  });
  // Round up to the next "nice" value (nearest 10, 20, 50, 100, etc.)
  if (max <= 10) return 10;
  if (max <= 20) return 20;
  if (max <= 50) return 50;
  if (max <= 100) return 100;
  if (max <= 200) return 200;
  if (max <= 500) return 500;
  if (max <= 1000) return 1000;
  // Otherwise, round up to next 1000
  return Math.ceil(max / 1000) * 1000;
}

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Merge defaults with provided data to ensure all fields are present
  const parsed = { ...Schema.parse({}), ...data };

  // Prepare pie chart data for Recharts
  const pieData =
    parsed.pieChartData?.map((item) => ({
      name: item.label,
      value: item.value,
      color: item.color,
    })) || [];

  // Custom label renderer for pie chart
  const renderCustomLabel = ({
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
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Check if revenueData is available and non-empty
  const hasRevenueData =
    Array.isArray(parsed.revenueData) && parsed.revenueData.length > 0;

  // Check if pieData is available and non-empty
  const hasPieData = Array.isArray(pieData) && pieData.length > 0;

  // Calculate dynamic max Y value for the bar chart
  const barChartMaxY = hasRevenueData
    ? getBarChartMaxY(parsed.revenueData as any[])
    : 100;

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-purple-50 to-blue-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-4 right-4 text-purple-300">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-purple-300 rounded-full opacity-50"
            ></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full border-4 border-purple-300 rounded-full"></div>
        <div className="absolute top-4 left-4 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
      </div>

      {/* Main Title */}
      <h1 className="text-6xl font-bold text-gray-800 mb-8">{parsed.title}</h1>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-200px)]">
        {/* Employee Productivity */}
        <div
          className="bg-white rounded-xl p-6 shadow-lg flex flex-col"
          style={{ minHeight: 380, maxHeight: 380 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {parsed.employeeProductivityTitle}
          </h2>
          <div className="space-y-6 flex-1">
            {[
              {
                name: parsed.division1Name,
                percentage: parsed.division1Percentage,
              },
              {
                name: parsed.division2Name,
                percentage: parsed.division2Percentage,
              },
              {
                name: parsed.division3Name,
                percentage: parsed.division3Percentage,
              },
              {
                name: parsed.division4Name,
                percentage: parsed.division4Percentage,
              },
            ].map((division, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {division.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                      style={{ width: `${division.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-8">
                    {division.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div
          className="bg-white rounded-xl p-6 shadow-lg flex flex-col"
          style={{ minHeight: 380, maxHeight: 380 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {parsed.revenueGrowthTitle}
          </h2>

          {hasRevenueData && (
            <div style={{ width: 340, height: 260, margin: "0 auto" }}>
              <BarChart
                width={340}
                height={260}
                data={parsed.revenueData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickFormatter={(value) => `$${value}M`}
                  domain={[0, barChartMaxY]}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [`$${value}M`, name]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="revenuePerCustomer"
                  name="Revenue per Customer"
                  fill="#93C5FD"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="monthlyRevenue"
                  name="Monthly Revenue"
                  fill="#C084FC"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="revenueGrowth"
                  name="Revenue Growth"
                  fill="#F9A8D4"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </div>
          )}
        </div>

        {/* Revenue Growth Pie Chart */}
        <div
          className="bg-white rounded-xl p-6 shadow-lg flex flex-col"
          style={{ minHeight: 380, maxHeight: 380 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Distribution
          </h2>

          {hasPieData && (
            <div className="flex-1 flex flex-col">
              <div style={{ width: 220, height: 220, margin: "0 auto" }}>
                <PieChart width={220} height={220}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </div>

              <div className="space-y-2 mt-4">
                {pieData.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <span className="text-gray-700 text-xs">
                        {segment.name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800 text-xs">
                      {segment.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {/* Net Promoter Score */}
        <div
          className="bg-white rounded-xl p-4 shadow-lg"
          style={{ minHeight: 120, maxHeight: 120 }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            {parsed.npsTitle}
          </h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {parsed.npsScore}/{parsed.npsTotal}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {parsed.npsSubtitle}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((parsed.npsScore || 0) / (parsed.npsTotal || 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Gauge Charts */}
        {[
          {
            title: "Revenue per Customer",
            value: parsed.revenuePerCustomerGauge,
            color: "#3B82F6",
          },
          {
            title: "Monthly Revenue",
            value: parsed.monthlyRevenueGauge,
            color: "#8B5CF6",
          },
          {
            title: "Revenue Growth",
            value: parsed.revenueGrowthGauge,
            color: "#EC4899",
          },
        ].map((gauge, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-lg"
            style={{ minHeight: 120, maxHeight: 120 }}
          >
            <h3 className="text-xs font-semibold text-gray-800 mb-3 text-center">
              {gauge.title}
            </h3>
            <div className="relative w-20 h-10 mx-auto mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <defs>
                  <linearGradient
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#E5E7EB" />
                    <stop offset="100%" stopColor="#E5E7EB" />
                  </linearGradient>
                  <linearGradient
                    id={`gradient-fill-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={gauge.color} />
                    <stop offset="100%" stopColor={gauge.color} />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 45 A 40 40 0 0 1 90 45"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 45 A 40 40 0 0 1 90 45"
                  fill="none"
                  stroke={gauge.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${((gauge.value || 0) / 100) * 125.6} 125.6`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800 pt-4">
                  {gauge.value}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideComponent;
