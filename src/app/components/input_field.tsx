import React from "react";

type InputProp = {
    label: string;
    placeholder: string;
    value: string;
    type?: string;
    required: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    min?: number;
    max?: number;
    accept?: string;
    onFocus?: () => void;
    rows?: number; // Optional rows prop for textarea to change textarea height
    maxLength?: number; // Optional maxLength prop to control input length
};

export default function InputField(props: InputProp) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props.onChange) {
            props.onChange(event);
        }
    };

    return (
        <div>
            <label className="text-sm font-bold leading-tight tracking-normal">
                {props.label}
            </label>
            {props.type === 'textarea' ? (
                <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={props.placeholder}
                    value={props.value}
                    required={props.required}
                    onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                    rows={props.rows || 3}
                    style={{ resize: 'none' }}
                    onFocus={props.onFocus}
                    maxLength={props.maxLength}
                />
            ) : (
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={props.placeholder}
                    value={props.value}
                    type={props.type}
                    required={props.required}
                    onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                    min={props.min}
                    max={props.max}
                    accept={props.accept}
                    onFocus={props.onFocus}
                    maxLength={props.maxLength}
                />
            )}
            {/* Character count display */}
            {props.maxLength && (
                <p className="text-right text-xs text-gray-600">
                    {`${props.value.length}/${props.maxLength}`}
                </p>
            )}
        </div>
    );
}
