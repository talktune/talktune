
interface MeetEndButtonProps {
    click: () => void;
    icon: JSX.Element;
}

function MeetEndButton({ click, icon }: MeetEndButtonProps) {
    return (
        <>
            <button
                className=" rounded-full bg-redBtn h-[5.299vh] lg:h-[6.599vh] w-[8.299vh] lg:w-[9.599vh] text-white justify-center items-center flex text-[3.5vh]  lg:text-[4vh]"
                onClick={click}
            >
                {icon}
            </button>
        </>
    );
}

export default MeetEndButton;
