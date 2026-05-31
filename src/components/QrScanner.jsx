import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanQrCode, Keyboard, VideoOff, Loader2 } from "lucide-react";

const SCANNER_ELEMENT_ID = "qr-reader-viewport";

const QrScanner = ({ onScan }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manualId, setManualId] = useState("");
  const [cameraState, setCameraState] = useState("idle"); // "idle" | "starting" | "ready" | "error"
  const [cameraError, setCameraError] = useState(null);

  const scannerRef = useRef(null);
  // Ref so the QR success callback always calls the latest onScan without being a dep of useEffect
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      await scanner.clear();
    } catch {
      // Ignore cleanup errors — the scanner may already be stopped
    } finally {
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!dialogOpen) {
      stopScanner();
      setCameraState("idle");
      setCameraError(null);
      return;
    }

    setCameraState("starting");

    // Delay to let the Dialog finish mounting and the DOM element to appear
    const timer = setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            document.activeElement?.blur();
            onScanRef.current(decodedText);
            setDialogOpen(false);
          }
        );
        setCameraState("ready");
      } catch (err) {
        const isPermission =
          err?.message?.toLowerCase().includes("permission") ||
          err?.message?.toLowerCase().includes("notallowed");
        setCameraError(
          isPermission
            ? "Camera access denied. Please allow camera permission in your browser settings and try again."
            : "Could not start camera. Make sure no other app is using it, then try again."
        );
        setCameraState("error");
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [dialogOpen, stopScanner]);

  const handleManualSubmit = () => {
    const value = manualId.trim();
    if (!value) return;
    onScanRef.current(value);
    setManualId("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleManualSubmit();
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>QR Scanner</CardTitle>
          <CardDescription>
            Scan the graduate's QR code or enter the booking number manually.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <Button className="w-full h-11" onClick={() => setDialogOpen(true)}>
            <ScanQrCode className="mr-2 h-4 w-4" />
            Open Camera Scanner
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or enter manually</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. BK-000001"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleManualSubmit}
              disabled={!manualId.trim()}
            >
              Submit
            </Button>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Keyboard size={13} />
            Press Enter after typing the booking number to submit quickly.
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription className="sr-only">
              Point your camera at a booking QR code to scan it.
            </DialogDescription>
          </DialogHeader>

          {cameraState === "error" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <VideoOff size={26} className="text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Camera Unavailable</p>
                <p className="text-sm text-muted-foreground max-w-xs">{cameraError}</p>
              </div>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/*
                Html5Qrcode MUST be visible in the DOM when start() is called —
                it reads the element's dimensions to size the QR box.
                The loading overlay sits on top while the camera initialises.
              */}
              <div className="relative min-h-[260px]">
                {cameraState === "starting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted rounded-lg z-10">
                    <Loader2 size={28} className="animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Starting camera…</p>
                  </div>
                )}
                <div id={SCANNER_ELEMENT_ID} className="w-full rounded-lg overflow-hidden" />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QrScanner;
