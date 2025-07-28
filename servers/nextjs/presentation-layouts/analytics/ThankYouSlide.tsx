import React from "react";
import * as z from "zod";

// Layout metadata
export const layoutId = "analytics-thank-you-slide";
export const layoutName = "Analytics Thank You Slide";
export const layoutDescription =
  "A clean, professional thank you slide for closing analytics presentations. Styled to match the analytics dashboard theme, this slide provides a closing message and company contact information.";

// Schema definition
const thankYouSlideSchema = z.object({
  title: z.string().min(3).max(30).default("Thank You!"),
  subtitle: z.string().min(0).max(100).default(""),
  companyName: z.string().min(2).max(50).default("presenton"),
  date: z.string().min(5).max(50).default("June 13, 2038"),
  address: z
    .string()
    .min(5)
    .max(100)
    .default("123 Anywhere St., Any City, ST 12345"),
  phone: z.string().min(5).max(30).default("+123-456-7890"),
  website: z.string().min(5).max(100).default("www.reallygreatsite.com"),
  email: z.string().default("info@reallygreatsite.com"),
});

export const Schema = thankYouSlideSchema;
export type ThankYouSlideData = z.infer<typeof thankYouSlideSchema>;

interface ThankYouSlideProps {
  data?: Partial<ThankYouSlideData>;
}

const ThankYouSlide: React.FC<ThankYouSlideProps> = ({ data }) => {
  return (
    <div
      className="w-full max-w-[1280px] aspect-video bg-gradient-to-br from-slate-50 via-indigo-100 to-indigo-300 p-8 flex flex-col items-center justify-center relative overflow-hidden"
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
          {data?.title || "Thank You!"}
        </h1>
        {data?.subtitle && (
          <div className="text-lg md:text-2xl text-indigo-500 font-medium mb-8 text-center">
            {data.subtitle}
          </div>
        )}
        <div className="flex flex-col items-center mt-2">
          <div className="text-xl font-bold text-gray-800 mb-2">
            We appreciate your attention
          </div>
          <div className="text-base text-gray-500 mb-8">
            Reach out for more insights or support.
          </div>
          <div className="flex flex-col items-center text-slate-700 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="address">
                📍
              </span>
              <span>
                {data?.address || "123 Anywhere St., Any City, ST 12345"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="phone">
                📞
              </span>
              <span>{data?.phone || "+123-456-7890"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="website">
                🌐
              </span>
              <span>{data?.website || "www.reallygreatsite.com"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="email">
                ✉️
              </span>
              <span>{data?.email || "info@reallygreatsite.com"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouSlide;
