import React from "react";

type InputProp = {
    label: string;
    placeholder: string;
    value: string;
    type?: string;
    required: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
};
export default function InputField(prop: InputProp) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (prop.onChange) {
            prop.onChange(event);
        }
    }
    return (
        <div>
            <label className="text-sm font-bold leading-tight tracking-normal">
                {prop.label}
            </label>
            <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={prop.placeholder}
                value={prop.value}
                type={prop.type}
                required={prop.required}
                onChange={handleChange}
                min={prop.min}
                max={prop.max}
            />
        </div>
    );
}