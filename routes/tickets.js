const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  Change,
  validateTicket,
  validateID,
  validateNote,
  addNote
} = require("../models/tickets");

const routes = function(app) {
  app.get("/api-v1/tickets", auth, async (req, res) => {
    try {
      const result = await Change.find()
        .populate("changeRequester", "firstName lastName email")
        .select("-__v");
      res.send(result);
    } catch (error) {
      res
        .status(500)
        .send("Unable to query the database, please try again later");
    }
  });

  app.post("/api-v1/tickets", auth, async (req, res) => {
    const result = validateTicket(req.body);

    let notes = req.body.notes || [];

    if (Object.keys(notes).length > 0) {
      notes.forEach(note => {
        let currentDate = Date.now();
        note.noteDate = currentDate;
        let noteResult = validateNote(note);

        if (noteResult.error) {
          console.log(noteResult.error);
        }
      });
    }

    if (!result.error) {
      let changeToAdd = new Change({
        changeRequester: req.body.changeRequester,
        changeTitle: req.body.changeTitle,
        changeType: req.body.changeType,
        changePhase: req.body.changePhase,
        changeJustification: req.body.changeJustification,
        changeDeploymentPlan: req.body.changeDeploymentPlan,
        changeBackoutPlan: req.body.changeBackoutPlan,
        changeTestPlan: req.body.changeTestPlan,
        changeImpactAnalysis: req.body.changeImpactAnalysis,
        changeStartDate: req.body.changeStartDate,
        changeEndDate: req.body.changeEndDate,
        changeCABRequired: req.body.changeCABRequired,
        notes: notes
      });

      try {
        let change = await changeToAdd.save();
        res.send(change);
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).send(result.error);
    }
  });

  app.put("/api-v1/tickets", auth, async (req, res) => {
    const result = validateTicket(req.body);
    if (!result.error) {
      const id = req.body.id;
      try {
        let ticket = await Change.findByIdAndUpdate(
          { _id: id },
          {
            changeRequester: req.body.changeRequester,
            changeTitle: req.body.changeTitle,
            changeType: req.body.changeType,
            changePhase: req.body.changePhase,
            changeJustification: req.body.changeJustification,
            changeDeploymentPlan: req.body.changeDeploymentPlan,
            changeBackoutPlan: req.body.changeBackoutPlan,
            changeTestPlan: req.body.changeTestPlan,
            changeImpactAnalysis: req.body.changeImpactAnalysis,
            changeStartDate: req.body.changeStartDate,
            changeEndDate: req.body.changeEndDate,
            changeCABRequired: req.body.changeCABRequired
          },
          { new: true }
        );

        if (!ticket) {
          res.send("Couldn't update that ticket");
        } else {
          res.send(ticket);
        }
      } catch (error) {
        console.log("In catch");
        res.send(error);
      }
    } else {
      res.send(result.error);
    }
  });

  app.delete("/api-v1/tickets", [auth, admin], async (req, res) => {
    const result = validateID(req.body);

    if (!result.error) {
      const id = req.body.id;
      try {
        const change = await Change.findByIdAndDelete(id);
        if (!change) {
          res.status(404).send("There was no change with this ID found");
        } else {
          res.send(change);
        }
      } catch (error) {
        res.send(error.message);
      }
    }
  });

  app.post("/api-v1/tickets/:id/notes", auth, async (req, res) => {
    const id = req.params.id;

    let ticketData = { id: id };

    console.log(ticketData);

    let result = validateID(ticketData);

    if (!result.error) {
      let note = req.body.note;
      let currentDate = Date.now();
      note.noteDate = currentDate;
      let noteResult = validateNote(req.body.note);

      if (!noteResult.error) {
        let result = await addNote(id, note);
        res.send(result);
      } else {
        res.status(500).send(noteResult.error);
      }
    } else {
      res.status(500).send(result.error);
    }
  });

  app.delete("/api-v1/tickets/:ticketID/notes/:noteID", auth, async (req, res) => {
      const ticketID = req.params.ticketID;
      const noteID = req.params.noteID;

      const ticket = { id: ticketID };
      const note = { id: noteID };

      const validTicketID = validateID(ticket);
      const validNoteID = validateID(note);

      if (!validTicketID.error) {
        if (!validNoteID.error) {
          try {
            let ticket = await Change.findById(ticketID);
            ticket.notes.id(noteID).remove();
            let result = await ticket.save();
            res.send(result);
          } catch (error) {
            res.status(500).send(error);
          }
        } else {
          res.status(500).send(validNoteID.error);
        }
      } else {
        res.status(500).send(validTicketID.error);
      }
    });

  app.put("/api-v1/tickets/:ticketID/notes/:noteID", auth, async (req, res) => {
    const ticketID = req.params.ticketID;
    const noteID = req.params.noteID;

    const ticket = { id: ticketID };
    const note = { id: noteID };

    const validTicketID = validateID(ticket);
    const validNoteID = validateID(note);

    if (!validTicketID.error) {
      if (!validNoteID.error) {
        try {

          let ticket = await Change.findById(ticketID);
          let note = await ticket.notes.id(noteID)
          let now = Date.now()
          let userID = note.noteUser.toString();

          let updateNote = {
                noteUser: userID,
                noteCustomer: req.body.noteCustomer,
                noteInternal: req.body.noteInternal,
                noteDate: now
          }

          let noteValidated = validateNote(updateNote)

          if(!noteValidated.error){
            note.noteCustomer = req.body.noteCustomer;
            note.noteInternal = req.body.noteInternal;
            let result = await ticket.save();
            res.send(result);
          } else {
           res.status(500).send(validateNote.error)
          }
          
        } catch (error) {
          res.status(500).send(error);
        }
      } else {
        res.status(500).send(validNoteID.error);
      }
    } else {
      res.status(500).send(validTicketID.error);
    }
  });
};

module.exports.routes = routes;
