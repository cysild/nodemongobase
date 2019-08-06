const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const express = require("express");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/find", auth, async (req, res) => {
 // const user = await User.findById(req.user._id).select("-password");

if(req.body.email){

}

  var user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Not found");
    try {
    //if can verify the token, set req.user and pass to next middleware
   //  console.log();
  res.send(user);
  } catch (ex) {
    //if invalid token
       res.send(ex);
  }

  // if(user.length > 0){
  //   res.send(user);
  // }
  res.send("no results found");
});
router.get("/all", auth, async (req, res) => {
 // const user = await User.findById(req.user._id).select("-password");



  var user = await User.find({});

  if (!user) return res.status(400).send("Not found");
    try {
    //if can verify the token, set req.user and pass to next middleware
   //  console.log();
  res.send(user);
  } catch (ex) {
    //if invalid token
       res.send(ex);
  }

  // if(user.length > 0){
  //   res.send(user);
  // }
  res.send("no results found");
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

module.exports = router;
