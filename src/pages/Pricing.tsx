import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Newsletter } from '@/components/containers/Home/Newsletter';
import save25 from '@/assets/images/save-25.png';

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  templates: string;
  features: string[];
  buttonStyle: string;
  cardStyle: string;
  isPopular?: boolean;
}

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      name: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 8,
      templates: "10 Templates",
      features: [
        "5 Pro Templates",
        "Unlimited Shares",
        "Comments"
      ],
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-0",
      cardStyle: "bg-white border border-gray-200"
    },
    {
      name: "Standard",
      monthlyPrice: 10,
      yearlyPrice: 8,
      templates: "25 Templates",
      features: [
        "5 Pro Templates",
        "Unlimited Shares",
        "Comments"
      ],
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-0",
      cardStyle: "bg-white border border-gray-200"
    },
    {
      name: "Premium",
      monthlyPrice: 10,
      yearlyPrice: 8,
      templates: "50 Templates",
      features: [
        "5 Pro Templates",
        "Unlimited Shares",
        "Comments"
      ],
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-0",
      cardStyle: "bg-white border border-gray-200"
    },
    {
      name: "Exclusive",
      monthlyPrice: 10,
      yearlyPrice: 8,
      templates: "100 Templates",
      features: [
        "5 Pro Templates",
        "Unlimited Shares",
        "Comments"
      ],
      buttonStyle: "bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 hover:from-blue-500 hover:via-purple-500 hover:to-orange-500 text-white border-0",
      cardStyle: "bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 p-0.5",
      isPopular: true
    }
  ];

  const handlePurchaseClick = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Powerful Features for <span className="text-orange-500">You</span>
          </h1>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12 relative">
            <span className={`text-lg ${!isYearly ? 'font-semibold text-black' : 'text-gray-500'}`}>
              Pay Monthly
            </span>
            <div className="relative">
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                  isYearly ? 'bg-[#FFA500]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    isYearly ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <span className={`text-lg ${isYearly ? 'font-semibold text-black' : 'text-gray-500'}`}>
              Pay Yearly
            </span>
            {isYearly && (
              <div className="flex items-center gap-3">
                <img 
                  src={save25} 
                  alt="Save 25%" 
                  style={{
                    width: '240px',
                    height: '100px',
                    position: 'absolute',
                    objectFit: 'scale-down',
                    top: '60%'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl ${
                plan.isPopular 
                  ? `${plan.cardStyle}` 
                  : `${plan.cardStyle} shadow-sm transition-transform hover:scale-105`
              }`}
            >
              <div className={`${plan.isPopular ? 'bg-white rounded-2xl p-6' : 'p-6'} h-full flex flex-col`}>
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <span className="text-2xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.templates}</p>
                </div>

                {/* Features List */}
                <div className="mb-8 space-y-3 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() => handlePurchaseClick(plan)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${plan.buttonStyle}`}
                >
                  Purchase
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments</h2>

            {/* Selected Package */}
            <div className="p-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-lg mb-6">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900">{selectedPlan.name} Package</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Quantity</span>
                <span className="font-medium text-gray-900">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Price:</span>
                <span className="font-medium text-gray-900">$50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">VAT:</span>
                <span className="font-medium text-gray-900">$50</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">$100</span>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Proceed to payment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default Pricing;
