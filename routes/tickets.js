const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  Change,
  validateTicket,
  validateID,
} = require("../models/tickets");

const routes = function(app) {
  app.get("/api-v1/tickets", async (req, res) => {
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
        changeCABRequired: req.body.changeCABRequired
      });

      try {
        let change = await changeToAdd.save();
        res.send(change);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  });

  app.put("/api-v1/tickets", auth, async (req, res) => {
    const result = validateTicket(req.body);

    if (!result.error) {
      const id = req.body.id;

      try {
        console.log("In Try");

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
          console.log("In if");
          res.send("Couldn't update that user");
        } else {
          console.log("In else");
          res.send(result);
        }
      } catch (error) {
        console.log("In catch");
        res.send(error);
      }
    } else {
      res.send(result.error);
    }
  });

  app.delete("/api-v1/tickets", auth, async (req, res) => {
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
};

module.exports.routes = routes;
