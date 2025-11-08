# Plugin .NET (C#) para AutoCAD — SPDA

Este diretório conterá um plugin em C# usando a AutoCAD .NET API para entregar UI avançada (Ribbon/Paletas) e melhor ergonomia.

Requisitos:
- Visual Studio 2019+ ou `dotnet` SDK.
- Referências: `Autodesk.AutoCAD.Runtime`, `Autodesk.AutoCAD.ApplicationServices`, `Autodesk.AutoCAD.EditorInput`, `Autodesk.AutoCAD.DatabaseServices` (instalada com AutoCAD ou ObjectARX).

Ideias:
- Paleta "SPDA" com parâmetros (raio, altura, material, opções de aterramento).
- Botões no Ribbon para cada comando.

Build/Deploy (proposta):
- Compilar em `Release` e carregar o `.dll` via `NETLOAD` no AutoCAD.

