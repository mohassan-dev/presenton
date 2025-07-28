import React from "react";
import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1)
    .max(30)
    .default("Business Metrics")
    .meta({ description: "Main dashboard title" }),

  // Key Performance Indicators
  kpis: z
    .array(
      z.object({
        title: z.string().min(1).max(20).meta({ description: "KPI title" }),
        value: z.string().min(1).max(10).meta({ description: "KPI value" }),
        change: z.number().meta({ description: "Percentage change" }),
        trend: z
          .enum(["up", "down", "neutral"])
          .meta({ description: "Trend direction" }),
      }),
    )
    .length(4)
    .default([
      { title: "Revenue", value: "$2.4M", change: 12.5, trend: "up" },
      { title: "Customers", value: "1,847", change: 8.2, trend: "up" },
      { title: "Conversion", value: "3.2%", change: -2.1, trend: "down" },
      { title: "Churn Rate", value: "2.8%", change: -0.5, trend: "up" },
    ])
    .meta({ description: "Key performance indicators" }),

  // Revenue trend data
  revenueData: z
    .array(
      z.object({
        month: z.string().min(1).max(10).meta({ description: "Month label" }),
        revenue: z.number().min(0).meta({ description: "Revenue value" }),
        target: z.number().min(0).meta({ description: "Target value" }),
      }),
    )
    .length(6)
    .default([
      { month: "Jan", revenue: 180, target: 200 },
      { month: "Feb", revenue: 205, target: 210 },
      { month: "Mar", revenue: 190, target: 220 },
      { month: "Apr", revenue: 240, target: 230 },
      { month: "May", revenue: 220, target: 240 },
      { month: "Jun", revenue: 260, target: 250 },
    ])
    .meta({ description: "Revenue trend data over time" }),

  // Customer acquisition data
  acquisitionData: z
    .array(
      z.object({
        week: z.string().min(1).max(10).meta({ description: "Week label" }),
        organic: z
          .number()
          .min(0)
          .meta({ description: "Organic acquisitions" }),
        paid: z.number().min(0).meta({ description: "Paid acquisitions" }),
      }),
    )
    .length(8)
    .default([
      { week: "W1", organic: 45, paid: 32 },
      { week: "W2", organic: 52, paid: 28 },
      { week: "W3", organic: 48, paid: 35 },
      { week: "W4", organic: 61, paid: 42 },
      { week: "W5", organic: 55, paid: 38 },
      { week: "W6", organic: 68, paid: 45 },
      { week: "W7", organic: 72, paid: 40 },
      { week: "W8", organic: 78, paid: 47 },
    ])
    .meta({ description: "Customer acquisition breakdown" }),

  // Top metrics
  topMetrics: z
    .array(
      z.object({
        metric: z.string().min(1).max(25).meta({ description: "Metric name" }),
        value: z
          .number()
          .min(0)
          .max(100)
          .meta({ description: "Metric value (percentage)" }),
      }),
    )
    .max(5)
    .length(5)
    .default([
      { metric: "Customer Satisfaction", value: 94 },
      { metric: "Product Quality", value: 87 },
      { metric: "Delivery Speed", value: 91 },
      { metric: "Support Response", value: 83 },
      { metric: "Overall Performance", value: 89 },
    ])
    .meta({ description: "Top performance metrics" }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const parsed = { ...Schema.parse({}), ...data };

  const TrendIcon = ({ trend, change }: { trend: string; change: number }) => {
    if (trend === "up") {
      return (
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">+{Math.abs(change)}%</span>
        </div>
      );
    } else if (trend === "down") {
      return (
        <div className="flex items-center text-red-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">{change}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <div className="w-4 h-0.5 bg-gray-400 mr-1"></div>
        <span className="text-sm font-medium">{change}%</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1280px] aspect-video bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {parsed.title}
        </h1>
        <p className="text-gray-600">Real-time business performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {parsed.kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
              <TrendIcon trend={kpi.trend} change={kpi.change} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue vs Target
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parsed.revenueData}>
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
                  tickFormatter={(value) => `$${value}K`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `$${value}K`,
                    name === "revenue" ? "Actual" : "Target",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#E5E7EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Acquisition
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={parsed.acquisitionData}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    value,
                    name === "organic" ? "Organic" : "Paid",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="#FEF3C7"
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  stackId="1"
                  stroke="#10B981"
                  fill="#D1FAE5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Score
          </h3>
          <div className="space-y-4">
            {parsed.topMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.metric}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metric.value}%
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mt-1 mb-1"
                  style={{ maxWidth: "90%" }}
                >
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-700 max-w-full"
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
