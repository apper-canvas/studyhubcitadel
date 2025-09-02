import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="shimmer h-8 w-64 rounded-lg"></div>
          <div className="shimmer h-10 w-32 rounded-lg"></div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="shimmer h-4 w-20 rounded mb-2"></div>
              <div className="shimmer h-8 w-16 rounded"></div>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="shimmer h-6 w-32 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="shimmer h-16 w-full rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="shimmer h-6 w-40 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer h-12 w-full rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="shimmer h-6 w-32 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <div className="shimmer h-10 rounded"></div>
                <div className="shimmer h-10 rounded"></div>
                <div className="shimmer h-10 rounded"></div>
                <div className="shimmer h-10 rounded"></div>
                <div className="shimmer h-10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="shimmer h-12 w-12 rounded-lg mr-4"></div>
              <div>
                <div className="shimmer h-5 w-32 rounded mb-2"></div>
                <div className="shimmer h-4 w-24 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="shimmer h-4 w-full rounded"></div>
              <div className="shimmer h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;