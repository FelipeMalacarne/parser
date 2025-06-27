import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />;
    } else if (theme === "light") {
      return <Sun className="h-4 w-4" />;
    } else {
      // system theme
      return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    if (theme === "dark") return "Dark";
    if (theme === "light") return "Light";
    return "System";
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} className="w-24">
      {getThemeIcon()}
      <span className="ml-2">{getThemeLabel()}</span>
    </Button>
  );
}
