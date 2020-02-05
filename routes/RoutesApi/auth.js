const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');

// @route get api/auth
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(500).send('server error');
    }
})

router.post(
    "/",
    [
      // check("name", "Name is requred")
      //   .not()
      //   .notEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Password is required"
      ).exists()
    ],
    async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
  
      const { email, password} = req.body;
  
      try
      {
        let user = await User.findOne({ email });
  
        console.log(user);
  
        //See if the user exist
        if (!user) {
          res.status(400).json({ error: [{ msg: "Invalid Credentials" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
            .status(400)
            .json({error: [{msg:"Invalid Credential"}]})
        }
  
        //return json web token
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          {
            expiresIn: 36000
          },
          (err, token) => {
  
            console.log(token);
            if (err) throw err;
            res.json({ token });
          }
        );
      //   res.send("User reqgister");
      }
      catch(err)
      {
          console.log(err.message);
          res.status(500).send('server error')
      }  
    }
  );

module.exports = router;