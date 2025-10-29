import React, { useState, useEffect } from 'react';
import { Input, Label } from './ui';

interface DecimalInputProps {
    id?: string;
    label?: string;
    value: number;
    onUpdate: (value: number) => void;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    title?: string;
    isAiSuggested?: boolean;
}

export function DecimalInput({ id, label, value, onUpdate, placeholder, className, readOnly, title, isAiSuggested }: DecimalInputProps) {
    const [displayValue, setDisplayValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Update display value when the prop changes, formatting the number with a comma
        if (value !== undefined && value !== null) {
            const currentNumericValue = parseFloat(displayValue.replace(',', '.'));
            if (isNaN(currentNumericValue) || currentNumericValue !== value) {
                 setDisplayValue(String(value).replace('.', ','));
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) {
            return;
        }
        const val = e.target.value;

        // Rule: Disallow periods
        if (val.includes('.')) {
            setError('Use vírgula (,) para casas decimais, não ponto (.).');
            setDisplayValue(val); // Show the invalid input to the user
            return;
        }

        // Rule: Allow only numbers and a single comma
        if (val !== '' && !/^[0-9]*,?[0-9]*$/.test(val)) {
            // Invalid character, ignore the change
            return;
        }

        setError(null);
        setDisplayValue(val);

        // Convert to a number for the parent state
        const sanitizedValue = val.replace(',', '.');
        const numericValue = parseFloat(sanitizedValue);
        
        onUpdate(isNaN(numericValue) ? 0 : numericValue);
    };

    return (
        <div className={className}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input
                id={id}
                type="text" // Use text to allow comma
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`${error ? 'border-red-500 focus:ring-red-400' : ''} ${isAiSuggested ? 'text-blue-400 font-bold' : ''}`}
                readOnly={readOnly}
                title={title}
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
    );
}