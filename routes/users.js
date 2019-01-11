const {
  User,
  validateUser,
  validateID,
  genAuthToken,
  getUser,
  getUsers,
  deleteUser
} = require("../models/users")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const bcrypt = require("bcryptjs")

const routes = function(app) {
  // ****************** GET METHOD ********************** //
  app.get("/api-v1/users", async (req, res) => {
    try {
      let results = await getUsers()
      res.send(results)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })

  // ****************** POST METHOD ********************* //
  app.post("/api-v1/users", [auth, admin], async (req, res) => {

    const result = validateUser(req.body)
    if (!result.error) {
      const password = req.body.password
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      const userToAdd = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashed,
        email: req.body.email.toLowerCase(),
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      })

      try {
        let user = await userToAdd.save()
        const token = genAuthToken(user)
        res
          .header("X-Auth-Token", token)
          .status(200)
          .send(token)
      } catch (error) {
        let result = error.message
        res.send(result)
      }
    } else {
      res.send(result.error)
    }
  })

  // ****************** PUT METHOD ********************** //
  app.put("/api-v1/users", auth, async (req, res) => {
    const result = validateUser(req.body)

    if (!result.error) {
      const password = req.body.password
      const id = req.body.id
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      let firstName = req.body.firstName
      let lastName = req.body.lastName
      let email = req.body.email.toLowerCase()
      let isAdmin = req.body.isAdmin
      let address = req.body.address
      let city = req.body.city
      let state = req.body.state
      let zip = req.body.zip

      try {
        const user = await User.findOneAndUpdate(
          { _id: id },
          {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            password: `${hashed}`,
            email: `${email}`,
            isAdmin: `${isAdmin}`,
            address: `${address}`,
            city: `${city}`,
            state: `${state}`,
            zip: `${zip}`
          },
          { new: true }
        )

        if (!user) {
          res.send("Could not update that user, please validate your data")
        } else {
          res.send(user)
        }
      } catch (error) {
        let result = error.message
        res.send(result)
      }
    } else {
      res.send(result.error)
    }
  })

  // ****************** DELETE METHOD ******************* //
  app.delete("/api-v1/users/:id", [auth, admin], async (req, res) => {
    
    let idObj = {
      id: req.params.id
    }
  
    let result = validateID(idObj);
  
    if (!result.error) {
      const id = req.params.id

      try {
        let result = await deleteUser(id)
        res.send(result)
      } catch (error) {
        res.status(500).send(error.message)
      }

     } else {
       res.status(400).send(result.error.message)
     }
  })

  // ****************** GET BY ID METHOD **************** //
  app.get("/api-v1/users/:id", async (req, res) => {
    const id = req.params.id
    let result = await getUser(id)
    res.send(result)
  })
}

module.exports.routes = routes
