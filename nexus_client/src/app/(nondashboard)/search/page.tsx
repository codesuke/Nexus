"use client";

import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (courses) {
      if (id) {
        const course = courses.find((c) => c.courseId === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
    }
  }, [courses, id]);

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course.courseId}`, {
      scroll: false,
    });
  };

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
      scroll: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      {/* Demo Mode Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
        <h3 className="text-lg font-semibold text-customgreys-darkGrey mb-2">🎭 Try Demo Mode!</h3>
        <p className="text-sm text-customgreys-dirtyGrey">
          Click &quot;Enroll Now&quot; on any course and use <strong>Guest Checkout</strong> to try the full enrollment process.
          No signup required - just enter any email address to see how it works!
        </p>
      </div>
      
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle">{courses.length} courses avaiable</h2>
      <div className="search__content">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
          className="search__courses-grid"
        >
          {courses.map((course) => (
            <motion.div
              key={course.courseId}
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.4 }}
            >
              <CourseCardSearch
                course={course}
                isSelected={selectedCourse?.courseId === course.courseId}
                onClick={() => handleCourseSelect(course)}
              />
            </motion.div>
          ))}
        </motion.div>

        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
