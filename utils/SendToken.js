

exports.sendtoken = (student, statusCode, res) => {
  try {
    const token = student.getjwttoken();

    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 *60 * 1000),
      httpOnly: true,
    };

    res.status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, id: student._id, token });
  } catch (error) {
    // Handle JWT token generation errors here
    console.error("JWT token generation error:", error);
    res.status(500).json({ success: false, message: "Failed to generate JWT token" });
  }
};


























// exports.sendtoken = (student,statusCode,res ) => {
//      const token = student.getjwttoken();

//      const options = {
//          expires : new Date(
//              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//          ),
//          httpOnly:true,
//         //  secure:false
        
//      }

//      res.status(statusCode)
//      .cookie( "token", token, options)
//      .json({success: true, id: student._id, token})

//      res.json({token})
// };  

// exports.sendtoken = (student, statusCode, res) => {
//     try {
//       const token = student.getjwttoken();
  
//       const options = {
//         expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 *60 * 1000),
//         httpOnly: true,
//       };
  
//       res.status(statusCode)
//         .cookie("token", token, options)
//         .json({ success: true, id: student._id, token });

//      res.json({token})

//     } catch (error) {
//       // Handle JWT token generation errors here
//       console.error("JWT token generation error:", error);
//       res.status(500).json({ success: false, message: "Failed to generate JWT token" });
//     }
//   };
  