import React from "react";
import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Layout metadata
export const layoutId = "generic-key-metrics-slide";
export const layoutName = "Generic Key Metrics Slide";
export const layoutDescription =
  "A flexible slide for presenting four key metrics and two charts (line and donut/pie), suitable for any domain. Customize metric cards, chart titles, and chart data for your use case.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less")
    .default("Key Metrics Overview")
    .describe("Main title for the slide"),

  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .default(
      "A comprehensive dashboard showcasing key performance indicators and trend analysis across multiple dimensions.",
    )
    .describe("Description text displayed above the metrics and charts."),

  metricCards: z
    .array(
      z.object({
        label: z
          .string()
          .min(1, "Metric label is required")
          .max(20, "Label too long"),
        value: z.string().min(1, "Value is required").max(16, "Value too long"),
        change: z
          .string()
          .min(1, "Change is required")
          .max(10, "Change too long"),
        changeType: z.enum(["increase", "decrease"]).default("increase"),
        description: z
          .string()
          .min(1, "Description is required")
          .max(30, "Description too long"),
      }),
    )
    .min(4, "At least 4 metrics required")
    .max(4, "Maximum 4 metrics")
    .default([
      {
        label: "Revenue",
        value: "$2.4M",
        change: "+12%",
        changeType: "increase",
        description: "vs last quarter",
      },
      {
        label: "Users",
        value: "48.2K",
        change: "-8%",
        changeType: "decrease",
        description: "vs last month",
      },
      {
        label: "Conversion",
        value: "3.7%",
        change: "+24%",
        changeType: "increase",
        description: "vs last period",
      },
      {
        label: "Retention",
        value: "92%",
        change: "-3%",
        changeType: "decrease",
        description: "vs last quarter",
      },
    ])
    .describe("Array of four key metric cards to display at the top."),

  leftChartTitle: z
    .string()
    .min(1, "Left chart title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Growth Trends")
    .describe("Title for the left (line) chart"),

  leftChartData: z
    .array(
      z.object({
        label: z.string().min(1).max(10),
        value: z.number().min(0).max(150),
      }),
    )
    .min(4, "At least 4 data points required")
    .max(6, "Maximum 6 data points")
    .default([
      { label: "Jan", value: 65 },
      { label: "Feb", value: 78 },
      { label: "Mar", value: 90 },
      { label: "Apr", value: 95 },
      { label: "May", value: 110 },
      { label: "Jun", value: 125 },
    ])
    .describe("Data for the left line chart."),

  rightChartTitle: z
    .string()
    .min(1, "Right chart title is required")
    .max(40, "Title must be 40 characters or less")
    .default("Market Distribution")
    .describe("Title for the right (donut/pie) chart"),

  rightChartData: z
    .array(
      z.object({
        label: z.string().min(1).max(20),
        value: z.number().min(0).max(100),
        color: z.string().default("#ec4899"),
      }),
    )
    .min(2, "At least 2 segments required")
    .max(6, "Maximum 6 segments")
    .default([
      { label: "Enterprise", value: 45, color: "#3b82f6" },
      { label: "SMB", value: 30, color: "#10b981" },
      { label: "Startup", value: 15, color: "#f59e0b" },
      { label: "Other", value: 10, color: "#ef4444" },
    ])
    .describe("Data for the right donut/pie chart."),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Component definition
const SlideComponent = ({ data = {} }: { data?: Partial<SchemaType> }) => {
  // Parse data with schema defaults
  const parsed = { ...Schema.parse({}), ...data };

  const cardColors = [
    "bg-gradient-to-r from-blue-500 to-blue-600",
    "bg-gradient-to-r from-emerald-500 to-emerald-600",
    "bg-gradient-to-r from-purple-500 to-purple-600",
    "bg-gradient-to-r from-orange-500 to-orange-600",
  ];

  const cardAccents = [
    "from-blue-100 to-blue-200",
    "from-emerald-100 to-emerald-200",
    "from-purple-100 to-purple-200",
    "from-orange-100 to-orange-200",
  ];

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Check if left chart data is available and valid
  const hasLeftChartData =
    Array.isArray(parsed.leftChartData) &&
    parsed.leftChartData.length > 0 &&
    parsed.leftChartData.every(
      (d) =>
        typeof d.label === "string" &&
        d.label.length > 0 &&
        typeof d.value === "number",
    );

  // Check if right chart data is available and valid
  const hasRightChartData =
    Array.isArray(parsed.rightChartData) &&
    parsed.rightChartData.length > 0 &&
    parsed.rightChartData.every(
      (d) =>
        typeof d.label === "string" &&
        d.label.length > 0 &&
        typeof d.value === "number",
    );

  return (
    <div className="w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pb-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-6 right-8 w-40 h-12 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full transform rotate-12"></div>
      <div className="absolute bottom-12 left-6 w-28 h-28 border-4 border-blue-200/20 rounded-full"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-indigo-300/40 rounded-full"></div>
      <div className="absolute bottom-32 right-12 w-4 h-4 bg-purple-300/40 rounded-full"></div>

      {/* Main Title */}
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-slate-800 mb-3">
          {parsed.title}
        </h1>
        {parsed.description && (
          <p className="text-slate-600 text-lg max-w-4xl leading-relaxed">
            {parsed.description}
          </p>
        )}
      </div>

      {/* Top Row - Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {parsed.metricCards.map((item, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 relative overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Top accent bar */}
            <div
              className={`absolute top-0 left-0 w-full h-1.5 ${cardColors[index]}`}
            ></div>

            {/* Background gradient */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${cardAccents[index]} opacity-10 rounded-bl-full`}
            ></div>

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                {item.label}
              </h3>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-800">
                  {item.value}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      item.changeType === "increase"
                        ? "text-emerald-700 bg-emerald-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {item.change}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row - Charts */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Left Chart (Line) */}
        {hasLeftChartData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              {parsed.leftChartTitle}
            </h2>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={parsed.leftChartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    activeDot={{
                      r: 7,
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      fill: "#ffffff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Right Chart (Pie) */}
        {hasRightChartData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              {parsed.rightChartTitle}
            </h2>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={parsed.rightChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {parsed.rightChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    wrapperStyle={{
                      paddingLeft: "20px",
                      fontSize: "14px",
                    }}
                    formatter={(value, entry) => (
                      <span style={{ color: "#475569", fontWeight: "500" }}>
                        {value}{" "}
                        {entry &&
                        entry.payload &&
                        typeof entry.payload.value === "number"
                          ? `(${entry.payload.value}%)`
                          : ""}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 right-8 opacity-20">
        <svg
          width="80"
          height="30"
          viewBox="0 0 80 30"
          className="text-indigo-400"
        >
          <path
            d="M0 15 Q20 5 40 15 T80 15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 20 Q20 10 40 20 T80 20"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};

export default SlideComponent;
