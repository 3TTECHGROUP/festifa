import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Newsletter } from '@/components/containers/Home/Newsletter';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Powerful Features for <span className="text-orange-500">You</span>
          </h1>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${!isYearly ? 'font-semibold text-black' : 'text-gray-500'}`}>
              Pay Monthly
            </span>
            <div className="relative">
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                  isYearly ? 'bg-orange-500' : 'bg-gray-300'
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
              <div className="relative">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save 25%
                </span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <svg width="20" height="8" viewBox="0 0 20 8" className="text-orange-500 fill-current">
                    <path d="M10 8L0 0h20L10 8z"/>
                  </svg>
                </div>
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
                  className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${plan.buttonStyle}`}
                >
                  Purchase
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default Pricing;
