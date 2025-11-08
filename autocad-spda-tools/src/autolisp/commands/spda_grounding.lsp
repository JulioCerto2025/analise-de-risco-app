;; SPDA - Aterramento (stub)
;; Utilidades para malhas/barras de aterramento (esqueleto)

(vl-load-com)

(defun SPDA-Ground-Grid (/ side spacing rows cols base pt i j)
  (setq side (getreal "\nTamanho da malha (m): "))
  (setq spacing (getreal "\nEspaçamento entre barras (m): "))
  (setq base (getpoint "\nPonto de origem: "))
  (if (and side spacing base (> side 0.0) (> spacing 0.0))
    (progn
      (setq rows (fix (/ side spacing)))
      (setq cols rows)
      (repeat rows
        (setq i (1- rows))
      )
      ;; Desenho simplificado: grade retangular
      (setq j 0)
      (while (< j rows)
        (command "_.LINE" (list (car base) (+ (cadr base) (* j spacing)) 0.0) (list (+ (car base) side) (+ (cadr base) (* j spacing)) 0.0) "")
        (setq j (1+ j))
      )
      (setq i 0)
      (while (< i cols)
        (command "_.LINE" (list (+ (car base) (* i spacing)) (cadr base) 0.0) (list (+ (car base) (* i spacing)) (+ (cadr base) side) 0.0) "")
        (setq i (1+ i))
      )
      (princ "\nMalha de aterramento desenhada.")
    )
    (princ "\nParâmetros inválidos.")
  )
  (princ)
)

;; Comando: SPDA_GROUND
(defun c:SPDA_GROUND () (SPDA-Ground-Grid))

;; Fim
(princ)

