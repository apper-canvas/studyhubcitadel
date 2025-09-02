import { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2"
              >
                <ApperIcon name="Menu" size={20} />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-1.5 rounded-lg shadow-sm">
                  <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  StudyHub
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;