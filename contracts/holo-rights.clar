;; Holographic Performance Rights and Royalties Contract

(define-map performances
  { performance-id: uint }
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-utf8 500),
    creation-date: uint,
    royalty-percentage: uint
  }
)

(define-map royalties
  { performance-id: uint, beneficiary: principal }
  { percentage: uint }
)

(define-data-var performance-nonce uint u0)

(define-public (register-performance (title (string-ascii 100)) (description (string-utf8 500)) (royalty-percentage uint))
  (let
    (
      (new-id (+ (var-get performance-nonce) u1))
    )
    (asserts! (<= royalty-percentage u100) (err u400)) ;; Ensure royalty percentage is not over 100%
    (map-set performances
      { performance-id: new-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        creation-date: block-height,
        royalty-percentage: royalty-percentage
      }
    )
    (map-set royalties
      { performance-id: new-id, beneficiary: tx-sender }
      { percentage: royalty-percentage }
    )
    (var-set performance-nonce new-id)
    (ok new-id)
  )
)

(define-public (update-royalties (performance-id uint) (beneficiary principal) (percentage uint))
  (let
    (
      (performance (unwrap! (map-get? performances { performance-id: performance-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get creator performance)) (err u403))
    (asserts! (<= percentage u100) (err u400))
    (ok (map-set royalties
      { performance-id: performance-id, beneficiary: beneficiary }
      { percentage: percentage }))
  )
)

(define-read-only (get-performance (performance-id uint))
  (map-get? performances { performance-id: performance-id })
)

(define-read-only (get-royalty (performance-id uint) (beneficiary principal))
  (map-get? royalties { performance-id: performance-id, beneficiary: beneficiary })
)

(define-public (pay-royalties (performance-id uint) (amount uint))
  (let
    (
      (performance (unwrap! (map-get? performances { performance-id: performance-id }) (err u404)))
      (royalty-percentage (get royalty-percentage performance))
      (royalty-amount (/ (* amount royalty-percentage) u100))
    )
    (try! (stx-transfer? royalty-amount tx-sender (get creator performance)))
    (ok royalty-amount)
  )
)

