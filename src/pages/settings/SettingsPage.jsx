import { CheckCircle2Icon, PackageIcon, XCircleIcon } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/context/useAuth";
import { useEasyParcel } from "@/hooks/shipment/useEasyParcel";

const SettingsPage = () => {
  const { user } = useAuth();
  const { isConnected, status, isLoading, connect, disconnect, isDisconnecting } = useEasyParcel();

  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <Page>
      <PageHeader title="Settings" description="Manage integrations and system configuration." />

      <div className="mt-8 max-w-lg">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">EasyParcel Integration</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : isConnected ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                  <CheckCircle2Icon className="h-4 w-4" />
                  Connected
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connected on</span>
                    <span className="font-medium">{fmt(status?.connected_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token expires</span>
                    <span className="font-medium">{fmt(status?.token_expires_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Refresh token expires</span>
                    <span className="font-medium">{fmt(status?.refresh_token_expires_at)}</span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => disconnect()}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? "Disconnecting…" : "Disconnect EasyParcel"}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <XCircleIcon className="h-4 w-4" />
                  Not connected
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect your EasyParcel account to enable shipment processing.
                </p>
                <Button className="w-full" onClick={() => connect(user?.id)}>
                  Connect EasyParcel
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default SettingsPage;
