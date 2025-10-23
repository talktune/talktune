import useSelectedColors from "@/styles/colors";

function ChartOptions(cutout: number) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: cutout,
    };
}

interface DoughnutDatasetsProps {
    overall_score: string | number;
    highest_score_obtainable?: number;
}

function DoughnutDatasets({
    overall_score,
    highest_score_obtainable,
}: DoughnutDatasetsProps) {
    const selectedColors = useSelectedColors();

    // Remove the percentage sign from a string
    function parseValue(strValue: string | number): number {
        if (strValue == "N/A") {
            strValue = 0;
        }
        const stringValue = String(strValue);
        const cleanedValue = stringValue.replace(/%/g, "");
        const intValue = parseInt(cleanedValue, 10);
        return intValue;
    }

    let parsedValue;
    if (highest_score_obtainable !== undefined) {
        parsedValue = (parseValue(overall_score) / highest_score_obtainable) * 100;
    } else {
        parsedValue = parseValue(overall_score);
    }

    const chartBg = (parsedValue: number) => {
        if (parsedValue > 65) {
            return `${selectedColors.chartBgGreen}`
        } else if (parsedValue > 45) {
            return `${selectedColors.chartBgBlue}`
        } else if (parsedValue > 30) {
            return `${selectedColors.chartBgOrange}`
        } else {
            return `${selectedColors.chartBgOrange}`
        }
    }

    return {
        datasets: [
            {
                data: [parsedValue, 100 - parsedValue],
                backgroundColor: [
                    parsedValue > 65
                        ? `${selectedColors.green}`
                        : parsedValue > 45
                            ? `${selectedColors.blue}`
                            : parsedValue > 30
                                ? `${selectedColors.orange}`
                                : `${selectedColors.orange}`,
                    `${chartBg(parsedValue)}`,
                ],
                borderWidth: 0,

                hoverBackgroundColor: [
                    parsedValue > 65
                        ? `${selectedColors.green}`
                        : parsedValue > 45
                            ? `${selectedColors.blue}`
                            : parsedValue > 30
                                ? `${selectedColors.orange}`
                                : `${selectedColors.orange}`,
                    `${selectedColors.gray}`,
                ],
            },
        ],
    };
}

export { ChartOptions, DoughnutDatasets };
