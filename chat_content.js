const { Op } = require("sequelize");
const raiseError = require("../middleware/showErro");
const { ContenuChat, User, Droit } = require("../models");
const { getIo } = require("../functions/socket_io");
const { sendAdminMails } = require("../functions/admin_mails");

// add chat content
const addChatContent = async (req, res) => {
  const { message, chat_id, user_id } = req.body;
  ContenuChat.create({
    contenu: message,
    ChatId: chat_id,
    UserId: user_id,
  })
    .catch((err) => {
      res.status(500).json({ message: "Une erreur du serveur" });
      raiseError(req, err);
    })
    .then(async (data) => {
      const last_cnt = await ContenuChat.findOne({
        where: { id: data.id },
        include: [
          {
            model: User,
            include: [Droit],
          },
        ],
      });
      const fullName = `${last_cnt.dataValues.User.nom} ${last_cnt.dataValues.User.prenom}`;
      sendAdminMails("Message", "Nouveau message", fullName);
      getIo().emit("chat_msg_added", last_cnt);
      res.status(200).json(last_cnt);
    });
};

// get a chat contents
const getChatContent = async (req, res) => {
  const { chat_id } = req.params;
  ContenuChat.findAll({
    order: [["id", "ASC"]],
    where: {
      ChatId: chat_id,
    },
    include: [
      {
        model: User,
        include: [Droit],
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

// get user chat contents
const getUserChatContent = async (req, res) => {
  const { user_id, chat_id } = req.query;
  ContenuChat.findAll({
    order: [["id", "ASC"]],
    where: {
      UserId: user_id,
      ChatId: chat_id,
    },
    include: [
      {
        model: User,
        include: [Droit],
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

module.exports = {
  addChatContent,
  getChatContent,
  getUserChatContent,
};
