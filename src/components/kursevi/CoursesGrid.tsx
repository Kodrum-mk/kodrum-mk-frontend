import { CourseCard } from "./CourseCard";
import type { Course } from "@/types";

interface Props {
  courses: Course[];
}

export function CoursesGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[#1E424A]/60 text-lg">
          Нема пронајдени курсеви за избраниот филтер.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
