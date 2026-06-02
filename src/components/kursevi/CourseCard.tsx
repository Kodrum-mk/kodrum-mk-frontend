import Image from "next/image";
import { Clock, Signal } from "lucide-react";
import type { Course } from "@/types";

interface Props {
  course: Course;
}

export function CourseCard({ course }: Props) {
  return (
    <article
      data-analytics-subject={course.title}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-[#1E424A]/5"
    >
      <div className="p-4 flex items-start gap-3">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={80}
          height={80}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          unoptimized
        />
        <div className="flex-1" />
        <span className="inline-block px-3 py-1 bg-[#008081]/10 text-[#008081] text-xs font-medium rounded-lg flex-shrink-0">
          {course.category}
        </span>
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-lg font-bold text-[#1E424A] line-clamp-2">
          {course.title}
        </h3>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[#1E424A]/70 text-sm line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      </div>

      <div className="px-4 pb-4">
        <span className="text-sm text-[#1E424A]/80 font-medium">
          {course.instructor.name}
        </span>
      </div>

      <div className="px-4 pb-4 flex items-center gap-4 text-sm text-[#1E424A]/60">
        <div className="flex items-center gap-1.5">
          <Signal className="w-4 h-4 text-[#008081]" aria-hidden="true" />
          <span>{course.level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#008081]" aria-hidden="true" />
          <span>{course.duration}</span>
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <button className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm">
          Дознај повеќе
        </button>
      </div>
    </article>
  );
}
