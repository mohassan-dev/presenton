/**
 * Recommendations Slide Layout (Template)
 *
 * A flexible template slide for presenting recommendations in a card format.
 * All text and data are placeholders for customization.
 *
 * WHY DO 4 RECOMMENDATION BOXES SOMETIMES SHOW?
 * ------------------------------------------------
 * The recommendations array is defined in the schema with .min(3).max(3), so it should always have exactly 3 items.
 * However, if the data passed in contains more than 3 recommendations (for example, from user input or external data),
 * the UI code will render as many as are present in parsed.recommendations, regardless of the schema's max(3).
 * This is because the .max(3) constraint is only enforced when using Schema.parse(), but if you merge in extra data
 * after parsing, or if the data prop already contains more than 3, the UI will render all of them.
 *
 * To guarantee only 3 cards are ever shown, you should explicitly slice the recommendations array in the component render.
 * See the updated code below.
 */

import * as z from "zod";
import { IconSchema } from "../defaultSchemes";

// Layout metadata
export const layoutId = "recommendations-slide";
export const layoutName = "Recommendations Slide";
export const layoutDescription =
  "A flexible template slide for presenting recommendations in a card format. All text and data are placeholders for customization.";

// Schema definition
export const Schema = z.object({
  title: z.string().min(1).max(50).default("Recommendations").meta({
    description: "Main title for the recommendations slide (placeholder)",
  }),
  subtitle: z
    .string()
    .min(1)
    .max(200)
    .default(
      "This is a placeholder subtitle for your recommendations slide. Replace this text with your own summary or context for the recommendations below.",
    )
    .meta({
      description: "Subtitle or description text for the slide (placeholder)",
    }),

  // Recommendation cards
  recommendations: z
    .array(
      z.object({
        title: z.string().min(1).max(50).default("Recommendation Title").meta({
          description: "Title of the recommendation card (placeholder)",
        }),
        description: z
          .string()
          .min(1)
          .max(200)
          .default(
            "This is a placeholder description for a recommendation. Replace this with your own recommendation details.",
          )
          .meta({
            description: "Description of the recommendation card (placeholder)",
          }),
        icon: IconSchema.meta({
          description: "Icon type for the recommendation card (placeholder)",
        }),
      }),
    )
    .min(3)
    .max(3)
    .default(() => [
      {
        title: "Placeholder Recommendation 1",
        description:
          "This is a placeholder description for the first recommendation card. Replace with your own content.",
        icon: {
          __icon_url__:
            "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
          __icon_query__: "A beautiful road in the mountains",
        },
      },
      {
        title: "Placeholder Recommendation 2",
        description:
          "This is a placeholder description for the second recommendation card. Replace with your own content.",
        icon: {
          __icon_url__:
            "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
          __icon_query__: "A beautiful road in the mountains",
        },
      },
      {
        title: "Placeholder Recommendation 3",
        description:
          "This is a placeholder description for the third recommendation card. Replace with your own content.",
        icon: {
          __icon_url__:
            "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
          __icon_query__: "A beautiful road in the mountains",
        },
      },
    ])
    .meta({ description: "Array of recommendation cards (placeholders)" }),
});

// Type inference
type SchemaType = z.infer<typeof Schema>;

// Component definition
const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  // Merge defaults with provided data
  const parsed = { ...Schema.parse({}), ...data };

  // Always show only the first 3 recommendations, even if more are present
  const recommendationsToShow = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.slice(0, 3)
    : [];

  return (
    <div className="px-16 pb-16 w-full max-w-[1280px] aspect-video bg-gradient-to-br from-purple-50 to-blue-50 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern
              id="dots"
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
            >
              <circle cx="5" cy="5" r="1" fill="#8B5CF6" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <polygon
            points="50,25 75,75 25,75"
            fill="none"
            stroke="#EC4899"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-10">
        <div className="w-4 h-4 bg-blue-400 rounded-full mb-2"></div>
        <div className="w-6 h-6 bg-purple-400 rounded-full mb-2"></div>
        <div className="w-4 h-4 bg-pink-400 rounded-full mb-2"></div>
        <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
      </div>

      {/* Main Title */}
      <div className="mb-12 text-left max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          {parsed.title}
        </h1>
        <div className="flex justify-start mb-6">
          <svg width="60" height="12" viewBox="0 0 60 12">
            <path
              d="M2,6 Q15,2 30,6 Q45,10 58,6"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          {parsed.subtitle}
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        {recommendationsToShow.slice(0, 3).map((recommendation, index) => (
          <div
            key={index}
            className="group hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full relative overflow-hidden">
              {/* Card background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-full transform translate-x-8 -translate-y-8"></div>
              </div>

              {/* Icon Circle */}
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center border-2 border-blue-100 group-hover:border-blue-300 transition-colors duration-300">
                  {/* Icon rendering logic as in Type10SlideLayout */}
                  {recommendation.icon?.__icon_url__ ? (
                    <img
                      src={recommendation.icon.__icon_url__}
                      alt={
                        recommendation.icon.__icon_query__ ||
                        recommendation.title
                      }
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : null}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
                  {recommendation.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {recommendation.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom decorative element */}
      <div className="flex justify-center mt-12">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
