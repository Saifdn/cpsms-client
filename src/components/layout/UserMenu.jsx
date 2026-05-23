import Avatar from "react-avatar"
import { useNavigate } from "react-router-dom"
import { UserIcon, SettingsIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/useAuth"


export const UserMenu = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative">
                    <Avatar name={user?.fullName || user?.email || "User"} size="32px" round="8px"/>
                  </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="end" className="w-60">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <UserIcon />
                        <span>View profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <SettingsIcon />
                        <span>Account settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}