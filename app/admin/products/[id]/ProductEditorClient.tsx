'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Sliders,
  Camera,
  AlertCircle,
  Tag,
  Palette,
} from 'lucide-react'
import {
  updateProductDetailsAction,
  upsertVariantAction,
  deleteVariantAction,
  assignVariantImageAction,
  updateImageStatusAction,
  type UpdateProductInput,
  type UpsertVariantInput,
} from './actions'
import { LiveInitialsPreview } from '@/components/storefront/LiveInitialsPreview'
import type { PersonalisationPlacement, PersonalisationFinish } from '@/types'

interface ProductEditorProps {
  product: {
    id: string
    slug: string
    name: string
    short_description: string | null
    description: string | null
    status: 'draft' | 'published' | 'archived'
    is_featured: boolean
    personalisation: any
  }
  variants: Array<{
    id: string
    colour: string | null
    colour_hex: string | null
    sku: string | null
    stock_quantity: number
    personalisation_enabled: boolean
    is_active: boolean
    prices: Array<{ currency: string; amount_minor: number }>
  }>
  images: Array<{
    id: string
    url: string
    alt: string | null
    variant_id: string | null
    is_primary: boolean
    status: string
    sort_order: number
  }>
}

export function ProductEditorClient({
  product,
  variants: initialVariants,
  images: initialImages,
}: ProductEditorProps) {
  const [activeTab, setActiveTab] = useState<'variants' | 'images' | 'personalisation'>('variants')
  const [variants, setVariants] = useState(initialVariants)
  const [images, setImages] = useState(initialImages)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Personalisation State
  const initialPlacement = product.personalisation?.placement || {
    x_percent: 50,
    y_percent: 68,
    scale: 1.0,
    rotation_deg: 0,
    max_width_percent: 55,
  }

  const [personalisationEnabled, setPersonalisationEnabled] = useState(
    Boolean(product.personalisation?.enabled)
  )
  const [maxChars, setMaxChars] = useState(product.personalisation?.max_chars || 3)
  const [styles, setStyles] = useState<string[]>(
    product.personalisation?.styles || ['blind', 'gold', 'silver']
  )
  const [placement, setPlacement] = useState<PersonalisationPlacement>(initialPlacement)
  const [previewInitials, setPreviewInitials] = useState('AKR')
  const [previewFinish, setPreviewFinish] = useState<'blind' | 'gold' | 'silver'>('blind')

  // New Variant Form State
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [newColour, setNewColour] = useState('')
  const [newHex, setNewHex] = useState('#9A633F')
  const [newSku, setNewSku] = useState('')
  const [newPrice, setNewPrice] = useState('12999')
  const [newStock, setNewStock] = useState('15')
  const [newPersonalisationEnabled, setNewPersonalisationEnabled] = useState(true)

  function showNotification(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Save Personalisation Settings
  async function handleSavePersonalisation() {
    setIsSaving(true)
    const res = await updateProductDetailsAction({
      productId: product.id,
      name: product.name,
      shortDescription: product.short_description || undefined,
      description: product.description || undefined,
      status: product.status,
      personalisationEnabled,
      personalisationMaxChars: maxChars,
      personalisationStyles: styles,
      placement,
    })
    setIsSaving(false)

    if (res?.success) {
      showNotification('✓ Personalisation placement and settings updated successfully!')
    } else {
      showNotification(`Failed: ${res?.error || 'Unknown error'}`)
    }
  }

  // Add New Variant
  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault()
    if (!newColour.trim()) return

    setIsSaving(true)
    const cleanSku = newSku.trim() || `CBR-${product.slug.slice(0, 4).toUpperCase()}-${newColour.slice(0, 3).toUpperCase()}`
    const res = await upsertVariantAction({
      productId: product.id,
      colour: newColour.trim(),
      colourHex: newHex.trim(),
      sku: cleanSku,
      priceInr: Number(newPrice) || 0,
      stockQuantity: Number(newStock) || 0,
      personalisationEnabled: newPersonalisationEnabled,
      isActive: true,
    })
    setIsSaving(false)

    if (res?.success && res.variantId) {
      setVariants((prev) => [
        ...prev,
        {
          id: res.variantId!,
          colour: newColour.trim(),
          colour_hex: newHex.trim(),
          sku: cleanSku,
          stock_quantity: Number(newStock) || 0,
          personalisation_enabled: newPersonalisationEnabled,
          is_active: true,
          prices: [{ currency: 'INR', amount_minor: Math.round(Number(newPrice) * 100) }],
        },
      ])
      setShowAddVariant(false)
      setNewColour('')
      showNotification(`✓ Variant "${newColour}" added successfully!`)
    } else {
      showNotification(`Failed: ${res?.error || 'Could not add variant'}`)
    }
  }

  // Delete Variant
  async function handleDeleteVariant(variantId: string, colourName: string | null) {
    if (!confirm(`Are you sure you want to delete the "${colourName || 'this'}" variant?`)) return
    setIsSaving(true)
    const res = await deleteVariantAction(variantId, product.id)
    setIsSaving(false)

    if (res?.success) {
      setVariants((prev) => prev.filter((v) => v.id !== variantId))
      showNotification('✓ Variant deleted.')
    } else {
      showNotification(`Failed: ${res?.error || 'Could not delete variant'}`)
    }
  }

  // Assign image to variant
  async function handleAssignImage(imageId: string, variantId: string | null, isPrimary: boolean) {
    setIsSaving(true)
    const res = await assignVariantImageAction(imageId, variantId, isPrimary, product.id)
    setIsSaving(false)

    if (res?.success) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, variant_id: variantId, is_primary: isPrimary } : img
        )
      )
      showNotification('✓ Image configuration updated.')
    }
  }

  const primaryImage = images.find((img) => img.is_primary) || images[0]

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'var(--colour-espresso)',
            color: 'var(--colour-ivory)',
            padding: '0.875rem 1.5rem',
            borderRadius: '2px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            color: 'var(--colour-charcoal)',
            opacity: 0.7,
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--colour-cognac)',
                fontWeight: 600,
              }}
            >
              Product Customisation &amp; Variants
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                fontWeight: 400,
                color: 'var(--colour-espresso)',
                margin: '0.25rem 0 0',
              }}
            >
              {product.name}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Eye size={14} /> View Storefront Page
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--colour-border)',
          marginBottom: '2rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('variants')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'variants' ? '2px solid var(--colour-espresso)' : '2px solid transparent',
            color: activeTab === 'variants' ? 'var(--colour-espresso)' : 'var(--colour-charcoal)',
            fontWeight: activeTab === 'variants' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Palette size={15} /> Colour Variants ({variants.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('images')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'images' ? '2px solid var(--colour-espresso)' : '2px solid transparent',
            color: activeTab === 'images' ? 'var(--colour-espresso)' : 'var(--colour-charcoal)',
            fontWeight: activeTab === 'images' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Camera size={15} /> Variant Images &amp; Gallery ({images.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('personalisation')}
          style={{
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'personalisation' ? '2px solid var(--colour-espresso)' : '2px solid transparent',
            color: activeTab === 'personalisation' ? 'var(--colour-espresso)' : 'var(--colour-charcoal)',
            fontWeight: activeTab === 'personalisation' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={15} /> Personalisation &amp; Placement Calibration
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COLOUR VARIANTS
          ========================================================================= */}
      {activeTab === 'variants' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 400, margin: 0 }}>
                Configured Colour Variants
              </h2>
              <p style={{ fontSize: '0.8125rem', opacity: 0.65, marginTop: '0.25rem', margin: 0 }}>
                Each variant displays its genuine photograph, price, and stock on the storefront.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddVariant(!showAddVariant)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Plus size={14} /> Add Colour Variant
            </button>
          </div>

          {/* Add Variant Modal / Drawer */}
          {showAddVariant && (
            <form
              onSubmit={handleAddVariant}
              style={{
                backgroundColor: 'var(--colour-parchment)',
                border: '1px solid var(--colour-border)',
                padding: '1.5rem',
                borderRadius: '2px',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', marginBottom: '1rem' }}>
                New Colour Variant
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Colour Name</label>
                  <input
                    type="text"
                    required
                    value={newColour}
                    onChange={(e) => setNewColour(e.target.value)}
                    placeholder="e.g. Olive Green"
                    className="form-input"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Swatch Colour (Hex)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      style={{ width: '2.5rem', height: '2.5rem', padding: 0, border: 'none', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>SKU</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. CBR-MARL-OLV"
                    className="form-input"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <input
                  type="checkbox"
                  id="new-personalisation-enabled"
                  checked={newPersonalisationEnabled}
                  onChange={(e) => setNewPersonalisationEnabled(e.target.checked)}
                />
                <label htmlFor="new-personalisation-enabled" style={{ fontSize: '0.8125rem' }}>
                  Enable complimentary monogramming for this variant
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={isSaving} className="btn btn-primary btn-sm">
                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : 'Create Variant'}
                </button>
                <button type="button" onClick={() => setShowAddVariant(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Variants Table */}
          <div style={{ border: '1px solid var(--colour-border)', backgroundColor: 'var(--colour-paper)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--colour-border)', backgroundColor: 'var(--colour-parchment)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Colour</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Swatch</th>
                  <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price (INR)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Monogram</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => {
                  const inr = v.prices.find((p) => p.currency === 'INR')?.amount_minor ?? 0
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--colour-border-light)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        {v.colour || 'Unnamed Variant'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '1.25rem',
                              height: '1.25rem',
                              borderRadius: '50%',
                              backgroundColor: v.colour_hex || '#9A633F',
                              border: '1px solid rgba(0,0,0,0.2)',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{v.colour_hex || '#9A633F'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', opacity: 0.7 }}>
                        {v.sku || '—'}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>
                        ₹{(inr / 100).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 500, color: v.stock_quantity === 0 ? '#C0392B' : 'inherit' }}>
                          {v.stock_quantity} units
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '2px',
                            backgroundColor: v.personalisation_enabled ? '#d1fae5' : '#f1f5f9',
                            color: v.personalisation_enabled ? '#065f46' : '#64748b',
                            fontWeight: 600,
                          }}
                        >
                          {v.personalisation_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(v.id, v.colour)}
                          disabled={variants.length <= 1}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: variants.length <= 1 ? '#ccc' : '#C0392B',
                            cursor: variants.length <= 1 ? 'not-allowed' : 'pointer',
                            padding: '0.25rem',
                          }}
                          title={variants.length <= 1 ? 'Cannot delete the only variant' : 'Delete variant'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: VARIANT IMAGERY & APPROVALS
          ========================================================================= */}
      {activeTab === 'images' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 400, margin: 0 }}>
              Variant Images &amp; Approval Status
            </h2>
            <p style={{ fontSize: '0.8125rem', opacity: 0.65, marginTop: '0.25rem', margin: 0 }}>
              Manage variant-to-image relationships. When a customer selects a colour, the matching photo is displayed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {images.map((img) => {
              const assignedVariant = variants.find((v) => v.id === img.variant_id)
              return (
                <div
                  key={img.id}
                  style={{
                    border: '1px solid var(--colour-border)',
                    backgroundColor: 'var(--colour-paper)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: 'var(--colour-parchment)' }}>
                    <Image src={img.url} alt={img.alt || ''} fill style={{ objectFit: 'cover' }} />
                    {img.is_primary && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          backgroundColor: 'var(--colour-espresso)',
                          color: 'var(--colour-ivory)',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.5rem',
                        }}
                      >
                        Primary
                      </span>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: img.status === 'approved' ? '#d1fae5' : '#fef3c7',
                        color: img.status === 'approved' ? '#065f46' : '#92400e',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2px',
                      }}
                    >
                      {img.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <label style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 600, opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>
                      Assigned Colour Variant
                    </label>
                    <select
                      value={img.variant_id || ''}
                      onChange={(e) => handleAssignImage(img.id, e.target.value || null, img.is_primary)}
                      style={{ width: '100%', padding: '0.375rem', fontSize: '0.8125rem', border: '1px solid var(--colour-border)', marginBottom: '0.75rem' }}
                    >
                      <option value="">General (All Colours)</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.colour} ({v.sku || 'No SKU'})
                        </option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleAssignImage(img.id, img.variant_id, !img.is_primary)}
                        style={{
                          fontSize: '0.6875rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--colour-cognac)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {img.is_primary ? 'Unset Primary' : 'Make Primary'}
                      </button>

                      {img.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => updateImageStatusAction(img.id, 'approved', product.id)}
                          style={{
                            fontSize: '0.6875rem',
                            backgroundColor: '#065f46',
                            color: '#fff',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '2px',
                            cursor: 'pointer',
                          }}
                        >
                          Approve Asset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PERSONALISATION & PLACEMENT CALIBRATION
          ========================================================================= */}
      {activeTab === 'personalisation' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Controls */}
          <div
            style={{
              backgroundColor: 'var(--colour-paper)',
              border: '1px solid var(--colour-border)',
              padding: '1.75rem',
              borderRadius: '2px',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              Personalisation Settings
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={personalisationEnabled}
                  onChange={(e) => setPersonalisationEnabled(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Enable Complimentary Monogramming
                </span>
              </label>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Max Initials Length</label>
              <input
                type="number"
                min={1}
                max={5}
                value={maxChars}
                onChange={(e) => setMaxChars(Number(e.target.value))}
                className="form-input"
                style={{ fontSize: '0.875rem', width: '6rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Available Finishes</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'blind', label: 'Blind Hot Deboss (Pressed leather)' },
                  { id: 'gold', label: '24K Gold Foil Stamping' },
                  { id: 'silver', label: 'Sterling Silver Foil Stamping' },
                ].map((f) => (
                  <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <input
                      type="checkbox"
                      checked={styles.includes(f.id)}
                      onChange={(e) => {
                        if (e.target.checked) setStyles([...styles, f.id])
                        else setStyles(styles.filter((s) => s !== f.id))
                      }}
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--colour-border)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
                Live Placement Coordinates
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span>Horizontal Position (X)</span>
                  <strong>{placement.x_percent}%</strong>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={placement.x_percent}
                  onChange={(e) => setPlacement({ ...placement, x_percent: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span>Vertical Position (Y)</span>
                  <strong>{placement.y_percent}%</strong>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={placement.y_percent}
                  onChange={(e) => setPlacement({ ...placement, y_percent: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span>Scale / Font Size</span>
                  <strong>{placement.scale || 1.0}×</strong>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.05}
                  value={placement.scale || 1.0}
                  onChange={(e) => setPlacement({ ...placement, scale: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span>Rotation Angle</span>
                  <strong>{placement.rotation_deg || 0}&deg;</strong>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={placement.rotation_deg || 0}
                  onChange={(e) => setPlacement({ ...placement, rotation_deg: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSavePersonalisation}
              disabled={isSaving}
              className="btn btn-primary btn-full"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save Personalisation Calibration'}
            </button>
          </div>

          {/* Interactive Live Calibration Bag Preview */}
          <div>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                Interactive Visual Calibration Preview
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  maxLength={3}
                  value={previewInitials}
                  onChange={(e) => setPreviewInitials(e.target.value.toUpperCase())}
                  style={{ width: '4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}
                />
                <select
                  value={previewFinish}
                  onChange={(e) => setPreviewFinish(e.target.value as any)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem' }}
                >
                  <option value="blind">Blind Deboss</option>
                  <option value="gold">Gold Foil</option>
                  <option value="silver">Silver Foil</option>
                </select>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                backgroundColor: 'var(--colour-parchment)',
                border: '1px solid var(--colour-border)',
                borderRadius: '2px',
                maxWidth: '480px',
              }}
            >
              {primaryImage ? (
                <Image src={primaryImage.url} alt={product.name} fill style={{ objectFit: 'cover' }} />
              ) : null}

              {/* OVERLAY INITIALS AT LIVE COORDINATES */}
              <LiveInitialsPreview
                initials={previewInitials}
                finish={previewFinish}
                placement={placement}
              />
            </div>
            <p style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.5rem', maxWidth: '480px' }}>
              Drag the sliders on the left to align the monogramming stamping directly onto the front leather panel. The values save instantly for all storefront shoppers.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
