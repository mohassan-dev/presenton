import * as z from "zod";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Layout metadata
export const layoutId = "operational-indicators-template";
export const layoutName = "Operational Indicators Template";
export const layoutDescription =
  "A flexible template slide for operational KPIs, featuring delivery rate cards, inventory turnover, and weekly performance trends. All content is placeholder and customizable.";

// Schema definition with meta descriptions and placeholder content
export const Schema = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    .default("Operational Indicators")
    .meta({ description: "Main title for the operational indicators slide." }),

  // On-Time Delivery Rate Cards
  lastMonthDelivery: z
    .object({
      title: z
        .string()
        .min(1)
        .max(30)
        .default("Last Month")
        .meta({ description: "Label for the previous month card." }),
      percentage: z.number().min(0).max(100).default(92).meta({
        description: "Placeholder percentage for last month's delivery rate.",
      }),
      subtitle: z
        .string()
        .min(1)
        .max(30)
        .default("On-Time Delivery Rate")
        .meta({ description: "Subtitle for the last month delivery card." }),
    })
    .default({
      title: "Last Month",
      percentage: 92,
      subtitle: "On-Time Delivery Rate",
    })
    .meta({
      description: "Card data for last month's delivery rate (placeholder).",
    }),

  thisMonthDelivery: z
    .object({
      title: z
        .string()
        .min(1)
        .max(30)
        .default("This Month")
        .meta({ description: "Label for the current month card." }),
      percentage: z.number().min(0).max(100).default(95).meta({
        description: "Placeholder percentage for this month's delivery rate.",
      }),
      subtitle: z
        .string()
        .min(1)
        .max(30)
        .default("On-Time Delivery Rate")
        .meta({ description: "Subtitle for the this month delivery card." }),
    })
    .default({
      title: "This Month",
      percentage: 95,
      subtitle: "On-Time Delivery Rate",
    })
    .meta({
      description: "Card data for this month's delivery rate (placeholder).",
    }),

  // Inventory Turnover
  inventoryTitle: z
    .string()
    .min(1)
    .max(30)
    .default("Inventory Turnover")
    .meta({ description: "Title for the inventory turnover bar chart." }),
  inventoryData: z
    .array(
      z.object({
        category: z
          .string()
          .min(1)
          .max(20)
          .meta({ description: "Category name (placeholder)." }),
        value: z
          .number()
          .min(0)
          .max(25)
          .meta({ description: "Placeholder value for inventory turnover." }),
      }),
    )
    .min(5)
    .max(5)
    .default([
      { category: "Category A", value: 12 },
      { category: "Category B", value: 20 },
      { category: "Category C", value: 16 },
      { category: "Category D", value: 18 },
      { category: "Category E", value: 8 },
    ])
    .meta({
      description: "Placeholder data for inventory turnover bar chart.",
    }),

  // Category Distribution Pie Chart
  categoryDistribution: z
    .array(
      z.object({
        category: z
          .string()
          .min(1)
          .max(20)
          .meta({ description: "Category name for pie chart (placeholder)." }),
        percentage: z.number().min(0).max(100).meta({
          description: "Placeholder percentage for pie chart segment.",
        }),
        color: z
          .string()
          .min(1)
          .max(20)
          .meta({ description: "Color for pie chart segment (placeholder)." }),
      }),
    )
    .min(5)
    .max(5)
    .default([
      { category: "Category A", percentage: 28.6, color: "#8B5CF6" },
      { category: "Category B", percentage: 25.7, color: "#3B82F6" },
      { category: "Category C", percentage: 21.4, color: "#EC4899" },
      { category: "Category D", percentage: 14.3, color: "#F97316" },
      { category: "Category E", percentage: 10.0, color: "#EF4444" },
    ])
    .meta({
      description: "Placeholder data for category distribution pie chart.",
    }),

  // Weekly Performance Trend
  weeklyPerformance: z
    .array(
      z.object({
        week: z.string().meta({ description: "Week label (placeholder)." }),
        delivery: z
          .number()
          .min(0)
          .max(100)
          .meta({ description: "Placeholder delivery value for the week." }),
        satisfaction: z.number().min(0).max(100).meta({
          description: "Placeholder satisfaction value for the week.",
        }),
        efficiency: z
          .number()
          .min(0)
          .max(100)
          .meta({ description: "Placeholder efficiency value for the week." }),
      }),
    )
    .default([
      { week: "W1", delivery: 88, satisfaction: 92, efficiency: 85 },
      { week: "W2", delivery: 91, satisfaction: 89, efficiency: 88 },
      { week: "W3", delivery: 85, satisfaction: 94, efficiency: 90 },
      { week: "W4", delivery: 95, satisfaction: 96, efficiency: 92 },
    ])
    .meta({
      description: "Placeholder weekly performance data for area/line chart.",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Prepare pie chart data for Recharts

  const defaultData = Schema.parse({});

  // Determine if inventoryData is available and non-empty
  const inventoryDataToShow =
    Array.isArray(data.inventoryData) && data.inventoryData.length > 0
      ? data.inventoryData
      : Array.isArray(defaultData.inventoryData) &&
          defaultData.inventoryData.length > 0
        ? defaultData.inventoryData
        : null;

  // Determine if weeklyPerformance is available and non-empty
  const weeklyPerformanceToShow =
    Array.isArray(data.weeklyPerformance) && data.weeklyPerformance.length > 0
      ? data.weeklyPerformance
      : Array.isArray(defaultData.weeklyPerformance) &&
          defaultData.weeklyPerformance.length > 0
        ? defaultData.weeklyPerformance
        : null;

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 relative overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-5 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-12 bg-blue-500 rounded-full"
            style={{
              left: `${i * 10}px`,
              top: `${Math.sin(i * 0.7) * 25 + 50}px`,
              transform: `rotate(${i * 20}deg)`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-purple-400 rounded-full"
            style={{
              width: `${120 - i * 15}px`,
              height: `${120 - i * 15}px`,
              bottom: `${i * 10}px`,
              right: `${i * 10}px`,
            }}
          />
        ))}
      </div>

      {/* Main Title */}
      <div className="flex justify-start mb-10 mt-2">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
          {data.title || defaultData.title}
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-10 h-full">
        {/* Delivery Rate Cards */}
        <div className="col-span-2 flex flex-col gap-8 justify-center">
          {/* This Month Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col items-center h-full min-h-[180px]">
            <div className="text-sm font-medium text-gray-500 mb-2 text-center">
              {data.thisMonthDelivery?.title ||
                defaultData.thisMonthDelivery.title}
            </div>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {data.thisMonthDelivery?.percentage ||
                  defaultData.thisMonthDelivery.percentage}
                %
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-3 text-center">
              {data.thisMonthDelivery?.subtitle ||
                defaultData.thisMonthDelivery.subtitle}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${data.thisMonthDelivery?.percentage || defaultData.thisMonthDelivery.percentage}%`,
                }}
              />
            </div>
          </div>

          {/* Last Month Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col items-center h-full min-h-[180px]">
            <div className="text-sm font-medium text-gray-500 mb-2 text-center">
              {data.lastMonthDelivery?.title ||
                defaultData.lastMonthDelivery.title}
            </div>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="p-2 bg-pink-100 rounded-full">
                <svg
                  className="w-5 h-5 text-pink-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {data.lastMonthDelivery?.percentage ||
                  defaultData.lastMonthDelivery.percentage}
                %
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-3 text-center">
              {data.lastMonthDelivery?.subtitle ||
                defaultData.lastMonthDelivery.subtitle}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${data.lastMonthDelivery?.percentage || defaultData.lastMonthDelivery.percentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Inventory Turnover Bar Chart - Enhanced */}
        {inventoryDataToShow && inventoryDataToShow.length > 0 && (
          <div className="col-span-4 flex flex-col justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col h-full min-h-[320px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {data.inventoryTitle || defaultData.inventoryTitle}
                </h3>
                <div className="px-3 py-1 bg-blue-50 rounded-full">
                  <span className="text-xs font-semibold text-blue-600">
                    Times/Year
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-[220px] flex items-center">
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={inventoryDataToShow}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 10,
                      bottom: 10,
                    }}
                    barCategoryGap="25%"
                  >
                    <XAxis
                      dataKey="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      width={40}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        `${value} times/year`,
                        "Turnover Rate",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "white",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      fill="url(#barGradient)"
                      barSize={32}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Category Distribution Pie Chart */}

        {/* Weekly Performance Trend - New Chart */}
        {weeklyPerformanceToShow && weeklyPerformanceToShow.length > 0 && (
          <div className="col-span-6 flex flex-col justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col h-full min-h-[320px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Weekly Performance
                </h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Delivery</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Satisfaction</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-gray-600">Efficiency</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-[220px] flex items-center">
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart
                    data={weeklyPerformanceToShow}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      domain={[75, 100]}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "white",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: any, name: string) => [
                        `${value}%`,
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="delivery"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="url(#deliveryGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="satisfaction"
                      stackId="2"
                      stroke="#10B981"
                      fill="url(#satisfactionGradient)"
                      strokeWidth={2}
                    />
                    {/* Show efficiency as an Area so it is visually displayed */}
                    <Area
                      type="monotone"
                      dataKey="efficiency"
                      stackId="3"
                      stroke="#F97316"
                      fill="url(#efficiencyGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient
                        id="deliveryGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="satisfactionGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#10B981"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="efficiencyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#F97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#F97316"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideComponent;
