'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createProductAction, type CreateProductInput } from './actions'
import { createClient } from '@/lib/supabase/client'
import {
  AlertCircle,
  Check,
  Loader2,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
} from 'lucide-react'

interface CollectionOption {
  id: string
  name: string
  slug: string
}

const PRESET_IMAGES = [
  { label: 'Briefcase', url: '/images/hero/hero-briefcase.jpg' },
  { label: 'Backpack', url: '/images/products/backpack-tan.jpg' },
  { label: 'Tote', url: '/images/products/tote-espresso.jpg' },
  { label: 'Messenger', url: '/images/products/messenger-cognac.jpg' },
  { label: 'Duffle', url: '/images/products/duffle-travel.jpg' },
  { label: 'Weekender', url: '/images/products/weekender.jpg' },
  { label: 'Laptop Bag', url: '/images/products/laptop-bag.jpg' },
  { label: 'Slim Wallet', url: '/images/products/wallet-slim.jpg' },
  { label: 'Cardholder', url: '/images/products/cardholder.jpg' },
  { label: 'Passport', url: '/images/products/passport-holder.jpg' },
]

export function NewProductForm({ collections }: { collections: CollectionOption[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Primary Form State
  const [name, setName] = useState('')
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '')
  const [priceInr, setPriceInr] = useState('12999')
  const [stockQuantity, setStockQuantity] = useState('10')
  const [colour, setColour] = useState('Cognac')
  const [shortDescription, setShortDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('/images/hero/hero-briefcase.jpg')
  const [personalisationEnabled, setPersonalisationEnabled] = useState(true)

  // Advanced / Optional Settings (Pre-filled automatically)
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('published')
  const [isFeatured, setIsFeatured] = useState(true)
  const [description, setDescription] = useState('')
  const [materialDescription, setMaterialDescription] = useState(
    'Full-grain vegetable-tanned bovine leather with solid antique brass hardware.'
  )
  const [dimensionsCm, setDimensionsCm] = useState('40cm × 29cm × 8cm')
  const [personalisationMaxChars, setPersonalisationMaxChars] = useState('3')

  function handleNameChange(val: string) {
    setName(val)
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(generatedSlug)
    setSku(`CBR-${generatedSlug.slice(0, 4).toUpperCase()}-001`)
  }

  // Handle Photo Upload from phone or computer
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    setError(null)

    try {
      const supabase = createClient()
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const filePath = `products/${Date.now()}-${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
    } catch (err: any) {
      console.warn('Direct upload failed:', err)
      setError('Could not upload photo directly. You can pick from our studio presets below.')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter a product title.')
      return
    }

    const priceNum = parseFloat(priceInr)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price in rupees.')
      return
    }

    setIsSubmitting(true)

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      `piece-${Date.now()}`

    const payload: CreateProductInput = {
      name: name.trim(),
      slug: finalSlug,
      collectionId,
      shortDescription:
        shortDescription.trim() ||
        `${name} handcrafted in genuine full-grain vegetable-tanned leather.`,
      description:
        description.trim() ||
        `The ${name} is sculpted from vegetable-tanned bovine leather with burnished edges, reinforced seams, and timeless durability.`,
      status,
      isFeatured,
      priceInr: priceNum,
      colour: colour.trim() || 'Cognac',
      stockQuantity: parseInt(stockQuantity, 10) || 10,
      sku: sku.trim() || `CBR-${finalSlug.slice(0, 4).toUpperCase()}-001`,
      imageUrl: imageUrl.trim() || '/images/hero/hero-briefcase.jpg',
      materialDescription,
      dimensionsCm,
      personalisationEnabled,
      personalisationMaxChars: parseInt(personalisationMaxChars, 10) || 3,
    }

    try {
      const res = await createProductAction(payload)
      if (res?.error) {
        setError(res.error)
        setIsSubmitting(false)
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to list product. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {error && (
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            padding: '1rem',
            background: '#fff5f5',
            border: '1px solid #fcc',
            fontSize: '0.875rem',
            color: '#c0392b',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: The Basics */}
      <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--colour-border)' }}>
          <span style={{ width: '1.5rem', height: '1.5rem', background: 'var(--colour-espresso)', color: 'var(--colour-ivory)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
            1
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>
            What is the piece called?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="prod-name">
              Piece Title *
            </label>
            <input
              id="prod-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. The Cambridge Messenger"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="prod-collection">
              Category
            </label>
            <select
              id="prod-collection"
              className="form-input"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
          <label className="form-label" htmlFor="prod-short-desc">
            Short Description (One or two lines)
          </label>
          <input
            id="prod-short-desc"
            type="text"
            className="form-input"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="e.g. Handcrafted bovine leather briefcase with laptop divider and brass buckles."
          />
        </div>
      </div>

      {/* Step 2: Price & Inventory */}
      <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--colour-border)' }}>
          <span style={{ width: '1.5rem', height: '1.5rem', background: 'var(--colour-espresso)', color: 'var(--colour-ivory)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
            2
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>
            Price &amp; Stock
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="prod-price">
              Price in Rupees (₹) *
            </label>
            <input
              id="prod-price"
              type="number"
              className="form-input"
              value={priceInr}
              onChange={(e) => setPriceInr(e.target.value)}
              placeholder="12999"
              min="0"
              required
            />
            <span style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.25rem', display: 'block' }}>
              Customers see: ₹{parseInt(priceInr || '0', 10).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="prod-stock">
              Quantity Available *
            </label>
            <input
              id="prod-stock"
              type="number"
              className="form-input"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="prod-colour">
              Leather Shade
            </label>
            <select
              id="prod-colour"
              className="form-input"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
            >
              <option value="Cognac">Cognac (Warm Amber Brown)</option>
              <option value="Espresso">Espresso (Deep Rich Brown)</option>
              <option value="Tan">Tan (Natural Light)</option>
              <option value="Black">Onyx Black</option>
              <option value="Olive">Heritage Olive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 3: Product Photography */}
      <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--colour-border)' }}>
          <span style={{ width: '1.5rem', height: '1.5rem', background: 'var(--colour-espresso)', color: 'var(--colour-ivory)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
            3
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>
            Product Photo
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Direct File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--colour-border)',
              backgroundColor: 'var(--colour-parchment)',
              padding: '1.75rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {isUploadingPhoto ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--colour-cognac)' }}>
                <Loader2 size={20} className="animate-spin" />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Uploading your photo…</span>
              </div>
            ) : (
              <div>
                <Camera size={28} strokeWidth={1.5} style={{ color: 'var(--colour-cognac)', margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--colour-espresso)', marginBottom: '0.25rem' }}>
                  Click to select photo from phone or computer
                </p>
                <p style={{ fontSize: '0.75rem', opacity: 0.55 }}>
                  Supports JPEG, PNG, WEBP
                </p>
              </div>
            )}
          </div>

          {/* Current Photo Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--colour-parchment)', border: '1px solid var(--colour-border)' }}>
            <div style={{ position: 'relative', width: '4rem', height: '4rem', backgroundColor: '#fff', overflow: 'hidden', border: '1px solid var(--colour-border)' }}>
              <img
                src={imageUrl}
                alt="Selected piece"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--colour-espresso)' }}>
                Active Piece Photo
              </p>
              <p style={{ fontSize: '0.75rem', opacity: 0.55, wordBreak: 'break-all' }}>
                {imageUrl}
              </p>
            </div>
          </div>

          {/* Studio Preset Quick Pick */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>
              Or choose from workshop library:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.625rem',
                    borderColor: imageUrl === preset.url ? 'var(--colour-cognac)' : undefined,
                    color: imageUrl === preset.url ? 'var(--colour-cognac)' : undefined,
                    fontWeight: imageUrl === preset.url ? 600 : 400,
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Personalisation */}
      <div style={{ background: 'var(--colour-paper)', border: '1px solid var(--colour-border)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--colour-border)' }}>
          <span style={{ width: '1.5rem', height: '1.5rem', background: 'var(--colour-espresso)', color: 'var(--colour-ivory)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
            4
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400 }}>
            Free Name Monogramming?
          </h2>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input
            type="checkbox"
            checked={personalisationEnabled}
            onChange={(e) => setPersonalisationEnabled(e.target.checked)}
            style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--colour-cognac)' }}
          />
          <span>Yes, offer complimentary initial embossing on this piece</span>
        </label>
      </div>

      {/* Collapsible: Advanced Settings (Zero technical clutter for client) */}
      <div style={{ background: 'var(--colour-parchment)', border: '1px solid var(--colour-border)' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--colour-espresso)',
          }}
        >
          <span>Advanced Technical Settings (Optional)</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div style={{ padding: '1.5rem', paddingTop: 0, borderTop: '1px solid var(--colour-border-light)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="prod-slug">URL Slug</label>
                <input
                  id="prod-slug"
                  type="text"
                  className="form-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="prod-sku">SKU Code</label>
                <input
                  id="prod-sku"
                  type="text"
                  className="form-input"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="prod-status">Initial Visibility</label>
                <select
                  id="prod-status"
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="published">Live on Website immediately</option>
                  <option value="draft">Hidden draft</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
              <label className="form-label" htmlFor="prod-desc">Detailed Story Narrative</label>
              <textarea
                id="prod-desc"
                rows={3}
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Narrative about hide selection, vegetable tanning, and durability..."
              />
            </div>
          </div>
        )}
      </div>

      {/* One-Click Publish Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          id="submit-new-product-btn"
          style={{ minWidth: '15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', fontSize: '0.875rem' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving Piece…
            </>
          ) : (
            <>
              <Check size={16} /> Save &amp; Put Live on Store
            </>
          )}
        </button>
      </div>
    </form>
  )
}
