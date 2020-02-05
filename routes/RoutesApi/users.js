const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../model/User');

// @route post api/users
//Register router
router.post(
  "/",
  [
    check("name", "Name is requred")
      .not()
      .notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {

    const body = req.body;

    console.log(JSON.stringify(`Body from req: ${JSON.stringify(body)}`));

    res.header("Access-Control-Allow-Origin", "*");


    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const {name, email, password} = req.body;

    try
    {
      let user = await User.findOne({ email });

      console.log(user);

      //See if the user exist
      if (user) {
        res.status(400).json({ error: [{ msg: "User alredy exist" }] });
      }
      //Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });
      //encrypt pass
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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