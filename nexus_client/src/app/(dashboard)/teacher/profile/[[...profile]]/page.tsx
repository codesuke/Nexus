import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

const TeacherProfilePage = () => {
  return (
    <>
      <Header title="Profile" subtitle="View your profile" />
      <UserProfile
        path="/teacher/profile"
        routing="path"
        appearance={{
          elements: {
            scrollBox: "bg-customgreys-secondarybg",
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              },
            },
          },
        }}
      />
    </>
  );
};

export default TeacherProfilePage;
