;; Utilidades matemáticas básicas para SPDA (stub)

(defun spda:clamp (val min max)
  (cond
    ((< val min) min)
    ((> val max) max)
    (t val)
  )
)

;; Fim
(princ)

