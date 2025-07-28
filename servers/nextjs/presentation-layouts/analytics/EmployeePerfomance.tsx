import React from "react";
import * as z from "zod";
import {
  ResponsiveContainer,
  Sector,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  Label,
} from "recharts";

// Layout metadata
export const layoutId = "multi-gauge-indicators-slide";
export const layoutName = "Multi Gauge Indicators Slide";
export const layoutDescription =
  "A highly flexible slide for visualizing up to three customizable percentage-based metrics using gauge-style charts. Each chart can represent any indicator you choose, such as performance rates, completion percentages, satisfaction scores, or other KPIs. All chart titles, values, and descriptions are fully configurable, allowing you to adapt the slide for a wide range of use cases beyond employee performance. Each chart is optional—display only the metrics you want, and omit any that are not needed.";

// Schema definition
export const Schema = z.object({
  chart1Title: z
    .string()
    .min(1, "Chart 1 title is required")
    .max(30, "Chart 1 title must be 30 characters or less")
    .default("Metric 1")
    .meta({ description: "Title for the first gauge chart" })
    .optional(),

  chart1Value: z
    .number()
    .min(0, "Chart 1 value cannot be negative")
    .max(100, "Chart 1 value cannot exceed 100%")
    .default(50)
    .meta({ description: "Value for the first gauge chart (percentage)" })
    .optional(),

  chart1Description: z
    .string()
    .min(10, "Chart 1 description must be at least 10 characters")
    .max(100, "Chart 1 description must be 100 characters or less")
    .default("Describe the first metric here. Placeholder text.")
    .meta({ description: "Description for the first gauge chart" })
    .optional(),

  chart2Title: z
    .string()
    .min(1, "Chart 2 title is required")
    .max(30, "Chart 2 title must be 30 characters or less")
    .default("Metric 2")
    .meta({ description: "Title for the second gauge chart" })
    .optional(),

  chart2Value: z
    .number()
    .min(0, "Chart 2 value cannot be negative")
    .max(100, "Chart 2 value cannot exceed 100%")
    .default(75)
    .meta({ description: "Value for the second gauge chart (percentage)" })
    .optional(),

  chart2Description: z
    .string()
    .min(10, "Chart 2 description must be at least 10 characters")
    .max(100, "Chart 2 description must be 100 characters or less")
    .default("Describe the second metric here. Placeholder text.")
    .meta({ description: "Description for the second gauge chart" })
    .optional(),

  chart3Title: z
    .string()
    .min(1, "Chart 3 title is required")
    .max(30, "Chart 3 title must be 30 characters or less")
    .default("Metric 3")
    .meta({ description: "Title for the third gauge chart" })
    .optional(),

  chart3Value: z
    .number()
    .min(0, "Chart 3 value cannot be negative")
    .max(100, "Chart 3 value cannot exceed 100%")
    .default(90)
    .meta({ description: "Value for the third gauge chart (percentage)" })
    .optional(),

  chart3Description: z
    .string()
    .min(10, "Chart 3 description must be at least 10 characters")
    .max(100, "Chart 3 description must be 100 characters or less")
    .default("Describe the third metric here. Placeholder text.")
    .meta({ description: "Description for the third gauge chart" })
    .optional(),

  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less")
    .default("Key Metrics Dashboard")
    .meta({ description: "Main title for the dashboard" }),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description must be 300 characters or less")
    .default(
      "This dashboard visualizes up to three customizable metrics using gauge-style charts. Each chart can represent any percentage-based indicator, such as performance rates, completion percentages, satisfaction scores, or other KPIs relevant to your needs. All chart titles, values, and descriptions are fully configurable. Each chart is optional—display only the metrics you want, and omit any that are not needed.",
    )
    .meta({
      description:
        "Description text for the dashboard, explaining the types of charts and data that can be visualized. Explicitly states that each chart is optional.",
    }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// GaugeMeter component using recharts
const GaugeMeter = ({
  value = 80,
  width = 200,
  height = 120,
}: {
  value?: number;
  width?: number;
  height?: number;
}) => {
  const RADIAN = Math.PI / 180;

  // Define gauge slices (colors and value ranges) - THEME COLORS
  const slices = [
    {
      value: 33.34,
      color: "#E0E7EF", // light blue/gray (matches bg-gradient)
    },
    {
      value: 33.33,
      color: "#93C5FD", // blue-300
    },
    {
      value: 33.34,
      color: "#60A5FA", // blue-400
    },
  ];

  const sumValues = slices.reduce((a, b) => a + b.value, 0);

  // Arrow data: [value, 0, rest]
  const chartValue = Math.max(0, Math.min(100, value));
  const arrowData = [
    { value: chartValue },
    { value: 0 },
    { value: sumValues - chartValue },
  ];

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    cx: width / 2,
    cy: height,
    isAnimationActive: false,
  };

  // Arrow shape for pointer
  const Arrow = ({ cx, cy, midAngle, outerRadius }: any) => {
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + width * 0.03) * cos;
    const my = cy + (outerRadius + width * 0.03) * sin;
    return (
      <g>
        <path
          d={`M${cx},${cy}L${mx},${my}`}
          strokeWidth="6"
          stroke="#2563EB" // blue-600 for pointer
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cy}
          r={width * 0.07}
          fill="white"
          stroke="#93C5FD"
        />
      </g>
    );
  };

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={width} height={height}>
          <Pie
            stroke="none"
            data={slices}
            innerRadius={width * 0.32}
            outerRadius={width * 0.45}
            dataKey="value"
            {...pieProps}
          >
            {slices.map((each, i) => (
              <Cell key={`cell-${i}`} fill={each.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
          <Pie
            stroke="none"
            fill="none"
            activeIndex={1}
            activeShape={Arrow}
            data={arrowData}
            innerRadius={width * 0.32}
            outerRadius={width * 0.38}
            dataKey="value"
            {...pieProps}
          >
            <Label
              value={chartValue}
              position="centerBottom"
              offset={-10}
              className="gauge-label"
              fontSize="32px"
              fontWeight="bold"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Only render charts if a value is provided (not null/undefined)
  const charts = [
    {
      title: data.chart1Title ?? "Metric 1",
      value: data.chart1Value,
      description:
        data.chart1Description ??
        "Describe the first metric here. Placeholder text.",
    },
    {
      title: data.chart2Title ?? "Metric 2",
      value: data.chart2Value,
      description:
        data.chart2Description ??
        "Describe the second metric here. Placeholder text.",
    },
    {
      title: data.chart3Title ?? "Metric 3",
      value: data.chart3Value,
      description:
        data.chart3Description ??
        "Describe the third metric here. Placeholder text.",
    },
  ].filter(
    (c, idx) => typeof c.value === "number" && !isNaN(c.value as number),
  );

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 to-blue-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 right-16 w-16 h-16 border-2 border-blue-200 rounded-full opacity-30"></div>

      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-slate-800 leading-tight">
          {data.title ?? "Key Metrics Dashboard"}
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          {data.description ??
            "This dashboard visualizes up to three customizable metrics using gauge-style charts. Each chart can represent any percentage-based indicator, such as performance rates, completion percentages, satisfaction scores, or other KPIs relevant to your needs. All chart titles, values, and descriptions are fully configurable. Each chart is optional—display only the metrics you want, and omit any that are not needed."}
        </p>
      </div>

      {/* Render only the charts that have a value */}
      <div className="flex flex-row justify-center items-stretch gap-8 w-full">
        {charts.map((chart, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col items-center min-w-[260px] max-w-[340px]"
          >
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              {chart.title}
            </h3>
            <div className="relative w-40 h-28 mb-4 flex items-center justify-center">
              <GaugeMeter
                value={chart.value as number}
                width={160}
                height={90}
              />
              <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 bg-white px-2 rounded">
                  {chart.value}%
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 text-center">
              {chart.description}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative pattern elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
