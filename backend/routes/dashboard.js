const router = require("express").Router()
const{subgreddiit} = require("../models/subgreddit")
const{posts} = require("../models/posts")
const{User} = require("../models/user")
const {savedpost} = require("../models/savedpost")

router.get("/", async(req, res) => {
    try{
        let postts = []
        const userr = await User.findOne({email: req.query.email})
        for(i = 0; i < userr.subgreddiits.length; i++){
            const subred = await subgreddiit.findById(userr.subgreddiits[i])
            for(j = subred.posts.length - 1; j >= 0; j--){
                const postt = await posts.findById(subred.posts[j])
                postts.push(postt)
            }
        }
        res.json(postts)
    }
    catch(error){
        console.log(error)
    }
});

module.exports = router