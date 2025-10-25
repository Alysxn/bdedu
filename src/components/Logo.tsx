import logoImage from "@/assets/logo.png";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoImage} 
        alt="BD.Edu Logo" 
        className="h-10 w-10 object-contain"
      />
      <span className="text-xl font-bold text-foreground">BD.Edu</span>
    </div>
  );
};
