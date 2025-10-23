function meetChartOptions(cutout: any) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: cutout,
    };
}

function meetDoughnutDatasets(value: number) {
    const getGradient = (chart: any) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.left,
            chartArea.bottom
        );

        gradient.addColorStop(0, "#FF3711"); // Top color
        gradient.addColorStop(0.5, "#00FFFF"); // Middle color
        gradient.addColorStop(1, "#339999"); // Bottom color
        return gradient;
    };

    return {
        datasets: [
            {
                data: [value, 100 - value],
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const { _, chartArea } = chart;
                    if (!chartArea) return null;
                    if (context.dataIndex === 0) {
                        return "white";
                    } else {
                        return getGradient(chart);
                    }
                },
                borderWidth: 0,
            },
        ],
    };
}

export { meetChartOptions, meetDoughnutDatasets };
