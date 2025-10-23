import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaPlus, FaCheck } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useInterviewContext } from "@/context/InterviewContext";
import { ArrowRightIcon, ChevronLeft } from "lucide-react";

function generateValidationSchema(
    schema: Array<{
        type: string;
        name: string;
        label: string;
        validation?: { min?: number; max?: number; required?: boolean };
    }>
) {
    const shape: Record<string, any> = {};

    schema.forEach((field) => {
        const { validation } = field;
        if (validation) {
            let validator;
            switch (field.type) {
                case "number":
                    validator = Yup.number();
                    if (validation.min !== undefined) {
                        if (validation.min !== undefined) {
                            validator = validator.min(
                                validation.min as number,
                                `Minimum ${validation.min}`
                            );
                        }
                    }
                    if (validation.max !== undefined) {
                        validator = validator.max(
                            validation.max,
                            `Maximum ${validation.max}`
                        );
                    }
                    break;
                case "add-group":
                    validator = Yup.array()
                        .of(Yup.string())
                        .min(
                            validation.min as number,
                            `At least ${validation.min} attribute is required`
                        );
                    break;
                default:
                    validator = Yup.string();
                    break;
            }
            if (validation.required) {
                validator = validator.required(`${field.label} is required`);
            }
            shape[field.name] = validator;
        }
    });

    return Yup.object().shape(shape);
}

function generateInitialValues(
    schema: Array<{ type: string; name: string; defaultValue?: any }>
) {
    const initialValues: { [key: string]: any } = {};

    schema.forEach((field) => {
        if (field.type === "number") {
            initialValues[field.name] = parseInt(field.defaultValue[0], 10) || 0;
        } else if (field.type === "button-group") {
            initialValues[field.name] = field.defaultValue
                ? field.defaultValue[0]
                : "";
        } else if (field.type === "add-group") {
            initialValues[field.name] =
                field.defaultValue || (field.type === "add-group" ? [] : "");
        }
    });

    return initialValues;
}

interface InterviewPreferencesProps {
    handleStaticTemplateInterviews: () => void;
}

function InterviewPreferences({
    handleStaticTemplateInterviews,
}: InterviewPreferencesProps) {
    const {
        handleDynamicPromptRequest,
        interviewText,
        preferencesSchema,
        introduction,
    } = useInterviewContext();

    const formSchema =
        preferencesSchema && preferencesSchema.length > 0
            ? [...preferencesSchema].sort(
                (a: { indexNo: number }, b: { indexNo: number }) =>
                    a.indexNo - b.indexNo
            )
            : [];
    // const formSchema = formSchemas[headerText] || formSchemas.softwareEngineer;

    const validationSchema = generateValidationSchema(formSchema);
    const initialValues = generateInitialValues(formSchema);

    const router = useRouter();

    const skills_set =
        formSchema &&
        formSchema.find((item: { name: string }) => item.name === "skills_set");
    const skills = skills_set && skills_set["options"];

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSkills, setFilteredSkills] = useState(skills ?? []);
    const dropdownRef = useRef<any>(null);

    const formik: any = useFormik({
        initialValues,
        validationSchema,

        onSubmit: async (values: any) => {
            await handleDynamicPromptRequest(values.interviewTimeLimit, values);
        },
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        if (formSchema.length == 0 && introduction.length == 0) {
            router.push("/");
        }
    }, [formSchema, introduction]);

    useEffect(() => {
        setFilteredSkills(
            skills &&
            skills.filter((skill: string) =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    interface FieldProps {
        type: string;
        name: string;
        label: string;
        max?: number;
        placeholder?: string;
        options?: string[];
        removeOption?: boolean;
        addNewOption?: boolean;
    }

    const renderField = (fieldProps: FieldProps) => {
        switch (fieldProps.type) {
            case "number":
                return (
                    <div
                        className="mb-4 lg:mb-8 flex flex-col sm:flex-row justify-start"
                        key={fieldProps.name}
                    >
                        <h2 className="mb-2 w-full sm:w-[14rem]">{fieldProps.label}</h2>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    {...formik.getFieldProps(fieldProps.name)}
                                    max={fieldProps.max}
                                    className={`text-sm lg:text-xl w-[3ch] text-center ${formik.touched[fieldProps.name] &&
                                        formik.errors[fieldProps.name]
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                    onClick={() => {
                                    }}
                                />
                                <div>{fieldProps.placeholder}</div>
                            </div>
                            {formik.touched[fieldProps.name] &&
                                formik.errors[fieldProps.name] && (
                                    <div className="text-red-500 text-xs">
                                        {formik.errors[fieldProps.name]}
                                    </div>
                                )}
                        </div>
                    </div>
                );

            case "button-group":
                return (
                    <div
                        className="mb-6 lg:mb-8 flex flex-col lg:flex-row justify-center lg:justify-start"
                        key={fieldProps.name}
                    >
                        <h2 className="mb-2 w-full lg:max-w-[12rem]">{fieldProps.label}</h2>
                        <div className="flex justify-center flex-wrap lg:justify-start gap-2 lg:gap-8">
                            {fieldProps.options &&
                                fieldProps.options.map((option) => (
                                    <div
                                        key={option}
                                        className={`flex justify-center items-center text-[0.68rem] lg:text-[0.96rem] rounded-lg text-black border-2 ${formik.values[fieldProps.name] === option
                                            ? "bg-[#0F99181A]  dark:bg-black text-black border-primary"
                                            : "bg-gray1 dark:bg-black border-gray2  dark:border-grayBorderDark dark:text-white"
                                            } px-[3vw] cursor-pointer transition-transform py-[0.5rem] hover:scale-[1.02]`}
                                        onClick={() => {
                                            formik.setFieldValue(fieldProps.name, option);
                                        }}
                                    >
                                        <span className="text-center">{option}</span>
                                        {formik.values[fieldProps.name] === option && (
                                            <div
                                                className={`ml-2 text-[0.654rem] lg:text-[0.854rem] ${formik.values[fieldProps.name] === option
                                                    ? "text-black"
                                                    : ""
                                                    }`}
                                            >
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                        {formik.touched[fieldProps.name] &&
                            formik.errors[fieldProps.name] && (
                                <div className="text-red-500 text-xs">
                                    {formik.errors[fieldProps.name]}
                                </div>
                            )}
                    </div>
                );

            case "add-group":
                return (
                    <div
                        className="mb-6 lg:mb-8 flex flex-col lg:flex-row justify-start"
                        key={fieldProps.name}
                    >
                        <h2 className="mb-2 w-full lg:max-w-[12rem]">{fieldProps.label}</h2>
                        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-8">
                            {formik.values[fieldProps.name].map(
                                (skill: string, index: number) => (
                                    <div
                                        key={index}
                                        className="relative flex items-center text-[0.68rem] lg:text-[0.96rem] rounded-lg border-2 bg-gray1 dark:bg-black text-black border-gray2 cursor-pointer transition-transform py-[0.5rem] px-[3vw] hover:scale-[1.02]"
                                    >
                                        <div className="flex justify-center">
                                            <span className="flex-grow text-center">{skill}</span>
                                        </div>
                                        {fieldProps.removeOption && (
                                            <div className="absolute right-[0.7rem]">
                                                <div
                                                    className="text-gray3 text-[0.754rem] lg:text-[0.954rem]"
                                                    onClick={() => {
                                                        formik.setFieldValue(
                                                            fieldProps.name,
                                                            formik.values[fieldProps.name].filter(
                                                                (s: string) => s !== skill
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <MdClose />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                            {fieldProps.addNewOption && (
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        className="flex justify-center items-center text-[0.68rem] lg:text-[0.96rem] rounded-lg font-normal text-gray4 bg-gray2 cursor-pointer transition-transform py-[0.5rem] px-[3vw] hover:scale-[1.02]"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <div className="mr-2 text-[0.754rem] lg:text-[0.954rem]">
                                            <FaPlus />
                                        </div>
                                        <span className="text-center">{"Add new skill"}</span>
                                    </div>
                                    {isOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-black border border-gray-300 rounded-md shadow-lg">
                                            <input
                                                type="text"
                                                placeholder="Search skills..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-4 py-2 border-b border-gray2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <ul className="max-h-60 overflow-auto">
                                                {filteredSkills
                                                    .slice(0, 5)
                                                    .map((skill: string, index: number) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => {
                                                                if (
                                                                    Array.isArray(formik.values.skills_set) &&
                                                                    !formik.values.skills_set.includes(skill)
                                                                ) {
                                                                    formik.setFieldValue("skills_set", [
                                                                        ...formik.values.skills_set,
                                                                        skill,
                                                                    ]);
                                                                    setSearchTerm("");
                                                                    setIsOpen(false);
                                                                }
                                                            }}
                                                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-primaryBgDark cursor-pointer"
                                                        >
                                                            {skill}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {formik.touched[fieldProps.name] &&
                            formik.errors[fieldProps.name] && (
                                <div className="text-red-500 text-xs">
                                    {formik.errors[fieldProps.name]}
                                </div>
                            )}
                    </div>
                );

            case "textarea":
                return (
                    <div
                        className="mb-4 lg:mb-8 flex flex-col lg:flex-row justify-start"
                        key={fieldProps.name}
                    >
                        <h2 className="mb-2 w-full lg:max-w-[12rem]">{fieldProps.label}</h2>
                        <div className="flex flex-col w-full">
                            <textarea
                                {...formik.getFieldProps(fieldProps.name)}
                                className={`w-full h-32 p-4 border border-gray-300 dark:border-grayBorderDark  rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formik.touched[fieldProps.name] &&
                                    formik.errors[fieldProps.name]
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                placeholder={fieldProps.placeholder}
                            />
                            {formik.touched[fieldProps.name] &&
                                formik.errors[fieldProps.name] && (
                                    <div className="text-red-500 text-xs">
                                        {formik.errors[fieldProps.name]}
                                    </div>
                                )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {formSchema && (
                <>
                    {formSchema.length > 0 ? (
                        <div className="relative flex flex-col bg-white dark:bg-primaryBgDark left-[9.8vw] sm:left-[15.686vw]  w-[80vw] sm:w-[68.627vw] shadow-xl px-[2.915vw] py-[1.802vw] mb-[15vw]">
                            <div className="flex flex-row m-0 p-0 justify-end"></div>
                            <button
                                className="flex items-center gap-2 mb-[3vh] text-black dark:text-white bg-gray2 rounded-full w-max justify-center p-2"
                                onClick={() => router.back()}
                            >
                                <ChevronLeft />
                            </button>
                            <div className="w-full flex justify-start mb-[3vh]">
                                <p className="text-[0.919rem] lg:text-[1.219rem] font-bold text-black dark:text-white">
                                    Personalise Your Interview
                                </p>
                            </div>
                            <form
                                onSubmit={formik.handleSubmit}
                                className="text-[0.719rem] lg:text-[1.019rem] mb-[5vw]"
                            >
                                {formSchema.map((fieldProps: FieldProps) =>
                                    renderField(fieldProps)
                                )}
                                <div className="flex justify-end">
                                    <button
                                        className=" flex flex-row gap-4 items-center justify-center text-white text-sm bg-primary lg:w-max w-full rounded-md shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 px-8 py-4"
                                        type="button"
                                        onClick={
                                            formSchema.length > 0
                                                ? formik.handleSubmit
                                                : handleStaticTemplateInterviews
                                        }
                                    >
                                        Continue
                                        <ArrowRightIcon />
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto p-6">
                            <div className="border-2 border-primary rounded-lg p-6">
                                <h2 className="text-primary text-2xl font-bold mb-4">TIPS</h2>
                                <p className="mb-4">For these questions, you should</p>
                                <ul className="list-disc list-inside space-y-2">
                                    {introduction &&
                                        introduction.map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                </ul>
                                <div className="flex justify-end mt-8">
                                    <button
                                        className=" flex flex-row gap-4 items-center justify-center text-white text-sm bg-primary lg:w-max w-full rounded-md shadow-md hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 px-8 py-4"
                                        type="button"
                                        onClick={
                                            formSchema.length > 0
                                                ? formik.handleSubmit
                                                : handleStaticTemplateInterviews
                                        }
                                    >
                                        Continue
                                        <ArrowRightIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default InterviewPreferences;
