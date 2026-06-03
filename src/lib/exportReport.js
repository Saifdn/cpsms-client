import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";

// ─── Style constants ──────────────────────────────────────────────────────────
const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E40AF" } };
const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Calibri" };

const TITLE_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
const TITLE_FONT  = { bold: true, color: { argb: "FFFFFFFF" }, size: 14, name: "Calibri" };

const META_FONT   = { color: { argb: "FF374151" }, size: 10, name: "Calibri" };
const META_FILL   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };

const KPI_LABEL_FONT  = { bold: true, color: { argb: "FF1E40AF" }, size: 10, name: "Calibri" };
const KPI_VALUE_FONT  = { bold: true, color: { argb: "FF111827" }, size: 11, name: "Calibri" };

const TOTAL_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFF6FF" } };
const TOTAL_FONT  = { bold: true, color: { argb: "FF1E3A8A" }, size: 11, name: "Calibri" };

const ALT_FILL    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFF" } };
const BODY_FONT   = { color: { argb: "FF111827" }, size: 10, name: "Calibri" };

const RM_FORMAT   = '"RM "#,##0.00';
const THIN_BORDER = { style: "thin", color: { argb: "FFD1D5DB" } };
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function styleHeaderRow(row, colCount) {
  row.height = 22;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.fill   = HEADER_FILL;
    cell.font   = HEADER_FONT;
    cell.border = ALL_BORDERS;
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right" };
  }
  row.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
}

function styleTotalRow(row, colCount) {
  row.height = 20;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.fill   = TOTAL_FILL;
    cell.font   = TOTAL_FONT;
    cell.border = ALL_BORDERS;
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right" };
  }
}

function styleDataRow(row, colCount, isAlt = false) {
  row.height = 18;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    if (isAlt) cell.fill = ALT_FILL;
    cell.font   = BODY_FONT;
    cell.border = ALL_BORDERS;
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right" };
  }
}

// ─── Sheet 1: Summary ─────────────────────────────────────────────────────────
function buildSummarySheet(wb, overall, periodLabel) {
  const ws = wb.addWorksheet("Summary");
  ws.views = [{ showGridLines: false }];

  // Column widths
  ws.columns = [
    { width: 30 },
    { width: 24 },
  ];

  // Title row
  ws.mergeCells("A1:B1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "CPSMS – Convocation Studio Report";
  titleCell.fill  = TITLE_FILL;
  titleCell.font  = TITLE_FONT;
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.border = ALL_BORDERS;
  ws.getRow(1).height = 30;

  // Period row
  ws.mergeCells("A2:B2");
  const periodCell = ws.getCell("A2");
  periodCell.value = `Period: ${periodLabel}`;
  periodCell.fill  = META_FILL;
  periodCell.font  = META_FONT;
  periodCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  periodCell.border = ALL_BORDERS;
  ws.getRow(2).height = 18;

  // Generated row
  ws.mergeCells("A3:B3");
  const genCell = ws.getCell("A3");
  genCell.value = `Generated: ${format(new Date(), "d MMM yyyy, h:mm a")}`;
  genCell.fill  = META_FILL;
  genCell.font  = META_FONT;
  genCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  genCell.border = ALL_BORDERS;
  ws.getRow(3).height = 18;

  // Blank row
  ws.getRow(4).height = 10;

  // KPI section header
  ws.mergeCells("A5:B5");
  const kpiHeader = ws.getCell("A5");
  kpiHeader.value = "Key Performance Indicators";
  kpiHeader.fill  = HEADER_FILL;
  kpiHeader.font  = HEADER_FONT;
  kpiHeader.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  kpiHeader.border = ALL_BORDERS;
  ws.getRow(5).height = 20;

  const avgRevenue = overall.totalDays > 0
    ? Math.round(overall.grandTotal / overall.totalDays)
    : 0;

  const kpis = [
    ["Total Bookings",       overall.totalBookings ?? 0],
    ["Grand Total Revenue",  overall.grandTotal ?? 0],
    ["Event Days",           overall.totalDays ?? 0],
    ["Avg Revenue / Day",    avgRevenue],
    ["Frame Orders (count)", overall.frameOrders?.totalOrders ?? 0],
    ["Frame Orders Revenue", overall.frameOrders?.totalRevenue ?? 0],
  ];

  kpis.forEach(([label, value], i) => {
    const row = ws.getRow(6 + i);
    row.height = 22;
    const labelCell = row.getCell(1);
    const valueCell = row.getCell(2);

    labelCell.value = label;
    labelCell.font  = KPI_LABEL_FONT;
    labelCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };
    labelCell.border = ALL_BORDERS;
    labelCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

    valueCell.font   = KPI_VALUE_FONT;
    valueCell.border = ALL_BORDERS;
    valueCell.alignment = { vertical: "middle", horizontal: "right" };

    if (label.includes("Revenue") || label.includes("Day") && !label.includes("Event")) {
      valueCell.value      = value;
      valueCell.numFmt     = RM_FORMAT;
    } else {
      valueCell.value = value;
    }
  });
}

// ─── Sheet 2: Revenue by Day ──────────────────────────────────────────────────
function buildRevenueByDaySheet(wb, eventDays) {
  const ws = wb.addWorksheet("Revenue by Day");
  ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

  ws.columns = [
    { key: "date",          header: "Date",              width: 20 },
    { key: "totalBookings", header: "Total Bookings",    width: 18 },
    { key: "grandTotal",    header: "Grand Total (RM)",  width: 22 },
  ];

  styleHeaderRow(ws.getRow(1), 3);

  let totalBookings = 0;
  let totalRevenue  = 0;

  eventDays.forEach((day, i) => {
    const row = ws.addRow({
      date:          format(new Date(day.date), "d MMM yyyy (EEE)"),
      totalBookings: day.totalBookings,
      grandTotal:    day.grandTotal,
    });
    styleDataRow(row, 3, i % 2 === 1);
    row.getCell(3).numFmt = RM_FORMAT;
    totalBookings += day.totalBookings ?? 0;
    totalRevenue  += day.grandTotal ?? 0;
  });

  // Total row
  const totalRow = ws.addRow({
    date:          "TOTAL",
    totalBookings: totalBookings,
    grandTotal:    totalRevenue,
  });
  styleTotalRow(totalRow, 3);
  totalRow.getCell(3).numFmt = RM_FORMAT;
}

// ─── Sheet 3 & 4 helper: breakdown table ──────────────────────────────────────
function buildBreakdownSheet(wb, sheetName, rows) {
  const ws = wb.addWorksheet(sheetName);
  ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

  ws.columns = [
    { key: "name",    header: "Name",           width: 30 },
    { key: "price",   header: "Unit Price (RM)", width: 20 },
    { key: "qty",     header: "Qty Sold",        width: 14 },
    { key: "revenue", header: "Revenue (RM)",    width: 20 },
  ];

  styleHeaderRow(ws.getRow(1), 4);

  let totalQty = 0;
  let totalRev = 0;

  rows.forEach((item, i) => {
    const row = ws.addRow({
      name:    item.name,
      price:   item.price,
      qty:     item.qty,
      revenue: item.revenue,
    });
    styleDataRow(row, 4, i % 2 === 1);
    row.getCell(2).numFmt = RM_FORMAT;
    row.getCell(4).numFmt = RM_FORMAT;
    totalQty += item.qty ?? 0;
    totalRev += item.revenue ?? 0;
  });

  // Total row
  const totalRow = ws.addRow({
    name:    "TOTAL",
    price:   null,
    qty:     totalQty,
    revenue: totalRev,
  });
  styleTotalRow(totalRow, 4);
  totalRow.getCell(4).numFmt = RM_FORMAT;
}

// ─── Sheet 5 & 6: qty pivot by date ───────────────────────────────────────────
// ─── Sheet 7: frame orders breakdown ─────────────────────────────────────────
function buildFrameOrdersSheet(wb, frameOrders) {
  const frames = frameOrders?.frames ?? [];
  const ws = wb.addWorksheet("Frame Orders");
  ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

  ws.columns = [
    { key: "name",    header: "Frame",        width: 30 },
    { key: "qty",     header: "Qty Sold",     width: 14 },
    { key: "revenue", header: "Revenue (RM)", width: 20 },
  ];

  styleHeaderRow(ws.getRow(1), 3);

  let totalQty = 0;
  let totalRev = 0;

  frames.forEach((item, i) => {
    const row = ws.addRow({ name: item.name, qty: item.qty, revenue: item.revenue });
    styleDataRow(row, 3, i % 2 === 1);
    row.getCell(3).numFmt = RM_FORMAT;
    totalQty += item.qty ?? 0;
    totalRev += item.revenue ?? 0;
  });

  const totalRow = ws.addRow({ name: "TOTAL", qty: totalQty, revenue: totalRev });
  styleTotalRow(totalRow, 3);
  totalRow.getCell(3).numFmt = RM_FORMAT;
}


function buildQtyByDateSheet(wb, sheetName, eventDays, itemKey) {
  // Collect all unique product names in the order they first appear
  const names = [];
  const seen  = new Set();
  eventDays.forEach((day) => {
    (day[itemKey] ?? []).forEach((item) => {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        names.push(item.name);
      }
    });
  });

  const colCount = 1 + names.length + 1; // Date + one per name + Total Qty

  const ws = wb.addWorksheet(sheetName);
  ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

  ws.columns = [
    { key: "_date",  header: "Date",      width: 22 },
    ...names.map((n) => ({ key: n, header: n, width: Math.max(n.length + 4, 14) })),
    { key: "_total", header: "Total Qty", width: 14 },
  ];

  styleHeaderRow(ws.getRow(1), colCount);

  const nameTotals  = Object.fromEntries(names.map((n) => [n, 0]));
  let grandTotal    = 0;

  eventDays.forEach((day, i) => {
    const qtyMap = {};
    (day[itemKey] ?? []).forEach((item) => {
      qtyMap[item.name] = item.qty;
    });

    let rowTotal = 0;
    const rowData = { _date: format(new Date(day.date), "d MMM yyyy (EEE)") };
    names.forEach((n) => {
      const qty    = qtyMap[n] ?? 0;
      rowData[n]   = qty;
      rowTotal    += qty;
      nameTotals[n] += qty;
    });
    rowData._total = rowTotal;
    grandTotal    += rowTotal;

    const row = ws.addRow(rowData);
    styleDataRow(row, colCount, i % 2 === 1);
  });

  // Total row
  const totalData = { _date: "TOTAL" };
  names.forEach((n) => { totalData[n] = nameTotals[n]; });
  totalData._total = grandTotal;
  styleTotalRow(ws.addRow(totalData), colCount);
}

// ─── Main export function ─────────────────────────────────────────────────────
export async function downloadReportExcel(summary, periodLabel) {
  const overall      = summary?.overall ?? {};
  const eventDays    = summary?.eventDays ?? [];
  const packages     = overall.packageBreakdown ?? [];
  const addons       = overall.addonBreakdown ?? [];
  const frameOrders  = overall.frameOrders ?? { frames: [] };

  const wb = new ExcelJS.Workbook();
  wb.creator   = "CPSMS";
  wb.lastModifiedBy = "CPSMS";
  wb.created   = new Date();
  wb.modified  = new Date();

  buildSummarySheet(wb, overall, periodLabel);
  buildRevenueByDaySheet(wb, eventDays);
  buildBreakdownSheet(wb, "Package Breakdown", packages);
  buildBreakdownSheet(wb, "Addon Breakdown", addons);
  buildQtyByDateSheet(wb, "Package Qty by Date", eventDays, "packages");
  buildQtyByDateSheet(wb, "Addon Qty by Date", eventDays, "addons");
  buildFrameOrdersSheet(wb, frameOrders);

  const buffer   = await wb.xlsx.writeBuffer();
  const blob     = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `cpsms-report-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  saveAs(blob, filename);
}
