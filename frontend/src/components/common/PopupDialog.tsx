import { AiOutlineClose } from "react-icons/ai";
import LoaderLite from "./LoaderLite";

interface PopupDialogProps {
    positiveFunction: () => void;
    negativeFunction: () => void;
    noOfButton: number;
    title: string;
    description: string;
    positiveBtnLabel: string;
    negativeBtnLabel: string;
    isLoading: boolean;
    disableModalClose: boolean;
}

const PopupDialog = ({
    positiveFunction,
    negativeFunction,
    noOfButton,
    title,
    description,
    positiveBtnLabel,
    negativeBtnLabel,
    isLoading,
    disableModalClose,
}: PopupDialogProps) => {
    return (
        <div
            className="fixed w-full h-full inset-0 z-500 overflow-hidden flex justify-center items-center animated fadeIn faster"
            style={{ background: "rgba(0,0,0,.7)" }}
        >
            <div className="border border-teal-500 modal-container bg-white dark:bg-primaryBgDark w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-lg lg:text-xl font-bold">{title}</p>
                        {!disableModalClose && (
                            <div
                                onClick={negativeFunction}
                                className="m-0 p-2 bg-[#f9f9f9] dark:bg-secondaryBgDark rounded-full text-grayTxt text-[0.754rem] lg:text-[0.954rem] cursor-pointer"
                            >
                                <AiOutlineClose />
                            </div>
                        )}
                    </div>
                    <div className="my-5 text-[0.7rem] md:text-[0.8rem] xl:text-[0.9rem]">
                        <p>{description}</p>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <LoaderLite />
                        </div>
                    ) : (
                        <div className="flex justify-end pt-2 text-[0.75rem] md:text-[0.85rem] xl:text-[0.95rem]">
                            {noOfButton > 1 ? (
                                <>
                                    <button
                                        onClick={negativeFunction}
                                        className="focus:outline-none modal-close px-4 bg-gray-200 p-3 rounded-lg text-black hover:bg-gray-300"
                                    >
                                        {negativeBtnLabel}
                                    </button>
                                    <button
                                        onClick={positiveFunction}
                                        className="focus:outline-none px-4 bg-primaryButtonBg dark:bg-primaryButtonBg p-3 ml-3 rounded-lg text-white hover:bg-teal-500"
                                        disabled={isLoading}
                                    >
                                        {positiveBtnLabel}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={positiveFunction}
                                    className="focus:outline-none px-4 bg-primaryButtonBg dark:bg-primaryButtonBg p-3 ml-3 rounded-lg text-white hover:bg-teal-500"
                                    disabled={isLoading}
                                >
                                    {positiveBtnLabel}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupDialog;