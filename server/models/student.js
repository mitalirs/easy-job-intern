const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../keys");
const jwt = require("jsonwebtoken");

const studentSchema = new Schema({
  personName: {
    type: String,
    required: true,
    // maxlength:40
  },
  email: {
    type: String,
    required: true,
    // unique:true
  },
  contact: {
    type: String,
    required: true,
    // minlength:10,
    // maxlength:10
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  institutionName: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  savedCompanies: {
    type: [String],
  },
  bookmarkedInternship: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
    },
  ],
  bookmarkedJob: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  bookmarkedFresherJob: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreshersJob",
    },
  ],
  location: {
    type: String,
    // required: true,
  },

  skills: {
    type: [String],
    // required: true,
  },
  currentRole: {
    type: String,
    // required: true,
  },

  openToRoles: {
    type: [String],
    // required: true,
  },
  workExperience: {
    type: String,
    // required: true,
  },
  experience_noOfYears: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  Profile: {
    General: {
      FirstName: {
        type: String,
      },
      LastName: {
        type: String,
      },
      Address: {
        type: String,
      },
      GithubLink: {
        type: String,
      },
      LinkedInLink: {
        type: String,
      },
      OtherProfileLink: [
        {
          type: String,
        },
      ],
    },
    Education: [
      {
        School: {
          type: String,
        },
        Degree: {
          type: String,
        },
        FieldOfStudy: {
          type: String,
        },
        StartDate: {
          type: Date,
        },
        LastDate: {
          type: Date,
        },
        Grade: {
          type: String,
        },
        Description: {
          type: String,
        },
      },
    ],
    Experience: [
      {
        Company: {
          type: String,
        },
        Title: {
          type: String,
        },
        StartDate: {
          type: Date,
        },
        LastDate: {
          type: Date,
        },
        Location: {
          type: String,
        },
        Description: {
          type: String,
        },
      },
    ],
    Project: [
      {
        ProjectLink: {
          type: String,
        },
        ProjectTitle: {
          type: String,
        },
        StartDate: {
          type: Date,
        },
        LastDate: {
          type: Date,
        },
        Description: {
          type: String,
        },
      },
    ],
    Skills: [
      {
        Skill: { type: String },
      },
    ],
    Achievments: [
      {
        Achievment: { type: String },
      },
    ],
    Other: [
      {
        Other: { type: String },
      },
    ],
    VolunteerExperience: [
      {
        Volunteer: { type: String },
      },
    ],
  },
});

studentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const token = jwt.sign({ _id: student._id }, JWT_SECRET);
  student.tokens = student.tokens.concat({ token: token });
  await student.save();
  return token;
};

studentSchema.statics.findByCredentials = async (email, password) => {
  const student = await Student.findOne({ email: email });
  if (!student) {
    throw new Error("Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return student;
};

studentSchema.pre("save", async function (next) {
  const student = this;
  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 10);
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
