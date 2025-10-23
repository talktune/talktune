import { RiArrowRightSLine } from "react-icons/ri";

type ArrowButtonProps = {
    type: string;
    action: () => void;
    label: string;
};

const ArrowButton: React.FC<ArrowButtonProps> = ({ type, action, label }) => {
    return (
        <button
            className={`${type == "arrowBlack" ? "bg-black text-white" : type == "arrowGray" ? "bg-gray2 text-black" : "text-black bg-transparent"} font-light gap-[1.256vw] sm:gap-[8px] sm:py-[12.5px] py-[1.868vw] pl-[2.389vw] sm:pl-[20px] pr-[1.833vw] sm:pr-[14px] text-[1.811vw] sm:text-[16px] rounded-[0.278vw] flex flex-row items-center border border-gray3 `}
            onClick={action}
        >
            {label}
            <RiArrowRightSLine />
        </button>
    );
};

export default ArrowButton;
