"use client";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import InterviewComponents from "../../components/meet/interview";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Loader from "@/components/common/Loader";

function InterviewDashboard() {
    const [isRefreshingPage, setIsRefreshingPage] = useState(false);



    return (
        <div>
            {isRefreshingPage ? (
                <Loader />
            ) : (
                <>
                    <InterviewComponents />
                    <Toaster />
                </>
            )}
        </div>
    );
}

export default InterviewDashboard;
