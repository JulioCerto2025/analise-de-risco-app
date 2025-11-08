// Stub de plugin .NET para AutoCAD (SPDA)
// Observação: referências da AutoCAD .NET API são necessárias para compilar.

using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;

namespace SpdaTools
{
    public class Commands
    {
        [CommandMethod("SPDA_RS_NET")]
        public void RollingSphere()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            var ed = doc.Editor;
            ed.WriteMessage("\nSPDA (NET): Método das Esferas Rolantes — stub.");
        }

        [CommandMethod("SPDA_GROUND_NET")]
        public void Grounding()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            var ed = doc.Editor;
            ed.WriteMessage("\nSPDA (NET): Aterramento — stub.");
        }
    }
}

