'use client';

import SearchAutocomplete from './SearchAutocomplete';
import BudgetFilter from './BudgetFilter';

interface InventoryFiltersProps {
  search: string;
  make?: string;
  minPrice: string;
  maxPrice: string;
  onSearchChange: (value: string) => void;
  onMakeClear: () => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClearAll: () => void;
}

export default function InventoryFilters({
  search,
  make,
  minPrice,
  maxPrice,
  onSearchChange,
  onMakeClear,
  onMinPriceChange,
  onMaxPriceChange,
  onClearAll,
}: InventoryFiltersProps) {
  const hasActiveFilters = search || make || minPrice || maxPrice;

  return (
    <div className="inventory-filters">
      <div className="inventory-filters-container">
        <div className="inventory-filters-search">
          <SearchAutocomplete
            value={search}
            onChange={onSearchChange}
            placeholder="Search by brand, model, or year..."
          />
        </div>

        <div className="inventory-filters-budget">
          <BudgetFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
          />
        </div>

        {make && (
          <div className="inventory-filters-brand">
            <div className="brand-filter-display">
              <span className="brand-filter-label">Brand:</span>
              <span className="brand-filter-value">{make}</span>
              <button
                onClick={onMakeClear}
                className="brand-filter-clear"
                aria-label="Clear brand filter"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="inventory-filters-actions">
            <button
              onClick={onClearAll}
              className="inventory-filters-clear"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
