import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSecuritySearch } from "@/api/hooks/useSecurities";

// Typescript interface for search results
interface SecuritySearchResult {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
  securityType?: string;
}

interface SecuritySearchComboboxProps {
  onSelect: (security: SecuritySearchResult) => void;
  placeholder?: string;
  className?: string;
}

export default function SecuritySearchCombobox({
  onSelect,
  placeholder = "Search stocks, ETFs...",
  className = "",
}: SecuritySearchComboboxProps) {
  // State management
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SecuritySearchResult[]>([]);
  //const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Refs for DOM access
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // use TanStack Query hook - handles debouncing and caching internally
  const { data: searchResults, isLoading } = useSecuritySearch(query, 10);

  // Update local state when query results change
  useEffect(() => {
    if (searchResults && query.length >= 2) {
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchResults, query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (security: SecuritySearchResult) => {
    onSelect(security); // 1. Tell parent component
    setQuery(""); // 2. Clear search input
    setResults([]); // 3. Clear results
    setIsOpen(false); // 4. Close dropdown
    setSelectedIndex(-1); // 5. Reset highlight
    inputRef.current?.blur(); // 6. Remove focus from input
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {results.map((security, index) => (
            <button
              key={security.id}
              onClick={() => handleSelect(security)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? "bg-teal-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    <span className="font-semibold text-gray-900">
                      {security.symbol}
                    </span>
                    {security.securityType && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {security.securityType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {security.name}
                  </p>
                  {security.exchange && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {security.exchange}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results State */}
      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No securities found for "{query}"
        </div>
      )}
    </div>
  );
}
