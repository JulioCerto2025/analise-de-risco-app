import React, { useState, useEffect } from 'react';
import { Input, Label } from './ui';

interface DecimalInputProps {
    id?: string;
    label?: string;
    value?: number;
    onUpdate: (value: number) => void;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    title?: string;
    isAiSuggested?: boolean;
    noWrapper?: boolean;
}

export function DecimalInput({ id, label, value, onUpdate, placeholder, className, readOnly, title, isAiSuggested, noWrapper }: DecimalInputProps) {
    const [displayValue, setDisplayValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        // Atualiza visualização quando o prop muda, mas evita sobrescrever durante digitação ativa
        if (isFocused) return;
        if (value !== undefined && value !== null) {
            const currentNumericValue = parseFloat(displayValue.replace(',', '.'));
            if (isNaN(currentNumericValue) || currentNumericValue !== value) {
                setDisplayValue(String(value).replace('.', ','));
            }
        } else {
            setDisplayValue('');
        }
    }, [value, isFocused]);

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

        // Converter para número e enviar somente quando for válido
        const sanitizedValue = val.replace(',', '.');
        const numericValue = parseFloat(sanitizedValue);

        // Evita sobrescrever com 0 em estados intermediários (vazio ou apenas vírgula)
        if (val === '' || val === ',') {
            return; // não atualiza o estado pai ainda
        }

        if (!isNaN(numericValue)) {
            onUpdate(numericValue);
        }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        setIsFocused(false);
        // Normaliza valor ao sair do campo
        const val = displayValue;
        if (val === '' || val === ',') {
            // Restaura visualmente o valor atual vindo do pai
            if (value !== undefined && value !== null) {
                setDisplayValue(String(value).replace('.', ','));
            } else {
                setDisplayValue('');
            }
            return;
        }
        const numericValue = parseFloat(val.replace(',', '.'));
        if (!isNaN(numericValue)) {
            // Garante sincronização final
            onUpdate(numericValue);
        }
    };

    const inputNode = (
        <Input
            id={id}
            type="text" // Use text to allow comma
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`${error ? 'border-red-500 focus:ring-red-400' : ''} ${isAiSuggested ? 'text-blue-400 font-bold' : ''} ${noWrapper ? (className || '') : ''}`}
            readOnly={readOnly}
            title={title}
        />
    );

    if (noWrapper) {
        return (
            <>
                {label && <Label htmlFor={id}>{label}</Label>}
                {inputNode}
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            </>
        );
    }

    return (
        <div className={className}>
            {label && <Label htmlFor={id}>{label}</Label>}
            {inputNode}
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
    );
}