import * as z from "zod";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const layoutId = "customer-satisfaction-slide";
export const layoutName = "Customer Satisfaction Slide";
export const layoutDescription =
  "A flexible slide layout for visualizing a variety of quantitative metrics using a line chart (for trends over time or categories) and/or a pie chart (for proportional or categorical breakdowns). Both charts are optional and can be shown independently, allowing you to display only the line chart, only the pie chart, or both, depending on your data and presentation needs. Chart labels, keys, and values are fully customizable to support a wide range of use cases beyond satisfaction metrics.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less")
    .default("Satisfaction Indicators")
    .meta({
      description:
        "Main title of the slide. MUST be 50 characters or less. Keep it concise and descriptive.",
    }),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(100, "Subtitle must be 100 characters or less")
    .default("Generic satisfaction indicators and metrics.")
    .meta({
      description:
        "Subtitle or description text for the slide. MUST be 100 characters or less. Be concise and informative.",
    }),

  lineChartTitle: z
    .string()
    .max(40, "Title must be 40 characters or less")
    .default("Line Chart")
    .meta({
      description:
        "Title for the line chart section. MUST be 40 characters or less.",
    })
    .optional(),

  lineChartData: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .meta({
      description:
        "Data for the line chart. Each object should have a 'label' field (string) and numeric value fields. Example: [{label: 'Q1', value1: 80, value2: 75}]. Optional - omit if no line chart needed.",
    })
    .optional(),

  lineChartKeys: z
    .array(
      z.object({
        key: z.string().describe("Must match a field name in lineChartData"),
        label: z.string().max(20, "Label must be 20 characters or less"),
        color: z.string().describe("Hex color code like #ec4899"),
      }),
    )
    .default([
      { key: "value1", label: "Metric 1", color: "#ec4899" },
      { key: "value2", label: "Metric 2", color: "#8b5cf6" },
    ])
    .meta({
      description:
        "Keys and display info for each line in the line chart. Labels must be 20 characters or less.",
    })
    .optional(),

  pieChartTitle: z
    .string()
    .max(40, "Title must be 40 characters or less")
    .default("Pie Chart")
    .meta({
      description:
        "Title for the pie chart section. MUST be 40 characters or less.",
    })
    .optional(),

  pieChartData: z
    .array(
      z.object({
        name: z.string().min(1).max(30, "Name must be 30 characters or less"),
        value: z.number().min(0, "Value must be non-negative"),
        color: z.string().min(1).describe("Hex color code like #ec4899"),
      }),
    )
    .meta({
      description:
        "Data for the pie chart. Each segment needs: name (30 chars max), value (0-100), and color (hex). Example: [{name: 'Satisfied', value: 75, color: '#10b981'}]. Optional - omit if no pie chart needed.",
    })
    .optional(),

  pieChartCenterLabel: z
    .string()
    .max(20, "Label must be 20 characters or less")
    .default("Total")
    .meta({
      description:
        "Short label to show in center of pie chart. MUST be 20 characters or less.",
    }),

  pieChartTotalLabel: z
    .string()
    .max(30, "Label must be 30 characters or less")
    .default("Total Value")
    .meta({
      description:
        "Label for the total value in center of pie chart. MUST be 30 characters or less.",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Pie chart data helper (generic)
const getPieTotal = (pieData: { value: number }[]) =>
  pieData.reduce((sum, seg) => sum + seg.value, 0);

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Truncate subtitle at first full stop and enforce 100 character limit
  let processedData = { ...data };
  if (processedData?.subtitle && typeof processedData.subtitle === "string") {
    const firstSentence = processedData.subtitle.split(".")[0] + ".";
    processedData.subtitle =
      firstSentence.length > 100 ? firstSentence.slice(0, 100) : firstSentence;
  }
  const parsed = Schema.parse(processedData ?? {});

  const pieData = parsed.pieChartData || [];
  const pieTotal = getPieTotal(pieData);

  // Calculate total percentage (capped at 100 and rounded)
  const totalPercent = Math.min(Math.round(pieTotal), 100);

  // For each segment, calculate its percentage (rounded, capped at 100)
  const getSegmentPercent = (value: number) =>
    pieTotal > 0 ? Math.min(Math.round((value / pieTotal) * 100), 100) : 0;

  const hasLineChartData =
    Array.isArray(parsed.lineChartData) && parsed.lineChartData.length > 0;
  const hasPieChartData =
    Array.isArray(pieData) &&
    pieData.length > 0 &&
    pieData.some((seg) => typeof seg.value === "number" && seg.value > 0);

  return (
    <div className="px-16 pb-10 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 to-indigo-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-4 right-8 w-16 h-16 grid grid-cols-4 gap-1 opacity-30">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-indigo-400 rounded-full"></div>
        ))}
      </div>

      {/* Main Title */}
      <h1 className="text-6xl font-bold text-slate-800 mb-8">{parsed.title}</h1>
      <p className="text-slate-600 mb-6">{parsed.subtitle}</p>

      <div className="grid grid-cols-2 gap-8 h-[1/2]">
        {/* Left Column - Generic Line Chart */}
        <div className="flex flex-col justify-center h-full">
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center h-full">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              {parsed.lineChartTitle || "Line Chart"}
            </h2>

            {/* Chart Area */}
            {hasLineChartData ? (
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={parsed.lineChartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#334155",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ top: -10, right: 0 }}
                    />
                    {(parsed.lineChartKeys || []).map((line) => (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        name={line.label}
                        stroke={line.color}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-lg">
                No data available for line chart.
              </div>
            )}

            <div className="flex gap-6 mt-4 justify-center">
              {(parsed.lineChartKeys || []).map((line) => (
                <div key={line.key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ background: line.color }}
                  ></div>
                  <span className="text-sm text-slate-600">{line.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <span className="text-slate-500 text-sm">
                Track trends and targets over time.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Generic Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-700 mb-8">
              {parsed.pieChartTitle}
            </h2>

            {hasPieChartData ? (
              <>
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                  <PieChart width={256} height={256}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={16}
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-semibold text-slate-500">
                      {parsed.pieChartCenterLabel}
                    </span>
                    <span className="text-4xl font-extrabold text-slate-800 mt-1">
                      {totalPercent}%
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      {parsed.pieChartTotalLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                  {pieData.map((segment) => (
                    <div key={segment.name} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: segment.color }}
                      ></div>
                      <span className="text-sm text-slate-600">
                        {segment.name} ({getSegmentPercent(segment.value)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-lg mx-auto"></div>
            )}
            <div className="mt-4 text-center">
              <span className="text-slate-500 text-sm"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
