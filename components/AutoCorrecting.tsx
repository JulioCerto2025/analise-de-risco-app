/**
 * AutoCorrecting components — separados do ui.tsx para evitar dependência circular
 * com geminiService (que tem imports pesados: @google/genai, constants, types, etc.)
 * Este arquivo importa apenas os componentes base de ui.tsx e a função correctText.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Input, Textarea, Label } from './ui';
import { correctText } from '../lib/geminiService';

// ── AutoCorrectingInput ──────────────────────────────────────────────────────
export const AutoCorrectingInput = ({
    id,
    label,
    value,
    onUpdate,
    placeholder,
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; onUpdate: (value: string) => void }) => {
    const [isCorrecting, setIsCorrecting] = useState(false);
    const wasCorrectedByApi = useRef(false);
    const [isCorrectionDisabled, setIsCorrectionDisabled] = useState(false);

    useEffect(() => {
        if (value === '') {
            wasCorrectedByApi.current = false;
            setIsCorrectionDisabled(false);
        }
    }, [value]);

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        if (isCorrectionDisabled || isCorrecting || !currentValue.trim()) return;
        setIsCorrecting(true);
        try {
            const correctedText = await correctText(currentValue);
            if (correctedText && correctedText !== currentValue) {
                onUpdate(correctedText);
                wasCorrectedByApi.current = true;
            }
        } finally {
            setIsCorrecting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (wasCorrectedByApi.current) {
            setIsCorrectionDisabled(true);
            wasCorrectedByApi.current = false;
        }
        onUpdate(newValue);
    };

    return (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative w-full">
                <Input
                    id={id}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`${isCorrecting ? 'pr-8' : ''} ${className}`}
                    {...props}
                />
                {isCorrecting && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-500" />
                )}
            </div>
        </div>
    );
};

// ── AutoCorrectingTextarea ───────────────────────────────────────────────────
export const AutoCorrectingTextarea = ({
    id,
    label,
    value,
    onUpdate,
    placeholder,
    className,
    rows = 5,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; onUpdate: (value: string) => void }) => {
    const [isCorrecting, setIsCorrecting] = useState(false);
    const wasCorrectedByApi = useRef(false);
    const [isCorrectionDisabled, setIsCorrectionDisabled] = useState(false);

    useEffect(() => {
        if (value === '') {
            wasCorrectedByApi.current = false;
            setIsCorrectionDisabled(false);
        }
    }, [value]);

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const currentValue = e.target.value;
        if (isCorrectionDisabled || isCorrecting || !currentValue.trim()) return;
        setIsCorrecting(true);
        try {
            const correctedText = await correctText(currentValue);
            if (correctedText && correctedText !== currentValue) {
                onUpdate(correctedText);
                wasCorrectedByApi.current = true;
            }
        } finally {
            setIsCorrecting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (wasCorrectedByApi.current) {
            setIsCorrectionDisabled(true);
            wasCorrectedByApi.current = false;
        }
        onUpdate(newValue);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative w-full">
                <Textarea
                    id={id}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${isCorrecting ? 'pr-8' : ''} ${className}`}
                    {...props}
                />
                {isCorrecting && (
                    <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-slate-500" />
                )}
            </div>
        </div>
    );
};
