const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// contract, user, vehicle, reservation => génère un PDF et renvoie le chemin
const generateContractPdf = (contract, user, vehicle, reservation) => {
  return new Promise((resolve, reject) => {
    try {
      const docsDir = path.join(__dirname, "..", "contracts_pdfs");
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      const fileName = `contract-${contract._id}.pdf`;
      const filePath = path.join(docsDir, fileName);

      const doc = new PDFDocument();

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- Contenu du PDF ---
      doc.fontSize(20).text("Contrat de location de véhicule", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Numéro de contrat : ${contract.contractNumber}`);
      doc.text(`Date de création : ${new Date(contract.createdAt).toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(14).text("Informations client");
      doc.fontSize(12).text(`Nom : ${user.firstName} ${user.lastName}`);
      doc.text(`Email : ${user.email}`);
      doc.moveDown();

      doc.fontSize(14).text("Véhicule");
      doc.fontSize(12).text(`Marque / Modèle : ${vehicle.brand} ${vehicle.model}`);
      doc.text(`Immatriculation : ${vehicle.plateNumber}`);
      doc.moveDown();

      doc.fontSize(14).text("Détails de la location");
      doc.fontSize(12).text(`Date de début : ${contract.startDate.toISOString().slice(0,10)}`);
      doc.text(`Date de fin   : ${contract.endDate.toISOString().slice(0,10)}`);
      doc.text(`Prix total    : ${contract.totalPrice} TND`);
      doc.moveDown();

      doc.text(
        "Le client s'engage à restituer le véhicule en bon état et à respecter les termes de ce contrat.",
        { align: "justify" }
      );

      doc.moveDown(2);
      doc.text("Signature client : _____________________");
      doc.moveDown();
      doc.text("Signature agence : _____________________");

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateContractPdf };
