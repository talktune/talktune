import useSelectedColors from "@/styles/colors";

const LoaderLite: React.FC = () => {
    const selectedColors = useSelectedColors();

    const loaderStyle: React.CSSProperties = {
        border: `6px solid ${selectedColors.gray}`,
        borderTop: `6px solid ${selectedColors.loaderWhite}`,
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
    };

    const keyframesStyle = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

    return (
        <div className="flex justify-center">
            <style>{keyframesStyle}</style>
            <div className="loader" style={loaderStyle}></div>
        </div>
    );
};

export default LoaderLite;
