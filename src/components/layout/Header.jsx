import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/assets/Logo";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";


export const Header = () => {

    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex justify-between gap-1 items-center py-3 ps-4 pe-2 border-b lg:hidden">
            <Logo />
            <div className="ml-a<uto">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={toggleSidebar} arial-label="Toggle mobile menu">
                <MenuIcon />
            </Button>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={toggleSidebar} arial-label="Toggle mobile menu">
                <MenuIcon />
            </Button> */}
        </header>
    );
}