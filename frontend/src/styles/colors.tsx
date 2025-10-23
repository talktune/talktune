// App colors for light and dark mode
function useSelectedColors() {
    const selectedColors = {
        red: "#C21F00",
        redBg: "rgb(194 31 0)",
        redLow: "rgb(251 210 211)",
        pink: "rgb(255, 99, 132)",
        pinkLight: "rgb(255 228 228)",
        yellow: "#FBBC05",
        orange: "#FF8800",
        green: "rgba(15, 153, 24, 1)",
        gray: "rgb(214 219 223)",
        loaderWhite: "rgb(136 136 136)",
        black: "rgb(0 0 0)",
        blue: "rgba(46, 144, 250, 1)",
        blueLight: "rgb(214 234 248)",
        chartBg: "rgb(21 23 24)",
        chartBgGreen: "#CFEBD1",
        chartBgBlue: "#D5E9FE",
        chartBgOrange: "#FFE7CC",
        chartBgLight: "rgb(243 244 246)",
        borderPink: "rgb(255, 99, 132)",
        transparentGreen: "rgba(207, 235, 209, 1)",
        normalGreen: "rgba(15, 153, 24, 1)",

        linearGradientRed:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(224,48,18,1) 0%, rgba(255,252,0,1) 94%)",
        linearGradientOrange:
            "linear-gradient(90deg, rgba(255, 252, 0, 1) 0%, rgba(17, 190, 13, 1) 100%)",
        linearGradientGreen:
            "linear-gradient(90deg, rgba(17, 190, 13, 1) 0%, rgba(255, 252, 0, 1) 100%)",
        linearGradientYellow:
            "linear-gradient(90deg, rgba(255, 252, 0, 1) 0%, rgba(224, 48, 18, 1) 100%)",
    };

    return selectedColors;
}

export default useSelectedColors;
