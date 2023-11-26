const router = require("express").Router()
const{subgreddiit} = require("../models/subgreddit")
const{posts} = require("../models/posts")
const{User} = require("../models/user")
const {savedpost} = require("../models/savedpost")

let postts = []
let flag = true

const getsubredposts = async(subredd) => {
    const subred = await subgreddiit.findById(subredd)
    subred.posts.map(getposts)
}

const getposts = async(post) => {
    const postt = await posts.findById(post)
    postts.push(postt)
}

router.get("/", async(req, res) => {  
    try{
        if(flag){
            const userr = await User.findOne({email: req.query.email})
            userr.subgreddiits.map(getsubredposts)
            flag = false
        }
        res.json(postts)
    }
    catch(error){
        console.log(error)
    }
    // try{
    //     let postts = []
    //     const userr = await User.findOne({email: req.query.email})
    //     for(i = 0; i < userr.subgreddiits.length; i++){
    //         const subred = await subgreddiit.findById(userr.subgreddiits[i])
    //         for(j = subred.posts.length - 1; j >= 0; j--){
    //             const postt = await posts.findById(subred.posts[j])
    //             postts.push(postt)
    //         }
    //     }
    //     res.json(postts)
    // }
    // catch(error){
    //     console.log(error)
    // }
});

module.exports = router