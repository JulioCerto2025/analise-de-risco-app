import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Helper to parse YYYY-MM-DD string into a Date object, accounting for timezone
const parseDate = (dateString: string): Date => {
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent date shifts
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
};

const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface DatePickerProps {
    value: string; // Expects YYYY-MM-DD
    onChange: (value: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Use memoization to avoid re-parsing the date on every render
    const selectedDate = useMemo(() => value ? parseDate(value) : new Date(), [value]);
    const [viewDate, setViewDate] = useState(selectedDate);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close the date picker when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync the calendar view with the selected date when it changes from the parent
    useEffect(() => {
        setViewDate(selectedDate);
    }, [selectedDate]);

    // Calculate the grid for the current month view
    const calendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const grid: (number | null)[] = [];
        // Add padding for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(null);
        }
        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(i);
        }
        return grid;
    }, [viewDate]);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(formatDate(newDate));
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const setToday = () => {
        const today = new Date();
        setViewDate(today);
        onChange(formatDate(today));
        setIsOpen(false);
    };
    
    // The "Limpar" button closes the picker as per user request's screenshot context
    const clearAndClose = () => {
        setIsOpen(false);
    };

    const displayValue = useMemo(() => {
        try {
            return selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return "Selecione uma data";
        }
    }, [selectedDate]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span>{displayValue}</span>
                <Calendar className="h-4 w-4 text-slate-400" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[280px] rounded-xl border bg-slate-900/80 backdrop-blur-lg text-slate-200 shadow-2xl border-slate-500/50"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} className="h-8 w-8">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold text-base">
                                    {MONTH_NAMES[viewDate.getMonth()]} de {viewDate.getFullYear()}
                                </span>
                                <Button variant="outline" size="icon" onClick={() => changeMonth(1)} className="h-8 w-8">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 mb-2">
                                {WEEK_DAYS.map((day, i) => <div key={i}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {calendarGrid.map((day, i) => (
                                    <div key={i} className="relative w-full" style={{ paddingTop: '100%' }}>
                                        {day && (
                                            <button
                                                onClick={() => handleDateSelect(day)}
                                                className={`absolute inset-0 flex items-center justify-center rounded-lg text-sm transition-colors
                                                ${
                                                    selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear()
                                                        ? 'bg-blue-600 text-white font-bold'
                                                        : 'hover:bg-slate-700/70'
                                                }
                                                ${
                                                    new Date().getDate() === day && new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear() && !(selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear())
                                                        ? 'border border-blue-400'
                                                        : ''
                                                }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-600/50">
                                <Button variant="outline" size="sm" onClick={clearAndClose}>Limpar</Button>
                                <Button variant="outline" size="sm" onClick={setToday}>Hoje</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
