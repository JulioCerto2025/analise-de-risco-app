/**
 * Converte markdown para HTML para preview do relatório e exportação Word/PDF.
 * Mantido em arquivo separado para compatibilidade com o Fast Refresh do Vite.
 */
export const markdownToHtml = (md: string, prefs: any): string => {
    const isWord = prefs.isWord || false;
    const textColor = isWord ? '#000000' : '#f8fafc';
    const headerColor = isWord ? '#000000' : '#3b82f6';
    const subheaderColor = isWord ? '#1e3a8a' : '#60a5fa';
    const borderColor = isWord ? '#000000' : 'rgba(148,163,184,0.15)';

    let html = md
        .replace(/^# (.*$)/gm, `<h1 style="font-size: 2rem; font-weight: 900; color: ${headerColor}; margin-bottom: 1rem; text-align: center; border-bottom: 4px solid ${headerColor}; padding-bottom: 0.5rem;">$1</h1>`)
        .replace(/^## (.*$)/gm, `<h2 style="font-size: ${prefs.h2FontSizeRem}rem; font-weight: ${prefs.h2Weight || 700}; color: ${subheaderColor}; margin-top: ${prefs.h2MarginTopPx}px; margin-bottom: ${prefs.h2MarginBottomPx}px; border-left: 3px solid ${isWord ? '#1e3a8a' : '#3b82f6'}; padding-left: 0.75rem;">$1</h2>`)
        .replace(/^### (.*$)/gm, `<h3 style="font-size: 1.25rem; font-weight: 700; color: ${isWord ? '#334155' : '#94a3b8'}; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`)
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: inherit;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" /></div>')
        .replace(/^\| (.*) \|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim() !== '').map(c => `<td style="border: 1px solid ${borderColor}; padding: 4px 6px; text-align: left; color: ${textColor};">${c.trim()}</td>`).join('');
            return `<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid ${borderColor};"><tr style="background: ${isWord ? '#f8fafc' : 'rgba(15,23,42,0.3)'};">${cells}</tr></table>`;
        })
        .replace(/<div class="status-box danger">([\s\S]*?)<\/div>/g, '<div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 1rem; padding: 1.5rem; margin: 2rem 0; color: #ef4444;">$1</div>')
        .replace(/^\d\. (.*$)/gm, `<li style="margin-bottom: 0.2rem; color: ${prefs.isWord ? '#000' : '#cbd5e1'}; font-size: 0.9rem;">$1</li>`)
        .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${prefs.isWord ? '#1e40af' : '#60a5fa'}; font-weight: 700;">$1</strong>`)
        .replace(/^- (.*$)/gm, `<li style="margin-left: 0.75rem; margin-bottom: 0.15rem; color: ${prefs.isWord ? '#000' : '#94a3b8'}; font-size: 0.9rem;">$1</li>`)
        .replace(/^> (.*$)/gm, `<blockquote style="border-left: 4px solid #3b82f6; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(59,130,246,0.05); font-style: italic; color: ${prefs.isWord ? '#1e293b' : '#94a3b8'};">$1</blockquote>`);

    const cleanHtml = html
        .replace(/<\/h[1-3]>\s*\n+/g, (match) => match.replace(/\n+/g, '<br/>'))
        .replace(/\n\s*\n/g, '<div style="margin-bottom: 12px;"></div>')
        .replace(/\n/g, ' ');

    return `<div class="prose-styles" style="font-family: 'Inter', sans-serif; line-height: 1.5; text-align: justify; color: ${textColor};">${cleanHtml}</div>`;
};
