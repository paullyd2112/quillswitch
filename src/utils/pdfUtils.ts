
import html2pdf from 'html2pdf.js';

export const setupPdfExporter = () => {
  window.exportSiteAsPdf = () => {
    // Configure the PDF options
    const options = {
      margin: 10,
      filename: 'quillswitch-export.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Create a clone of the document body to modify for PDF export
    const contentElement = document.createElement('div');
    contentElement.innerHTML = document.body.innerHTML;
    
    // Remove elements we don't want in the PDF (like navigation, buttons, etc.)
    const elementsToRemove = contentElement.querySelectorAll('nav, footer, button, .no-print');
    elementsToRemove.forEach(el => el.remove());
    
    // Style the content for better PDF appearance
    const style = document.createElement('style');
    style.textContent = `
      body { font-family: Arial, sans-serif; color: #333; }
      h1, h2, h3 { color: #1a1a1a; }
      img { max-width: 100%; height: auto; }
      .container { width: 100%; padding: 0; }
    `;
    contentElement.prepend(style);
    
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(contentElement);
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Generate the PDF
    html2pdf()
      .from(tempContainer)
      .set(options)
      .save()
      .then(() => {
        // Clean up the temporary container
        document.body.removeChild(tempContainer);
      });
  };
};

// Type definition for the global window object
declare global {
  interface Window {
    exportSiteAsPdf?: () => void;
  }
}
