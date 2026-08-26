import React from "react";
import { Folder, FolderOpen, Plus, Clock, ArrowRight } from "lucide-react";

function CollectionList({ collections = [], loading = false, onCreateClick }) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-28 bg-[#E6D2A5]/60 dark:bg-[#1C1C1F] rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] p-4 animate-pulse space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F]" />
                <div className="h-4 w-28 bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] rounded" />
              </div>
              <div className="h-3 w-full bg-[#E6D2A5]/30 dark:bg-[#1C1C1F] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Title and Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Collections
          </h2>
          {collections.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-medium text-[#FF6D1F]">
              {collections.length}
            </span>
          )}
        </div>

        {onCreateClick && collections.length > 0 && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>New Collection</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {collections.length === 0 ? (
        <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
            <FolderOpen className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
              No collections yet.
            </h3>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-xs mx-auto mt-1 leading-relaxed">
              Create a collection to organize your API requests.
            </p>
          </div>

          {onCreateClick && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onCreateClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Collection</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Collections Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => {
            const formattedDate = collection.updatedAt
              ? new Date(collection.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : null;

            return (
              <div
                key={collection._id}
                className="group relative flex flex-col justify-between p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#6E6E73] transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <div>
                  {/* Title and Folder Icon */}
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 shrink-0 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F] group-hover:scale-105 transition-transform">
                        <Folder className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7] truncate group-hover:text-[#FF6D1F] transition-colors">
                        {collection.name}
                      </h3>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-[#8C8C8C] dark:text-[#6E6E73] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6] line-clamp-2 leading-relaxed min-h-[28px]">
                    {collection.description || "No description provided."}
                  </p>
                </div>

                {/* Footer Metadata */}
                {formattedDate && (
                  <div className="pt-2.5 mt-2 border-t border-[#FAF3E1] dark:border-[#1F1F23] flex items-center justify-between text-[10px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8C8C8C] dark:text-[#6E6E73]" />
                      <span>Updated {formattedDate}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CollectionList;
