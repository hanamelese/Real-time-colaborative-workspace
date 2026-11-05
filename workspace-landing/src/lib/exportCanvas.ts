import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportCanvasAsPng(element: HTMLElement, fileName = 'system-architecture.png') {
    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            pixelRatio: 2, // 2x resolution for high-DPI crispness
            backgroundColor: '#f8fafc', // Matches Tailwind bg-slate-50
            filter: (node) => {
                // Optional: filter out unwanted UI overlays if needed during export
                return true;
            },
        });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to export PNG:', err);
    }
}

export async function exportCanvasAsSvg(element: HTMLElement, fileName = 'system-architecture.svg') {
    try {
        const dataUrl = await toSvg(element, {
            backgroundColor: '#f8fafc',
        });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to export SVG:', err);
    }
}

export async function exportCanvasAsPdf(element: HTMLElement, fileName = 'system-architecture.pdf') {
    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#f8fafc',
        });

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(fileName);
    } catch (err) {
        console.error('Failed to export PDF:', err);
    }
}