import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export interface ExportPdfOptions {
  onProgress?: (current: number, total: number, message: string) => void;
}

const COMMON_IMAGE_OPTIONS = {
  quality: 0.95,
  pixelRatio: 2,
  backgroundColor: '#fcf8f5',
  cacheBust: true,
  skipFonts: true,
  fontEmbedCSS: '',
};

/**
 * Converts all pages rendered in #printable-book-container into a high-fidelity multi-page PDF (10 pages)
 * perfectly matching the interactive e-book styling 1:1 using native browser rendering.
 */
export async function generateHighQualityBookPdf(
  options?: ExportPdfOptions
): Promise<void> {
  const container = document.getElementById('printable-book-container');
  if (!container) {
    throw new Error('Elemen buku tidak ditemukan');
  }

  // Get all page elements
  const pageElements = container.querySelectorAll<HTMLElement>('.pdf-book-page');
  if (pageElements.length === 0) {
    throw new Error('Halaman buku tidak ditemukan');
  }

  const totalPages = pageElements.length;
  options?.onProgress?.(0, totalPages, 'Menyiapkan 10 halaman e-book berwarna...');

  // Initialize PDF in 29.7cm x 20.5cm landscape format (297mm x 205mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 205],
    compress: true,
  });

  const pdfWidth = 297; // mm
  const pdfHeight = 205; // mm

  for (let i = 0; i < totalPages; i++) {
    const pageEl = pageElements[i];
    options?.onProgress?.(
      i + 1,
      totalPages,
      `Merender halaman ${i + 1} dari ${totalPages}...`
    );

    // Render page to crisp image with 2x pixel ratio for high print resolution
    const imgData = await toJpeg(pageEl, COMMON_IMAGE_OPTIONS);

    if (i > 0) {
      pdf.addPage([297, 205], 'landscape');
    }

    // Insert full landscape page image
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  options?.onProgress?.(totalPages, totalPages, 'Menyimpan berkas PDF...');
  pdf.save('Buku_Resep_Selai_Apel_dan_Olahannya.pdf');
}

/**
 * Converts a specific single recipe sheet into a ready-to-download Landscape PDF (29.7 x 20.5 cm)
 * matching the exact e-book visual design 1:1.
 */
export async function generateSingleRecipePdf(
  recipeId: string,
  recipeTitle: string,
  options?: ExportPdfOptions
): Promise<void> {
  let targetEl = document.getElementById(`pdf-single-recipe-${recipeId}`);
  if (!targetEl) {
    // Fallback: try finding in main book container
    targetEl = document.getElementById(`pdf-page-5`);
  }

  if (!targetEl) {
    throw new Error(`Lembar resep "${recipeTitle}" tidak ditemukan.`);
  }

  options?.onProgress?.(1, 1, `Merender lembar resep ${recipeTitle} (landscape)...`);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 205],
    compress: true,
  });

  const pdfWidth = 297;
  const pdfHeight = 205;

  const imgData = await toJpeg(targetEl, COMMON_IMAGE_OPTIONS);

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  const sanitizedTitle = recipeTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  pdf.save(`Resep_Landscape_${sanitizedTitle}_Sumbergondo.pdf`);
}

/**
 * Converts selected chapter pages into a ready-to-download Landscape PDF (29.7 x 20.5 cm)
 */
export async function generateChapterPdf(
  pageNumbers: number[],
  chapterTitle: string,
  options?: ExportPdfOptions
): Promise<void> {
  const totalPages = pageNumbers.length;
  options?.onProgress?.(0, totalPages, `Menyiapkan ${chapterTitle}...`);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 205],
    compress: true,
  });

  const pdfWidth = 297;
  const pdfHeight = 205;

  for (let i = 0; i < pageNumbers.length; i++) {
    const pageNum = pageNumbers[i];
    const pageEl = document.getElementById(`pdf-page-${pageNum}`);
    if (!pageEl) continue;

    options?.onProgress?.(
      i + 1,
      totalPages,
      `Merender halaman ${pageNum} (${i + 1}/${totalPages})...`
    );

    const imgData = await toJpeg(pageEl, COMMON_IMAGE_OPTIONS);

    if (i > 0) {
      pdf.addPage([297, 205], 'landscape');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  const sanitizedTitle = chapterTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  pdf.save(`${sanitizedTitle}_Landscape_Sumbergondo.pdf`);
}

/**
 * Exports the UMKM Product Label Sheet formatted on standard A4 (210mm x 297mm)
 * with a 2x3 grid of 6 ready-to-cut jar sticker labels.
 */
export async function generatePackagingLabelSheetPdf(
  productTitle: string = 'Selai Apel Anna',
  options?: ExportPdfOptions
): Promise<void> {
  const targetEl = document.getElementById('pdf-packaging-label-a4-sheet');
  if (!targetEl) {
    throw new Error('Elemen lembar label kemasan A4 tidak ditemukan');
  }

  options?.onProgress?.(1, 1, `Merender lembar stiker label A4 untuk ${productTitle}...`);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData = await toJpeg(targetEl, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    skipFonts: true,
  });

  // A4 size: 210mm x 297mm
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

  const sanitized = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  pdf.save(`Lembar_Stiker_Label_${sanitized}_A4_Sumbergondo.pdf`);
}

/**
 * Exports a single HD product label badge as a standalone PDF for print vendors or packaging proofing
 */
export async function generateSingleLabelPdf(
  productTitle: string = 'Selai Apel Anna',
  options?: ExportPdfOptions
): Promise<void> {
  const targetEl = document.getElementById('pdf-single-label-preview');
  if (!targetEl) {
    throw new Error('Elemen label produk tidak ditemukan');
  }

  options?.onProgress?.(1, 1, `Merender label produk ${productTitle} resolusi tinggi...`);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [140, 95],
    compress: true,
  });

  const imgData = await toJpeg(targetEl, {
    quality: 0.98,
    pixelRatio: 2.5,
    backgroundColor: '#ffffff',
    cacheBust: true,
    skipFonts: true,
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, 140, 95, undefined, 'FAST');

  const sanitized = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  pdf.save(`Label_HD_${sanitized}_Sumbergondo.pdf`);
}

