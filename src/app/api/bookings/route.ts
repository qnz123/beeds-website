import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendBookingEmails } from '@/lib/email'

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('A valid email address is required'),
  // The four folio services (see folioData.tsx / BookingCalendar SERVICES).
  service: z.enum(['creative-strategy', 'ai-enablement', 'production', 'market-expansion'], {
    error: 'Please select a valid service',
  }),
  date: z.string().trim().min(1, 'Date is required'),
  time: z.string().trim().min(1, 'Time is required'),
  // message is optional — coerce empty string to undefined so Prisma stores null
  message: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
})

// ---------------------------------------------------------------------------
// POST /api/bookings
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 2. Validate
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const { name, email, service, date, time, message } = parsed.data

  // 3. Persist
  let booking
  try {
    booking = await prisma.booking.create({
      data: { name, email, service, date, time, message },
    })
  } catch (err) {
    console.error('[bookings] Database write failed:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  // 4. Send confirmation emails (errors are caught inside — booking still succeeds)
  await sendBookingEmails({ name, email, service, date, time, message })

  return NextResponse.json(
    {
      success: true,
      message: 'Booking request received',
      data: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        createdAt: booking.createdAt,
      },
    },
    { status: 201 }
  )
}
