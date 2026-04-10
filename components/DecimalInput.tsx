import * as React from 'react';
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
    useThousands?: boolean;
    currency?: boolean;
    currencySymbol?: string;
    min?: number;
    max?: number;
    blockScientific?: boolean;
}

export function DecimalInput({ id, label, value, onUpdate, placeholder, className, readOnly, title, isAiSuggested, noWrapper, useThousands, currency, currencySymbol, min, max, blockScientific }: DecimalInputProps) {
    const [displayValue, setDisplayValue] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    const formatNumber = (num: number | undefined | null) => {
        if (num === undefined || num === null || Number.isNaN(num)) return '';
        if (currency) {
            const formatted = num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 6 });
            return `${currencySymbol || 'R$'} ${formatted}`;
        }
        if (useThousands) {
            return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 6 });
        }
        return String(num).replace('.', ',');
    };

    React.useEffect(() => {
        // Atualiza visualização quando o prop muda, mas evita sobrescrever durante digitação ativa
        if (isFocused) return;
        if (value !== undefined && value !== null) {
            const currentNumericValue = parseFloat(displayValue.replace(',', '.'));
            if (isNaN(currentNumericValue) || currentNumericValue !== value) {
                setDisplayValue(formatNumber(value));
            }
        } else {
            setDisplayValue('');
        }
    }, [value, isFocused]);

    // Garantir que a digitação não se perca ao navegar: flush no unmount
    React.useEffect(() => {
        return () => {
            const val = displayValue;
            const numericValue = parseFloat(val
                .replace(/\s/g, '')
                .replace(/^R\$/, '')
                .replace(/R\$|\./g, '')
                .replace(',', '.'));
            if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
                try { onUpdate(numericValue); } catch { /* noop */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyBounds = (n: number) => {
        let r = n;
        if (typeof min === 'number') r = Math.max(min, r);
        if (typeof max === 'number') r = Math.min(max, r);
        return r;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        let val = e.target.value;
        if (blockScientific) {
            // Remove qualquer tentativa de notação científica
            val = val.replace(/[eE]/g, '');
        }

        // Libera digitação: aceita números com sinal, ponto ou vírgula
        setError(null);
        setDisplayValue(val);

        const sanitized = val
            .replace(/\s/g, '')
            .replace(/^R\$/, '')
            .replace(/R\$|\./g, '')
            .replace(',', '.');
        const numericValue = Number(sanitized);

        // Não bloqueia digitação; só atualiza quando for um número válido
        if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
            onUpdate(applyBounds(numericValue));
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
                setDisplayValue(formatNumber(value));
            } else {
                setDisplayValue('');
            }
            return;
        }
        const numericValue = parseFloat(val
            .replace(/\s/g, '')
            .replace(/^R\$/, '')
            .replace(/R\$|\./g, '')
            .replace(',', '.'));
        if (!isNaN(numericValue)) {
            // Garante sincronização final
            const bounded = applyBounds(numericValue);
            onUpdate(bounded);
            setDisplayValue(formatNumber(bounded));
        }
    };

    const inputNode = (
        <Input
            id={id}
            type="text"
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
