'use client';

import { useState } from 'react';

interface BudgetFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export default function BudgetFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: BudgetFilterProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [error, setError] = useState('');

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMin(value);
    onMinPriceChange(value);
    validateBudget(value, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMax(value);
    onMaxPriceChange(value);
    validateBudget(localMin, value);
  };

  const validateBudget = (min: string, max: string) => {
    const minNum = min ? parseInt(min) : 0;
    const maxNum = max ? parseInt(max) : Infinity;
    
    if (minNum > maxNum && min && max) {
      setError('Min price cannot exceed max price');
      return false;
    }
    
    setError('');
    return true;
  };

  const clearFilters = () => {
    setLocalMin('');
    setLocalMax('');
    onMinPriceChange('');
    onMaxPriceChange('');
    setError('');
  };

  return (
    <div className="budget-filter">
      <div className="budget-filter-header">
        <h3 className="budget-filter-title">Budget Range</h3>
        {(localMin || localMax || error) && (
          <button
            onClick={clearFilters}
            className="budget-filter-clear"
            aria-label="Clear budget filter"
          >
            Clear
          </button>
        )}
      </div>

      <div className="budget-filter-inputs">
        <div className="budget-filter-input-group">
          <label htmlFor="minPrice" className="budget-filter-label">
            Min Price (KES)
          </label>
          <div className="budget-filter-input-wrapper">
            <input
              id="minPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={localMin}
              onChange={handleMinChange}
              className={`budget-filter-input ${error ? 'input-error' : ''}`}
              aria-label="Minimum price"
            />
          </div>
        </div>

        <div className="budget-filter-divider">-</div>

        <div className="budget-filter-input-group">
          <label htmlFor="maxPrice" className="budget-filter-label">
            Max Price (KES)
          </label>
          <div className="budget-filter-input-wrapper">
            <input
              id="maxPrice"
              type="text"
              inputMode="numeric"
              placeholder="Any"
              value={localMax}
              onChange={handleMaxChange}
              className={`budget-filter-input ${error ? 'input-error' : ''}`}
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="budget-error-message">
          {error}
        </div>
      )}
    </div>
  );
}
