import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { formatSmartNumber } from '../lib/format';
import { ChevronDown, Check, Loader2, Info } from 'lucide-react';


// Contexto global para controlar o Modo Auditoria/Fiscalização
const AuditContext = React.createContext<{ 
    auditMode: boolean; 
    setAuditMode: (m: boolean) => void;
    activeTooltipId: string | null;
    setActiveTooltipId: (id: string | null) => void;
}>({ 
    auditMode: false, 
    setAuditMode: () => {},
    activeTooltipId: null,
    setActiveTooltipId: () => {}
});

export const AuditProvider = ({ value, children }: { value: any; children: React.ReactNode }) => (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
);

export const useAuditMode = () => React.useContext(AuditContext);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}
export const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
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
  <div className={`flex flex-col rounded-3xl border bg-slate-900/40 backdrop-blur-md text-slate-200 shadow-2xl border-slate-500/30 ${className}`} {...props} />
));
export const CardHeader = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1 p-4 py-3 bg-slate-900/80 text-white rounded-t-3xl border-b border-slate-700/50 ${className}`} {...props} />
));
export const CardTitle = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold leading-snug tracking-tight text-slate-100 ${className}`} {...props} />
));
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-4 ${className}`} {...props} />
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
      className={`flex h-10 w-full rounded-full border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 !bg-[#0f172a] ${className}`}
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
      className={`flex min-h-[80px] w-full rounded-3xl border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 !bg-[#0f172a] ${className}`}
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
  <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white" {...props} />
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
      onClick={(e) => { e.stopPropagation(); onCheckedChange(!checked); }}
      className={`peer h-4 w-4 shrink-0 rounded-lg border ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center cursor-pointer ${
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

const SelectContext = React.createContext<SelectContextType | null>(null);

export const Select = ({ children, value, onValueChange, placeholder, options: optionsProp, onOpenChange, wrapperClassName }: React.PropsWithChildren<{ value?: string | number; onValueChange?: (value: string) => void; placeholder?: string; options?: { value: any, label: string }[], onOpenChange?: (open: boolean) => void, wrapperClassName?: string }>) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');
  const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const options = optionsProp || [];

  const [searchQuery, setSearchQuery] = React.useState('');
  const searchTimeoutRef = React.useRef<number | null>(null);

  const handleSetOpen = (newOpenState: boolean) => {
      setOpen(newOpenState);
      if (onOpenChange) {
          onOpenChange(newOpenState);
      }
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within a Select");
    const setRefs = (node: HTMLButtonElement | null) => {
      if (!node) return;
      context.triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in (ref as any)) (ref as any).current = node;
    }
    
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .force-rounded { border-radius: 9999px !important; overflow: hidden !important; }
                .force-rounded * { border-radius: 9999px !important; }
            `}} />
            <button 
                ref={setRefs} 
                type="button" 
                onClick={() => context.setOpen(!context.open)} 
                onKeyDown={context.handleKeyDown}
                style={{ borderRadius: '9999px', overflow: 'hidden' }}
                className={`flex h-10 w-full items-center justify-between gap-2 force-rounded border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
                {...props}
            >
                <div className="flex-1 min-w-0 truncate text-left" style={{ borderRadius: '9999px' }}>
                    {children}
                </div>
                {!hideChevron && <ChevronDown className="h-4 w-4 opacity-70 flex-shrink-0 ml-1" />}
            </button>
        </>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = () => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within a Select");
    
    const selectedOption = context.options.find(opt => String(opt.value) === String(context.value));
    const labelToShow = context.selectedLabel ?? selectedOption?.label;

    const displayContent = labelToShow ? (
        <span className="flex-1 min-w-0 truncate text-left">{labelToShow}</span>
    ) : (
        <span className="flex-1 min-w-0 text-slate-400 text-left truncate">{context.placeholder}</span>
    );

    return displayContent;
};

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context || !context.open) return null;
  const rect = context.triggerRef.current?.getBoundingClientRect();
  const left = (rect?.left || 0) + window.scrollX;
  const topBelow = (rect?.bottom || 0) + window.scrollY + 4;
  const width = rect?.width || undefined;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<'below' | 'above'>('below');
  const [computedTop, setComputedTop] = React.useState<number>(topBelow);
  const [availableHeight, setAvailableHeight] = React.useState<number>(Math.floor(window.innerHeight * 0.6));

  React.useEffect(() => {
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
      <div ref={setPortalRef} style={{ position: 'fixed', left, top: computedTop, width, transform: position === 'above' ? 'translateY(-100%)' : 'none' }} className={`z-[1000] min-w-[12rem] max-w-[56rem] rounded-2xl border bg-slate-800/90 backdrop-blur-lg text-slate-200 shadow-md animate-in fade-in-80 border-slate-600 ${className}`}>
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
  React.HTMLAttributes<HTMLDivElement> & { value: string | number; label: string; showRightValue?: boolean, rightText?: string }
>(({ label, value, showRightValue = false, rightText, className, ...props }, ref) => {
  const context = React.useContext(SelectContext);
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
        {showRightValue && !isValueRedundant && (
            <span className="font-medium text-blue-400">{rightText ?? String(value)}</span>
        )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";


// AutoCorrectingInput and AutoCorrectingTextarea are now in ./AutoCorrecting.tsx
// Re-exported above (line 5) for backward compatibility.

// Autocomplete Input (typeahead)
export const AutocompleteInput = ({ id, label, value, onUpdate, onCommit, suggestions, placeholder, className, maxSuggestions = 8, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, onUpdate: (value: string) => void, onCommit?: (value: string) => void, suggestions: string[], maxSuggestions?: number }) => {
    const [open, setOpen] = React.useState(false);
    const [filtered, setFiltered] = React.useState<string[]>([]);
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
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
        <div className="space-y-1" ref={containerRef}>
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

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}
export const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children, className }) => (
    <button
        onClick={onClick}
        className={`px-3 sm:px-6 py-2 sm:py-2.5 text-[9px] sm:text-[12px] font-black uppercase tracking-widest rounded-full transition-all duration-300 flex-1 whitespace-nowrap min-w-[70px] sm:min-w-[100px] border ${
            isActive 
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]' 
                : 'bg-slate-800/40 text-slate-400 border-white/5 hover:bg-slate-700/60 hover:text-slate-200'
        } ${className || ''}`}
    >
        {children}
    </button>
);


export const FormulaTooltip = ({ formulas, values, children, className = "inline-block", triggerClassName = "cursor-default inline-block" }: { formulas: { [key: string]: string }, values?: { [key: string]: any }, children?: React.ReactNode, className?: string, triggerClassName?: string }) => {
    const { auditMode, activeTooltipId, setActiveTooltipId } = useAuditMode();
    const tooltipId = React.useId();
    const isOpen = activeTooltipId === tooltipId;
    
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLSpanElement>(null);
    const portalRef = React.useRef<HTMLDivElement>(null);

    const dragControls = useDragControls();

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;
            const isClickInsideTrigger = containerRef.current && containerRef.current.contains(event.target as Node);
            const isClickInsidePortal = portalRef.current && portalRef.current.contains(event.target as Node);
            
            if (!isClickInsideTrigger && !isClickInsidePortal) {
                setActiveTooltipId(null);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setActiveTooltipId]);

    const handleMouseEnter = () => {
        // Agora o painel é persistente. Só abre no clique.
    };

    const handleMouseLeave = () => {
        // Agora o painel é persistente. Só fecha no clique fora.
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOpen) {
            setActiveTooltipId(null);
        } else {
            setActiveTooltipId(tooltipId);
        }
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
        const normFunc = (s: string) => s
            .replace(/\*/g, ' × ')
            .replace(/×/g, ' × ')
            .replace(/\+/g, ' + ')
            .replace(/\)\(/g, ') × (')
            .replace(/([0-9])\(/g, '$1 × (')
            .replace(/\)([0-9A-Za-zπ])/g, ') × $1');
        const normalized = normFunc(formula);
        const segments = normalized.split(/\s*\+\s*/);
        const renderSegment = (seg: string, segIdx: number) => {
            const scanRegex = new RegExp(`\\b(${varKeys.join('|')})\\b`, 'gi');
            const localParts: React.ReactNode[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = scanRegex.exec(seg)) !== null) {
                const varName = match[0];
                const start = match.index;
                if (start > lastIndex) {
                    localParts.push(<span key={`t-${segIdx}-${lastIndex}`}>{seg.slice(lastIndex, start)}</span>);
                }
                const val = (values as any)[varName] ?? (values as any)[varName.toLowerCase()] ?? (values as any)[varName.toUpperCase()];
                localParts.push(<span key={`v-${segIdx}-${start}`}>{formatNumberNode(val)}</span>);
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
        const normFunc = (s: string) => s
            .replace(/\*/g, ' × ')
            .replace(/×/g, ' × ')
            .replace(/\+/g, ' + ')
            .replace(/\)\(/g, ') × (')
            .replace(/([0-9])\(/g, '$1 × (')
            .replace(/\)([0-9A-Za-zπ])/g, ') × $1');
        const normalized = normFunc(formula);
        const segs = normalized.split(/\s*\+\s*/);
        const nodes: React.ReactNode[] = [];
        segs.forEach((seg, idx) => {
            nodes.push(<span key={`pf-${idx}`} className="inline-flex items-baseline whitespace-nowrap">{seg}</span>);
            if (idx < segs.length - 1) nodes.push(<span key={`pf-plus-${idx}`} className="mx-0.5">+</span>);
        });
        return <span className="break-normal whitespace-normal">{nodes}</span>;
    };
    
    const isMobile = useIsMobile();
    
    return (
        <span className={className} ref={containerRef}>
            {children && (
                <span 
                    ref={triggerRef} 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave} 
                    onClick={handleToggle} 
                    className={triggerClassName}
                >
                    {children}
                </span>
            )}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && !isMobile && auditMode && (
                        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 backdrop-blur-[4px] pointer-events-none" 
                            />
                            
                            {/* Tooltip Panel */}
                            <motion.div 
                                ref={portalRef}
                                drag
                                dragControls={dragControls}
                                dragListener={false}
                                dragMomentum={false}
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                style={{ 
                                    position: 'fixed',
                                    right: `24px`,
                                    top: `80px`,
                                    width: 'min(90vw, 540px)',
                                    zIndex: 9999
                                }}
                                className="p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-visible pointer-events-auto select-none"
                            >
                                <div 
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 drag-handle cursor-move touch-none"
                                >
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px] flex-1">Memória de Cálculo Editorial</p>
                                    <div className="text-slate-500 text-[8px] font-bold uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded-full">Arraste para mover</div>
                                </div>
                                
                                <ul className="space-y-8 select-text pr-2">
                                    {Object.entries(formulas).map(([key, formula]) => {
                                        const populated = renderFormulaWithValues(formula);
                                        const valValue = (values as any)?.[key];
                                        const valueNode = values && (key in (values || {}) || key.toLowerCase() in (values || {}) || key.toUpperCase() in (values || {})) 
                                            ? formatNumberNode(Number(valValue || (values as any)?.[key.toLowerCase()] || (values as any)?.[key.toUpperCase()]) || 0) 
                                            : null;
                                            
                                        return (
                                            <li key={key} className="space-y-4">
                                                {/* Valor */}
                                                {valueNode && (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-[10px] uppercase font-black text-blue-500/70 tracking-widest">Resultado</span>
                                                        <p className="text-blue-400 font-mono font-black text-lg">Valor: <span className="align-baseline">{valueNode}</span></p>
                                                    </div>
                                                )}
                                                {/* Fórmula */}
                                                <div className="space-y-1.5">
                                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Fórmula (Variáveis):</p>
                                                    <div className="font-mono bg-slate-900/40 p-4 rounded-2xl text-slate-200 text-xs sm:text-base leading-relaxed border border-white/5 shadow-inner">
                                                        <span className="align-baseline font-bold text-blue-300/90">{key}</span>
                                                        <span className="mx-2 text-slate-500">=</span>
                                                        {renderPlainFormulaSegments(formula)}
                                                    </div>
                                                </div>
                                                {/* Valores */}
                                                {populated && (
                                                    <div className="space-y-1.5">
                                                        <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Aplicação de Valores:</p>
                                                        <div className="font-mono bg-blue-500/5 p-4 rounded-2xl text-blue-100 text-xs sm:text-base leading-relaxed border border-blue-500/20 shadow-inner">
                                                            <span className="align-baseline font-bold text-blue-400">{key}</span>
                                                            <span className="mx-2 text-blue-900/50">=</span>
                                                            {populated}
                                                            <span className="mx-2 text-blue-400/50">=</span>
                                                            <span className="text-blue-400 font-bold">{valueNode}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                                
                                <div 
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="mt-8 pt-4 border-t border-white/5 flex justify-center drag-handle cursor-move touch-none"
                                >
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">NBR 5419-2:2026 Audit Ready</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </span>
    );
};

// Detecta se a viewport é mobile (<640px)
export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
};
export const InfoTooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const { auditMode } = useAuditMode();
    const portalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideTrigger = triggerRef.current && triggerRef.current.contains(event.target as Node);
            const isClickInsidePortal = portalRef.current && portalRef.current.contains(event.target as Node);
            if (!isClickInsideTrigger && !isClickInsidePortal) setIsOpen(false);
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);
    return (
        <div className="relative inline-block" ref={triggerRef} onMouseEnter={() => setIsOpen(true)}>
            {children}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && !isMobile && auditMode && (
                        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" 
                            />
                            <motion.div 
                                ref={portalRef}
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                className="fixed right-6 top-[100px] w-[min(90vw,400px)] p-6 bg-slate-800/98 border border-blue-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-[9999] pointer-events-auto"
                            >
                                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <p className="font-black text-slate-100 uppercase tracking-[0.2em] text-[10px]">Informação Técnica</p>
                                </div>
                                <div className="text-sm leading-relaxed text-slate-300 font-medium">
                                    {text}
                                </div>
                                <div className="mt-6 pt-3 border-t border-white/5 flex justify-center">
                                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em]">NBR 5419-2:2026 Audit Ready</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
