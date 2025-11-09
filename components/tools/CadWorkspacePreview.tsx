import React from 'react';

export default function CadWorkspacePreview() {
  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Top Ribbon Mock */}
      <div className="h-20 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-3 shadow-2xl">
        <div className="text-sm font-bold">AutoCAD — Workspace Preview</div>
        <div className="flex-1 flex flex-wrap gap-2">
          {["Home","Insert","Annotate","Parametric","View","Manage","Output"].map((t)=> (
            <div key={t} className="px-3 py-1 rounded-md bg-slate-800 border border-slate-600 text-xs">{t}</div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input className="px-3 py-1 rounded-md bg-slate-800 border border-slate-600 text-xs" placeholder="Search" />
        </div>
      </div>

      {/* Drawing canvas with grid */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:20px_20px]" />
        {/* Crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-0.5 bg-slate-400/60" />
          <div className="w-0.5 h-40 bg-slate-400/60 -translate-x-1/2 translate-y-[-20px]" />
        </div>
        {/* ViewCube mock */}
        <div className="absolute right-4 top-4 w-24 h-24 bg-slate-800 border border-slate-600 rounded-md grid place-items-center text-xs">TOP</div>
      </div>

      {/* Command line */}
      <div className="h-14 bg-slate-900 border-t border-slate-700 flex items-center px-3 gap-2">
        <div className="text-xs text-slate-400">Command:</div>
        <input className="flex-1 h-8 px-3 rounded-md bg-slate-800 border border-slate-600 text-xs" placeholder="Type a command" />
        <div className="text-[10px] px-2 py-1 rounded bg-slate-800 border border-slate-600">MODEL</div>
      </div>
    </div>
  );
}

