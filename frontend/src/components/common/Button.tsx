type ButtonProps = {
    type: string;
    action: () => void;
    label: string;
};

const Button: React.FC<ButtonProps> = ({ type, action, label }) => {
    return (
        <button
            className={`${type == "normal" ? "bg-gray1 text-blackNormal" : type == "positive" ? "bg-primary text-white" : "bg-redBgNormal text-white"} font-light py-[10px] px-[15px] sm:px-[24px] text-[10px] sm:text-[14px] rounded-[5px]`}
            onClick={action}
        >
            {label}
        </button>
    );
};

export default Button;
