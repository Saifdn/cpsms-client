// pages/easyparcel/Connect.jsx
import { useEffect } from "react";
import { useEasyParcel } from "@/hooks/shipment/useEasyParcel";
import { Page, PageHeader } from "@/components/layout/Page";
import { Loader2, ExternalLink } from "lucide-react";

const EasyParcelConnect = () => {
  const { connect, isConnecting } = useEasyParcel();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <Page>
      <PageHeader
        title="Connect EasyParcel"
        description="Redirecting you to EasyParcel login"
      />

      <div className="max-w-md mx-auto mt-24 text-center">
        <div className="mb-10">
          <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6">
            <ExternalLink className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-2xl font-semibold mb-2">Connecting to EasyParcel</h2>
          <p className="text-muted-foreground">
            You will be redirected to EasyParcel to authorize access.
          </p>
        </div>

        {isConnecting && (
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirecting...</span>
          </div>
        )}
      </div>
    </Page>
  );
};

export default EasyParcelConnect;