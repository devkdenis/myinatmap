import type { ReactElement } from 'react';

interface PromptProps {
  isVisible: boolean;
  onClose: () => void;
}

const Prompt = ({ isVisible, onClose }: PromptProps): ReactElement => {
  if (!isVisible) return <></>;

  const handleOAuthLogin = () => {
    // TODO: Implement OAuth login
    console.log('OAuth login clicked');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        {/* Popup */}
        <div 
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Connect to iNaturalist
          </h2>
          
          {/* OAuth Login Button */}
          <button
            onClick={handleOAuthLogin}
            className="
              w-full px-4 py-2 bg-green-600 text-white rounded-md mb-3
              hover:bg-green-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500
              font-medium
            "
          >
            🔐 Login with iNaturalist
          </button>

          {/* Privacy Text */}
          <p className="text-xs text-gray-500 text-center mb-10">
            Your login credentials and observation data are private. Everything stays cached locally in your browser only.
          </p>

          {/* Demo Divider */}
          <div className="relative mb-6">
            <hr className="border-gray-300" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or try a demo
            </span>
          </div>

          {/* Demo Button */}
          <button
            onClick={onClose}
            className="
              w-full px-4 py-2 bg-gray-600 text-white rounded-md
              hover:bg-gray-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-gray-500
            "
          >
            Run Demo
          </button>
        </div>
      </div>
    </>
  );
};

export default Prompt;