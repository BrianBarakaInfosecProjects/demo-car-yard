'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

interface VehicleSuggestion {
  id: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchAutocomplete({ value, onChange, placeholder }: SearchAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await api.get('/vehicles/suggestions', { search: query });
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onChange(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          const searchValue = `${suggestion.year} ${suggestion.make} ${suggestion.model}`;
          setQuery(searchValue);
          onChange(searchValue);
          setIsOpen(false);
        } else {
          onChange(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: VehicleSuggestion) => {
    const searchValue = `${suggestion.year} ${suggestion.make} ${suggestion.model}`;
    setQuery(searchValue);
    onChange(searchValue);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(query);
    setIsOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="search-autocomplete">
      <form onSubmit={handleSubmit} className="search-autocomplete-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder || "Search by brand, model, or year..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="search-input"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={isOpen}
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
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

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="search-suggestions"
          role="listbox"
          id="search-suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              id={`suggestion-${index}`}
              className={`search-suggestion ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="suggestion-main">
                <span className="suggestion-year">{suggestion.year}</span>
                <span className="suggestion-make">{suggestion.make}</span>
                <span className="suggestion-model">{suggestion.model}</span>
              </div>
              <div className="suggestion-price">{formatPrice(suggestion.priceKES)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
