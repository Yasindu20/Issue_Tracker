import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon,
  className = '',
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        checkDropdownPosition();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Check if dropdown should open upward or downward
  const checkDropdownPosition = () => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 350; // Maximum dropdown height
    const spaceBelow = windowHeight - rect.bottom - 20; // 20px buffer
    const spaceAbove = rect.top - 20; // 20px buffer

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  // Handle dropdown close
  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    document.body.style.overflow = 'unset';
  };

  // Handle dropdown open
  const handleDropdownToggle = () => {
    if (disabled) return;
    
    if (!isOpen) {
      checkDropdownPosition();
      // Prevent body scroll when opening
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    setIsOpen(!isOpen);
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.value);
    handleClose();
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      <div 
        className={`custom-dropdown ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'is-open' : ''}`} 
        ref={dropdownRef}
      >
        <div 
          className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={handleDropdownToggle}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleDropdownToggle();
            }
          }}
        >
          <div className="dropdown-content">
            {icon && <span className="dropdown-icon">{icon}</span>}
            <span className="dropdown-text">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg 
            className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isOpen && (
          <div 
            className={`dropdown-menu ${dropdownPosition === 'top' ? 'dropdown-up' : 'dropdown-down'}`}
            ref={menuRef}
            role="listbox"
          >
            {options.length > 5 && (
              <div className="dropdown-search">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path 
                    d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            )}
            
            <div className="dropdown-options">
              {filteredOptions.length === 0 ? (
                <div className="no-options">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.icon && <span className="option-icon">{option.icon}</span>}
                    <span className="option-label">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="option-count">{option.count}</span>
                    )}
                    {option.value === value && (
                      <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path 
                          d="M13.5 4.5L6 12L2.5 8.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-screen backdrop when dropdown is open */}
      {isOpen && (
        <div 
          className="dropdown-backdrop-overlay" 
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default CustomDropdown;