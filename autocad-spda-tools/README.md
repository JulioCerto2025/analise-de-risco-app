# Ferramentas SPDA para AutoCAD (2010+)

Objetivo: criar um conjunto de ferramentas para elaboração de projetos SPDA com recursos visuais e utilidades: método das esferas rolantes, dimensionamento/aterramento, verificações normativas e automações de desenho.

Compatibilidade: AutoCAD 2010 ou superior.

Linguagens propostas:
- AutoLISP: ampla compatibilidade, ideal para comandos, automações e integração com o desenho.
- .NET (C# + AutoCAD .NET API): paletas, Ribbon, UI avançada, melhor performance e acesso a APIs modernas.

Plano inicial:
1. Começar com AutoLISP (comandos básicos), carregamento via `APPLOAD` e `acaddoc.lsp`.
2. Evoluir para um plugin .NET com paleta/Ribbon para UI rica.

Estrutura:
```
autocad-spda-tools/
  README.md
  src/
    autolisp/
      spda-init.lsp
      commands/
        spda_rolling_sphere.lsp
        spda_grounding.lsp
      utils/
        math.lsp
    dotnet/
      README.md
      Plugin.cs
```

Instalação (AutoLISP):
- Abra o AutoCAD, use `APPLOAD` e carregue `spda-init.lsp`.
- Opcional: copie `spda-init.lsp` para a pasta de suporte e referencie em `acaddoc.lsp` para carregar automaticamente.

Comandos previstos:
- `SPDA_RS`: método das esferas rolantes (visualização do raio, checagem de proteção).
- `SPDA_GROUND`: utilidades de aterramento (malhas, barramentos, distâncias, cálculos básicos).

Roadmap:
- [ ] Paleta com controles de parâmetros (raio, altura, material).
- [ ] Ribbon/aba “SPDA” (em .NET) com botões para cada ferramenta.
- [ ] Exportação de relatórios e tabelas.
- [ ] Integração com normas e presets.

