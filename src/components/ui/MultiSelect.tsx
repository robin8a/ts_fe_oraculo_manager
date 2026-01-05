import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  error,
  helperText,
  searchable = true,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  const toggleOption = (value: string) => {
    if (disabled) return;
    
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedValues.filter(v => v !== value));
  };

  const selectId = `multiselect-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left border rounded-lg shadow-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            min-h-[42px] flex items-center flex-wrap gap-1
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-primary-500 border-primary-500' : ''}
          `}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeOption(option.value, e)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                <ul className="py-1">
                  {filteredOptions.map(option => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          onClick={() => toggleOption(option.value)}
                          className={`
                            w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                            flex items-center
                            ${isSelected ? 'bg-primary-50' : ''}
                          `}
                        >
                          <div className={`
                            flex-shrink-0 w-5 h-5 border-2 rounded mr-3 flex items-center justify-center
                            ${isSelected 
                              ? 'border-primary-600 bg-primary-600' 
                              : 'border-gray-300'
                            }
                          `}>
                            {isSelected && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {option.label}
                            </div>
                            {option.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

