import React, { useEffect } from "react";

import InterviewFeedback from "./InterviewFeedback";

interface InterviewEndPanelProps {
    activityID: string;
    reDirectToHome: () => void;
    isCancelledInterview: boolean;
}

function InterviewEndPanel({
    activityID,
    reDirectToHome,
    isCancelledInterview,
}: InterviewEndPanelProps) {
    useEffect(() => {
        const handleReport = async () => {
            if (isCancelledInterview == true) {
                try {
                    // await updateActivityIsCancelled(activityID, true);
                } catch (_error) { }
            } else {
                try {
                    // await updateActivityIsCancelled(activityID, false);
                    // await evaluteActivity(activityID).then((res) => { });
                } catch (_error) { }
            }
        };
        handleReport();
    }, []);

    return (
        <div>
            {isCancelledInterview ? (
                <InterviewFeedback
                    reDirectToHome={reDirectToHome}
                    isCancelledInterview={isCancelledInterview}
                />
            ) : (
                <InterviewFeedback
                    reDirectToHome={reDirectToHome}
                    isCancelledInterview={isCancelledInterview}
                />
            )}
        </div>
    );
}

export default InterviewEndPanel;
