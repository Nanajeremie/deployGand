const { Op } = require("sequelize");
const raiseError = require("../middleware/showErro");
const { FraisTransaction, TauxTransaction } = require("../models");

// add frais de transaction
const add = async (req, res) => {
  const { envoie, reception, montant, is_percent, id } = req.body;
  if (id == 0) {
    FraisTransaction.create({
      envoie: envoie,
      reception: reception,
      montant: montant,
      is_percent: is_percent,
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then(async (data) => {
        res.status(200).json({ message: "Opération reussie" });
      });
  } else {
    FraisTransaction.update(
      {
        envoie: envoie,
        reception: reception,
        montant: montant,
        is_percent: is_percent,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then(async (data) => {
        res.status(200).json({ message: "Opération reussie" });
      });
  }
};
// get all frais
const getFrais = async (req, res) => {
  FraisTransaction.findAll({
    order: [["id", "ASC"]],
    include: [
      {
        model: TauxTransaction,
        where: {
          destroyTime: null,
        },
        required: true,
      },
    ],
  })
    .catch((err) => {
      res.status(500).json({ message: "Une erreur du serveur" });
      raiseError(req, err);
    })
    .then((data) => {
      res.status(200).json(data);
    });
};

// get all frais
const getSingleFrais = async (req, res) => {
  const { baseOnTaux, id } = req.params;
  if (baseOnTaux == "1") {
    FraisTransaction.findOne({
      where: {
        TauxTransactionId: id,
      },
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } else {
    FraisTransaction.findOne({
      where: {
        id: id,
      },
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then((data) => {
        res.status(200).json(data);
      });
  }
};
module.exports = { add, getFrais, getSingleFrais };
