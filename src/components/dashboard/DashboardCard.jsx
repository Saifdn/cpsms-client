import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EllipsisVerticalIcon } from "lucide-react"

export const DashboardCard = ({title, description, children}) => {
    return (
        <Card className="bg-background">
            <CardHeader className="border-b flex justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVerticalIcon size={20} />
                    </DropdownMenuTrigger>
                </DropdownMenu> */}
            </CardHeader>
            <CardContent className="grid grid-cols-1 grow pt-6">
                {children}
            </CardContent>
            {/* <CardFooter className="border-t pt-4 pb-4">
                <Button variant="outline" className="ml-auto">{buttonText}</Button>
            </CardFooter> */}
        </Card>
    );
}