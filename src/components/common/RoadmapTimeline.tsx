import { ReactNode } from "react";

export interface RoadmapItem {
  date: string;
  title: string;
  description: string;
  icon?: ReactNode;
  status?: "upcoming" | "in-progress" | "done";
}

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
  condensed?: boolean;
}

export function RoadmapTimeline({ roadmap, condensed }: RoadmapTimelineProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-teal-700 mb-4 flex items-center gap-2">
        🚀 What's Coming Next
      </h2>
      <ul className="relative border-l-2 border-teal-200 pl-4 space-y-6">
        {roadmap.map((item) => (
          <li
            key={item.title + item.date}
            className="flex items-start gap-4 group"
          >
            <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-white border-2 border-teal-200 rounded-full shadow group-hover:scale-105 transition-transform">
              {item.icon}
            </span>
            <div className="ml-6">
              <div className="mb-1">
                <span className="font-bold text-teal-600 text-base block">
                  {item.title}
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{item.date}</span>
                  {item.status === "in-progress" && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                      In Progress
                    </span>
                  )}
                  {item.status === "done" && (
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      Complete
                    </span>
                  )}
                  {item.status === "upcoming" && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
              {/* Only show the title once, remove repeated week name */}
              {!condensed && (
                <div className="text-gray-600 text-sm mt-1">
                  {item.description}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
