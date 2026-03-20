import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import prisma from '../config/database';


const GOLD = '#c4933f';
const DARK = '#1c1814';
const INK = '#0c0a08';
const CREAM = '#faf6ef';
const STONE = '#6b6457';
const BORDER = '#e5e1d8';

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE');

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

const fmtShort = (d: Date) =>
  new Date(d).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short'
  });

export const exportReport = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [vehicles, inquiries, recentInquiries] = await Promise.all([
      prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, make: true, model: true, year: true,
          priceKES: true, mileage: true, fuelType: true,
          transmission: true, status: true,
          viewCount: true, createdAt: true,
        }
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true,
          message: true, status: true, createdAt: true,
vehicle: {
            select: { make: true, model: true, year: true, priceKES: true }
        }
        }
      }),
      prisma.inquiry.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const activeVehicles = vehicles.filter(v => v.status !== 'SOLD');
    const soldVehicles = vehicles.filter(v => v.status === 'SOLD');
const totalStockValue = activeVehicles.reduce((s, v) => s + v.priceKES, 0);
    const totalViews = vehicles.reduce((s, v) => s + (v.viewCount || 0), 0);
    const topVehicles = [...vehicles]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
    const openInquiries = inquiries.filter(
      i => i.status !== 'CLOSED' && i.status !== 'RESOLVED'
    );

    const agingVehicles = activeVehicles.filter(v => {
      const days = Math.floor(
        (now.getTime() - new Date(v.createdAt).getTime())
        / (1000 * 60 * 60 * 24)
      );
      return days > 60;
    });

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 40, left: 0, right: 0 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sassy-auto-report-${now.toISOString().split('T')[0]}.pdf"`
    );
    doc.pipe(res);

    const PW = 595;
    const ML = 40;
    const MR = 40;
    const CW = PW - ML - MR;

    const headerBar = (title: string, subtitle?: string) => {
      doc.rect(0, doc.y, PW, subtitle ? 56 : 44).fill(INK);
      const ty = doc.y + (subtitle ? 14 : 15);
      doc.fillColor(GOLD).fontSize(11).font('Helvetica-Bold')
         .text(title.toUpperCase(), ML, ty, { characterSpacing: 1.5 });
      if (subtitle) {
        doc.fillColor(STONE).fontSize(8).font('Helvetica')
           .text(subtitle, ML, ty + 16);
      }
      doc.moveDown(subtitle ? 2.8 : 2.2);
    };

    const statCard = (
      label: string, value: string,
      x: number, y: number, w: number, h = 52,
      accent = false
    ) => {
      doc.rect(x, y, w, h).fill(accent ? INK : '#f7f5f1');
      doc.fillColor(accent ? GOLD : STONE)
         .fontSize(7).font('Helvetica')
         .text(label.toUpperCase(), x + 12, y + 10, { width: w - 24, characterSpacing: .8 });
      doc.fillColor(accent ? CREAM : DARK)
         .fontSize(18).font('Helvetica-Bold')
         .text(value, x + 12, y + 22, { width: w - 24 });
    };

    const divider = () => {
      doc.moveTo(ML, doc.y).lineTo(PW - MR, doc.y)
         .lineWidth(0.5).strokeColor(BORDER).stroke();
      doc.moveDown(0.4);
    };

    const tableHeader = (cols: { label: string; w: number }[]) => {
      const y = doc.y;
      doc.rect(ML, y, CW, 20).fill('#f0ece4');
      let x = ML;
      cols.forEach(col => {
        doc.fillColor(STONE).fontSize(7).font('Helvetica-Bold')
           .text(col.label.toUpperCase(), x + 6, y + 6, { width: col.w - 8, characterSpacing: .5 });
        x += col.w;
      });
      doc.moveDown(1.6);
    };

    const tableRow = (
      cols: { val: string; w: number; color?: string }[],
      shade: boolean
    ) => {
      const y = doc.y;
      const rowH = 18;
      if (shade) doc.rect(ML, y, CW, rowH).fill('#faf9f7');
      let x = ML;
      cols.forEach(col => {
        doc.fillColor(col.color || DARK)
           .fontSize(8).font('Helvetica')
           .text(col.val, x + 6, y + 5, { width: col.w - 8, ellipsis: true });
        x += col.w;
      });
      doc.moveDown(1.4);
    };

    const newPage = () => {
      doc.addPage();
      doc.y = 40;
    };

    // PAGE 1 — COVER + SUMMARY
    doc.rect(0, 0, PW, 110).fill(INK);
    doc.fillColor(GOLD).fontSize(22).font('Helvetica-Bold')
       .text('SASSY AUTO TRADING', ML, 28, { characterSpacing: 2 });
    doc.fillColor(STONE).fontSize(9).font('Helvetica')
       .text('NAIROBI · EST. 2001', ML, 56, { characterSpacing: 3 });
    doc.fillColor(CREAM).fontSize(11).font('Helvetica')
       .text('Business Report', ML, 76);
    doc.fillColor(STONE).fontSize(8)
       .text(fmtDate(now), PW - MR - 120, 80, { width: 120, align: 'right' });

    doc.y = 130;

    const cardW = Math.floor(CW / 4) - 4;
    const cardY = doc.y;
    statCard('Active Listings', String(activeVehicles.length), ML, cardY, cardW, 52, true);
    statCard('Vehicles Sold', String(soldVehicles.length), ML + cardW + 4, cardY, cardW);
    statCard('New Leads (30d)', String(recentInquiries.length), ML + (cardW + 4) * 2, cardY, cardW);
    statCard('Open Inquiries', String(openInquiries.length), ML + (cardW + 4) * 3, cardY, cardW);

    doc.y = cardY + 68;

    const wideW = Math.floor(CW / 2) - 4;
    statCard('Total Stock Value', fmt(totalStockValue), ML, doc.y, wideW, 52, true);
    statCard('Total Listing Views', totalViews.toLocaleString(), ML + wideW + 4, doc.y, wideW);

    doc.y += 68;

    headerBar('Top 5 Most Viewed Vehicles', 'Ranked by page views');

    tableHeader([
      { label: 'Vehicle', w: 200 },
      { label: 'Year', w: 50 },
      { label: 'Price', w: 110 },
      { label: 'Status', w: 80 },
      { label: 'Views', w: 75 },
    ]);

    topVehicles.forEach((v, i) => {
      tableRow([
        { val: `${v.make} ${v.model}`, w: 200 },
        { val: String(v.year), w: 50 },
        { val: fmt(v.priceKES), w: 110, color: GOLD },
        { val: v.status, w: 80, color: v.status === 'SOLD' ? '#16a34a' : DARK },
        { val: String(v.viewCount || 0), w: 75 },
      ], i % 2 === 0);
    });

    divider();
    doc.moveDown(0.3);
    headerBar('Recent Inquiries (Last 30 Days)');

    const recentSlice = recentInquiries.slice(0, 8);
    tableHeader([
      { label: 'Customer', w: 140 },
      { label: 'Phone', w: 100 },
      { label: 'Vehicle', w: 170 },
      { label: 'Status', w: 80 },
      { label: 'Date', w: 65 },
    ]);

    recentSlice.forEach((i: any, idx: number) => {
      tableRow([
        { val: i.name, w: 140 },
        { val: i.phone || '—', w: 100 },
        { val: i.vehicle ? `${i.vehicle.make} ${i.vehicle.model}` : 'General', w: 170 },
        { val: i.status, w: 80, color: i.status === 'PENDING' ? '#b45309' : DARK },
        { val: fmtShort(i.createdAt), w: 65 },
      ], idx % 2 === 0);
    });

    // PAGE 2 — FULL INVENTORY
    newPage();
    doc.rect(0, 0, PW, 50).fill(INK);
    doc.fillColor(GOLD).fontSize(13).font('Helvetica-Bold')
       .text('INVENTORY — FULL LISTING', ML, 18, { characterSpacing: 1.5 });
    doc.fillColor(STONE).fontSize(8).font('Helvetica')
       .text(`${activeVehicles.length} active · ${soldVehicles.length} sold`, PW - MR - 120, 22, { width: 120, align: 'right' });
    doc.y = 65;

    tableHeader([
      { label: 'Vehicle', w: 160 },
      { label: 'Year', w: 40 },
      { label: 'Price (KES)', w: 100 },
      { label: 'Mileage', w: 70 },
      { label: 'Fuel', w: 55 },
      { label: 'Status', w: 65 },
      { label: 'Views', w: 45 },
    ]);

    vehicles.forEach((v, i) => {
      if (doc.y > 760) {
        newPage();
        doc.y = 40;
        tableHeader([
          { label: 'Vehicle', w: 160 },
          { label: 'Year', w: 40 },
          { label: 'Price (KES)', w: 100 },
          { label: 'Mileage', w: 70 },
          { label: 'Fuel', w: 55 },
          { label: 'Status', w: 65 },
          { label: 'Views', w: 45 },
        ]);
      }
      tableRow([
        { val: `${v.make} ${v.model}`, w: 160 },
        { val: String(v.year), w: 40 },
        { val: v.priceKES.toLocaleString(), w: 100, color: GOLD },
        { val: `${(v.mileage || 0).toLocaleString()} km`, w: 70 },
        { val: v.fuelType || '—', w: 55 },
        { val: v.status, w: 65, color: v.status === 'SOLD' ? '#16a34a' : DARK },
        { val: String(v.viewCount || 0), w: 45 },
      ], i % 2 === 0);
    });

    // PAGE 3 — FULL INQUIRIES + AGING
    newPage();
    doc.rect(0, 0, PW, 50).fill(INK);
    doc.fillColor(GOLD).fontSize(13).font('Helvetica-Bold')
       .text('INQUIRIES — FULL LOG', ML, 18, { characterSpacing: 1.5 });
    doc.fillColor(STONE).fontSize(8).font('Helvetica')
       .text(`${inquiries.length} total`, PW - MR - 120, 22, { width: 120, align: 'right' });
    doc.y = 65;

    tableHeader([
      { label: 'Customer', w: 120 },
      { label: 'Phone', w: 90 },
      { label: 'Vehicle', w: 150 },
      { label: 'Status', w: 70 },
      { label: 'Date', w: 65 },
    ]);

    inquiries.forEach((i: any, idx: number) => {
      if (doc.y > 760) {
        newPage();
        doc.y = 40;
        tableHeader([
          { label: 'Customer', w: 120 },
          { label: 'Phone', w: 90 },
          { label: 'Vehicle', w: 150 },
          { label: 'Status', w: 70 },
          { label: 'Date', w: 65 },
        ]);
      }
      tableRow([
        { val: i.name, w: 120 },
        { val: i.phone || '—', w: 90 },
        { val: i.vehicle ? `${i.vehicle.make} ${i.vehicle.model}` : 'General', w: 150 },
        { val: i.status, w: 70, color: i.status === 'PENDING' ? '#b45309' : DARK },
        { val: fmtShort(i.createdAt), w: 65 },
      ], idx % 2 === 0);
    });

    if (agingVehicles.length > 0) {
      if (doc.y > 650) newPage();
      doc.moveDown(1);
      doc.rect(ML, doc.y, CW, 24).fill('#fef3c7');
      doc.fillColor('#92400e').fontSize(9).font('Helvetica-Bold')
         .text(`ATTENTION — ${agingVehicles.length} vehicle(s) listed over 60 days`, ML + 12, doc.y + 8);
      doc.moveDown(1.8);

      tableHeader([
        { label: 'Vehicle', w: 200 },
        { label: 'Price', w: 120 },
        { label: 'Views', w: 80 },
        { label: 'Days listed', w: 115 },
      ]);

      agingVehicles.forEach((v, i) => {
        const days = Math.floor(
          (now.getTime() - new Date(v.createdAt).getTime())
          / (1000 * 60 * 60 * 24)
        );
        tableRow([
          { val: `${v.make} ${v.model} ${v.year}`, w: 200 },
          { val: fmt(v.priceKES), w: 120, color: GOLD },
          { val: String(v.viewCount || 0), w: 80 },
          { val: `${days} days`, w: 115, color: '#b45309' },
        ], i % 2 === 0);
      });
    }

    divider();
    doc.fillColor(STONE).fontSize(7).font('Helvetica')
       .text(`Sassy Auto Trading Kenya  ·  Generated ${fmtDate(now)}  ·  Confidential`, ML, doc.y, { align: 'center', width: CW });

    doc.end();

  } catch (error) {
    console.error('PDF export error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }
};
