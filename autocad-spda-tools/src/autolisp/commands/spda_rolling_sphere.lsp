;; SPDA - Método das Esferas Rolantes (stub)
;; Visualização e checagem básica do raio de proteção

(vl-load-com)

(defun SPDA-RollingSphere-Draw (radius / cen ent)
  ;; Desenhar círculo representando a esfera em vista 2D (simplificado)
  (setq cen (getpoint "\nCentro da esfera: "))
  (if (and cen radius)
    (progn
      (command "_.CIRCLE" cen radius)
      (princ (strcat "\nEsfera desenhada com raio = " (rtos radius 2 3)))
    )
    (princ "\nParâmetros inválidos.")
  )
  (princ)
)

(defun SPDA-RollingSphere-Check (/ radius)
  (setq radius (getreal "\nInforme o raio da esfera (m): "))
  (if (and radius (> radius 0.0))
    (SPDA-RollingSphere-Draw radius)
    (princ "\nRaio inválido.")
  )
  (princ)
)

;; Comando: SPDA_RS
(defun c:SPDA_RS () (SPDA-RollingSphere-Check))

;; Fim
(princ)

