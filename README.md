# Enter L2 Explorer

A modern, feature-rich blockchain explorer for the Enter L2 network built with Next.js, TypeScript, and Tailwind CSS.

## Overview

The Enter L2 Explorer provides a comprehensive interface for exploring the Enter L2 network, featuring:

- **Real-time Network Statistics**: Live data on blocks, transactions, and network health
- **Transaction Explorer**: Detailed transaction information with merchant-paid fee tracking
- **Block Explorer**: Complete block data with batch information
- **Address Analytics**: Account details, transaction history, and wallet type identification
- **Batch Tracking**: ZK batch verification status and proof details
- **Name Service**: ENS-like name resolution and phone number verification
- **Staking Dashboard**: Staking positions, rewards, and pool statistics
- **Bridge Monitor**: L1-L2 bridge operation tracking
- **Search Functionality**: Universal search for addresses, transactions, blocks, and names

## Features

### 🔍 Universal Search
- Search by transaction hash, block number, address, batch, or name
- Auto-detection of search type with intelligent routing
- Real-time search suggestions and validation

### 📊 Network Analytics
- Live network statistics with growth metrics
- Transaction throughput and performance monitoring
- Gas usage and fee analysis
- Active address tracking

### 💸 Transaction Details
- Complete transaction information with flow visualization
- Merchant-paid fee identification and tracking
- Gas usage and optimization insights
- Transaction status and confirmation tracking

### 🏦 Wallet Intelligence
- Consumer vs Merchant wallet identification
- Whitelist and daily limit information
- Operator management for merchant wallets
- Balance tracking across multiple tokens

### 🔗 Bridge Operations
- L1-L2 deposit and withdrawal tracking
- Bridge operation status monitoring
- Cross-chain transaction linking
- Finalization time estimates

### 🏷️ Name Services
- ENS-like name resolution
- Phone number verification status
- Primary name identification
- Reverse address lookup

### 🥩 Staking Information
- Individual staking positions
- Reward calculation and claiming
- Lock period and multiplier tracking
- Pool statistics and APY

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel, Docker

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/enter-l2/explorer.git
cd explorer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local`:

```bash
# API endpoints
NEXT_PUBLIC_API_URL=https://api.enterl2.com
NEXT_PUBLIC_NODE_RPC_URL=https://rpc.enterl2.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_token_here

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

## Project Structure

```
explorer/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx        # Homepage
│   │   ├── tx/[hash]/      # Transaction details
│   │   ├── block/[id]/     # Block details
│   │   ├── address/[addr]/ # Address details
│   │   ├── batch/[id]/     # Batch details
│   │   └── name/[name]/    # Name details
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── charts/        # Chart components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and API
│   │   ├── api.ts         # API client
│   │   ├── utils.ts       # Helper functions
│   │   └── constants.ts   # App constants
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── public/                # Static assets
├── docs/                  # Documentation
└── docker/               # Docker configuration
```

## API Integration

The explorer integrates with multiple data sources:

### Enter L2 Node RPC
```typescript
// Direct RPC calls to Enter L2 node
const transaction = await rpcRequest('eth_getTransactionByHash', [hash]);
const block = await rpcRequest('eth_getBlockByNumber', [number, true]);
const batch = await rpcRequest('enterl2_getBatchByNumber', [number]);
```

### Backend API
```typescript
// REST API for aggregated data
const stats = await fetch('/api/v1/stats');
const transactions = await fetch('/api/v1/transactions?limit=10');
const addresses = await fetch('/api/v1/addresses/top');
```

### Real-time Updates
```typescript
// WebSocket for live data
const ws = new WebSocket('wss://ws.enterl2.com');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI with new block/transaction data
};
```

## Component Examples

### Transaction Details
```tsx
import { TransactionDetails } from '@/components/TransactionDetails';

export default function TransactionPage({ params }: { params: { hash: string } }) {
  return (
    <div>
      <TransactionDetails hash={params.hash} />
    </div>
  );
}
```

### Network Statistics
```tsx
import { NetworkStats } from '@/components/NetworkStats';

export default function HomePage() {
  return (
    <div>
      <NetworkStats />
    </div>
  );
}
```

### Search Bar
```tsx
import { SearchBar } from '@/components/SearchBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SearchBar />
      {children}
    </div>
  );
}
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_NODE_RPC_URL
```

### Docker

```bash
# Build image
docker build -t enter-l2-explorer .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.enterl2.com \
  -e NEXT_PUBLIC_NODE_RPC_URL=https://rpc.enterl2.com \
  enter-l2-explorer
```

### Docker Compose

```yaml
version: '3.8'
services:
  explorer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.enterl2.com
      - NEXT_PUBLIC_NODE_RPC_URL=https://rpc.enterl2.com
    restart: unless-stopped
```

## Performance Optimization

### Caching Strategy
- **Static Generation**: Pre-render pages at build time
- **Incremental Static Regeneration**: Update static pages on demand
- **API Caching**: Cache API responses with appropriate TTL
- **Image Optimization**: Automatic image optimization with Next.js

### Code Splitting
- **Route-based**: Automatic code splitting by page
- **Component-based**: Dynamic imports for heavy components
- **Bundle Analysis**: Regular bundle size monitoring

### SEO Optimization
- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines
- **Sitemap**: Automatic sitemap generation

## Monitoring and Analytics

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### User Analytics
```typescript
// Google Analytics
import { gtag } from '@/lib/gtag';

gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
});
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Security

### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
];
```

### Environment Variables
- Never commit sensitive data
- Use environment variables for all configuration
- Validate environment variables at startup

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.enterl2.com](https://docs.enterl2.com)
- **Discord**: [discord.gg/enterl2](https://discord.gg/enterl2)
- **GitHub Issues**: [github.com/enter-l2/explorer/issues](https://github.com/enter-l2/explorer/issues)
- **Email**: support@enterl2.com

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app companion
- [ ] API rate limiting dashboard
- [ ] Custom alert system
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Export functionality
- [ ] Advanced filtering options
