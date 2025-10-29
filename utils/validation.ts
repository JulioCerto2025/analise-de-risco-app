import { AnalysisData } from '../types';

export function validateStep(step: number, data: AnalysisData): string[] {
    // A validação foi desabilitada a pedido do usuário para permitir o avanço livre entre as etapas.
    return [];
}
