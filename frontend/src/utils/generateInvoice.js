import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoice = ({
  paymentId,
  event,
  ticketCount,
  basePrice,
  subtotal,
  discount,
  total,
  customerDetails,
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text("Comedy Club - Ticket Invoice", pageWidth / 2, 20, {
    align: "center",
  });

  // Customer Information
  doc.setFontSize(12);
  doc.text("Customer Details", 20, 40);
  doc.setFontSize(10);
  doc.text(`Name: ${customerDetails.name}`, 20, 50);
  doc.text(`Email: ${customerDetails.email}`, 20, 60);

  // Event Information
  doc.setFontSize(12);
  doc.text("Event Details", 20, 80);
  doc.setFontSize(10);
  doc.text(`Event: ${event.title}`, 20, 90);
  doc.text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, 20, 100);
  doc.text(`Time: ${event.startTime} - ${event.endTime}`, 20, 110);

  // Payment Details Table
  doc.autoTable({
    startY: 130,
    head: [["Description", "Amount"]],
    body: [
      ["Price per Ticket", `₹${basePrice}`],
      ["Number of Tickets", ticketCount],
      ["Subtotal", `₹${subtotal}`],
      ["Discount", `₹${discount}`],
      ["Total Amount", `₹${total}`],
    ],
  });

  // Payment Information
  doc.setFontSize(10);
  doc.text(`Payment ID: ${paymentId}`, 20, doc.lastAutoTable.finalY + 20);
  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    20,
    doc.lastAutoTable.finalY + 30
  );

  // Terms & Conditions
  doc.setFontSize(8);
  doc.text("Terms & Conditions", 20, doc.lastAutoTable.finalY + 50);
  doc.text(
    "1. Please carry a valid ID proof",
    20,
    doc.lastAutoTable.finalY + 60
  );
  doc.text(
    "2. This ticket is non-transferable",
    20,
    doc.lastAutoTable.finalY + 65
  );

  // Save PDF
  doc.save(`ticket-${paymentId}.pdf`);
};
