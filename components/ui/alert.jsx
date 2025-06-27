import React from "react";
import { AlertTriangle } from "lucide-react";

export function Alert({ children, className = "" }) {
  return (
    <div className={`flex items-start gap-2 p-3 border rounded-lg bg-yellow-50 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AlertDescription({ children, className = "" }) {
  return <div className={`text-sm text-yellow-800 ${className}`}>{children}</div>;
} 