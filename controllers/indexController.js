// work handle callback functions
const { catchAsyncError } = require("../middlwares/catchAsyncError");
const studentModel = require("../models/studentModel");
const taskModel = require("../models/taskModel");
const ErorrHandler = require("../utils/ErrorHandling");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendtoken } = require("../utils/SendToken");
const { log } = require("console");
const imagekit = require("../utils/imagekit").initImagekit();


exports.homepage = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token, "its token");

  if (!token) {
    const student = null;
    res.json({ message: "its /", student });
  } else {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.id = id;
    const student = await studentModel.findById(req.id);
    if (!student) {
      const student = null;
      res.json({ message: "its /" });
    } else {
      res.json({ message: "its /", student });
    }
  }
});

exports.currentUser = catchAsyncError(async (req, res, next) => {
  const student = await studentModel
    .findById(req.id).populate('tasks')

  res.json({ student});
});

exports.studentsignup = catchAsyncError(async (req, res, next) => {
  const student = await new studentModel(req.body);
  await student.save();
  sendtoken(student, 201, res);
  res.status(201).json(student);
});

exports.studentsignin = catchAsyncError(async (req, res, next) => {
   try{
    const student = await studentModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!student) {
    return next(new ErorrHandler("user Not Found With This Email", 404));
  }

  const isMatch = student.comparepassword(req.body.password);
  // if (!isMatch) return next(new ErorrHandler("Wrong Credentials", 500)); 
  if (!isMatch) {
    return next(new ErorrHandler("Wrong Credentials", 401)); // Changed status code to 401 for unauthorized
  }

  sendtoken(student, 201, res);
   }catch(error){
    console.log(error);
   }
});

exports.studentsignout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "succesfully sign out" });
});

exports.studentupdate = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findByIdAndUpdate(req.id, req.body).exec();
  await student.save();
  res.status(200).json({
    success: true,
    message: "Student Updated successfully",
    student,
  });
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel
      .findOne({ email: req.body.email })
      .exec();

    if (!student) {
      return next(new ErorrHandler("user Not Found With This Email", 404));
    }

    const reset_link = `${req.protocol}://localhost:3000/student/forgotp/${student._id}`;

    sendmail(req, res, next, reset_link);
    student.resetPaswwordToken = "1";
    await student.save();

    res.json({ student, reset_link });
    console.log("Emailsent");
  } catch (error) {
    console.log(error);
    console.log("email did not send");
  }
});

exports.forgotlink = catchAsyncError(async (req, res, next) => {
  const password = req.body.password;
  const id = req.params.id;

  const student = await studentModel.findById(id).exec();
  if (!student) {
    return next(new ErorrHandler("user Not Found With This Email", 404));
  }
  if (!password) {
    return next(new ErorrHandler("Password is required", 400));
  }
  if (student.resetPaswwordToken === 1) {
    student.password = password;
    student.resetPaswwordToken = 0;
    try {
      await student.save();
      console.log("Student saved successfully");
    } catch (error) {
      console.error(
        "Error while saving student:",
        error,
        "thisi the dina; error"
      );
      return next(error); // Assuming catchAsyncError handles the error properly
    }
  } else {
    return next(
      new ErorrHandler("Invalid Reset Password Link,Please Try again", 500)
    );
  }
  console.log(student, "its sthhg");

  res.status(200).json({
    message: "Password has been succesfully Changed",
  });
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findById(req.id).exec();
  student.password = req.body.password;
  student.resetPaswwordToken = "0";
  await student.save();
  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findByIdAndUpdate(req.id, req.body).exec();
  console.log(student, "its a students");
  res.status(200).json({
    success: true,
    message: "Student Updated successfully",
    student,
  });
});

exports.studentavatar = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).exec();
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const file = req.files.file;
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`;

    try {
      if (student.avatar.fileId !== "") {
        await imagekit.deleteFile(student.avatar.fileId);
      }
    } catch (error) {
      // Handle the error if student.avatar.fileId is undefined or other issues
      console.error("Error deleting previous avatar:", error);
    }

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    student.avatar = { fileId, url };
    await student.save();
    res.status(200).json({
      success: true,
      message: "Profile Uploaded",
      student,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

exports.createtask = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();
   
    var task = await taskModel.create({
      ownerid: owner._id,
      task:req.body.task,
      duedate:req.body.duedate,
      description:req.body.description
    });

    owner.tasks.push(task);
    await owner.save();
    res.status(200).json({
      success: true,
      message: "task Uploaded",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.taskupdate = catchAsyncError(async (req, res, next) => {
  const task = await taskModel
    .findByIdAndUpdate(req.params.id, req.body)
    .exec();
  await task.save();
  res.status(200).json({
    success: true,
    message: "task Updated successfully",
    task,
  });
});

exports.deletetask = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    const task = await taskModel.findById(req.params.id).exec();

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    const courseIndex = owner.tasks.indexOf(req.params.id);

    if (courseIndex !== -1) {
      owner.tasks.splice(courseIndex, 1);
    }

    await owner.save();
    await taskModel.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: "task deleted" });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.findtask = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).populate('tasks')
    const task = await taskModel
      .findById(req.params.cid)
      .populate("ownerid");

    if (!task) {
      // Handle the case where the task with the given ID is not found
      return res.status(404).json({ error: "task not found" });
    }

    res.status(201).json({ student, task });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.takdone = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    const task = await taskModel.findById(req.params.id).exec();

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    owner.complited.push(task);
    await owner.save();

    res.status(201).json({ message: "task completed",task,owner });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

// exports.alltask = catchAsyncError(async (req, res, next) => {
//   try {
//     const owner = await studentModel.findById(req.id).exec();

//     if (!owner) {
//       return res.status(404).json({ error: "owner not found" });
//     }

//     const tasks = await taskModel.find();

//     if (!tasks) {
//       return res.status(404).json({ error: "task not found" });
//     }

//     res.status(201).json({ message: "all taksk",tasks,owner });
//   } catch (error) {
//     console.log(error);
//     console.log("its error");
//   }
// });


