import React from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal.jsx";
import { Sparkles, Cloud, Lock, Sliders, History, ArrowRight } from "lucide-react";

export default function FeatureGateModal({
  isOpen,
  onClose,
  featureName = "Cloud Persistence",
  featureDescription = "Save and sync your API collections across all devices.",
}) {
  const benefits = [
    {
      icon: Cloud,
      title: "Cloud Workspace & Collections",
      desc: "Save unlimited projects, collections, and nested folders.",
    },
    {
      icon: Sliders,
      title: "Multi-Environment Variables",
      desc: "Manage dynamic dev, staging, and production secrets.",
    },
    {
      icon: History,
      title: "Full Execution History & Snapshots",
      desc: "Review past runs, durations, status codes, and rerun with 1-click.",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Full Cloud Workspace"
      description="Create a free account to persist your work and unlock advanced developer tools."
      icon={Lock}
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-[#222222] dark:text-[#F5F5F7]">
        {/* Highlighted Feature Callout */}
        <div className="p-3.5 rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6D1F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{featureName} is a Cloud Feature</span>
          </div>
          <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1">
            {featureDescription}
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-3">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center shrink-0 text-[#FF6D1F] mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#FAF3E1] dark:border-[#1F1F23] flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Link
            to="/login"
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors text-center"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
