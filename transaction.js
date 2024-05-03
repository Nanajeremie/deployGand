const { Op } = require("sequelize");
const raiseError = require("../middleware/showErro");
const {
  Transaction,
  RecepteurInfo,
  User,
  Paiement,
  MoyenPaiement,
} = require("../models");
const { stringToJSON } = require("../functions/json_process");
const { mailsTypes } = require("../enums/mails_types");
const { sendOtherMails } = require("./send_mails");

// add transaction
const addTransaction = async (req, res) => {
  const Joi = require("joi");
  const validate = Joi.object({
    motif: Joi.string().required(),
    moyen_transfert: Joi.string().required(),
    numero_transfert: Joi.string().required(),
    lien: Joi.string().required(),
    montant_envoie: Joi.string().required(),
    montant_reception: Joi.string().required(),
    taux_echange: Joi.string().required(),
    devise_base: Joi.string().required(),
    frais: Joi.string().required(),
    is_frais_percent: Joi.string().required(),
    monnaie_envoie: Joi.string().required(),
    monnaie_reception: Joi.string().required(),
    pays_envoie: Joi.string().required(),
    recepteur_id: Joi.string().required(),
    user_id: Joi.string().required(),
    id_pays_envoie: Joi.string().required(),
    eqv_monnaie_base: Joi.string().required(),
  });
  const {
    motif,
    moyen_transfert,
    numero_transfert,
    lien,
    montant_envoie,
    montant_reception,
    taux_echange,
    devise_base,
    frais,
    is_frais_percent,
    monnaie_envoie,
    pays_envoie,
    monnaie_reception,
    recepteur_id,
    user_id,
    id_pays_envoie,
    eqv_monnaie_base,
  } = req.body;
  const { error } = validate.validate(req.body);
  if (error) {
    raiseError(req, error);
    res.status(400).json({ message: error.details[0].message });
  } else {
    Transaction.create({
      motif: motif,
      moyen_transfert: moyen_transfert,
      numero_transfert: numero_transfert,
      lien: lien,
      montant_envoie: montant_envoie,
      montant_reception: montant_reception,
      taux_echange: taux_echange,
      devise_base: devise_base,
      frais: frais,
      is_frais_percent: is_frais_percent,
      monnaie_envoie: monnaie_envoie,
      monnaie_reception: monnaie_reception,
      pays_envoie: pays_envoie,
      RecepteurInfoId: recepteur_id,
      UserId: user_id,
      statut: 1,
      id_pays_envoie: id_pays_envoie,
      eqv_monnaie_base: eqv_monnaie_base,
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

// update transaction
const updateTransaction = async (req, res) => {
  const Joi = require("joi");
  const validate = Joi.object({
    motif: Joi.string().required(),
    moyen_transfert: Joi.string().required(),
    numero_transfert: Joi.string().required(),
    lien: Joi.string().required(),
    montant_envoie: Joi.string().required(),
    montant_reception: Joi.string().required(),
    taux_echange: Joi.string().required(),
    devise_base: Joi.string().required(),
    frais: Joi.string().required(),
    is_frais_percent: Joi.string().required(),
    monnaie_envoie: Joi.string().required(),
    monnaie_reception: Joi.string().required(),
    pays_envoie: Joi.string().required(),
    recepteur_id: Joi.string().required(),
    user_id: Joi.string().required(),
    id_pays_envoie: Joi.string().required(),
    eqv_monnaie_base: Joi.string().required(),
    id: Joi.string().required(),
  });
  const {
    motif,
    moyen_transfert,
    numero_transfert,
    lien,
    montant_envoie,
    montant_reception,
    taux_echange,
    devise_base,
    frais,
    is_frais_percent,
    monnaie_envoie,
    pays_envoie,
    monnaie_reception,
    recepteur_id,
    user_id,
    id_pays_envoie,
    eqv_monnaie_base,
    id,
  } = req.body;
  const { error } = validate.validate(req.body);
  if (error) {
    raiseError(req, error);
    res.status(400).json({ message: error.details[0].message });
  } else {
    Transaction.update(
      {
        motif: motif,
        moyen_transfert: moyen_transfert,
        numero_transfert: numero_transfert,
        lien: lien,
        montant_envoie: montant_envoie,
        montant_reception: montant_reception,
        taux_echange: taux_echange,
        devise_base: devise_base,
        frais: frais,
        is_frais_percent: is_frais_percent,
        monnaie_envoie: monnaie_envoie,
        monnaie_reception: monnaie_reception,
        pays_envoie: pays_envoie,
        RecepteurInfoId: recepteur_id,
        UserId: user_id,
        statut: 1,
        id_pays_envoie: id_pays_envoie,
        eqv_monnaie_base: eqv_monnaie_base,
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
      .then((data) => {
        res.status(200).json(data);
      });
  }
};
// get all transactions
const getAllTransactions = async (req, res) => {
  Transaction.findAll({
    include: [RecepteurInfo, User, Paiement],
    order: [[Paiement, "updatedAt", "DESC"]],
    paranoid: true,
  })
    .catch((err) => {
      res.status(500).json({ message: "Une erreur du serveur" });
      raiseError(req, err);
    })
    .then((data) => {
      res.status(200).json(data);
    });
};

// get transaction by id
const getTransactionById = async (req, res) => {
  const { id } = req.params;
  Transaction.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Paiement,
        include: [MoyenPaiement],
      },
      RecepteurInfo,
      User,
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

// get user transactions
const userTransactions = async (req, res) => {
  const { user } = req.params;
  const { filter_type, start_date, end_date } = req.query;

  if (filter_type == "all") {
    Transaction.findAndCountAll({
      where: {
        UserId: user,
      },
      order: [
        ["id", "DESC"],
        [Paiement, "updatedAt", "DESC"],
      ],
      // order: [[Paiement, "updatedAt", "DESC"]],
      include: [Paiement, RecepteurInfo, User],
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } else {
    let today = new Date();
    let startDate = new Date(
      `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    );
    let endDate = new Date(
      `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()} 23:59:59`
    );
    if (filter_type == "week") {
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
        0,
        0,
        0
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay()),
        23,
        59,
        59
      );
    }
    if (filter_type == "month") {
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        lastDayOfMonth,
        23,
        59,
        59
      );
    }
    if (filter_type == "custom") {
      startDate = new Date(start_date);
      endDate = new Date(`${end_date} 23:59:59`);
    }
    Transaction.findAndCountAll({
      where: {
        UserId: user,
        updatedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      // order: [],
      order: [
        ["id", "DESC"],
        [Paiement, "updatedAt", "DESC"],
      ],
      include: [Paiement, RecepteurInfo, User],
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
// get user transactions for check
const userTransactionsForCheck = async (req, res) => {
  const { user } = req.params;
  const { filter_type, start_date, end_date } = req.query;

  if (filter_type == "all") {
    Transaction.findAndCountAll({
      where: {
        UserId: user,
      },
      include: [
        {
          model: Paiement,
          require: true,
        },
      ],
      // order: [[Paiement, "updatedAt", "DESC"]],
      order: [["id", "DESC"]],
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } else {
    let today = new Date();
    let startDate = new Date(
      `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    );
    let endDate = new Date(
      `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()} 23:59:59`
    );
    if (filter_type == "week") {
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay()),
        23,
        59,
        59
      );
    }
    if (filter_type == "month") {
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        lastDayOfMonth,
        23,
        59,
        59
      );
    }
    if (filter_type == "custom") {
      startDate = new Date(start_date);
      endDate = new Date(`${end_date} 23:59:59`);
    }
    Transaction.findAndCountAll({
      where: {
        UserId: user,
        updatedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Paiement,
          required: true,
        },
      ],
      // order: [[Paiement, "updatedAt", "DESC"]],
      order: [["id", "DESC"]],
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
// delete  transactions
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  Transaction.destroy({
    where: {
      id: id,
    },
  })
    .catch((err) => {
      res.status(500).json({ message: "Une erreur du serveur" });
      raiseError(req, err);
    })
    .then((data) => {
      res.status(200).json({ message: "Opération réussie" });
    });
};

// get user transaction with filters
const userTransactionWithFilters = async (req, res) => {
  const { itemsCount, page, status } = req.query;

  const { user } = req.params;
  if (status == 255) {
    Transaction.findAndCountAll({
      where: {
        UserId: user,
      },
      limit: parseInt(itemsCount),
      offset: parseInt(itemsCount) * parseInt(page),
      include: [
        {
          model: RecepteurInfo,
          // where: {
          //   pays: {
          //     [Op.in]: ["Burkina Faso", "Mali"],
          //   },
          // },
        },
        User,
        Paiement,
      ],
      distinct: true,
      order: [[Paiement, "updatedAt", "DESC"]],
      // order: [["id", "DESC"]],
    })
      .catch((err) => {
        res.status(500).json({ message: "Une erreur du serveur" });
        raiseError(req, err);
      })
      .then((data) => {
        res.status(200).json(data);
      });
  } else {
    Transaction.findAndCountAll({
      where: {
        [Op.and]: [{ statut: parseInt(status) }, { UserId: user }],
      },
      limit: parseInt(itemsCount),
      offset: parseInt(itemsCount) * parseInt(page),
      include: [RecepteurInfo, User],
      distinct: true,
      // order: [["id", "DESC"]],
      order: [[Paiement, "updatedAt", "DESC"]],
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
// get transaction with filters
const allTransactionWithFilters = async (req, res) => {
  const { itemsCount, page, status, allow_pays, search } = req.query;

  if (status == 255) {
    if (allow_pays == "all") {
      Transaction.findAndCountAll({
        limit: parseInt(itemsCount),
        offset: parseInt(itemsCount) * parseInt(page),
        // order: [["id", "DESC"]],

        include: [
          {
            model: Paiement,
            required: true,
          },
          {
            model: RecepteurInfo,
          },

          {
            model: User,
            where: {
              [Op.or]: [
                {
                  nom: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  prenom: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
            },
            required: true,
          },
        ],
        order: [
          ["updatedAt", "DESC"],
          [Paiement, "updatedAt", "DESC"],
        ],
        distinct: true,
      })
        .catch((err) => {
          res.status(500).json({ message: "Une erreur du serveur" });
          raiseError(req, err);
        })
        .then((data) => {
          res.status(200).json(data);
        });
    } else {
      Transaction.findAndCountAll({
        limit: parseInt(itemsCount),
        offset: parseInt(itemsCount) * parseInt(page),
        // order: [["id", "DESC"]],

        include: [
          {
            model: Paiement,
            required: true,
          },
          {
            model: RecepteurInfo,
            where: {
              pays: {
                [Op.in]: allow_pays.split("_"),
              },
            },
          },

          {
            model: User,
            where: {
              [Op.or]: [
                {
                  nom: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  prenom: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
            },
          },
        ],
        distinct: true,
        order: [[Paiement, "updatedAt", "DESC"]],
      })
        .catch((err) => {
          res.status(500).json({ message: "Une erreur du serveur" });
          raiseError(req, err);
        })
        .then((data) => {
          res.status(200).json(data);
        });
    }
  } else {
    if (allow_pays == "all") {
      Transaction.findAndCountAll({
        limit: parseInt(itemsCount),
        offset: parseInt(itemsCount) * parseInt(page),
        // order: [["id", "DESC"]],
        order: [[Paiement, "updatedAt", "DESC"]],
        include: [
          {
            model: Paiement,
            where: {
              statut: parseInt(status),
            },
            required: true,
          },
          {
            model: RecepteurInfo,
          },
          {
            model: User,
            where: {
              [Op.or]: [
                {
                  nom: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  prenom: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
            },
          },
        ],
        distinct: true,
      })
        .catch((err) => {
          res.status(500).json({ message: "Une erreur du serveur" });
          raiseError(req, err);
        })
        .then((data) => {
          res.status(200).json(data);
        });
    } else {
      Transaction.findAndCountAll({
        limit: parseInt(itemsCount),
        offset: parseInt(itemsCount) * parseInt(page),
        // order: [["id", "DESC"]],

        include: [
          {
            model: Paiement,
            where: {
              statut: parseInt(status),
            },
            required: true,
          },
          {
            model: RecepteurInfo,
            where: {
              pays: {
                [Op.in]: allow_pays.split("_"),
              },
            },
          },
          {
            model: User,
          },
        ],
        order: [[Paiement, "updatedAt", "DESC"]],
        distinct: true,
      })
        .catch((err) => {
          res.status(500).json({ message: "Une erreur du serveur" });
          raiseError(req, err);
        })
        .then((data) => {
          res.status(200).json(data);
        });
    }
  }
};

// process transaction
const processTransaction = async (req, res) => {
  const { status, id, reject_reason } = req.body;
  Paiement.update(
    {
      statut: status,
      reject_reason: stringToJSON(reject_reason),
    },
    {
      where: {
        TransactionId: id,
      },
    }
  )
    .catch((err) => {
      raiseError(req, err);
      res.status(500).json({ message: "Une erreur du serveur" });
    })
    .then(async (data) => {
      const user = await Transaction.findOne({
        where: { id: id },
        include: [User],
      });

      const fullName = `${user.dataValues.User.nom} ${user.dataValues.User.prenom}`;
      if (status == 1) {
        sendOtherMails(
          mailsTypes.PayAccepted,
          fullName,
          user.dataValues.User.email
        );
      } else {
        sendOtherMails(
          mailsTypes.PayFailed,
          fullName,
          user.dataValues.User.email
        );
      }

      res.status(200).json({ message: "Opération réussie" });
    });
};

module.exports = {
  getAllTransactions,
  allTransactionWithFilters,
  userTransactionWithFilters,
  processTransaction,
  addTransaction,
  userTransactions,
  deleteTransaction,
  getTransactionById,
  updateTransaction,
  userTransactionsForCheck,
};
