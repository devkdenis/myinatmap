import type { ReactElement } from 'react';

interface DashboardProps {
  isVisible: boolean;
  onToggle: () => void;
}

const Dashboard = ({ isVisible, onToggle }: DashboardProps): ReactElement => {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="
          absolute top-[10px] left-[10px]
          bg-white 
          w-[29px] h-[29px]
          rounded 
          shadow-sm
          cursor-pointer
          border border-gray-300
          hover:bg-gray-100 
          transition-colors
          z-20
          text-sm
          font-sans
          flex items-center justify-center
        "
        aria-label={isVisible ? 'Hide Dashboard' : 'Show Dashboard'}
      >
        {isVisible ? '◀' : '▶'}
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="
          absolute top-0 left-0 bottom-0
          w-80
          bg-white
          shadow-lg
          z-10
          overflow-hidden
          flex flex-col
        ">
          {/* Header */}
          <div className="p-[10px] border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 ml-12">My iNat Map</h2>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              
              <p className="text-gray-700">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <p className="text-gray-700">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              
              <p className="text-gray-700">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              
              <p className="text-gray-700">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>
              
              <p className="text-gray-700">
                Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
              </p>
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