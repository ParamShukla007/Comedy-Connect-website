import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateTicketPDF = async (ticketData, qrCodeDataUrl) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add header with gradient
  doc.setFillColor(41, 37, 36);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Event Ticket", pageWidth / 2, 25, { align: "center" });

  // Reset color for content
  doc.setTextColor(0, 0, 0);

  // Event name
  doc.setFontSize(20);
  doc.text(ticketData.eventName, pageWidth / 2, 60, { align: "center" });

  // Add QR code
  if (qrCodeDataUrl) {
    doc.addImage(
      qrCodeDataUrl,
      "PNG",
      pageWidth / 2 - 30, // centered, 60x60 size
      70,
      60,
      60
    );
  }

  // Add ticket details
  doc.autoTable({
    startY: 140,
    theme: "grid",
    headStyles: { fillColor: [41, 37, 36] },
    head: [["Detail", "Information"]],
    body: [
      ["Ticket ID", ticketData.id],
      ["Event Date", new Date(ticketData.date).toLocaleDateString()],
      ["Time", ticketData.time],
      ["Venue", ticketData.venue],
      ["Seat", ticketData.seatNumber],
      ["Type", ticketData.ticketType],
      ["Price", ticketData.price],
    ],
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });

  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Present this QR code at the venue entrance for verification",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  return doc;
};
