import * as z from "zod";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// Layout metadata
export const layoutId = "goals-targets-slide";
export const layoutName = "Goals & Targets Slide";
export const layoutDescription =
  "A flexible template slide for visualizing goals, targets, and progress. All content is placeholder and customizable.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Goals & Targets")
    .meta({
      description: "Main title for the goals and targets slide (placeholder)",
    }),
  chartTitle: z
    .string()
    .min(1, "Chart title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Goals Progress Overview")
    .meta({
      description: "Title for the pie chart section (placeholder)",
    }),

  currentRevenue: z
    .string()
    .min(1, "Current revenue is required")
    .max(15, "Revenue value too long")
    .default("$123M")
    .meta({ description: "Current revenue value (placeholder)" }),

  targetRevenue: z
    .string()
    .min(1, "Target revenue is required")
    .max(15, "Revenue value too long")
    .default("$150M")
    .meta({ description: "Target revenue value (placeholder)" }),

  remainingRevenue: z
    .string()
    .min(1, "Remaining revenue is required")
    .max(15, "Revenue value too long")
    .default("$27M")
    .meta({ description: "Remaining revenue to target (placeholder)" }),

  changePercentage: z
    .string()
    .min(1, "Change percentage is required")
    .max(10, "Percentage too long")
    .default("↑ 4%")
    .meta({ description: "Percentage change from last period (placeholder)" }),

  periodDescription: z
    .string()
    .min(1, "Period description is required")
    .max(30, "Description too long")
    .default("since last quarter")
    .meta({ description: "Description of the time period (placeholder)" }),

  employeeEngagementTarget: z
    .number()
    .min(0, "Engagement target cannot be negative")
    .max(100, "Engagement target cannot exceed 100%")
    .default(80)
    .meta({
      description: "Employee engagement target percentage (placeholder)",
    }),

  currentRevenueGauge: z
    .number()
    .min(0, "Current revenue gauge cannot be negative")
    .max(100, "Current revenue gauge cannot exceed 100%")
    .default(65)
    .meta({
      description: "Current revenue progress as percentage (placeholder)",
    }),

  targetGauge: z
    .number()
    .min(0, "Target gauge cannot be negative")
    .max(100, "Target gauge cannot exceed 100%")
    .default(50)
    .meta({ description: "Target progress as percentage (placeholder)" }),

  remainingGauge: z
    .number()
    .min(0, "Remaining gauge cannot be negative")
    .max(100, "Remaining gauge cannot exceed 100%")
    .default(35)
    .meta({ description: "Remaining progress as percentage (placeholder)" }),

  monthlyTargetData: z
    .array(
      z.object({
        month: z
          .string()
          .min(1, "Month is required")
          .max(10, "Month name too long"),
        current: z.number().min(0).max(40),
        target: z.number().min(0).max(40),
        remaining: z.number().min(0).max(40),
      }),
    )
    .min(6, "At least 6 months of data required")
    .max(6, "Maximum 6 months of data")
    .default([
      { month: "Jan", current: 7, target: 10, remaining: 3 },
      { month: "Feb", current: 12, target: 15, remaining: 5 },
      { month: "Mar", current: 18, target: 20, remaining: 8 },
      { month: "Apr", current: 22, target: 25, remaining: 10 },
      { month: "May", current: 28, target: 30, remaining: 12 },
      { month: "Jun", current: 32, target: 35, remaining: 15 },
    ])
    .meta({ description: "Monthly revenue growth target data (placeholder)" }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Pie chart types and data
type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: any;
  };

// Placeholder pie data
const pieData = [
  { name: "Current Revenue", value: 400 },
  { name: "Target Achievement", value: 300 },
  { name: "Employee Engagement", value: 300 },
  { name: "Remaining Goals", value: 200 },
];

const RADIAN = Math.PI / 180;
const COLORS = ["#ec4899", "#c084fc", "#60a5fa", "#34d399"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Defensive: fallback to empty array if undefined
  const monthlyTargetData = data.monthlyTargetData ?? [];
  // For pie chart, you could allow override via data.pieData, but for now use pieData as-is
  // If you want to allow hiding pie chart if pieData is empty, check for that
  const hasMonthlyChart =
    Array.isArray(monthlyTargetData) &&
    monthlyTargetData.length > 0 &&
    monthlyTargetData.every(
      (d) =>
        typeof d.current === "number" &&
        typeof d.target === "number" &&
        typeof d.remaining === "number",
    );
  const hasPieChart =
    Array.isArray(pieData) &&
    pieData.length > 0 &&
    pieData.some((d) => typeof d.value === "number" && d.value > 0);

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 to-pink-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-6 left-6 w-16 h-16 border-2 border-pink-200 rounded-full opacity-30 transform rotate-12"></div>
      <div className="absolute bottom-6 right-6 w-12 h-12 bg-pink-100 rounded-lg opacity-40"></div>

      {/* Main Title */}
      <h1 className="text-6xl font-bold text-slate-800 mb-8">{data.title}</h1>

      <div className="grid grid-cols-3 gap-8 h-full">
        {/* Left Column - Metric Cards and Bar Chart */}
        <div className="col-span-2 space-y-6">
          {/* Top Row - Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-600 mb-2">
                Current Revenue
              </h3>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {data.currentRevenue}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {data.changePercentage}
              </div>
              <div className="text-xs text-slate-500">
                {data.periodDescription}
              </div>
              <div className="w-full bg-pink-100 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.currentRevenueGauge}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-600 mb-2">
                Target
              </h3>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {data.targetRevenue}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {data.changePercentage}
              </div>
              <div className="text-xs text-slate-500">
                {data.periodDescription}
              </div>
              <div className="w-full bg-purple-100 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.targetGauge}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-600 mb-2">
                Remaining
              </h3>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {data.remainingRevenue}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {data.changePercentage}
              </div>
              <div className="text-xs text-slate-500">
                {data.periodDescription}
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.remainingGauge}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Revenue Growth Target Chart */}
          {hasMonthlyChart && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-700 mb-6">
                Revenue Growth Target
              </h2>

              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={30 + i * 30}
                      x2="460"
                      y2={30 + i * 30}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Y-axis labels */}
                  {[40, 30, 20, 10, 0].map((label, i) => (
                    <text
                      key={i}
                      x="30"
                      y={35 + i * 30}
                      className="text-xs fill-slate-400"
                      textAnchor="end"
                    >
                      {label}
                    </text>
                  ))}

                  {/* Bar Chart */}
                  {monthlyTargetData.map((d, i) => {
                    const x = 60 + i * 65;
                    const barWidth = 15;

                    return (
                      <g key={i}>
                        {/* Current Revenue bars */}
                        <rect
                          x={x}
                          y={150 - d.current * 3}
                          width={barWidth}
                          height={d.current * 3}
                          fill="#ec4899"
                          className="transition-all duration-500"
                        />

                        {/* Target bars */}
                        <rect
                          x={x + barWidth + 2}
                          y={150 - d.target * 3}
                          width={barWidth}
                          height={d.target * 3}
                          fill="#c084fc"
                          className="transition-all duration-500"
                        />

                        {/* Remaining bars */}
                        <rect
                          x={x + barWidth * 2 + 4}
                          y={150 - d.remaining * 3}
                          width={barWidth}
                          height={d.remaining * 3}
                          fill="#a5b4fc"
                          className="transition-all duration-500"
                        />

                        {/* Month labels */}
                        <text
                          x={x + barWidth + 8}
                          y="175"
                          className="text-xs fill-slate-400"
                          textAnchor="middle"
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded"></div>
                  <span className="text-sm text-slate-600">
                    Current Revenue
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded"></div>
                  <span className="text-sm text-slate-600">Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-300 rounded"></div>
                  <span className="text-sm text-slate-600">Remaining</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Pie Chart */}
        <div className="space-y-6">
          {hasPieChart && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">
                {data.chartTitle}
              </h2>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart Legend */}
              <div className="space-y-3 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-slate-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
