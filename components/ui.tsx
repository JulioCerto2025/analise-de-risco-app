import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { formatSmartNumber } from '../lib/format';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { correctText } from '../lib/geminiService';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}
export const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-slate-500 bg-slate-800/50 text-slate-200 hover:bg-slate-700/70",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      icon: "h-8 w-8",
    };
    return <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} ref={ref} {...props} />;
  }
));
Button.displayName = "Button";

// Card
export const Card = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col rounded-xl border bg-slate-900/60 text-slate-200 shadow-2xl border-slate-500/50 ${className}`} {...props} />
));
export const CardHeader = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 bg-slate-900/80 text-white rounded-t-xl ${className}`} {...props} />
));
export const CardTitle = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-slate-100 ${className}`} {...props} />
));
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props} />
);

// Progress
export const Progress = ({ value, className }: { value: number, className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-700 ${className}`}>
    <div
      className="h-full w-full flex-1 bg-blue-600 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, spellCheck, lang, ...props }, ref) => (
    <input
      className={`flex h-10 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      spellCheck={spellCheck ?? false}
      lang={lang ?? 'pt-BR'}
      {...props}
    />
  )
);
Input.displayName = "Input";

// Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, spellCheck, lang, ...props }, ref) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      spellCheck={spellCheck ?? false}
      lang={lang ?? 'pt-BR'}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// Label
export const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300" {...props} />
);

// Checkbox
export const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { checked: boolean; onCheckedChange: (checked: boolean) => void }
>(({ checked, onCheckedChange, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`peer h-4 w-4 shrink-0 rounded-lg border ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center ${
        checked ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent border-slate-500'
      } ${className}`}
      {...props}
    >
      {checked && <Check className="h-4 w-4 p-0.5" />}
    </button>
  );
});
Checkbox.displayName = "Checkbox";


// Alert
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive';
};
export const Alert = ({ className, variant, ...props }: AlertProps) => {
    const variantClasses = variant === 'destructive' 
        ? 'border-red-600/50 bg-red-900/40 text-red-200' 
        : '';
    return (
        <div 
            className={`relative w-full rounded-xl border p-4 ${variantClasses} ${className}`} 
            {...props} 
        />
    );
};
export const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />
);
export const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={`text-sm ${className}`} {...props} />
);

// Select
interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | number;
  setValue: (value: string | number) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: any, label: string }[];
  handleKeyDown: (e: React.KeyboardEvent) => void;
  selectedLabel?: string;
  setSelectedLabel?: (label: string | undefined) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const SelectContext = createContext<SelectContextType | null>(null);

export const Select = ({ children, value, onValueChange, placeholder, options: optionsProp, onOpenChange, wrapperClassName }: React.PropsWithChildren<{ value?: string | number; onValueChange?: (value: string) => void; placeholder?: string; options?: { value: any, label: string }[], onOpenChange?: (open: boolean) => void, wrapperClassName?: string }>) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const options = optionsProp || [];

  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<number | null>(null);

  const handleSetOpen = (newOpenState: boolean) => {
      setOpen(newOpenState);
      if (onOpenChange) {
          onOpenChange(newOpenState);
      }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      const target = event.target as Node | null;
      const inWrapper = !!(ref.current && target && ref.current.contains(target));
      const inContent = !!(contentRef.current && target && contentRef.current.contains(target));
      if (!inWrapper && !inContent) {
        handleSetOpen(false);
      }
    };
    // Usar 'click' para permitir que o onClick do item dispare antes
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, [ref]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
      // Reset selected label when value is externally controlled
      setSelectedLabel(undefined);
    }
  }, [value]);
  
  const handleValueChange = (val: string | number) => {
      setInternalValue(val);
      if(onValueChange) onValueChange(String(val));
      handleSetOpen(false);
  }
  
  const handleTypeAhead = (val: string | number) => {
      setInternalValue(val);
      if(onValueChange) onValueChange(String(val));
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        handleSetOpen(true);
      }
      return;
    }

    // When open
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        handleSetOpen(false);
        break;
      case 'Enter':
        e.preventDefault();
        // The value is already updated by typing, so just close.
        handleSetOpen(false);
        break;
      default:
        if (e.key.length === 1 && e.key.match(/^[a-z0-9 ]$/i)) {
          e.preventDefault();
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }

          const newQuery = (searchQuery + e.key).toLowerCase();
          setSearchQuery(newQuery);

          const matchedOption = options.find(option => 
            option.label.toLowerCase().startsWith(newQuery) || 
            String(option.value).toLowerCase().startsWith(newQuery)
          );

          if (matchedOption) {
            handleTypeAhead(matchedOption.value);
          }

          searchTimeoutRef.current = window.setTimeout(() => {
            setSearchQuery('');
          }, 800);
        }
        break;
    }
  };

  return (
    <SelectContext.Provider value={{ open, setOpen: handleSetOpen, value: internalValue, setValue: handleValueChange, onValueChange, placeholder, options: options || [], handleKeyDown, selectedLabel, setSelectedLabel, triggerRef, contentRef }}>
      <div className={wrapperClassName || "relative"} ref={ref}>{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { hideChevron?: boolean }
>(({ children, className, hideChevron, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within a Select");
    const setRefs = (node: HTMLButtonElement | null) => {
      if (!node) return;
      context.triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in (ref as any)) (ref as any).current = node;
    }
    
    return (
        <button 
        ref={setRefs} 
        type="button" 
        onClick={() => context.setOpen(!context.open)} 
        onKeyDown={context.handleKeyDown}
        className={`flex h-10 w-full items-center justify-between rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
        {...props}
        >
        {children}
        {!hideChevron && <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />}
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = () => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within a Select");
    
    const selectedOption = context.options.find(opt => String(opt.value) === String(context.value));
    const labelToShow = context.selectedLabel ?? selectedOption?.label;

    const displayContent = labelToShow ? (
        <span className="truncate text-left flex-1">{labelToShow}</span>
    ) : (
        <span className="text-slate-400 text-left flex-1">{context.placeholder}</span>
    );

    return displayContent;
};

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className }, ref) => {
  const context = useContext(SelectContext);
  if (!context || !context.open) return null;
  const rect = context.triggerRef.current?.getBoundingClientRect();
  const left = (rect?.left || 0) + window.scrollX;
  const topBelow = (rect?.bottom || 0) + window.scrollY + 4;
  const width = rect?.width || undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<'below' | 'above'>('below');
  const [computedTop, setComputedTop] = React.useState<number>(topBelow);
  const [availableHeight, setAvailableHeight] = React.useState<number>(Math.floor(window.innerHeight * 0.6));

  useEffect(() => {
    const recalc = () => {
      const r = context.triggerRef.current?.getBoundingClientRect();
      const leftY = (r?.top || 0) + window.scrollY;
      const belowY = (r?.bottom || 0) + window.scrollY + 4;
      const spaceBelow = window.innerHeight - (r?.bottom || 0);
      const spaceAbove = (r?.top || 0);
      const shouldOpenAbove = spaceBelow < 220 && spaceAbove > spaceBelow;
      setPosition(shouldOpenAbove ? 'above' : 'below');
      setComputedTop(shouldOpenAbove ? leftY - 4 : belowY);
      const avail = shouldOpenAbove ? spaceAbove - 12 : spaceBelow - 12;
      setAvailableHeight(Math.max(160, Math.min(Math.floor(window.innerHeight * 0.7), Math.floor(avail))));
    };
    recalc();
    window.addEventListener('resize', recalc);
    window.addEventListener('scroll', recalc, { passive: true });
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('scroll', recalc);
    };
  }, [context.open]);

  // Expor a referência do conteúdo para o handler de clique externo
  const setPortalRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    context.contentRef.current = node;
    if (typeof ref === 'function') ref(node as any);
    else if (ref && 'current' in (ref as any)) (ref as any).current = node;
  };
  
  return createPortal(
      <div ref={setPortalRef} style={{ position: 'fixed', left, top: computedTop, width, transform: position === 'above' ? 'translateY(-100%)' : 'none' }} className={`z-[1000] min-w-[12rem] max-w-[56rem] rounded-xl border bg-slate-800/90 backdrop-blur-lg text-slate-200 shadow-md animate-in fade-in-80 border-slate-600 ${className}`}>
          <div ref={containerRef} className="p-1 overflow-auto" style={{ maxHeight: availableHeight }}>
              {children}
          </div>
      </div>,
      document.body
  );
});
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string | number; label: string; showRightValue?: boolean }
>(({ label, value, showRightValue = false, className, ...props }, ref) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within a Select");
  
  const handleClick = () => {
    context.setValue(value);
    if (context.setSelectedLabel) {
      context.setSelectedLabel(label);
    }
  };

  const selectedOption = context.options.find(opt => String(opt.value) === String(context.value));
  const isSelected = (context.selectedLabel ? context.selectedLabel === label : (selectedOption ? selectedOption.label === label : false));
  const isValueRedundant = String(value) === String(label);

  const justifyClass = showRightValue && !isValueRedundant ? 'justify-between' : 'justify-start';

  return (
    <div 
        ref={ref} 
        onClick={handleClick} 
        className={`relative flex w-full cursor-pointer select-none items-center ${justifyClass} rounded-lg py-1.5 px-3 text-sm outline-none focus:bg-slate-700/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-700/80 ${isSelected ? 'bg-slate-700/80' : ''} ${className}`}
        {...props}
    >
        <div className="flex items-center">
            {isSelected ? (
                <Check className="h-4 w-4" />
            ) : (
                <div className="h-4 w-4" /> // Placeholder for alignment
            )}
            <span className="ml-2 whitespace-normal break-words">{label}{isValueRedundant ? '' : ':'}</span>
        </div>
        {showRightValue && !isValueRedundant && <span className="font-medium text-blue-400">{String(value)}</span>}
    </div>
  );
});
SelectItem.displayName = "SelectItem";


export const AutoCorrectingInput = ({ id, label, value, onUpdate, placeholder, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, onUpdate: (value: string) => void }) => {
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
        if (isCorrectionDisabled || isCorrecting || !currentValue.trim()) {
            return;
        }

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
        <div className="space-y-2">
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

// Auto-correcting Textarea
export const AutoCorrectingTextarea = ({ id, label, value, onUpdate, placeholder, className, rows = 5, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, onUpdate: (value: string) => void }) => {
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
        if (isCorrectionDisabled || isCorrecting || !currentValue.trim()) {
            return;
        }

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

// Autocomplete Input (typeahead)
export const AutocompleteInput = ({ id, label, value, onUpdate, onCommit, suggestions, placeholder, className, maxSuggestions = 8, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, onUpdate: (value: string) => void, onCommit?: (value: string) => void, suggestions: string[], maxSuggestions?: number }) => {
    const [open, setOpen] = useState(false);
    const [filtered, setFiltered] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normalizedSuggestions = React.useMemo(() => {
        return suggestions.map(s => ({ norm: normalize(String(s)), value: String(s) }));
    }, [suggestions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onUpdate(newValue);
        const q = normalize(newValue);
        if (!q) {
            setFiltered([]);
            setOpen(false);
            setActiveIndex(-1);
            return;
        }
        const next = normalizedSuggestions
            .filter(s => s.norm.includes(q))
            .slice(0, maxSuggestions)
            .map(s => s.value);
        setFiltered(next);
        setOpen(next.length > 0);
        setActiveIndex(next.length ? 0 : -1);
    };

    const handleSelect = (item: string) => {
        onUpdate(item);
        if (onCommit) onCommit(item);
        setOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Se houver sugestões abertas, seleciona a ativa; senão, comita o valor atual
            const choice = open ? filtered[activeIndex >= 0 ? activeIndex : 0] : undefined;
            if (choice) {
                handleSelect(String(choice));
            } else if (onCommit) {
                onCommit(String(value || ''));
                setOpen(false);
                setActiveIndex(-1);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            setActiveIndex(-1);
        } else if (e.key === 'ArrowDown') {
            if (!open) return;
            e.preventDefault();
            setActiveIndex(prev => Math.min((prev < 0 ? 0 : prev) + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            if (!open) return;
            e.preventDefault();
            setActiveIndex(prev => Math.max((prev < 0 ? filtered.length - 1 : prev) - 1, 0));
        }
    };

    return (
        <div className="space-y-2" ref={containerRef}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative w-full">
                <Input
                    id={id}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`${className}`}
                    {...props}
                />
                {open && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/95 shadow-xl max-h-48 overflow-auto">
                        {filtered.map((item, idx) => (
                            <div
                                key={`${id}-${item}`}
                                onMouseDown={(e) => { e.preventDefault(); }}
                                onClick={() => handleSelect(String(item))}
                                className={`px-3 py-2 text-sm text-slate-100 cursor-pointer ${idx === activeIndex ? 'bg-slate-700/70' : 'hover:bg-slate-700/70'}`}
                            >
                                {String(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Tab Button
interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}
export const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex-1 ${
            isActive ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80'
        }`}
    >
        {children}
    </button>
);


export const FormulaTooltip = ({ formulas, values, children }: { formulas: { [key: string]: string }, values?: { [key: string]: any }, children?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    
    const updateStyleFromTrigger = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const newStyle: React.CSSProperties = {
            position: 'fixed',
            zIndex: 100,
        };
        const tooltipMaxWidth = 320;
        const tooltipMaxHeight = 300;
        const viewportPadding = 8;
        if (rect.left + tooltipMaxWidth > window.innerWidth - viewportPadding) {
            newStyle.right = `${window.innerWidth - rect.right}px`;
        } else {
            newStyle.left = `${rect.left}px`;
        }
        if (rect.bottom + tooltipMaxHeight > window.innerHeight - viewportPadding) {
            newStyle.bottom = `${window.innerHeight - rect.top + viewportPadding}px`;
        } else {
            newStyle.top = `${rect.bottom + viewportPadding}px`;
        }
        setStyle(newStyle);
    };

    const handleMouseEnter = () => {
        updateStyleFromTrigger();
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (!isOpen) updateStyleFromTrigger();
        setIsOpen(!isOpen);
    };

    // Componente local para notação científica em base 10 com duas casas
    const ScientificNotation = ({ value, precision = 2 }: { value: number; precision?: number }) => {
        if (value === 0 || !isFinite(value)) return <span>0</span>;
        const [mantissa, exponent] = value.toExponential(precision).split('e');
        return (
            <span className="font-mono tracking-tight whitespace-nowrap" dangerouslySetInnerHTML={{ __html: `${mantissa.replace('.', ',')} &times; 10<sup>${exponent}</sup>` }} />
        );
    };

    const formatNumberNode = (value: any): React.ReactNode => {
        if (typeof value !== 'number') return <span>{String(value)}</span>;
        if (value === 0) return <span>0</span>;
        const abs = Math.abs(value);
        if (abs < 0.001) return <ScientificNotation value={value} precision={2} />;
        const maxDecimals = (
            abs >= 1000 ? 0 :
            abs >= 100 ? 1 :
            abs >= 1 ? 2 :
            3
        );
        return <span className="font-mono">{formatSmartNumber(Number(value), { maxDecimals, useScientificBelow: 0.001 })}</span>;
    };

    // Renderiza "Valores" com substituição das variáveis, quebrando somente em '+' e nunca dentro de multiplicações
    const renderFormulaWithValues = (formula: string): React.ReactNode => {
        if (!values || Object.keys(values).length === 0) return null;
        const varKeys = Object.keys(values);
        const normalize = (s: string) => s
            .replace(/\*/g, ' × ')
            .replace(/×/g, ' × ')
            .replace(/\+/g, ' + ')
            .replace(/\)\(/g, ') × (')
            .replace(/([0-9])\(/g, '$1 × (')
            .replace(/\)([0-9A-Za-zπ])/g, ') × $1');
        const normalized = normalize(formula);
        const segments = normalized.split(/\s*\+\s*/);
        const renderSegment = (seg: string, segIdx: number) => {
            const scanRegex = new RegExp(`\\b(${varKeys.join('|')})\\b`, 'g');
            const localParts: React.ReactNode[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = scanRegex.exec(seg)) !== null) {
                const [varName] = match;
                const start = match.index;
                if (start > lastIndex) {
                    localParts.push(<span key={`t-${segIdx}-${lastIndex}`}>{seg.slice(lastIndex, start)}</span>);
                }
                localParts.push(<span key={`v-${segIdx}-${start}`}>{formatNumberNode(values[varName])}</span>);
                lastIndex = start + varName.length;
            }
            if (lastIndex < seg.length) {
                localParts.push(<span key={`t-${segIdx}-end`}>{seg.slice(lastIndex)}</span>);
            }
            return <span key={`seg-${segIdx}`} className="inline-flex items-baseline whitespace-nowrap">{localParts}</span>;
        };
        const nodes: React.ReactNode[] = [];
        segments.forEach((seg, idx) => {
            nodes.push(renderSegment(seg, idx));
            if (idx < segments.length - 1) nodes.push(<span key={`plus-${idx}`} className="mx-0.5">+</span>);
        });
        return <span className="break-normal whitespace-normal">{nodes}</span>;
    };

    // Renderiza a fórmula crua em segmentos que só quebram entre '+'
    const renderPlainFormulaSegments = (formula: string): React.ReactNode => {
        const normalized = (
            formula
                .replace(/\*/g, ' × ')
                .replace(/×/g, ' × ')
                .replace(/\+/g, ' + ')
                .replace(/\)\(/g, ') × (')
                .replace(/([0-9])\(/g, '$1 × (')
                .replace(/\)([0-9A-Za-zπ])/g, ') × $1')
        );
        const segs = normalized.split(/\s*\+\s*/);
        const nodes: React.ReactNode[] = [];
        segs.forEach((seg, idx) => {
            nodes.push(<span key={`pf-${idx}`} className="inline-flex items-baseline whitespace-nowrap">{seg}</span>);
            if (idx < segs.length - 1) nodes.push(<span key={`pf-plus-${idx}`} className="mx-0.5">+</span>);
        });
        return <span className="break-normal whitespace-normal">{nodes}</span>;
    };
    
    return (
        <span className="hidden sm:inline-block ml-1 align-middle w-full" ref={containerRef}>
            {children && (
                <span ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleToggle} className="cursor-default inline-block w-full">
                    {children}
                </span>
            )}
            {isOpen && (
                <div 
                    style={style}
                    className={`w-auto min-w-[18rem] max-w-[48rem] p-3 bg-slate-800/90 border rounded-lg shadow-lg text-sm border-slate-600 backdrop-blur-sm animate-in fade-in-80`}
                    
                >
                    <p className="font-bold mb-3 text-base">Fórmulas Utilizadas</p>
                    <ul className="space-y-4">
                        {Object.entries(formulas).map(([key, formula]) => {
                            const populated = renderFormulaWithValues(formula);
                            const valueNode = values && key in (values || {}) ? formatNumberNode(Number((values as any)[key]) || 0) : null;
                            return (
                                <li key={key} className="space-y-2">
                                    {/* Valor */}
                                    {valueNode && (
                                        <p className="text-blue-400 font-mono">{`Valor:`} <span className="align-baseline">{valueNode}</span></p>
                                    )}
                                    {/* Fórmula */}
                                    <div>
                                        <p className="text-slate-300">Fórmula:</p>
                                        <code className="font-mono bg-slate-700 p-2 rounded-lg block text-white break-normal whitespace-normal text-xs sm:text-sm leading-tight">
                                            <span className="align-baseline">{key} = {renderPlainFormulaSegments(formula)}</span>
                                        </code>
                                    </div>
                                    {/* Valores */}
                                    {populated && (
                                        <div>
                                            <p className="text-slate-300">Valores:</p>
                                            <code className="font-mono bg-slate-900 p-2 rounded-lg block text-white break-normal whitespace-normal text-xs sm:text-sm leading-tight">
                                                <span className="align-baseline">{key} = {populated}</span>
                                            </code>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </span>
    );
};

// Detecta se a viewport é mobile (<640px)
export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
};
