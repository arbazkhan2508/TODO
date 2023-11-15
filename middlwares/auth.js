const jwt = require('jsonwebtoken')
const ErorrHandler = require('../utils/ErrorHandling')
const { catchAsyncError } = require('./catchAsyncError')

// exports.isAuthenticated = catchAsyncError(async (req,res,next)=>{
//      const {token} = req.cookies;

//       if(!token){
//          return next(
//             new ErorrHandler("Please Login First to access the Resources!",401)
//          );
//       }

//       const { id } = jwt.verify(token, process.env.JWT_SECRET)
//       req.id = id;
//       next();

//     //  res.json({ id,token })
// })

exports.isAuthenticated = catchAsyncError(async (req,res,next)=>{
    console.log(req.cookies,"good");
   const {token} = req.cookies;
   console.log(token ,"its not tolke");

   if(!token){
       console.log("Token not found");
       return next(
          new ErorrHandler("Please Login First to access the Resources!",401)
       );
   }

   try {
       const { id } = jwt.verify(token, process.env.JWT_SECRET);
       req.id = id;
       console.log("Authenticated user ID:", id);
       next();
   } catch (error) {
       console.error("Token verification error:", error);
       return next(
          new ErorrHandler("Invalid or expired token. Please login again.", 401)
       );
   }
});
