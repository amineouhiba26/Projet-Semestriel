const Payment = require("../models/Payment");
const Contract = require("../models/Contract");

// ADMIN - enregistrer un paiement pour un contrat
exports.createPayment = async (req, res) => {
  try {
    const { contractId, amount, method } = req.body;

    if (!contractId || !amount || !method) {
      return res.status(400).json({ message: "contractId, amount et method sont requis" });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contrat introuvable" });
    }

    const existing = await Payment.findOne({ contract: contractId });
    if (existing) {
      return res.status(400).json({ message: "Un paiement existe déjà pour ce contrat" });
    }

    const payment = await Payment.create({
      contract: contractId,
      amount,
      method,
      status: "PAID",
      paidAt: new Date(),
    });

    contract.isPaid = true;
    await contract.save();

    res.status(201).json(payment);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// ADMIN - liste des paiements
exports.getPayments = async (req, res) => {
  try {
    const list = await Payment.find()
      .populate("contract", "contractNumber totalPrice status");

    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// ADMIN - paiements d'un contrat
exports.getPaymentByContract = async (req, res) => {
  try {
    const payment = await Payment.findOne({ contract: req.params.contractId })
      .populate("contract", "contractNumber totalPrice status");

    if (!payment) {
      return res.status(404).json({ message: "Aucun paiement pour ce contrat" });
    }

    res.json(payment);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};
