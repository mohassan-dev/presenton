import React from "react";
import * as z from "zod";

// Layout metadata
export const layoutId = "analytics-introduction-slide";
export const layoutName = "Analytics Introduction Slide";
export const layoutDescription =
  "A visually engaging introduction/cover slide for analytics presentations, styled to match the analytics dashboard theme. Displays company name, presentation title, subtitle, and presenter information.";

// Schema definition
const introductionSlideSchema = z.object({
  companyName: z.string().min(2).max(50).default("presenton"),
  title: z.string().min(3).max(50).default("Analytics Dashboard Overview"),
  subtitle: z
    .string()
    .min(0)
    .max(100)
    .default("Unlocking insights for better decisions"),
  presenterName: z.string().min(2).max(40).default("Jane Doe"),
  presenterTitle: z.string().min(2).max(40).default("Lead Data Analyst"),
  date: z.string().min(5).max(50).default("June 13, 2038"),
});

export const Schema = introductionSlideSchema;
export type IntroductionSlideData = z.infer<typeof introductionSlideSchema>;

interface IntroductionSlideProps {
  data?: Partial<IntroductionSlideData>;
}

const IntroductionSlide: React.FC<IntroductionSlideProps> = ({ data }) => {
  return (
    <div
      className="w-full max-w-[1280px] aspect-video bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ fontFamily: "Montserrat, Inter, sans-serif" }}
    >
      {/* Minimal background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill="#8B5CF6" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="80" r="40" fill="#3B82F6" />
        </svg>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-12 right-12 flex justify-between items-center text-slate-700 text-base font-semibold z-10">
        <span>{data?.companyName || "presenton"}</span>
        <span>{data?.date || "June 13, 2038"}</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 text-center tracking-tight">
          {data?.title || "Analytics Dashboard Overview"}
        </h1>
        {data?.subtitle && (
          <div className="text-lg md:text-2xl text-indigo-500 font-medium mb-8 text-center">
            {data.subtitle}
          </div>
        )}

        <div className="flex flex-col items-center mt-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-7 h-7 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {data?.presenterName || "Jane Doe"}
          </div>
          <div className="text-base text-gray-500">
            {data?.presenterTitle || "Lead Data Analyst"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionSlide;
