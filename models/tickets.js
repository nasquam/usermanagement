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

const ticketSchema = new mongoose.Schema({
  ticketRequester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // User would be another collection in the Mongo DB
  },
  ticketTitle: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true
  },
  ticketType: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  ticketPhase: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  ticketJustification: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  ticketDeploymentPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  ticketBackoutPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  ticketTestPlan: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  ticketImpactAnalysis: {
    type: String,
    required: true,
    maxlength: 9999,
    trim: true
  },
  ticketStartDate: {
    type: Date,
    required: true,
    trim: true
  },
  ticketEndDate: {
    type: Date,
    required: true,
    trim: true
  },
  ticketCABRequired: {
    type: Boolean,
    required: true
  },
  ticketCloseCode: {
    type: String,
    maxlength: 99,
    trim: true
  },
  ticketCloseNotes: {
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
    ticketRequester: Joi.string()
      .min(24)
      .max(24)
      .required(),
    ticketTitle: Joi.string()
      .min(2)
      .max(255)
      .required(),
    ticketType: Joi.string()
      .min(2)
      .max(99)
      .required(),
    ticketPhase: Joi.string()
      .max(99)
      .required(),
    ticketJustification: Joi.string()
      .max(9999)
      .required(),
    ticketDeploymentPlan: Joi.string()
      .max(9999)
      .required(),
    ticketBackoutPlan: Joi.string()
      .max(9999)
      .required(),
    ticketTestPlan: Joi.string()
      .max(9999)
      .required(),
    ticketImpactAnalysis: Joi.string()
      .max(9999)
      .required(),
    ticketStartDate: Joi.date().required(),
    ticketEndDate: Joi.date().required(),
    ticketCABRequired: Joi.boolean().required(),
    ticketCloseCode: Joi.string()
      .min(2)
      .max(99),
    ticketCloseNotes: Joi.string()
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

const Ticket = mongoose.model("Ticket", ticketSchema);

async function addNote(id, note) {
  try {
    let result = await Ticket.findById(id);
    result.notes.push(note);
    result = await result.save();
    return result;
  } catch (error) {
    return error;
  }
}

module.exports.Ticket = Ticket;
module.exports.ticketSchema = ticketSchema;
module.exports.noteSchema = noteSchema;
module.exports.addNote = addNote;
module.exports.validateID = validateID;
module.exports.validateTicket = validateTicket;
module.exports.validateNote = validateNote;
