import { useState } from "react";
import { motion } from "framer-motion";

const AnimatedTabs = ({ tabs, variant = "default", activeTab, onTabChange, isDark = false }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]);
  
  const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;
  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  if (variant === "underline") {
    return (
      <div className="relative flex items-center">
        {tabs.map((tab, index) => {
          const isActive = currentActiveTab === tab.value || currentActiveTab === tab;
          const tabValue = typeof tab === 'string' ? tab : tab.value;
          const tabLabel = typeof tab === 'string' ? tab : tab.label;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleTabChange(tabValue)}
              className={`relative flex h-12 items-center px-6 text-base font-semibold transition-colors duration-200 ${
                isActive
                  ? (isDark ? "text-white" : "text-black")
                  : (isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black")
              }`}
            >
              <span className="relative z-10">{tabLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-fit items-center rounded-full bg-gray-100 p-1.5 border-2 border-gray-200">
      {tabs.map((tab, index) => {
        const isActive = currentActiveTab === tab.value || currentActiveTab === tab;
        const tabValue = typeof tab === 'string' ? tab : tab.value;
        const tabLabel = typeof tab === 'string' ? tab : tab.label;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleTabChange(tabValue)}
            className={`relative flex h-10 items-center rounded-full px-6 text-sm font-bold transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-gray-700 hover:text-black"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-background"
                className="absolute inset-0 rounded-full bg-black shadow-lg"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{tabLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
