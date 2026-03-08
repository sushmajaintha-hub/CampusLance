
const express = require("express")
const Project = require("../models/project")
const {protect, authorize} = require("../middleware/authMiddleware")

const router = express.Router()

/* =================================
   PAY STUDENT
================================= */

router.post("/:projectId/pay",protect,authorize("client"),async(req,res)=>{

try{

const project = await Project.findById(req.params.projectId)

if(!project){
return res.status(404).json({message:"Project not found"})
}

if(project.client.toString() !== req.user._id.toString()){
return res.status(403).json({message:"Not authorized"})
}

project.paymentStatus="paid"
project.status="completed"

await project.save()

res.json({
message:"Payment successful",
project
})

}catch(error){

res.status(500).json({message:"Server error"})

}

})

module.exports = router