import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

function UserStat({ icon: Icon, count, label }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/40">
      <Icon size={24} className="text-primary" />
      <p className="text-2xl font-bold">{count ?? 0}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function UserCountsCard({ data = {} }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>Total accounts in the system</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <UserStat icon={GraduationCap} count={data.graduates} label="Graduates" />
          <UserStat icon={Users} count={data.staff} label="Staff" />
        </div>
      </CardContent>
    </Card>
  );
}
