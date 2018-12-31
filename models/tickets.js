const mongoose = require("mongoose");
const Joi = require("joi");

const noteSchema = new mongoose.Schema({
  noteUser: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // User would be another collection in the Mongo DB
  },
  noteDate: {
    type: Date,
    required: true,
    maxlength: 99,
    trim: true
  },
  noteCustomer: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  noteInternal: {
    type: String,
    maxlength: 9999,
    trim: true
  }
});

function validateNote(note) {
  const schema = {
    noteUser: Joi.string()
      .min(24)
      .max(24)
      .required(),
    noteDate: Joi.date().required(),
    noteCustomer: Joi.string().max(9999),
    noteInternal: Joi.string().max(9999)
  };
  return Joi.validate(note, schema);
}

const changeSchema = new mongoose.Schema({
  changeRequester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // User would be another collection in the Mongo DB
  },
  changeTitle: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true
  },
  changeType: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  changePhase: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  changeJustification: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  changeDeploymentPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  changeBackoutPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  changeTestPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  changeImpactAnalysis: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  changeStartDate: {
    type: Date,
    required: true,
    trim: true
  },
  changeEndDate: {
    type: Date,
    required: true,
    trim: true
  },
  changeCABRequired: {
    type: Boolean,
    required: true
  },
  changeCloseCode: {
    type: String,
    maxlength: 99,
    trim: true
  },
  changeCloseNotes: {
    type: String,
    maxlength: 9999,
    trim: true
  },
  notes: [noteSchema]
});

function validateTicket(ticket) {
  const schema = {
    id: Joi.string()
      .min(24)
      .max(24),
    changeRequester: Joi.string()
      .min(24)
      .max(24)
      .required(),
    changeTitle: Joi.string()
      .min(2)
      .max(255)
      .required(),
    changeType: Joi.string()
      .min(2)
      .max(99)
      .required(),
    changePhase: Joi.string()
      .max(99)
      .required(),
    changeJustification: Joi.string()
      .max(9999)
      .required(),
    changeDeploymentPlan: Joi.string()
      .max(9999)
      .required(),
    changeBackoutPlan: Joi.string()
      .max(9999)
      .required(),
    changeTestPlan: Joi.string()
      .max(9999)
      .required(),
    changeImpactAnalysis: Joi.string()
      .max(9999)
      .required(),
    changeStartDate: Joi.date().required(),
    changeEndDate: Joi.date().required(),
    changeCABRequired: Joi.boolean().required(),
    changeCloseCode: Joi.string()
      .min(2)
      .max(99),
    changeCloseNotes: Joi.string()
      .min(2)
      .max(9999),
    notes: Joi.array().items(
      Joi.object().keys({
        noteUser: Joi.string()
          .min(24)
          .max(24),
        noteDate: Joi.date(),
        noteCustomer: Joi.string().max(9999),
        noteInternal: Joi.string().max(9999)
      })
    )
  };
  return Joi.validate(ticket, schema);
}

function validateID(id) {
  const schema = {
    id: Joi.string()
      .min(24)
      .max(24)
  };

  return Joi.validate(id, schema);
}

const Change = mongoose.model("Change", changeSchema);

async function addNote(id, note) {
  try {
    let result = await Change.findById(id);
    result.notes.push(note);
    result = await result.save();
    return result;
  } catch (error) {
    return error;
  }
}

module.exports.Change = Change;
module.exports.changeSchema = changeSchema;
module.exports.noteSchema = noteSchema;
module.exports.addNote = addNote;
module.exports.validateID = validateID;
module.exports.validateTicket = validateTicket;
module.exports.validateNote = validateNote;
