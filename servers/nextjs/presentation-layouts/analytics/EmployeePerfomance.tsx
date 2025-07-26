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
export const layoutId = "employee-performance-indicators-slide";
export const layoutName = "Employee Performance Indicators Slide";
export const layoutDescription =
  "A flexible slide for visualizing employee performance metrics such as absenteeism, training completion, and engagement. All fields are placeholders and customizable.";

// Schema definition
export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title must be 50 characters or less")
    .default("Employee Performance Indicators")
    .meta({ description: "Main title for the employee performance dashboard" }),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description must be 200 characters or less")
    .default(
      "Describe your employee performance dashboard here. This is a placeholder for a summary or introduction to the metrics below.",
    )
    .meta({ description: "Description text for the dashboard" }),

  absenteeismRate: z
    .number()
    .min(0, "Absenteeism rate cannot be negative")
    .max(100, "Absenteeism rate cannot exceed 100%")
    .default(10)
    .meta({ description: "Employee absenteeism rate percentage" }),

  absenteeismDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(100, "Description must be 100 characters or less")
    .default("Describe absenteeism metric here. Placeholder text.")
    .meta({ description: "Description for absenteeism metric" }),

  trainingCompletion: z
    .number()
    .min(0, "Training completion cannot be negative")
    .max(100, "Training completion cannot exceed 100%")
    .default(90)
    .meta({ description: "Training completion rate percentage" }),

  trainingDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(100, "Description must be 100 characters or less")
    .default("Describe training completion metric here. Placeholder text.")
    .meta({ description: "Description for training completion metric" }),

  netPromoterScore: z
    .number()
    .min(0, "Net Promoter Score cannot be negative")
    .max(100, "Net Promoter Score cannot exceed 100")
    .default(80)
    .meta({ description: "Employee Net Promoter Score" }),

  engagementPeriod: z
    .string()
    .min(1, "Period is required")
    .max(20, "Period must be 20 characters or less")
    .default("Last 6 Months")
    .meta({ description: "Time period for engagement score measurement" }),
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
  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 to-blue-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 right-16 w-16 h-16 border-2 border-blue-200 rounded-full opacity-30"></div>

      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-slate-800 leading-tight">
          {data.title ?? "Employee Performance Indicators"}
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          {data.description ??
            "Describe your employee performance dashboard here. This is a placeholder for a summary or introduction to the metrics below."}
        </p>
      </div>

      {/* Three charts in a single horizontal line */}
      <div className="flex flex-row justify-center items-stretch gap-8 w-full">
        {/* Absenteeism Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col items-center min-w-[260px] max-w-[340px]">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Absenteeism Rate
          </h3>
          <div className="relative w-40 h-28 mb-4 flex items-center justify-center">
            <GaugeMeter
              value={data.absenteeismRate ?? 10}
              width={160}
              height={90}
            />
            <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800 bg-white px-2 rounded">
                {data.absenteeismRate ?? 10}%
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 text-center">
            {data.absenteeismDescription ??
              "Describe absenteeism metric here. Placeholder text."}
          </p>
        </div>

        {/* Training Completion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col items-center min-w-[260px] max-w-[340px]">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Training Completion
          </h3>
          <div className="relative w-40 h-28 mb-4 flex items-center justify-center">
            <GaugeMeter
              value={data.trainingCompletion ?? 90}
              width={160}
              height={90}
            />
            <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800 bg-white px-2 rounded">
                {data.trainingCompletion ?? 90}%
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 text-center">
            {data.trainingDescription ??
              "Describe training completion metric here. Placeholder text."}
          </p>
        </div>

        {/* Employee Engagement Score */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col items-center min-w-[260px] max-w-[340px]">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Employee Engagement Score
          </h3>
          <div className="mb-6 w-full flex flex-col items-center">
            <h4 className="text-base font-medium text-slate-600 mb-4 text-center">
              Net Promoter Score
            </h4>
            <div className="relative w-40 h-28 mb-2 flex items-center justify-center">
              <GaugeMeter
                value={data.netPromoterScore ?? 80}
                width={160}
                height={90}
              />
              <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 bg-white px-2 rounded">
                  {data.netPromoterScore ?? 80}%
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center mb-4">
              {data.engagementPeriod ?? "Last 6 Months"}
            </p>
          </div>
        </div>
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
