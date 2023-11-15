const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      maxLength: [15, "Name Should not Exceed More Than 15 Character"],
      minLength: [3, "Name Should Have Atleast 6 Character"],
      // unique: true,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    lastname: {
      type: String,
      maxLength: [15, "Name Should not Exceed More Than 15 Character"],
      minLength: [3, "Name Should Have Atleast 6 Character"],
      // unique: true,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false, //jb user find krege to password ni dega
      maxLength: [15, "Password Should not Exceed More Than 15 Character"],
      minLength: [6, "Password Should Have Atleast 6 Character"],
      // matchMedia:[]
    },
    contact: {
      type: String,
      // required:[true,"Name is Required"],
      maxLength: [15, "Contact Should not Exceed More Than 10 Character"],
      minLength: [3, "Contact Should Have Atleast 10 Character"],
      // unique: true,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    // contact:String,
    city: {
      type: String,
      // required:[true,"Name is Required"],
      // maxLength:[15,"Contact Should not Exceed More Than 10 Character"],
      minLength: [3, "City Should Have Atleast 3 Character"],
      // unique: true,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "male", "female", "Others"],
    },

    resetPaswwordToken: {
      type: Number,
      default: 0,
    },

    avatar: {
      type: Object,
      // type:mongoose.Schema.Types.Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5zcGFsc2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      },
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
      },
    ],
    complited: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentSchema.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentSchema.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const student = mongoose.model("student", studentSchema);
module.exports = student;
