export default function ResponseTabs({
  activeTab,
  onTabChange,
  headerCount = 0,
  cookieCount = 0,
}) {
  const tabs = [
    { key: "body", label: "Body" },
    { key: "headers", label: `Headers (${headerCount})` },
    { key: "cookies", label: `Cookies (${cookieCount})` },
    { key: "info", label: "Info" },
  ];

  return (
    <div className="flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
            activeTab === tab.key
              ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs font-semibold"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
