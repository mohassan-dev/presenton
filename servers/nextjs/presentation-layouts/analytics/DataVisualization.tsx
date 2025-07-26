import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const layoutId = "generic-dual-chart-slide";
export const layoutName = "Generic Dual Chart Slide";
export const layoutDescription =
  "A comprehensive dashboard showcasing key performance indicators and trend analysis across multiple dimensions.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Generic Data Visualization")
    .meta({ description: "Main title for the slide" }),

  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .default(
      "A generic dashboard for visualizing trends and distributions. Customize the chart titles, keys, and data for your use case. This layout supports a line chart on the left and a stacked bar chart on the right. You can use it to display any two datasets side by side, making it flexible for various data visualization needs. You can also adjust the colors, labels, and data points to fit your specific requirements.",
    )
    .meta({ description: "Description text displayed above the charts." }),

  leftChartTitle: z
    .string()
    .min(1, "Left chart title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Line Chart")
    .meta({ description: "Title for the left (line) chart" }),

  leftChartData: z
    .array(z.record(z.union([z.string(), z.number()])))
    .min(1, "At least one data point required")
    .default([
      { label: "A", value1: 10, value2: 20 },
      { label: "B", value1: 20, value2: 15 },
      { label: "C", value1: 30, value2: 25 },
      { label: "D", value1: 25, value2: 30 },
      { label: "E", value1: 35, value2: 28 },
    ])
    .meta({
      description:
        "Generic data for the line chart. Each object should have a label and one or more value fields.",
    }),

  leftChartKeys: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        color: z.string(),
      }),
    )
    .min(1)
    .default([
      { key: "value1", label: "Metric 1", color: "#ec4899" },
      { key: "value2", label: "Metric 2", color: "#8b5cf6" },
    ])
    .meta({
      description: "Keys and display info for each line in the line chart.",
    }),

  rightChartTitle: z
    .string()
    .min(1, "Right chart title is required")
    .max(30, "Title must be 30 characters or less")
    .default("Stacked Bar Chart")
    .meta({ description: "Title for the right (bar) chart" }),

  rightChartData: z
    .array(z.record(z.union([z.string(), z.number()])))
    .min(1, "At least one data point required")
    .default([
      { label: "A", group1: 10, group2: 20, group3: 15 },
      { label: "B", group1: 15, group2: 18, group3: 12 },
      { label: "C", group1: 20, group2: 15, group3: 18 },
      { label: "D", group1: 18, group2: 22, group3: 10 },
      { label: "E", group1: 25, group2: 20, group3: 15 },
    ])
    .meta({
      description:
        "Generic data for the bar chart. Each object should have a label and one or more group fields.",
    }),

  rightChartKeys: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        color: z.string(),
      }),
    )
    .min(1)
    .default([
      { key: "group1", label: "Group 1", color: "#ec4899" },
      { key: "group2", label: "Group 2", color: "#c084fc" },
      { key: "group3", label: "Group 3", color: "#a5b4fc" },
    ])
    .meta({
      description: "Keys and display info for each bar group in the bar chart.",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Helper to sum values for each key in the bar chart
function getBarTotals(data: any[], keys: { key: string }[]) {
  const totals: Record<string, number> = {};
  keys.forEach(({ key }) => {
    totals[key] = data.reduce(
      (sum, row) => sum + (typeof row[key] === "number" ? row[key] : 0),
      0,
    );
  });
  return totals;
}

// Helper to get total sum for all keys (for percentage calculation)
function getBarGrandTotal(totals: Record<string, number>) {
  return Object.values(totals).reduce((sum, v) => sum + v, 0);
}

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Merge defaults with provided data
  const parsed = { ...Schema.parse({}), ...data };

  // Calculate totals for legend display in bar chart
  const barTotals = getBarTotals(parsed.rightChartData, parsed.rightChartKeys);
  const barGrandTotal = getBarGrandTotal(barTotals);

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 to-purple-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-8 right-8 w-20 h-20 border-4 border-purple-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-purple-100 rounded-lg opacity-40"></div>

      {/* Main Title */}
      <h1 className="text-6xl font-bold text-slate-800 mb-4">{parsed.title}</h1>

      {/* Description text out of the white background */}
      {parsed.description && (
        <div className="mb-8 text-slate-500 text-lg max-w-3xl">
          {parsed.description}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left Column - Generic Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-1/2 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            {parsed.leftChartTitle}
          </h2>

          <div className="h-40 relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={parsed.leftChartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <RechartsTooltip />
                <RechartsLegend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ top: -20, right: 0 }}
                />
                {parsed.leftChartKeys.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.label}
                    stroke={line.color}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4">
            {parsed.leftChartKeys.map((line) => (
              <div key={line.key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: line.color }}
                ></div>
                <span className="text-sm text-slate-600">{line.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Generic Stacked Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-1/2 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            {parsed.rightChartTitle}
          </h2>

          <div className="space-y-4 h-full flex flex-col">
            <div className="w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={parsed.rightChartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <RechartsTooltip />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ top: -20, right: 0 }}
                  />
                  {parsed.rightChartKeys.map((bar, idx) => (
                    <Bar
                      key={bar.key}
                      dataKey={bar.key}
                      name={bar.label}
                      stackId="a"
                      fill={bar.color}
                      radius={idx === 0 ? [8, 8, 0, 0] : 0}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with numbers and percentages */}
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
              {parsed.rightChartKeys.map((bar) => {
                const value = barTotals[bar.key] ?? 0;
                const percent =
                  barGrandTotal > 0
                    ? ((value / barGrandTotal) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div key={bar.key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: bar.color }}
                    ></div>
                    <span className="text-sm text-slate-600">
                      {bar.label}{" "}
                      <span className="text-xs text-slate-500">
                        ({value}
                        {barGrandTotal > 0 ? `, ${percent}%` : ""})
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
