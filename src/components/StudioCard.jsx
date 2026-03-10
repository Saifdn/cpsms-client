import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Aperture } from "lucide-react";

const StudioCard = ({ studio }) => {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <CardTitle>{studio.name}</CardTitle>
            <CardDescription>{studio.location}</CardDescription>
          </div>

          <Switch />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 grow pt-6">
        <Badge
          variant={studio.isOccupied ? "destructive" : "secondary"}
          className={
            studio.isOccupied
              ? "bg-red-600 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-600"
          }
        >
          {studio.isOccupied ? "Occupied" : "Free"}
        </Badge>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

export default StudioCard;
