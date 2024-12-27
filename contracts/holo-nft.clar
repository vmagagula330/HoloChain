;; Holographic NFT Contract

(define-non-fungible-token holo-nft uint)

(define-map holo-nft-metadata
  { token-id: uint }
  {
    name: (string-ascii 100),
    description: (string-utf8 500),
    image-uri: (string-utf8 256),
    performance-id: uint
  }
)

(define-data-var nft-nonce uint u0)

(define-public (mint-holo-nft (name (string-ascii 100)) (description (string-utf8 500)) (image-uri (string-utf8 256)) (performance-id uint))
  (let
    (
      (token-id (+ (var-get nft-nonce) u1))
    )
    (try! (nft-mint? holo-nft token-id tx-sender))
    (map-set holo-nft-metadata
      { token-id: token-id }
      {
        name: name,
        description: description,
        image-uri: image-uri,
        performance-id: performance-id
      }
    )
    (var-set nft-nonce token-id)
    (ok token-id)
  )
)

(define-public (transfer-holo-nft (token-id uint) (recipient principal))
  (nft-transfer? holo-nft token-id tx-sender recipient)
)

(define-read-only (get-holo-nft-metadata (token-id uint))
  (map-get? holo-nft-metadata { token-id: token-id })
)

(define-read-only (get-owner (token-id uint))
  (nft-get-owner? holo-nft token-id)
)

