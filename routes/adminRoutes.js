
const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");

const router = express.Router();

/* GET USERS */

router.get("/users", async(req,res)=>{

const users = await User.find();

res.json(users);

});

/* DELETE USER */

router.delete("/users/:id", async(req,res)=>{

await User.findByIdAndDelete(req.params.id);

res.json({message:"User deleted"});

});

/* GET PROJECTS */

router.get("/projects", async(req,res)=>{

const projects = await Project.find();

res.json(projects);

});

/* DELETE PROJECT */

router.delete("/projects/:id", async(req,res)=>{

await Project.findByIdAndDelete(req.params.id);

res.json({message:"Project deleted"});

});

module.exports = router;