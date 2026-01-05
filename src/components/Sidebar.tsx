import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  CubeIcon,
  ListBulletIcon,
  PlusCircleIcon,
  CloudArrowDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  FolderIcon,
  TrashIcon,
  SparklesIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'ModelAI',
    href: '/modelai',
    icon: CubeIcon,
    children: [
      { name: 'List', href: '/modelai', icon: ListBulletIcon },
      { name: 'Create', href: '/modelai/create', icon: PlusCircleIcon },
    ],
  },
  {
    name: 'Features',
    href: '/features',
    icon: SparklesIcon,
    children: [
      { name: 'List', href: '/features', icon: ListBulletIcon },
      { name: 'Create', href: '/features/create', icon: PlusCircleIcon },
    ],
  },
  {
    name: 'Units of Measure',
    href: '/unitsofmeasure',
    icon: ScaleIcon,
    children: [
      { name: 'List', href: '/unitsofmeasure', icon: ListBulletIcon },
      { name: 'Create', href: '/unitsofmeasure/create', icon: PlusCircleIcon },
    ],
  },
  {
    name: 'Projects & Trees',
    href: '/projects',
    icon: FolderIcon,
  },
  {
    name: 'Delete Projects/Trees/Features',
    href: '/projects/delete',
    icon: TrashIcon,
  },
  {
    name: 'KoboToolbox Import',
    href: '/kobotoolbox/import',
    icon: CloudArrowDownIcon,
  },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">ModelAI Manager</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center px-3 py-2 text-sm rounded-md transition-colors
                            ${isActive(child.href)
                              ? 'bg-primary-50 text-primary-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center px-3 py-2 text-sm rounded-md transition-colors
                      ${isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.attributes?.email || 'Authenticated'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};



