import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as z from "zod";

// Layout metadata
export const layoutId = "financial-indicators-template";
export const layoutName = "Financial Indicators Template";
export const layoutDescription =
  "A generic slide template for visualizing placeholder financial indicators, including a bar chart and key metric cards. All content is placeholder and customizable.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(20, "Title must be 20 characters or less")
    .default("Financial Indicators")
    .meta({
      description:
        "Main dashboard title displayed at the top right (placeholder)",
    }),

  description: z
    .string()
    .min(1, "Description is required")
    .max(250, "Description must be 250 characters or less")
    .default(
      "This is a placeholder description for your financial indicators dashboard. Replace this text with your own summary or insights.",
    )
    .meta({
      description:
        "Descriptive text explaining the financial indicators shown in the dashboard (placeholder)",
    }),

  // Financial Statistics Chart Data
  financialStatsData: z
    .array(
      z
        .object({
          month: z.string().min(1).max(10).default("Mon").meta({
            description: "Month label (placeholder)",
          }),
          grossProfitMargin: z.number().min(0).default(10).meta({
            description: "Gross profit margin value (placeholder)",
          }),
          operatingExpenseRatio: z.number().min(0).default(15).meta({
            description: "Operating expense ratio value (placeholder)",
          }),
          grossProfitMargin2: z.number().min(0).default(20).meta({
            description: "Second gross profit margin value (placeholder)",
          }),
        })
        .meta({
          description: "Monthly financial statistics data point (placeholder)",
        }),
    )
    .min(3)
    .max(12)
    .default([
      {
        month: "Jan",
        grossProfitMargin: 10,
        operatingExpenseRatio: 15,
        grossProfitMargin2: 20,
      },
      {
        month: "Feb",
        grossProfitMargin: 12,
        operatingExpenseRatio: 18,
        grossProfitMargin2: 22,
      },
      {
        month: "Mar",
        grossProfitMargin: 15,
        operatingExpenseRatio: 20,
        grossProfitMargin2: 25,
      },
      {
        month: "Apr",
        grossProfitMargin: 18,
        operatingExpenseRatio: 22,
        grossProfitMargin2: 28,
      },
      {
        month: "May",
        grossProfitMargin: 20,
        operatingExpenseRatio: 25,
        grossProfitMargin2: 30,
      },
      {
        month: "Jun",
        grossProfitMargin: 22,
        operatingExpenseRatio: 28,
        grossProfitMargin2: 32,
      },
    ])
    .meta({
      description:
        "Financial statistics chart data showing monthly trends for gross profit margin, operating expense ratio, and gross profit margin metrics (placeholder)",
    }),

  // Key Financial Metrics
  grossProfitMargin1: z
    .object({
      title: z.string().min(1).max(30).default("Gross Profit Margin").meta({
        description: "Metric title (placeholder)",
      }),
      value: z.string().min(1).max(20).default("$99M").meta({
        description: "Metric value (placeholder)",
      }),
      percentage: z.number().min(0).max(100).default(45).meta({
        description: "Metric percentage (placeholder)",
      }),
      label: z.string().min(1).max(30).default("from last period").meta({
        description: "Metric label (placeholder)",
      }),
    })
    .default({
      title: "Gross Profit Margin",
      value: "$99M",
      percentage: 45,
      label: "from last period",
    })
    .meta({
      description:
        "First gross profit margin metric with title, value, growth percentage, and period label (placeholder)",
    }),

  operatingExpenseRatio: z
    .object({
      title: z.string().min(1).max(30).default("Operating Expense Ratio").meta({
        description: "Metric title (placeholder)",
      }),
      value: z.string().min(1).max(20).default("$104M").meta({
        description: "Metric value (placeholder)",
      }),
      percentage: z.number().min(0).max(100).default(20).meta({
        description: "Metric percentage (placeholder)",
      }),
      label: z.string().min(1).max(30).default("from last period").meta({
        description: "Metric label (placeholder)",
      }),
    })
    .default({
      title: "Operating Expense Ratio",
      value: "$104M",
      percentage: 20,
      label: "from last period",
    })
    .meta({
      description:
        "Operating expense ratio metric with title, value, growth percentage, and period label (placeholder)",
    }),

  grossProfitMargin2: z
    .object({
      title: z.string().min(1).max(30).default("Gross Profit Margin").meta({
        description: "Metric title (placeholder)",
      }),
      value: z.string().min(1).max(20).default("$130M").meta({
        description: "Metric value (placeholder)",
      }),
      percentage: z.number().min(0).max(100).default(15).meta({
        description: "Metric percentage (placeholder)",
      }),
      label: z.string().min(1).max(30).default("from last period").meta({
        description: "Metric label (placeholder)",
      }),
    })
    .default({
      title: "Gross Profit Margin",
      value: "$130M",
      percentage: 15,
      label: "from last period",
    })
    .meta({
      description:
        "Second gross profit margin metric with title, value, growth percentage, and period label (placeholder)",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: $${entry.value}M`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Default data (all placeholder)
  const defaultData = {
    title: "Financial Indicators",
    description:
      "This is a placeholder description for your financial indicators dashboard. Replace this text with your own summary or insights.",
    financialStatsData: [
      {
        month: "Jan",
        grossProfitMargin: 10,
        operatingExpenseRatio: 15,
        grossProfitMargin2: 20,
      },
      {
        month: "Feb",
        grossProfitMargin: 12,
        operatingExpenseRatio: 18,
        grossProfitMargin2: 22,
      },
      {
        month: "Mar",
        grossProfitMargin: 15,
        operatingExpenseRatio: 20,
        grossProfitMargin2: 25,
      },
      {
        month: "Apr",
        grossProfitMargin: 18,
        operatingExpenseRatio: 22,
        grossProfitMargin2: 28,
      },
      {
        month: "May",
        grossProfitMargin: 20,
        operatingExpenseRatio: 25,
        grossProfitMargin2: 30,
      },
      {
        month: "Jun",
        grossProfitMargin: 22,
        operatingExpenseRatio: 28,
        grossProfitMargin2: 32,
      },
    ],
    grossProfitMargin1: {
      title: "Gross Profit Margin",
      value: "$99M",
      percentage: 45,
      label: "from last period",
    },
    operatingExpenseRatio: {
      title: "Operating Expense Ratio",
      value: "$104M",
      percentage: 20,
      label: "from last period",
    },
    grossProfitMargin2: {
      title: "Gross Profit Margin",
      value: "$130M",
      percentage: 15,
      label: "from last period",
    },
  };

  const mergedData = { ...defaultData, ...data };

  // Check if chart data is available and valid (array with at least 1 item)
  const hasChartData =
    Array.isArray(mergedData.financialStatsData) &&
    mergedData.financialStatsData.length > 0;

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-blue-50 to-purple-50 p-8 font-sans relative overflow-hidden">
      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Side - Financial Statistics Chart with Recharts */}
        {hasChartData && (
          <div
            className="col-span-7 bg-white rounded-xl shadow-lg p-6 flex flex-col"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {mergedData.title}
              </h3>
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mergedData.financialStatsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="grossProfitMargin"
                    fill="#F472B6"
                    name="Gross Profit Margin"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="operatingExpenseRatio"
                    fill="#A78BFA"
                    name="Operating Expense Ratio"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="grossProfitMargin2"
                    fill="#60A5FA"
                    name="Gross Profit Margin 2"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Right Side - Title, Description and Metrics Button */}
        <div className="col-span-5 flex flex-col">
          {/* Title and Description */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {mergedData.title}
            </h1>
            <div className="w-16 h-1 bg-gray-800 rounded mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              {mergedData.description}
            </p>
          </div>
        </div>

        {/* Bottom Row - Key Metrics Cards */}
        <div className="col-span-4 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-center">
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            {mergedData.grossProfitMargin1.title}
          </h4>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              {mergedData.grossProfitMargin1.value}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 rounded text-green-600 text-xs font-medium">
              <span>↑</span>
              <span>{mergedData.grossProfitMargin1.percentage}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {mergedData.grossProfitMargin1.label}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-pink-400 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${mergedData.grossProfitMargin1.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-center">
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            {mergedData.operatingExpenseRatio.title}
          </h4>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              {mergedData.operatingExpenseRatio.value}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 rounded text-green-600 text-xs font-medium">
              <span>↑</span>
              <span>{mergedData.operatingExpenseRatio.percentage}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {mergedData.operatingExpenseRatio.label}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-purple-400 h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${mergedData.operatingExpenseRatio.percentage}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-center">
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            {mergedData.grossProfitMargin2.title}
          </h4>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              {mergedData.grossProfitMargin2.value}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 rounded text-green-600 text-xs font-medium">
              <span>↑</span>
              <span>{mergedData.grossProfitMargin2.percentage}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {mergedData.grossProfitMargin2.label}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-400 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${mergedData.grossProfitMargin2.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
