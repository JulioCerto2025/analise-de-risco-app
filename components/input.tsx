/**
 * Arquivo isolado para o componente Input.
 * Mantido separado do ui.tsx para evitar dependências circulares no bundle de produção.
 */
import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, spellCheck, lang, ...props }, ref) => (
    <input
      className={`flex h-10 w-full rounded-xl border border-slate-600 bg-[#0f172a] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
      ref={ref}
      spellCheck={spellCheck ?? false}
      lang={lang ?? 'pt-BR'}
      {...props}
    />
  )
);
Input.displayName = 'Input';
