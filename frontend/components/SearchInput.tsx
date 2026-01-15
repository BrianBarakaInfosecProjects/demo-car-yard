'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localValue);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by brand, model, year, or keywords..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="search-input"
          />
          {localValue && (
            <button
              type="button"
              onClick={() => {
                setLocalValue('');
                onChange('');
              }}
              className="search-clear"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
