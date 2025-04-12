import React, { useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import { generateTicketPDF } from "@/utils/generateTicketPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

const QRCodeViewer = ({ isOpen, onClose, ticketData }) => {
  const qrRef = useRef(null);

  const getQRDataUrl = () => {
    if (!qrRef.current) return null;
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  };

  const handleDownload = async () => {
    try {
      const qrDataUrl = getQRDataUrl();
      if (!qrDataUrl) {
        console.error("QR code not found");
        return;
      }

      const doc = await generateTicketPDF(ticketData, qrDataUrl);
      doc.save(`ticket-${ticketData.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Your Ticket QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6">
          {/* QR Code with ref */}
          <div ref={qrRef} className="p-6 bg-white rounded-xl shadow-inner">
            <QRCode
              value={JSON.stringify({
                ticketId: ticketData.id,
                eventName: ticketData.eventName,
                date: ticketData.date,
                time: ticketData.time,
                venue: ticketData.venue,
                seat: ticketData.seatNumber,
                type: ticketData.ticketType,
              })}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Event Info */}
          <div className="text-center space-y-2">
            <h3 className="font-bold text-lg">{ticketData.eventName}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(ticketData.date).toLocaleDateString()} at{" "}
              {ticketData.time}
            </p>
          </div>

          {/* Download Button */}
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Show this QR code at the venue entrance
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeViewer;
