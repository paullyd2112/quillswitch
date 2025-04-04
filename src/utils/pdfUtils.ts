
import { toast } from "sonner";

// This function is attached to the window object to be accessible from navConfig
export const setupPdfDownloader = () => {
  window.downloadAsPdf = () => {
    toast.info("Generating PDF...");
    
    import('html2pdf.js').then((html2pdf) => {
      const element = document.documentElement; // Get the entire HTML document
      const filename = 'quillswitch-export.pdf';
      
      const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF
      html2pdf.default(element, options)
        .then(() => {
          toast.success("PDF downloaded successfully!");
        })
        .catch((error: any) => {
          console.error("PDF generation failed:", error);
          toast.error("Failed to generate PDF. Please try again.");
        });
    }).catch((error) => {
      console.error("Failed to load html2pdf library:", error);
      toast.error("Failed to load PDF generator. Please try again later.");
    });
  };
};

// Declare global window type
declare global {
  interface Window {
    downloadAsPdf?: () => void;
  }
}
