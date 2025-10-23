"use client";

import Loader from "@/components/common/Loader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHome from "@/components/dashboard/DashboardHome";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";


function InterviewDashboard() {
  const [isRefreshingPage, setIsRefreshingPage] = useState(false);

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div>
      {isRefreshingPage ? (
        <Loader />
      ) : (
        <>
          <div className="fixed top-0 right-0 z-50 w-full">
            <DashboardHeader />
          </div>
          <div
            className={"bg-white dark:bg-bgDark flex-grow h-full overflow-y-auto mt-[3.9rem] pt-[1.5rem] min-h-screen"} >
            <DashboardHome />
          </div>
        </>
      )}
    </div>
  );
}

export default InterviewDashboard;
