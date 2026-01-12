
import { Sale } from '../types';

declare const jspdf: any;

export const generateReceiptPDF = (sale: Sale) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 200] // Formato ticket térmico (80mm)
  });

  const margin = 5;
  let cursorY = 15;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTIVA SPORTS', 40, cursorY, { align: 'center' });
  
  cursorY += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Indumentaria y Calzado Deportivo', 40, cursorY, { align: 'center' });
  
  cursorY += 4;
  doc.text('Comprobante No oficial de Venta', 40, cursorY, { align: 'center' });
  
  cursorY += 10;
  doc.line(margin, cursorY, 80 - margin, cursorY);
  
  cursorY += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(`ID: #${sale.id}`, margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(sale.fecha).toLocaleString(), 80 - margin, cursorY, { align: 'right' });
  
  cursorY += 8;
  // Items table
  doc.setFont('helvetica', 'bold');
  doc.text('Cant', margin, cursorY);
  doc.text('Detalle', margin + 10, cursorY);
  doc.text('Subtotal', 80 - margin, cursorY, { align: 'right' });
  
  cursorY += 2;
  doc.line(margin, cursorY, 80 - margin, cursorY);
  
  cursorY += 5;
  doc.setFont('helvetica', 'normal');
  sale.items.forEach(item => {
    doc.text(item.cantidad.toString(), margin, cursorY);
    doc.text(`${item.nombre} (${item.talle})`, margin + 10, cursorY);
    doc.text(`$${item.subtotal.toLocaleString('es-AR')}`, 80 - margin, cursorY, { align: 'right' });
    cursorY += 5;
  });
  
  cursorY += 5;
  doc.line(margin, cursorY, 80 - margin, cursorY);
  
  cursorY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal bruto:', margin, cursorY);
  doc.text(`$${sale.total_bruto.toLocaleString('es-AR')}`, 80 - margin, cursorY, { align: 'right' });
  
  if (sale.ajuste_tipo !== 'ninguno') {
    cursorY += 5;
    const adjustLabel = sale.ajuste_tipo === 'descuento' ? 'Descuento:' : 'Recargo:';
    doc.text(adjustLabel, margin, cursorY);
    doc.text(`${sale.ajuste_tipo === 'descuento' ? '-' : '+'}${sale.ajuste_valor}%`, 80 - margin, cursorY, { align: 'right' });
  }
  
  cursorY += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', margin, cursorY);
  doc.text(`$${sale.total_final.toLocaleString('es-AR')}`, 80 - margin, cursorY, { align: 'right' });
  
  cursorY += 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Gracias por su compra!', 40, cursorY, { align: 'center' });
  
  doc.save(`Ticket_ActivaSports_${sale.id}.pdf`);
};
