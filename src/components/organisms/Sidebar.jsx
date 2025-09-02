import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" }
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-gradient-to-br from-white to-gray-50/50 border-r border-gray-200 shadow-sm">
        <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg">
              <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StudyHub
              </h1>
              <p className="text-sm text-gray-600">Academic Organization</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col pt-6">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900"
                }`}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive(item.href) ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  }`} 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center mb-2">
                <ApperIcon name="Lightbulb" className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-900">Study Tip</span>
              </div>
              <p className="text-xs text-primary-700">
                Break large assignments into smaller tasks for better progress tracking!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="relative flex w-64 flex-col bg-gradient-to-br from-white to-gray-50/50 shadow-xl"
          >
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg">
                  <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    StudyHub
                  </h1>
                  <p className="text-sm text-gray-600">Academic Organization</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col pt-6">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      className={`mr-3 h-5 w-5 transition-colors ${
                        isActive(item.href) ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                      }`} 
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;