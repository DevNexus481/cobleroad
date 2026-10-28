'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Trash2, EyeOff, Check, AlertTriangle, Loader2 } from 'lucide-react'
import { toggleProductStatusAction, deleteProductAction } from './actions'

interface ProductRow {
  id: string
  slug: string
  name: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  is_demo: boolean
  created_at: string
  product_variants: { id: string; stock_quantity: number }[]
  product_prices: { id: string; currency: string; amount_minor: number }[]
}

export function ProductsTable({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  async function handleToggleStatus(productId: string, currentStatus: string) {
    setLoadingId(productId)
    try {
      const res = await toggleProductStatusAction(productId, currentStatus)
      if (res?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: res.newStatus as any } : p
          )
        )
        showToast(
          res.newStatus === 'published'
            ? '✓ Product is now live on the storefront!'
            : 'Product hidden from customer view.'
        )
      }
    } catch {
      showToast('Failed to update status.')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(productId: string) {
    setLoadingId(productId)
    try {
      const res = await deleteProductAction(productId)
      if (res?.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        setDeleteConfirmId(null)
        showToast('✓ Product successfully removed.')
      }
    } catch {
      showToast('Failed to delete product.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)' }}>
      {toastMessage && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--colour-espresso)',
            color: 'var(--colour-ivory)',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26,22,19,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'var(--colour-paper)',
              border: '1px solid var(--colour-border)',
              maxWidth: '26rem',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#C0392B' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--colour-espresso)' }}>
                Remove Product?
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.75, marginBottom: '1.5rem' }}>
              Are you sure you want to permanently remove{' '}
              <strong>{products.find((p) => p.id === deleteConfirmId)?.name}</strong>? It will no longer appear anywhere on your store.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary btn-sm"
                disabled={loadingId === deleteConfirmId}
              >
                Keep Product
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#C0392B', borderColor: '#C0392B' }}
                disabled={loadingId === deleteConfirmId}
              >
                {loadingId === deleteConfirmId ? 'Removing…' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--colour-border)', background: 'var(--colour-parchment)' }}>
              {['Product Name', 'Store Visibility', 'Stock Units', 'Price (INR)', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '0.875rem 1rem',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    opacity: 0.55,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLive = p.status === 'published'
              const totalStock = (p.product_variants ?? []).reduce(
                (sum: number, v: any) => sum + (v.stock_quantity ?? 0),
                0
              )
              const inrPrice = (p.product_prices ?? []).find(
                (pr: any) => pr.currency === 'INR'
              )
              const isLoading = loadingId === p.id

              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--colour-border-light)' }}>
                  {/* Name */}
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: 600, color: 'var(--colour-espresso)' }}>{p.name}</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: '0.125rem' }}>
                      URL: /products/{p.slug}
                    </p>
                  </td>

                  {/* Store Visibility Toggle */}
                  <td style={{ padding: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      disabled={isLoading}
                      title={isLive ? 'Click to hide from store' : 'Click to show on store'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 0.75rem',
                        background: isLive ? '#d1fae5' : '#f1f5f9',
                        color: isLive ? '#065f46' : '#64748b',
                        border: '1px solid transparent',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : isLive ? (
                        <Check size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}
                      <span>{isLive ? 'Live on Store' : 'Hidden (Draft)'}</span>
                    </button>
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        fontWeight: 500,
                        color: totalStock === 0 ? '#C0392B' : 'inherit',
                      }}
                    >
                      {totalStock} {totalStock === 1 ? 'unit' : 'units'}
                    </span>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {inrPrice ? (
                      `₹${(inrPrice.amount_minor / 100).toLocaleString('en-IN')}`
                    ) : (
                      <span style={{ opacity: 0.4 }}>—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link
                        href={`/admin/products/${p.id}`}
                        title="Manage colour variants, images & personalisation"
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.375rem 0.625rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          borderColor: 'var(--colour-espresso)',
                          fontWeight: 500,
                        }}
                      >
                        Edit &amp; Variants
                      </Link>

                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        title="View on store website"
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.375rem 0.625rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <Eye size={13} /> View
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p.id)}
                        disabled={isLoading}
                        title="Remove product"
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.375rem 0.625rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          color: '#C0392B',
                          borderColor: 'rgba(192, 57, 43, 0.25)',
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
