import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items, separator, showHome = true, homeIcon = true }) => {
    const Separator = separator || <ChevronRight className="w-4 h-4 text-gray-400" />;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            {showHome && (
                <>
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {homeIcon ? <Home className="w-4 h-4" /> : 'Home'}
                    </Link>
                    {items.length > 0 && (
                        <span className="flex items-center">{Separator}</span>
                    )}
                </>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {item.href && !isLast ? (
                            <Link
                                to={item.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={isLast ? 'text-primary font-medium' : 'text-gray-600'}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <span className="flex items-center">{Separator}</span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
export default Breadcrumb;
// Demo Component
function BreadcrumbDemo() {
    const [currentPath, setCurrentPath] = React.useState('products');

    const breadcrumbConfigs = {
        products: [
            { label: 'Products', href: '/products' },
            { label: 'Electronics', href: '/products/electronics' },
            { label: 'Laptops' }
        ],
        settings: [
            { label: 'Settings', href: '/settings' },
            { label: 'Profile', href: '/settings/profile' },
            { label: 'Security' }
        ],
        docs: [
            { label: 'Documentation', href: '/docs' },
            { label: 'API', href: '/docs/api' },
            { label: 'Authentication', href: '/docs/api/auth' },
            { label: 'OAuth 2.0' }
        ]
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Dynamic Breadcrumb Component
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Reusable breadcrumb component with customizable styling and separators
                    </p>

                    {/* Path Selector */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Demo Path:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(breadcrumbConfigs).map((path) => (
                                <button
                                    key={path}
                                    onClick={() => setCurrentPath(path)}
                                    className={`px-4 py-2 rounded-md transition-colors ${currentPath === path
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {path.charAt(0).toUpperCase() + path.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Examples */}
                <div className="space-y-6">
                    {/* Default Style */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">
                            Default (with home icon)
                        </h3>
                        <Breadcrumb items={breadcrumbConfigs[currentPath]} />
                    </div>

                    {/* Without Home */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">
                            Without Home
                        </h3>
                        <Breadcrumb
                            items={breadcrumbConfigs[currentPath]}
                            showHome={false}
                        />
                    </div>

                    {/* Custom Separator (Slash) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">
                            Custom Separator (Slash)
                        </h3>
                        <Breadcrumb
                            items={breadcrumbConfigs[currentPath]}
                            separator={<span className="text-gray-400">/</span>}
                        />
                    </div>

                    {/* Home Text Instead of Icon */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">
                            Home as Text
                        </h3>
                        <Breadcrumb
                            items={breadcrumbConfigs[currentPath]}
                            homeIcon={false}
                        />
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Usage Example:</h3>
                    <pre className="text-sm text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
                        {`<Breadcrumb 
  items={[
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops' }
  ]}
  showHome={true}
  homeIcon={true}
  separator={<ChevronRight />}
/>`}
                    </pre>
                </div>
            </div>
        </div>
    );
}