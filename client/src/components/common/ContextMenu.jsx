import React, { useEffect, useRef, useState } from "react";

/**
 * ContextMenu component for right-click / popover options menus.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to close the menu
 * @param {{ x: number, y: number }} props.position - Target coordinates {x, y}
 * @param {Array<{ label: string, icon?: React.ComponentType, shortcut?: string, danger?: boolean, divider?: boolean, onClick?: Function }>} props.items - Menu items
 */
export default function ContextMenu({
  isOpen,
  onClose,
  position = { x: 0, y: 0 },
  items = [],
}) {
  const menuRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: position.x, y: position.y });

  // Adjust menu position to keep inside viewport
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      if (x + rect.width > viewportWidth - 8) {
        x = Math.max(8, viewportWidth - rect.width - 8);
      }
      if (y + rect.height > viewportHeight - 8) {
        y = Math.max(8, viewportHeight - rect.height - 8);
      }

      setAdjustedPos({ x, y });
    } else {
      setAdjustedPos({ x: position.x, y: position.y });
    }
  }, [isOpen, position]);

  // Click outside and keydown Escape handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !items || items.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedPos.y}px`, left: `${adjustedPos.x}px` }}
      className="fixed z-50 min-w-[170px] max-w-[240px] rounded-lg bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E6D2A5] dark:border-[#2C2C2E] py-1 shadow-lg text-xs font-sans animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="my-1 border-t border-[#FAF3E1] dark:border-[#27272A]"
            />
          );
        }

        const Icon = item.icon;
        const isDanger = item.danger;

        return (
          <button
            key={item.label || index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              if (item.onClick) item.onClick();
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer text-left ${
              isDanger
                ? "text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D]"
                : "text-[#222222] dark:text-[#F5F5F7] hover:bg-[#FAF3E1]/70 dark:hover:bg-[#27272A]"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {Icon && (
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isDanger ? "text-[#DC2626] dark:text-[#F87171]" : "text-[#8C8C8C] dark:text-[#A1A1A6]"
                  }`}
                />
              )}
              <span className="truncate font-medium">{item.label}</span>
            </div>

            {item.shortcut && (
              <span className="ml-3 text-[10px] font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
