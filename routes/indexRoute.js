const express = require('express');

const { 
    homepage ,
    studentsignup,
    studentsignin,
    studentsignout,
    currentUser,
    forgotpassword,
    forgotlink,
    resetPassword,
    studentupdate,
    studentavatar,
    createtask,
    taskupdate,
    deletetask,
    findtask,
    takdone,
    alltasks
} = require('../controllers/indexController');

const { isAuthenticated } = require('../middlwares/auth');
const router = express.Router();

// get /    
router.get('/',homepage)

// get /loginstudent
router.get('/student',isAuthenticated, currentUser)

// post /student/signup
router.post('/student/signup',studentsignup)

// post /student/signin
router.post('/student/signin',studentsignin)

// Get /student/signout
router.get('/student/signout',isAuthenticated,studentsignout)


// post /student/update
router.post('/student/update',isAuthenticated,studentupdate)

// Post /forgot/password
router.post('/forgot/password',forgotpassword)

// Get /forgot/link
router.post('/forgot/reset_link/:id',forgotlink)

// Post /reset/password
router.post('/reset/password',isAuthenticated,resetPassword)

// post /student/update
router.post('/student/update',isAuthenticated,studentupdate)

// post /student/avatar
router.post('/student/avatar',isAuthenticated,studentavatar)




router.post('/create/task',isAuthenticated,createtask)

router.get('/task/find/:cid',isAuthenticated,findtask)

router.post('/update/task/:id',isAuthenticated,taskupdate)

router.post('/delete/task/:id',isAuthenticated,deletetask)

router.post('/completed/task/:id',isAuthenticated,takdone)


// post /student/review
// router.get('/alltasks', isAuthenticated, alltasks);


module.exports = router;