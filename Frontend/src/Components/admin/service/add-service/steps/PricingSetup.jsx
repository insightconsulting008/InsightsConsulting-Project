import React from 'react';
import { useService } from '../ServiceContext';
import { Percent } from 'lucide-react';

export default function PricingSetup() {
  const {
    basicInfo,
    setBasicInfo,
    priceMode,
    setPriceMode,
    discountPercentage,
    setDiscountPercentage
  } = useService();

  const calculateDiscountPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const offerPrice = parseFloat(basicInfo.offerPrice);
    
    if (!isNaN(individualPrice) && !isNaN(offerPrice) && individualPrice > 0) {
      const discount = ((individualPrice - offerPrice) / individualPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') {
      setDiscountPercentage('');
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing Setup</h2>
        <p className="text-sm text-gray-600">Set your pricing strategy for this service.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-800">
            Pricing Mode
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePriceModeChange('fixed')}
              className={`px-3 py-1.5 text-xs rounded-lg ${priceMode === 'fixed' ? 'bg-[#6869AC] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Fixed Price
            </button>
            <button
              onClick={() => handlePriceModeChange('percentage')}
              className={`px-3 py-1.5 text-xs rounded-lg ${priceMode === 'percentage' ? 'bg-[#6869AC] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Discount %
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Individual Price
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={basicInfo.individualPrice}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    individualPrice: e.target.value,
                  }))
                }
                placeholder="1099"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              {priceMode === 'percentage' ? 'Discount Percentage' : 'Offer Price'}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {priceMode === 'percentage' ? (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    <Percent className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="35"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  />
                </>
              ) : (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={basicInfo.offerPrice}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        offerPrice: e.target.value,
                      }))
                    }
                    placeholder="700"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  />
                </>
              )}
            </div>
            {priceMode === 'fixed' && basicInfo.individualPrice && basicInfo.offerPrice && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">
                  Discount: {calculateDiscountPercentage()}%
                </span>
              </div>
            )}
            {priceMode === 'percentage' && discountPercentage && basicInfo.individualPrice && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">
                  Offer Price: ₹{basicInfo.offerPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}