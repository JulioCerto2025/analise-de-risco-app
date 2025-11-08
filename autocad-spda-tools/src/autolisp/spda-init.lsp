;; SPDA - Inicialização de comandos (AutoLISP)
;; Compatível com AutoCAD 2010+

(vl-load-com)

;; Util: registrar comandos e configurar ambiente mínimo
(defun SPDA-Init (/)
  (princ "\nSPDA: inicializando comandos...")
  (princ)
)

;; Alias para facilitar carregamento manual
(defun c:SPDA-INIT () (SPDA-Init))

;; Carregar comandos (ajuste o caminho conforme necessário)
(defun SPDA-LoadCommands ()
  (cond
    ((findfile "spda_rolling_sphere.lsp") (load "spda_rolling_sphere.lsp"))
  )
  (cond
    ((findfile "spda_grounding.lsp") (load "spda_grounding.lsp"))
  )
  (princ "\nSPDA: comandos carregados.")
  (princ)
)

;; Alias
(defun c:SPDA-LOAD () (SPDA-LoadCommands))

;; Autoexec opcional: descomente se quiser carregar sempre ao abrir desenho
;; (SPDA-Init)
;; (SPDA-LoadCommands)

;; Fim
(princ)

