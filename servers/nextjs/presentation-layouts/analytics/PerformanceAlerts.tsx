import React from "react";
import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Layout metadata
export const layoutId = "performance-alerts-slide";
export const layoutName = "Performance Alerts Slide";
export const layoutDescription =
  "A flexible template slide for visualizing performance alerts, featuring a line chart for churn rates and a donut chart for inventory turnover with gauge indicators.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less")
    .default("Performance Alerts Dashboard")
    .meta({
      description: "Main title for the performance alerts slide",
    }),

  churnRateTitle: z
    .string()
    .min(1, "Churn rate title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Monthly Churn Analysis")
    .meta({
      description: "Title for the churn rate chart section",
    }),

  currentChurnRate: z
    .number()
    .min(0, "Churn rate cannot be negative")
    .max(100, "Churn rate cannot exceed 100%")
    .default(32)
    .meta({ description: "Current churn rate percentage" }),

  targetChurn: z
    .number()
    .min(0, "Target churn cannot be negative")
    .max(100, "Target churn cannot exceed 100%")
    .default(20)
    .meta({ description: "Target churn rate percentage" }),

  inventoryTitle: z
    .string()
    .min(1, "Inventory title is required")
    .max(40, "Title must be 40 characters or less")
    .default("Product Performance Distribution")
    .meta({
      description: "Title for the inventory turnover section",
    }),

  popularProducts: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100%")
    .default(45)
    .meta({ description: "Percentage of popular products" }),

  mediumProducts: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100%")
    .default(35)
    .meta({
      description: "Percentage of medium selling products",
    }),

  slowProducts: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100%")
    .default(20)
    .meta({ description: "Percentage of slow selling products" }),

  churnData: z
    .array(
      z.object({
        month: z
          .string()
          .min(1, "Month is required")
          .max(10, "Month name too long"),
        currentChurn: z.number().min(0).max(100),
        targetChurn: z.number().min(0).max(100),
      }),
    )
    .min(6, "At least 6 months of data required")
    .max(12, "Maximum 12 months of data")
    .default([
      { month: "Jan", currentChurn: 18, targetChurn: 15 },
      { month: "Feb", currentChurn: 22, targetChurn: 18 },
      { month: "Mar", currentChurn: 28, targetChurn: 20 },
      { month: "Apr", currentChurn: 35, targetChurn: 22 },
      { month: "May", currentChurn: 32, targetChurn: 20 },
      { month: "Jun", currentChurn: 29, targetChurn: 18 },
      { month: "Jul", currentChurn: 31, targetChurn: 20 },
      { month: "Aug", currentChurn: 27, targetChurn: 18 },
      { month: "Sep", currentChurn: 25, targetChurn: 16 },
      { month: "Oct", currentChurn: 23, targetChurn: 15 },
    ])
    .meta({
      description: "Monthly churn rate data for the line chart",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Enhanced GaugeChart component
const GaugeChart = ({
  value,
  color,
  bgColor,
  title,
}: {
  value: number;
  color: string;
  bgColor: string;
  title: string;
}) => {
  const radius = 35;
  const circumference = Math.PI * radius; // Half circle
  const percent = Math.max(0, Math.min(100, value));
  const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-12 mb-2">
        <svg className="w-full h-full" viewBox="0 0 80 40">
          {/* Background arc */}
          <path
            d="M 10 35 A 35 35 0 0 1 70 35"
            fill="none"
            stroke={bgColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 35 A 35 35 0 0 1 70 35"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-700 ease-out"
            transform="rotate(0 40 35)"
          />
        </svg>
      </div>
      <span className="text-lg font-bold text-slate-800">{percent}%</span>
      <span className="text-xs font-medium text-slate-600 text-center">
        {title}
      </span>
    </div>
  );
};

// Custom tooltip components
const ChurnTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-700">
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// Component definition
const SlideComponent = ({ data = {} }: { data?: Partial<SchemaType> }) => {
  // Parse data with schema defaults
  const parsedData = Schema.parse(data);

  // Transform inventory data for pie chart
  const inventoryData = [
    {
      name: "High Performers",
      value: parsedData.popularProducts,
      color: "#10b981",
    },
    {
      name: "Average Performers",
      value: parsedData.mediumProducts,
      color: "#f59e0b",
    },
    {
      name: "Underperformers",
      value: parsedData.slowProducts,
      color: "#ef4444",
    },
  ];

  // Determine alert status based on current vs target churn
  const isChurnAlert = parsedData.currentChurnRate > parsedData.targetChurn;
  const churnDifference = Math.abs(
    parsedData.currentChurnRate - parsedData.targetChurn,
  );

  // Check if churnData is available and non-empty
  const hasChurnData =
    Array.isArray(parsedData.churnData) && parsedData.churnData.length > 0;

  // Check if inventoryData has at least one nonzero value
  const hasInventoryData =
    Array.isArray(inventoryData) &&
    inventoryData.some(
      (item) => typeof item.value === "number" && item.value > 0,
    );

  return (
    <div className="w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-8 pb-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-6 right-8 w-32 h-8 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full transform rotate-12"></div>
      <div className="absolute bottom-12 left-6 w-24 h-24 border-3 border-orange-200/20 rounded-full"></div>

      {/* Main Title */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-800 mb-2">
          {parsedData.title}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left Column - Churn Rate Analysis */}
        <div className="space-y-6">
          {/* Main Chart */}
          {hasChurnData && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-700">
                  {parsedData.churnRateTitle}
                </h2>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={parsedData.churnData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<ChurnTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="currentChurn"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "#ef4444",
                        strokeWidth: 2,
                        fill: "#ffffff",
                      }}
                      name="Current Churn"
                    />
                    <Line
                      type="monotone"
                      dataKey="targetChurn"
                      stroke="#10b981"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "#10b981",
                        strokeWidth: 2,
                        fill: "#ffffff",
                      }}
                      name="Target Churn"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="flex gap-6 mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-slate-700 font-medium">
                    Current Rate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded border-2 border-dashed border-green-600"></div>
                  <span className="text-sm text-slate-700 font-medium">
                    Target Rate
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Gauge Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
              <GaugeChart
                value={parsedData.currentChurnRate}
                color={isChurnAlert ? "#ef4444" : "#10b981"}
                bgColor="#f1f5f9"
                title="Current Rate"
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
              <GaugeChart
                value={parsedData.targetChurn}
                color="#10b981"
                bgColor="#f1f5f9"
                title="Target Rate"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Product Performance */}
        <div className="flex flex-col">
          {hasInventoryData && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 h-[500]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-700">
                  {parsedData.inventoryTitle}
                </h2>
              </div>

              <div className="h-80 flex flex-col items-center justify-center">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span
                            style={{
                              color: "#475569",
                              fontWeight: "500",
                              fontSize: "14px",
                            }}
                          >
                            {value} ({entry?.payload?.value}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {parsedData.popularProducts}%
                    </div>
                    <div className="text-xs text-slate-600">High</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">
                      {parsedData.mediumProducts}%
                    </div>
                    <div className="text-xs text-slate-600">Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      {parsedData.slowProducts}%
                    </div>
                    <div className="text-xs text-slate-600">Low</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-4 right-8 opacity-20">
        <svg
          width="100"
          height="30"
          viewBox="0 0 100 30"
          className="text-orange-400"
        >
          <path
            d="M0 15 Q25 5 50 15 T100 15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 20 Q25 10 50 20 T100 20"
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
