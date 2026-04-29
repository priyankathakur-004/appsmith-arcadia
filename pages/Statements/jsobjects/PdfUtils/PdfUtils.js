export default {

  pdfStringToDataUrl() {
		const pdfString = GetStatementPDF.data;

    return `data:application/pdf;base64,${btoa(pdfString)}`;
  }
};
