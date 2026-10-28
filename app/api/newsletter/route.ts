import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { NewsletterSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = NewsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // In demo/unconfigured environment, succeed gracefully
      return NextResponse.json({ success: true, demo: true, message: 'Subscribed successfully (demo mode).' })
    }

    const supabase = await createAdminClient()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: parsed.data.email, source: 'website' }, { onConflict: 'email' })

    if (error) {
      console.error('[newsletter]', error)
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[newsletter] catch error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Internal error.' }, { status: 500 })
  }
}
