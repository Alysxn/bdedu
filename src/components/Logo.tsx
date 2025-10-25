import logoImage from "@/assets/logo.png";

export const Logo = () => {
  return (
    <div className="flex items-center gap-4">
      <img 
        src={logoImage} 
        alt="BD.Edu Logo" 
        className="h-16 w-16 object-contain"
      />
      <span className="text-2xl font-bold text-foreground">BD.Edu</span>
    </div>
  );
};
