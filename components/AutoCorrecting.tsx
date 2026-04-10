/**
 * AutoCorrecting components — ISOLADOS para evitar dependência circular.
 * NÃO importa de './ui' (causaria ciclo: ui → AutoCorrecting → ui).
 * Usa elementos HTML nativos com as mesmas classes do design system.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { correctText } from '../lib/geminiService';

// Estilos inline (mesmas classes usadas em ui.tsx) — sem import de ui.tsx
const inputClass = 'flex h-10 w-full rounded-xl border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 !bg-[#0f172a]';
const textareaClass = 'flex min-h-[80px] w-full rounded-xl border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 !bg-[#0f172a]';
const labelClass = 'text-[10px] uppercase font-bold text-slate-500 tracking-wider';

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
            const corrected = await correctText(currentValue);
            if (corrected && corrected !== currentValue) {
                onUpdate(corrected);
                wasCorrectedByApi.current = true;
            }
        } finally {
            setIsCorrecting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (wasCorrectedByApi.current) {
            setIsCorrectionDisabled(true);
            wasCorrectedByApi.current = false;
        }
        onUpdate(e.target.value);
    };

    return (
        <div className="space-y-1">
            <label htmlFor={id} className={labelClass}>{label}</label>
            <div className="relative w-full">
                <input
                    id={id}
                    value={value as string}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    spellCheck={false}
                    lang="pt-BR"
                    className={`${inputClass} ${isCorrecting ? 'pr-8' : ''} ${className ?? ''}`}
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
            const corrected = await correctText(currentValue);
            if (corrected && corrected !== currentValue) {
                onUpdate(corrected);
                wasCorrectedByApi.current = true;
            }
        } finally {
            setIsCorrecting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (wasCorrectedByApi.current) {
            setIsCorrectionDisabled(true);
            wasCorrectedByApi.current = false;
        }
        onUpdate(e.target.value);
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className={labelClass}>{label}</label>
            <div className="relative w-full">
                <textarea
                    id={id}
                    value={value as string}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    rows={rows}
                    spellCheck={false}
                    lang="pt-BR"
                    className={`${textareaClass} ${isCorrecting ? 'pr-8' : ''} ${className ?? ''}`}
                    {...props}
                />
                {isCorrecting && (
                    <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-slate-500" />
                )}
            </div>
        </div>
    );
};
