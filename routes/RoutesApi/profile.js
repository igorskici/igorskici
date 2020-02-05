const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const request = require('request');
const config = require('config');
const {check, validationResult} = require('express-validator/check');

const Profile = require('../../model/Profile')
const User = require('../../model/User')
const Post = require('../../model/Posts')

// @route get api/profile/me
// @route get current users from profile
// @access private
router.get('/me',auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']); //get profile from that user

        if(!profile){
            res.status(400).json({msg:"there is no profile for this user"})
        }

        res.json(profile);

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

// @route POST api/profile/
// @des create or update user profile
// @access private

router.post('/',[auth, [
    check('status', 'Status is required')
        .not()
        .notEmpty(),
    check('skills', 'skills is required')
        .not()
        .notEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedIn
    } = req.body;


    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(company) profileFields.company = company;
    if(githubusername) profileFields.githubusername = githubusername;


    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build Social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedIn) profileFields.social.linkedIn = linkedIn;
 
    try {
        let profile = await Profile.findOne({user: req.user.id});

        //Update
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields}, 
                {new: true}
            );

            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);

        //save to Mongo db
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err)
        res.status(500).json('Server error')
    }
})


// @route get api/profile/
// @route get current users from profile
// @access public
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profile);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})




// @route get api/profile/user/:user_id
// @route get  profile by user_id
// @access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user', ['name', 'avatar']);

        if(!profile){
           return res.status(400).json({msg: "There is not profile for this user"})
        }

        res.json(profile);

    } catch (err) {
        console.log(err);

        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: "Profile not found"})
        }

        res.status(500).send('Server Error');
    }
})



// @route DWELETE api/profile
// @route DELETE  profile, user & post
// @access private
router.delete('/', auth, async (req, res) => {
    try {
        // console.log("DELETED"+ JSON.stringify(req));
        //Remove user post

        await Post.deleteMany({user: req.user.id});
        //Remove profile     
        await Profile.findOneAndDelete({user: req.user.id});
        //Remove User
        await User.findByIdAndRemove({_id: req.user.id});

        res.json({msg: "User deleted"});

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


// @route PUT api/profile/expiriance
// @route PUT  ADD profille expiriance
// @access private

router.put('/expiriance', [auth, [
    check('title', 'title is requered')
    .not()
    .notEmpty(),

    check('company', 'company is requered')
    .not()
    .notEmpty(),

    check('from', 'From Date is requered')
    .not()
    .notEmpty()

]], async (req, res) => {
    

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };


        try {
            const profile = await Profile.findOne({user: req.user.id});
            profile.expiriance.unshift(newExp); //push to list
            profile.save();

            res.json(profile);
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }   
 
})


// @route DELETE api/profile/expiriance/:id
// @route DELETE profille expiriance from profile
// @access private
router.delete('/expiriance/:exp_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({user: req.user.id});

        //Get remove index
        const removeIndex = profile.expiriance.map(item => item.id).indexOf(req.params.exp_id);


        profile.expiriance.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    }
})





// @route PUT api/profile/education
// @route PUT  ADD profille education
// @access private

router.put('/education', [auth, [
    check('school', 'school is requered')
    .not()
    .notEmpty(),

    check('degree', 'degree is requered')
    .not()
    .notEmpty(),

    check('from', 'From Date is requered')
    .not()
    .notEmpty(),

    check('fieldostudy', 'study is requered')
    .not()
    .notEmpty()

]], async (req, res) => {
    

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        

        const {
            school,
            degree,
            fieldostudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldostudy,
            from,
            to,
            current,
            description
        };


        try {
            const profile = await Profile.findOne({user: req.user.id});
            profile.education.unshift(newEdu); //push to list
            profile.save();

            res.json(profile);
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }   
 
})


// @route DELETE api/profile/education/:id
// @route DELETE profille education from profile
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({user: req.user.id});

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    }
})


// @route GET api/profile/github/:username
// @route GET user repo from Github
// @access public
router.get('/github/:username', (req, res) => {

    try {
        const option = {
            url: `https://api.github.com/users/
            ${req.params.username}
            /repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('gitHubSecret')}`,
            method:"GET",
            header: {'user-agent': 'node.js'}
        };

        request(option, (error, response, body) => {
            if(error) console.log(error);
            
            if(response.statusCode != 200){
                response.status(404).json({msg:"No github profile found"})
            }

            
            response.json(JSON.parse(body));

        })

    } catch (err) {
       console.log(err);
       res.status(500).send('Server Error')
    }
})










module.exports = router;