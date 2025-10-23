import { BsArrowLeft } from "react-icons/bs";
import useSelectedStrings from "@/constants/strings";

interface BtnBackProps {
    goBack: () => void;
}

const BtnBack: React.FC<BtnBackProps> = ({ goBack }) => {
    const selectedStrings = useSelectedStrings();

    return (
        <button
            className={`border border-grayBorder dark:border-grayBorderDark text-blackText dark:text-whiteTextDark hover:bg-whiteButtonHover dark:hover:bg-grayBgDark black mt-4 ml-5 sm:ml-10 cursor-pointer font-medium border-1 rounded-md h-7 w-20 text-[0.7em] sm:h-10 sm:w-28 sm:text-[1em]  flex items-center justify-center `}
            onClick={goBack}
        >
            <BsArrowLeft style={{ marginRight: "8px" }} />
            {selectedStrings.btnBack}
        </button>
    );
};

export default BtnBack;
