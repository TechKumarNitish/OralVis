import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportPDFButton() {
  const exportToPDF = async () => {
    const input = document.getElementById("report-content");

    // Wait for all images to fully load
    const images = input.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = resolve;
        });
      })
    );

    // Capture the HTML content to canvas with CORS support
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Dental-Checkup-Report.pdf");
  };

  return (
    <button
      onClick={exportToPDF}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    >
      Export PDF
    </button>
  );
}
