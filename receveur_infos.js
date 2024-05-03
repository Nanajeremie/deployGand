const { Op } = require("sequelize");
const raiseError = require("../middleware/showErro");
const { RecepteurInfo } = require("../models");
const Joi = require("joi");
const moment = require("moment");
// add a receiver infos
const addReceveur = async (req, res) => {
  const validate = Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    tel: Joi.string().required(),
    user_id: Joi.string().required(),
    pays: Joi.string().required(),
    pays_id: Joi.string().required(),
  });

  const { error } = validate.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    const { nom, prenom, tel, pays, user_id, pays_id } = req.body;
    RecepteurInfo.create({
      nom: nom,
      prenom: prenom,
      tel: tel,
      pays: pays,
      statut: 1,
      UserId: user_id,
      pays_id: pays_id,
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
const updReceveur = async (req, res) => {
  const validate = Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    tel: Joi.string().required(),
    user_id: Joi.string().required(),
    pays: Joi.string().required(),
    pays_id: Joi.string().required(),
    id: Joi.string().required(),
  });

  const { error } = validate.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    const { nom, prenom, tel, pays, user_id, pays_id, id } = req.body;
    RecepteurInfo.update(
      {
        nom: nom,
        prenom: prenom,
        tel: tel,
        pays: pays,
        statut: 1,
        UserId: user_id,
        pays_id: pays_id,
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
module.exports = { addReceveur, updReceveur };
