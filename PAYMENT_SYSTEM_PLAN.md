# Payment System Implementation Plan
## Crossmint Embed Checkout Integration for Coinmoji

### Overview
This document outlines the comprehensive implementation plan for integrating a payment checkout system using Crossmint embed checkout, with wallet connect functionality and ERC20 token discounts.

---

## 🎯 Phase 1: Crossmint Integration Setup

### 1.1 Crossmint Account & API Setup
**Timeline: Week 1**

**Tasks:**
- [ ] Create Crossmint developer account
- [ ] Obtain API keys (sandbox & production)
- [ ] Set up webhook endpoints for payment notifications
- [ ] Configure supported payment methods (cards, crypto wallets)

**Implementation Steps:**
```bash
# Install Crossmint SDK
npm install @crossmint/client-sdk-vanilla-js

# Environment variables
CROSSMINT_PROJECT_ID=your_project_id
CROSSMINT_CLIENT_SECRET=your_client_secret
CROSSMINT_ENVIRONMENT=staging # or production
```

### 1.2 Payment Component Architecture
**Files to Create:**
- `src/components/PaymentModal.tsx` - Main payment interface
- `src/components/WalletConnect.tsx` - Wallet connection component
- `src/utils/crossmint.ts` - Crossmint SDK wrapper
- `src/types/payment.d.ts` - Payment type definitions

---

## 🔗 Phase 2: Wallet Connect Integration

### 2.1 Wallet Connection Setup
**Timeline: Week 2**

**Dependencies:**
```bash
npm install @wagmi/core viem @tanstack/react-query
npm install @rainbow-me/rainbowkit # Optional: For better UX
```

**Key Components:**
- **WalletConnect Provider** - Wrap the app with wallet functionality
- **Wallet Button** - Connect/disconnect wallet interface
- **Address Display** - Show connected wallet address
- **Network Detection** - Ensure correct blockchain network

### 2.2 ERC20 Token Balance Checking
**Smart Contract Integration:**
```typescript
// Token contract interface
interface TokenContract {
  balanceOf(address: string): Promise<BigNumber>;
  decimals(): Promise<number>;
  symbol(): Promise<string>;
}

// Minimum token requirement for discount
const MINIMUM_TOKENS_FOR_DISCOUNT = 1000; // Adjust as needed
const DISCOUNT_PERCENTAGE = 50; // 50% discount
```

---

## 💰 Phase 3: Pricing & Discount System

### 3.1 Pricing Structure
**Base Pricing:**
- Standard Emoji Creation: $2.99
- Premium Features: $4.99
- Bulk Creation (5+ emojis): $1.99 each

**Discount Logic:**
```typescript
interface PricingCalculator {
  basePrice: number;
  userTokenBalance: number;
  minimumTokensRequired: number;
  discountPercentage: number;
  
  calculateFinalPrice(): number;
  hasDiscount(): boolean;
}
```

### 3.2 Token Verification System
**Process Flow:**
1. User connects wallet
2. Check ERC20 token balance
3. Apply discount if requirements met
4. Display pricing with/without discount
5. Process payment with adjusted amount

---

## 🖥️ Phase 4: UI/UX Implementation

### 4.1 Payment Modal Design
**Features:**
- **Price Display** - Clear pricing with discount indicators
- **Payment Methods** - Credit card, crypto wallet options
- **Wallet Status** - Connected wallet info and token balance
- **Progress Indicators** - Payment processing states
- **Error Handling** - User-friendly error messages

### 4.2 Wallet Integration UI
**Components:**
```typescript
// Update existing wallet button to handle payments
const WalletPaymentButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Wallet connection logic
  // Token balance checking
  // Payment modal trigger
};
```

---

## ⚙️ Phase 5: Backend Integration

### 5.1 Netlify Functions Enhancement
**New Functions to Create:**
- `netlify/functions/process-payment.ts` - Handle payment webhooks
- `netlify/functions/verify-token-balance.ts` - Server-side token verification
- `netlify/functions/apply-discount.ts` - Calculate and apply discounts
- `netlify/functions/payment-status.ts` - Check payment completion

### 5.2 Webhook Handling
**Crossmint Webhook Events:**
```typescript
interface PaymentWebhook {
  event: 'payment.succeeded' | 'payment.failed' | 'payment.pending';
  paymentId: string;
  amount: number;
  currency: string;
  metadata: {
    userId: string;
    walletAddress?: string;
    discountApplied: boolean;
  };
}
```

---

## 🔐 Phase 6: Security & Validation

### 6.1 Payment Security
**Security Measures:**
- [ ] Server-side payment validation
- [ ] Token balance verification on backend
- [ ] Rate limiting for payment attempts
- [ ] Fraud detection integration
- [ ] Secure API key management

### 6.2 Token Balance Verification
**Dual Verification:**
- **Client-side** - Immediate UI feedback
- **Server-side** - Final payment processing validation

```typescript
// Server-side token verification
export const verifyTokenBalance = async (
  walletAddress: string,
  tokenContractAddress: string,
  minimumRequired: number
): Promise<boolean> => {
  // Web3 provider setup
  // Contract interaction
  // Balance verification
  // Return eligibility
};
```

---

## 📱 Phase 7: Mobile & Telegram Integration

### 7.1 Telegram Web App Payments
**Integration Points:**
- **Telegram Payments API** - For in-app purchases
- **Web3 Wallet Integration** - MetaMask mobile, WalletConnect
- **Mobile Responsive Design** - Touch-optimized payment flow

### 7.2 Cross-Platform Compatibility
**Supported Wallets:**
- MetaMask
- WalletConnect compatible wallets
- Coinbase Wallet
- Trust Wallet

---

## 🚀 Phase 8: Testing & Deployment

### 8.1 Testing Strategy
**Test Cases:**
- [ ] Payment flow without wallet connection
- [ ] Payment flow with connected wallet (no tokens)
- [ ] Payment flow with connected wallet (sufficient tokens)
- [ ] Failed payment scenarios
- [ ] Network switching scenarios
- [ ] Mobile browser compatibility

### 8.2 Staging Environment
**Setup:**
```bash
# Staging environment variables
CROSSMINT_ENVIRONMENT=staging
TOKEN_CONTRACT_ADDRESS_TESTNET=0x...
ENABLE_PAYMENT_TESTING=true
```

---

## 📊 Phase 9: Analytics & Monitoring

### 9.1 Payment Analytics
**Metrics to Track:**
- Payment conversion rate
- Discount usage rate
- Wallet connection rate
- Average transaction value
- Failed payment reasons

### 9.2 Error Monitoring
**Integration:**
- Payment failure notifications
- Webhook delivery monitoring
- Token balance check failures
- Network connectivity issues

---

## 🔧 Technical Implementation Details

### Code Structure Updates

**App.tsx Enhancement:**
```typescript
// Add payment state management
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>();

// Update wallet button onClick
const handleWalletClick = () => {
  if (isConnected) {
    setShowPaymentModal(true);
  } else {
    // Trigger wallet connection
  }
};
```

**New Component Structure:**
```
src/
  components/
    PaymentModal.tsx          # Main payment interface
    WalletConnect.tsx         # Wallet connection logic
    PriceDisplay.tsx          # Pricing with discount info
    PaymentMethods.tsx        # Payment method selection
  utils/
    crossmint.ts              # Crossmint API wrapper
    tokenBalance.ts           # ERC20 balance checking
    priceCalculator.ts        # Discount calculation
  types/
    payment.d.ts              # Payment type definitions
```

---

## 🎯 Success Metrics

**Key Performance Indicators:**
- **Payment Conversion Rate** - Target: >15%
- **Wallet Connection Rate** - Target: >40%
- **Discount Utilization** - Target: >20%
- **Payment Success Rate** - Target: >98%
- **Average Transaction Value** - Track and optimize

---

## 📅 Implementation Timeline

**Week 1-2:** Crossmint setup and basic integration
**Week 3-4:** Wallet connect and token balance checking
**Week 5-6:** UI/UX implementation and testing
**Week 7-8:** Backend webhook integration
**Week 9-10:** Security hardening and mobile optimization
**Week 11-12:** Testing, monitoring, and deployment

---

## 🔄 Future Enhancements

**Phase 2 Improvements:**
- Multiple token support for discounts
- Tiered discount system based on token holdings
- Subscription model for power users
- NFT holder exclusive features
- Social payment sharing

**Integration Opportunities:**
- DeFi yield farming rewards
- Community governance tokens
- Cross-platform payment sync
- Enterprise bulk pricing

---

## 📝 Notes

- All payment processing will be handled securely through Crossmint
- Token balance checking will use multiple RPC endpoints for reliability
- Mobile-first design approach for Telegram Web App compatibility
- Comprehensive error handling and user feedback systems
- Regular security audits and updates

---

*This plan provides a comprehensive roadmap for implementing a robust payment system with wallet integration and token-based discounts using Crossmint's embedded checkout solution.*
