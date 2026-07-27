const express = require("express")
const multer = require("multer")
const uploadFile = require("./services/storage.service")
const postmodel = require("./models/post.model")

const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({storage:multer.memoryStorage()})


app.post('/create-post',upload.single("image"),async (req,res)=>{
    console.log(req.body)

    const result = await uploadFile(req.file.buffer);

    const post = await postmodel.create({
        image: result.url,
        caption: req.body.caption
    })

    return res.status(201).json({
        message: "Post created successfully",
        post
    })

})

app.get("/posts", async(req,res)=>{

    const posts = await postmodel.find();

    return res.status(200).json({
        message : "All posts are fetched successfully",
        posts
    })
})
module.exports = app