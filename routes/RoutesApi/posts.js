const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');
const Posts = require('../../model/Posts');
const Users = require('../../model/User');
const Profile = require('../../model/Profile');

// @route POST api/post
//Descr: create post
//@access: private
router.post('/', [auth, [
    check('text',"text is requered")
        .not()
        .notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    try {
        const user = await Users.findById(req.user.id).select('-password');

        const newPost = new Posts ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
   
        });

        const post = await newPost.save();
        
         res.json(post);
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
     
})






// @route GET api/post
//Descr: get all post
//@access: private
router.get('/', [auth, [
    check('text',"text is requered")
        .not()
        .notEmpty()
]], async (req, res) => {


    try {
        const posts = await Posts.find().sort({date: -1});
        res.json(posts);
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
     
})



//@route GET api/post/:idf
//Descr: get all post
//@access: private
router.get('/:id', [auth, [
    check('text',"text is requered")
        .not()
        .notEmpty()
]], async (req, res) => {


    try {
        const post = await Posts.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
        res.json(post);
        
    } catch (err) {
        console.log(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error');
    }
})


// @route DELETE api/post
//Descr: DELETE post by id
 //@access: private
router.delete('/:id', [auth, [
    check('text',"text is requered")
        .not()
        .notEmpty()
]], async (req, res) => {


    try {
        const posts = await Posts.findById(req.params.id);

        if(!posts){
            return res.status(404).json({msg:'Post not found'});
        }


        //check if that user owns this post
        if(posts.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"});
        }

        await posts.remove();

        res.json({msg:"Post removed"});


        res.json(posts);
        
    } catch (err) {
        console.log(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error')
    }
})

//@route PUT api/post/like/:id
//Descr: PUT  like a post
//@access: private

router.put('/likes/:id', auth, async (req, res) => {


    try {
        const post = await Posts.findById(req.params.id);

        //check if the post allready been  liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
             return res.status(400).json({msg: "Post allready liked"})
        }

        post.likes.unshift({user: req.user.id});

        await post.save();

        res.json(post.likes);
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
     
})

//@route PUT api/post/unlike/:id
//Descr: PUT  unlike a post
//@access: private
router.put('/unlike/:id', auth, async (req, res) => {


    try {

        console.log(req.user.id);

        const post = await Posts.findById(req.params.id);

        //check if the post allready been  liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
             return res.status(400).json({msg: "Post has not yet liked"})
        }

        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
        post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
     
})



//post api posts/comment
router.post('/comment/:id', [auth, [
    check('text',"text is requered")
        .not()
        .notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    try {
        const user = await Users.findById(req.user.id).select('-password');
        const post = await Posts.findById(req.params.id);

        const newComment = new Posts ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
   
        });

        post.comments.unshift(newComment);

        await post.save(post.comments);
        
         res.json(post.comments);
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }     
})



router.delete('/comment/:id/:comment_id', auth, async (req, res) => {

    try {
        const post = await Posts.findById(req.params.id);
        
        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        console.log(comment);

        //Make sure comment exist
        if(!comment){
            return res.status(400).json({msg:"Comment does not exist"});
        }

        //check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:"User not authorized"})
        }

        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));

        post.comments.splice(removeIndex,1);

        await post.save();

        res.json(post.comments);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error delete comment');
    }
     
})





module.exports = router;