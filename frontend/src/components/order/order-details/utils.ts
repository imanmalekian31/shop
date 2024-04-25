import { PDFDocument, StandardFonts } from "pdf-lib";
import type { OrderDoc } from "../../../../../backend/src/types";

export async function generatePDF(order: OrderDoc) {
  const pdfDoc = await PDFDocument.create();
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  let y = height - 100;
  page.setFontSize(12);

  const drawLine = () => {
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
    });
  };

  const drawTableItemText = (
    column: { x: number; y: number },
    text: string
  ) => {
    page.drawText(text, {
      x: column.x,
      y: column.y,
      font: courierFont,
    });
  };

  page.drawText(`Customer Name: ${order.customer_name}`, { x: 50, y });
  page.drawText(`Address: ${order.address}`, { x: 50, y: y - lineHeight });
  page.drawText(
    `Order Date: ${new Date(order.order_date).toLocaleDateString()}`,
    { x: 50, y: y - 2 * lineHeight }
  );
  y -= 4 * lineHeight;

  // table
  const columns = (y: number) => ({
    product: {
      x: 50,
      y: y - lineHeight / 2,
    },
    quantity: {
      x: width / 3,
      y: y - lineHeight / 2,
    },
    ppu: {
      x: (width / 3) * 2,
      y: y - lineHeight / 2,
    },
    total: {
      x: width - 100,
      y: y - lineHeight / 2,
    },
  });

  page.drawText("Product", {
    x: columns(y).product.x,
    y: columns(y).product.y,
  });
  page.drawText("Quantity", {
    x: columns(y).quantity.x,
    y: columns(y).quantity.y,
  });
  page.drawText("PP Unit", { x: columns(y).ppu.x, y: columns(y).ppu.y });
  page.drawText("Total", { x: columns(y).total.x, y: columns(y).total.y });
  y -= lineHeight;

  order.items.forEach((item) => {
    drawLine();
    y -= 10;
    drawTableItemText(columns(y).product, item.product_name);
    drawTableItemText(columns(y).quantity, item.quantity.toString());
    drawTableItemText(columns(y).ppu, `$${item.price_per_unit.toFixed(2)}`);
    drawTableItemText(
      columns(y).total,
      `$${(item.quantity * item.price_per_unit).toFixed(2)}`
    );
    y -= lineHeight;
  });
  drawLine();
  // end table

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");
}
