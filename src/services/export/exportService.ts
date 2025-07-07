import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createObjectCsvWriter } from 'csv-writer';
import { toast } from 'sonner';

export interface ExportOptions {
  filename?: string;
  format: 'pdf' | 'csv' | 'json';
  includeTimestamp?: boolean;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  summary: Record<string, any>;
  data: any[];
  metadata?: Record<string, any>;
}

/**
 * Service for exporting data and reports in various formats
 */
export class ExportService {
  
  /**
   * Export data as CSV
   */
  static async exportCSV(data: any[], filename: string = 'export') {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      // Get headers from first object
      const headers = Object.keys(data[0]).map(key => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
      }));

      // Create CSV string manually for browser compatibility
      const csvContent = this.generateCSVContent(data, headers);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadBlob(blob, `${filename}.csv`);
      
      toast.success(`CSV exported successfully: ${filename}.csv`);
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error('Failed to export CSV');
      throw error;
    }
  }

  /**
   * Export data as JSON
   */
  static async exportJSON(data: any, filename: string = 'export') {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      this.downloadBlob(blob, `${filename}.json`);
      
      toast.success(`JSON exported successfully: ${filename}.json`);
    } catch (error) {
      console.error('JSON export failed:', error);
      toast.error('Failed to export JSON');
      throw error;
    }
  }

  /**
   * Export HTML element as PDF
   */
  static async exportElementAsPDF(
    elementId: string, 
    filename: string = 'report',
    options: {
      orientation?: 'portrait' | 'landscape';
      format?: 'a4' | 'letter';
      margin?: number;
    } = {}
  ) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - (options.margin || 20);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', options.margin || 10, options.margin || 10, imgWidth, imgHeight);
      
      // Download PDF
      pdf.save(`${filename}.pdf`);
      
      toast.success(`PDF exported successfully: ${filename}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
      throw error;
    }
  }

  /**
   * Generate comprehensive report PDF
   */
  static async generateReportPDF(reportData: ReportData, filename: string = 'report') {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportData.title, margin, yPosition);
      yPosition += 15;

      // Add subtitle if provided
      if (reportData.subtitle) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(reportData.subtitle, margin, yPosition);
        yPosition += 10;
      }

      // Add timestamp
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
      yPosition += 15;

      // Add summary section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      Object.entries(reportData.summary).forEach(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        pdf.text(`${label}: ${value}`, margin, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Add data section if provided
      if (reportData.data && reportData.data.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Results', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');

        // Create simple table
        const headers = Object.keys(reportData.data[0]);
        const cellWidth = (pageWidth - 2 * margin) / headers.length;

        // Table headers
        headers.forEach((header, index) => {
          pdf.text(
            header.charAt(0).toUpperCase() + header.slice(1),
            margin + index * cellWidth,
            yPosition
          );
        });
        yPosition += 6;

        // Table data (first 20 rows to avoid page overflow)
        reportData.data.slice(0, 20).forEach((row) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }

          headers.forEach((header, index) => {
            const value = String(row[header] || '').substring(0, 20); // Truncate long values
            pdf.text(value, margin + index * cellWidth, yPosition);
          });
          yPosition += 6;
        });
      }

      // Add metadata if provided
      if (reportData.metadata) {
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Additional Information', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        Object.entries(reportData.metadata).forEach(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          pdf.text(`${label}: ${String(value)}`, margin, yPosition);
          yPosition += 6;
        });
      }

      // Save PDF
      pdf.save(`${filename}.pdf`);
      
      toast.success(`Report PDF generated successfully: ${filename}.pdf`);
    } catch (error) {
      console.error('Report PDF generation failed:', error);
      toast.error('Failed to generate report PDF');
      throw error;
    }
  }

  /**
   * Helper method to generate CSV content
   */
  private static generateCSVContent(data: any[], headers: Array<{id: string, title: string}>): string {
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.map(h => h.title).join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header.id];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  /**
   * Helper method to download blob as file
   */
  private static downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}