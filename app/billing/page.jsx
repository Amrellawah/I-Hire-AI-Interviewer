'use client'
import React, { useState } from 'react';
import { CheckCircle, CreditCard, PlusCircle, Star, BadgeCheck, Info, X, Crown, Users, ChevronDown, ChevronUp, Download, Calendar, DollarSign } from 'lucide-react';
import useMobile from '../../hooks/use-mobile';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: [
      'Up to 3 Interviews/mo',
      'Basic Support',
      'Community Access',
    ],
    badge: 'Starter',
    icon: <Crown className="w-8 h-8 text-gray-400" />,
    color: 'border-gray-300',
    bgColor: 'bg-gray-50',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: [
      'Unlimited Interviews',
      'Priority Support',
      'Advanced Analytics',
    ],
    badge: 'Most Popular',
    icon: <Crown className="w-8 h-8 text-[#be3144]" />,
    color: 'border-[#be3144]',
    bgColor: 'bg-[#be3144]/5',
  },
  {
    name: 'Enterprise',
    price: 'Contact',
    period: 'Us',
    features: [
      'Custom Interviews',
      'Dedicated Manager',
      'Team Analytics',
      'SLAs & Integrations',
    ],
    badge: 'Best Value',
    icon: <Users className="w-8 h-8 text-blue-600" />,
    color: 'border-blue-600',
    bgColor: 'bg-blue-50',
  },
];

const mockCards = [
  { id: 1, brand: 'Visa', last4: '4242', exp: '12/25', primary: true },
  { id: 2, brand: 'Mastercard', last4: '1234', exp: '09/24', primary: false },
];

const mockHistory = [
  { id: 1, date: '2024-06-01', amount: '$29.00', status: 'Paid', invoice: '#' },
  { id: 2, date: '2024-05-01', amount: '$29.00', status: 'Paid', invoice: '#' },
  { id: 3, date: '2024-04-01', amount: '$29.00', status: 'Paid', invoice: '#' },
];

function AddCardModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md relative animate-slide-up sm:animate-fade-in max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#be3144]" /> 
              Add Payment Method
            </h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Card Number</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:border-[#be3144] transition-all" 
                placeholder="1234 5678 9012 3456" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Expiry</label>
                <input 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:border-[#be3144] transition-all" 
                  placeholder="MM/YY" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">CVC</label>
                <input 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:border-[#be3144] transition-all" 
                  placeholder="123" 
                />
              </div>
            </div>
            <button 
              type="button" 
              className="w-full bg-[#be3144] hover:bg-[#a82a3a] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
            >
              Add Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useMobile();

  if (!isMobile) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          {icon} {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold flex items-center gap-3">
          {icon} {title}
        </h2>
        {isOpen ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </section>
  );
}

export default function BillingPage() {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 text-[#be3144]" /> 
            Billing & Subscription
          </h1>
          <p className="text-gray-600 text-lg">Manage your subscription and payment methods</p>
        </div>
        
        {/* Plans Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
            <Crown className="w-7 h-7 text-[#be3144]" /> 
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 bg-white shadow-lg p-6 sm:p-8 flex flex-col transition-all duration-300 ${plan.color} ${plan.bgColor} ${currentPlan === plan.name ? 'ring-4 ring-[#be3144] ring-opacity-30 scale-105 shadow-xl' : 'hover:shadow-xl hover:scale-105'}`}
              >
                <div className="absolute top-4 right-4">
                  {plan.badge && (
                    <span className={`px-3 py-1 text-sm rounded-full font-bold ${plan.name === 'Pro' ? 'bg-[#be3144] text-white' : plan.name === 'Enterprise' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                
                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">{plan.icon}</div>
                  <div className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-lg text-gray-600">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="text-gray-700 text-sm mb-8 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#be3144] flex-shrink-0 mt-0.5" /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                
                {currentPlan === plan.name ? (
                  <button className="w-full bg-green-100 text-green-700 font-bold py-4 rounded-xl cursor-default flex items-center justify-center gap-2 text-lg border-2 border-green-200" disabled>
                    <BadgeCheck className="w-5 h-5" /> Current Plan
                  </button>
                ) : (
                  <button
                    className="w-full bg-[#be3144] hover:bg-[#a82a3a] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
                    onClick={() => setCurrentPlan(plan.name)}
                  >
                    Choose {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <CollapsibleSection 
          title="Payment Methods" 
          icon={<CreditCard className="w-7 h-7 text-[#be3144]" />}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-900">Your Cards</h3>
            <button 
              onClick={() => setAddCardOpen(true)} 
              className="flex items-center gap-2 bg-[#be3144] hover:bg-[#a82a3a] text-white px-6 py-3 rounded-xl transition-colors font-semibold text-lg shadow-lg w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-5 h-5" /> Add Payment Method
            </button>
          </div>
          <div className="space-y-4">
            {mockCards.map(card => (
              <div 
                key={card.id} 
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-2 rounded-xl p-4 sm:p-6 ${card.primary ? 'border-[#be3144] bg-[#be3144]/5' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{card.brand}</span>
                      {card.primary && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">
                      •••• {card.last4} • Exp {card.exp}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!card.primary && (
                    <button className="text-[#be3144] hover:text-[#a82a3a] font-semibold text-lg">Set Primary</button>
                  )}
                  <button className="text-red-500 hover:text-red-600 font-semibold text-lg">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Billing History */}
        <CollapsibleSection 
          title="Billing History" 
          icon={<Info className="w-7 h-7 text-[#be3144]" />}
        >
          <div className="space-y-4">
            {mockHistory.map(item => (
              <div key={item.id} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{item.date}</div>
                      <div className="text-gray-600">Invoice #{item.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-2xl text-gray-900">{item.amount}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />} {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <a 
                    href={item.invoice} 
                    className="flex items-center gap-2 text-[#be3144] hover:text-[#a82a3a] font-semibold text-lg"
                  >
                    <Download className="w-5 h-5" /> Download Invoice
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <AddCardModal open={addCardOpen} onClose={() => setAddCardOpen(false)} />
      </div>
    </div>
  );
} 