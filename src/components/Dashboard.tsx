import { useState } from 'react';
import type { ReactElement } from 'react';

interface DashboardProps {
  isVisible: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

interface FilterState {
  dropdown1: string;
  dropdown2: string;
  dropdown3: string;
  dropdown4: string;
  dropdown5: string;
  checkbox1: boolean;
  checkbox2: boolean;
}

const Dashboard = ({ isVisible, onToggle, isMobile }: DashboardProps): ReactElement => {
  const [filters, setFilters] = useState<FilterState>({
    dropdown1: '',
    dropdown2: '',
    dropdown3: '',
    dropdown4: '',
    dropdown5: '',
    checkbox1: true,
    checkbox2: true
  });

  const handleDropdownChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FilterState, checked: boolean) => {
    setFilters(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <>
      {/* Dashboard Panel */}
      {isVisible && (
        <div className={`
          bg-white
          shadow-lg
          overflow-hidden
          flex flex-col
          ${isMobile 
            ? 'fixed top-[10px] left-[10px] right-[10px] bottom-[10px] z-10 rounded-lg' 
            : 'h-full w-full'
          }
        `}>
          {/* Header */}
          <div className="p-[10px] border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              My iNat Map
            </h2>
            
            {/* Close Button */}
            <button
              onClick={onToggle}
              className="
                w-8 h-8
                rounded-full
                hover:bg-gray-100
                flex items-center justify-center
                text-gray-500 hover:text-gray-700
                transition-colors
                text-base
              "
              aria-label="Close Dashboard"
            >
              ✕
            </button>
          </div>
          
          {/* Scrollable Content - Fixed width on desktop, full width on mobile */}
          <div className={`flex-1 overflow-y-auto p-4 ${isMobile ? 'w-full' : 'w-80'}`}>
            <div className="space-y-6">
              
              {/* Dropdown 1 */}
              <div>
                <label htmlFor="dropdown1" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter 1
                </label>
                <select
                  id="dropdown1"
                  value={filters.dropdown1}
                  onChange={(e) => handleDropdownChange('dropdown1', e.target.value)}
                  className="
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white text-gray-700
                  "
                >
                  <option value="">Select option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              {/* Dropdown 2 */}
              <div>
                <label htmlFor="dropdown2" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter 2
                </label>
                <select
                  id="dropdown2"
                  value={filters.dropdown2}
                  onChange={(e) => handleDropdownChange('dropdown2', e.target.value)}
                  className="
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white text-gray-700
                  "
                >
                  <option value="">Select option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              {/* Dropdown 3 */}
              <div>
                <label htmlFor="dropdown3" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter 3
                </label>
                <select
                  id="dropdown3"
                  value={filters.dropdown3}
                  onChange={(e) => handleDropdownChange('dropdown3', e.target.value)}
                  className="
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white text-gray-700
                  "
                >
                  <option value="">Select option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              {/* Dropdown 4 */}
              <div>
                <label htmlFor="dropdown4" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter 4
                </label>
                <select
                  id="dropdown4"
                  value={filters.dropdown4}
                  onChange={(e) => handleDropdownChange('dropdown4', e.target.value)}
                  className="
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white text-gray-700
                  "
                >
                  <option value="">Select option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              {/* Dropdown 5 */}
              <div>
                <label htmlFor="dropdown5" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter 5
                </label>
                <select
                  id="dropdown5"
                  value={filters.dropdown5}
                  onChange={(e) => handleDropdownChange('dropdown5', e.target.value)}
                  className="
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white text-gray-700
                  "
                >
                  <option value="">Select option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Options
                </label>
                <div className="space-y-2">
                  {/* Checkbox 1 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkbox1"
                      checked={filters.checkbox1}
                      onChange={(e) => handleCheckboxChange('checkbox1', e.target.checked)}
                      className="
                        h-4 w-4
                        text-blue-600
                        border-gray-300 rounded
                        focus:ring-blue-500 focus:ring-opacity-50
                      "
                    />
                    <label htmlFor="checkbox1" className="ml-2 block text-sm text-gray-700">
                      Option 1
                    </label>
                  </div>

                  {/* Checkbox 2 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkbox2"
                      checked={filters.checkbox2}
                      onChange={(e) => handleCheckboxChange('checkbox2', e.target.checked)}
                      className="
                        h-4 w-4
                        text-blue-600
                        border-gray-300 rounded
                        focus:ring-blue-500 focus:ring-opacity-50
                      "
                    />
                    <label htmlFor="checkbox2" className="ml-2 block text-sm text-gray-700">
                      Option 2
                    </label>
                  </div>
                </div>
              </div>

              {/* Sample Data Display */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Sample Data
                </h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-700">
                    No data available. Please adjust your filters.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} My iNat Map.
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                Built with React, TypeScript & MapLibre GL JS
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                Created by{' '}
                <a 
                  href="https://dev.krystelledenis.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline transition-colors"
                >
                  Krystelle Denis
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;