# BEEDS Modern Website

A modern, responsive service booking website for BEEDS creative agency - built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

✨ **Modern Design**
- Dark theme with gradient accents
- Responsive mobile-first design
- Smooth animations and transitions
- Professional color scheme (orange/blue)

🎯 **Service Showcase**
- Video Editing
- Content Creation
- Creative Direction  
- Localization Services

📱 **Booking System**
- Beautiful booking form
- Service selection
- Date/time scheduling
- Direct email submissions

🖼️ **Portfolio Gallery**
- Filterable project showcase
- Category-based filtering
- Beautiful card layouts

📊 **SEO Optimized**
- Meta tags and descriptions
- Server-side rendering
- Optimized images
- Fast page loads

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── booking/
│   │   └── page.tsx        # Booking page
│   └── api/
│       └── bookings/
│           └── route.ts    # Booking API endpoint
├── components/
│   ├── Navigation.tsx       # Header navigation
│   ├── Footer.tsx          # Footer
│   ├── BookingForm.tsx     # Booking form component
│   └── sections/
│       ├── Hero.tsx        # Hero section
│       ├── Services.tsx    # Services section
│       ├── Portfolio.tsx   # Portfolio gallery
│       └── CallToAction.tsx # CTA section
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Update Contact Information
Edit `src/components/sections/CallToAction.tsx` and `src/components/Footer.tsx` to add your actual email and phone numbers.

### Customize Colors
Update the color scheme in `tailwind.config.ts`:
```typescript
colors: {
  primary: '#FF6B35',    // Orange
  secondary: '#004E89',  // Blue
  accent: '#F77F00',     // Accent orange
}
```

### Add Portfolio Items
Edit `src/components/sections/Portfolio.tsx` to add your actual project cases.

### Update Services
Edit `src/components/sections/Services.tsx` to match your actual offerings.

## Database Integration

The booking form currently logs submissions to console. To persist bookings:

### Option 1: Supabase (Recommended)
```bash
npm install @supabase/supabase-js
```
Update `src/app/api/bookings/route.ts` with your Supabase credentials.

### Option 2: Firebase
```bash
npm install firebase
```

### Option 3: MongoDB Atlas
```bash
npm install mongoose
```

## Email Notifications

Add email notifications when bookings are received:

```bash
npm install nodemailer
# or
npm install sendgrid
```

Update the API route to send confirmation emails.

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
- **Netlify**: Connect GitHub repository
- **AWS**: Use AWS Amplify
- **DigitalOcean App Platform**: Connect repository

## Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized Core Web Vitals
- Image optimization
- Code splitting
- Server-side rendering
- Static generation where possible

## Security

- CORS configured
- Input validation on forms
- XSS protection via React
- CSRF protection ready for API

## License

MIT License - see LICENSE file for details

## Next Steps

1. ✅ Project structure created
2. ⏳ Install Node.js and dependencies
3. ⏳ Connect booking database (Supabase/Firebase)
4. ⏳ Add email notifications
5. ⏳ Replace portfolio with real projects
6. ⏳ Deploy to Vercel

## Support

For questions or issues, contact: info@beedstu.com
