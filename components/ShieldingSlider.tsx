import React from 'react';
import { Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui';

interface ShieldingSliderProps {
    isShielded: boolean;
    rsValue: number;
    onChange: (isShielded: boolean, newRsValue: number) => void;
}

// O valor 'value' corresponde ao limite superior da faixa de resistência.
// Um valor especial de 0 é usado para 'Não Blindada'.
const rsOptions = [
    { value: 0, label: 'Não Blindada' },
    { value: 1, label: 'Rs ≤ 1 Ω/km' },
    { value: 5, label: '1 < Rs ≤ 5 Ω/km' },
    { value: 20, label: '5 < Rs ≤ 20 Ω/km' },
];


// Determina o valor a ser exibido no seletor com base no estado atual.
const getSelectedValue = (isShielded: boolean, rs: number): number => {
    if (!isShielded) {
        return 0; // Valor para 'Não Blindada'
    }
    if (rs <= 1) return 1;
    if (rs <= 5) return 5;
    return 20;
};

export const ShieldingSlider: React.FC<ShieldingSliderProps> = ({
    isShielded,
    rsValue,
    onChange,
}) => {
    const selectedValue = getSelectedValue(isShielded, rsValue);

    const handleValueChange = (v: string) => {
        const numericValue = parseFloat(v);
        if (numericValue === 0) { // 'Não Blindada' foi selecionada
            onChange(false, 20); 
        } else {
            onChange(true, numericValue);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Blindagem e Resistência (Rs)</Label>
            <Select
                value={String(selectedValue)}
                onValueChange={handleValueChange}
                options={rsOptions}
            >
                <SelectTrigger className="w-full bg-slate-950/70">
                     <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {rsOptions.map(opt => (
                        <SelectItem key={opt.value} value={String(opt.value)} label={opt.label} />
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};