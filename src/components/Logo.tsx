import { Database } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Database className="h-8 w-8 text-primary" strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-sm transform rotate-12" />
      </div>
      <span className="text-xl font-bold text-foreground">BD.Edu</span>
    </div>
  );
};
