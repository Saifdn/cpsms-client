import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanQrCode } from "lucide-react"

const QrScanner = ({ onScan }) => {
  const [open, setOpen] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            handleSubmit(decodedText); // use same handler
            stop();
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    const stop = async () => {
      try {
        await scanner.stop();
        await scanner.clear();
      } catch {}
      setOpen(false);
    };

    start();

    return () => {
      stop();
    };
  }, [open]);

  const handleSubmit = (id) => {
    if (!id) return;

    onScan(id);          // send to page
    setBookingId("");    // reset input
  };

  return (
    <Card className="bg-background">
      <CardHeader className="border-b">
        <CardTitle>QR Scanner</CardTitle>
        <CardDescription>
          Scan the QR or Enter the Booking ID
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10 space-y-5">
        {/* Scan Button */}
        <Button className="w-full" onClick={() => setOpen(true)}>
          <ScanQrCode />
          Scan QR
        </Button>

        {/* Manual Input */}
        <FieldGroup>
          <Field orientation="horizontal">
            <Input
              placeholder="Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => handleSubmit(bookingId)}
            >
              Submit
            </Button>
          </Field>
        </FieldGroup>

        {/* Modal Scanner */}
        {open && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-xl w-[400px]">
              <h2 className="text-lg font-semibold mb-4">
                Scan QR Code
              </h2>

              <div id="reader" />

              <Button
                onClick={() => setOpen(false)}
                variant="destructive"
                className="mt-4 w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Use QR scan or manual input for check-in / check-out.
        </p>
      </CardFooter>
    </Card>
  );
};

export default QrScanner;