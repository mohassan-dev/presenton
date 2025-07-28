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
  "A flexible slide template for visualizing financial indicators, supporting bar charts for time-series or categorical data and customizable key metric cards. Both chart and metric cards are optional and can be shown independently based on your data and presentation needs.";

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

  barChartKeys: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        label: z
          .string()
          .min(1, "Label is required")
          .max(30, "Label must be 30 characters or less"),
        color: z.string().min(1, "Color is required"),
      }),
    )
    .default([
      {
        key: "grossProfitMargin",
        label: "Gross Profit Margin",
        color: "#F472B6",
      },
      {
        key: "operatingExpenseRatio",
        label: "Operating Expense Ratio",
        color: "#A78BFA",
      },
      {
        key: "grossProfitMargin2",
        label: "Gross Profit Margin 2",
        color: "#60A5FA",
      },
    ])
    .meta({
      description:
        "Keys and display info for each bar in the bar chart. Each object should have a key (matches a field in financialStatsData), label, and color.",
    })
    .optional(),

  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be 100 characters or less")
    .default(
      "This template allows you to visualize a variety of financial indicators.",
    )
    .meta({
      description:
        "Descriptive text explaining the types of charts and data that can be visualized. Both the bar chart and key metric cards are optional and can be shown independently.",
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
    .optional()
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
  // Only use provided data for rendering; do not use any defaultData
  const mergedData = { ...data };

  // Use barChartKeys from data or schema default
  const barChartKeys =
    mergedData.barChartKeys && Array.isArray(mergedData.barChartKeys)
      ? mergedData.barChartKeys
      : [
          {
            key: "grossProfitMargin",
            label: "Gross Profit Margin",
            color: "#F472B6",
          },
          {
            key: "operatingExpenseRatio",
            label: "Operating Expense Ratio",
            color: "#A78BFA",
          },
          {
            key: "grossProfitMargin2",
            label: "Gross Profit Margin 2",
            color: "#60A5FA",
          },
        ];

  // Only show chart if chart data is provided and valid (no default)
  const hasChartData =
    Array.isArray(mergedData.financialStatsData) &&
    mergedData.financialStatsData.length > 0 &&
    barChartKeys.some((bar) =>
      mergedData.financialStatsData.some(
        (row) => typeof row[bar.key] === "number" && row[bar.key] !== 0,
      ),
    );

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-blue-50 to-purple-50 p-8 font-sans relative overflow-hidden">
      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 h-full">
        {hasChartData ? (
          <>
            {/* Left Side - Financial Statistics Chart with Recharts */}
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

                    {barChartKeys.map((bar) => (
                      <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        fill={bar.color}
                        name={bar.label}
                        radius={[2, 2, 0, 0]}
                        maxBarSize={40}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Dynamic Legend below chart */}
              <div className="flex justify-center gap-6 mt-4">
                {barChartKeys.map((bar) => (
                  <div key={bar.key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: bar.color }}
                    ></div>
                    <span className="text-sm text-slate-600">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Side - Title, Description */}
            <div className="col-span-5 flex flex-col">
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
          </>
        ) : (
          <div className="col-span-12 flex flex-col justify-start">
            <div className="mb-8 text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {mergedData.title}
              </h1>
              <div className="w-16 h-1 bg-gray-800 rounded mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {mergedData.description}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Row - Key Metrics Cards */}
        {mergedData.grossProfitMargin1 && (
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
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-pink-400 h-1.5 rounded-full transition-all duration-700 max-w-full"
                style={{
                  width: `${Math.min(mergedData.grossProfitMargin1.percentage, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {mergedData.operatingExpenseRatio && (
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
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-400 h-1.5 rounded-full transition-all duration-700 max-w-full"
                style={{
                  width: `${Math.min(mergedData.operatingExpenseRatio.percentage, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {mergedData.grossProfitMargin2 && (
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
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-400 h-1.5 rounded-full transition-all duration-700 max-w-full"
                style={{
                  width: `${Math.min(mergedData.grossProfitMargin2.percentage, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideComponent;
