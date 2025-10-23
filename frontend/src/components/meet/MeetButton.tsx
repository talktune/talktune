interface MeetButtonProps {
  click: () => void;
  icon: JSX.Element;
  type: string;
  isActived: boolean;
}

function MeetButton({ click, icon, type, isActived }: MeetButtonProps) {
  return (
    <>
      <button
        className={`rounded-full ${
          type === "microphone"
            ? isActived
              ? "bg-grayBtn"
              : "bg-red-500"
            : isActived
            ? "bg-blueIcon"
            : "bg-grayBtn"
        } h-[5.299vh] lg:h-[6.599vh] w-[5.299vh] lg:w-[6.599vh] text-white justify-center items-center flex text-[2.5vh] lg:text-[3vh]`}
        onClick={click}
      >
        {icon}
      </button>
    </>
  );
}

export default MeetButton;
