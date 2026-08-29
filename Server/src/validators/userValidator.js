import {body} from "express-validator";
const registerValidator=[
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("phoneNumber").notEmpty().withMessage("phone number is required").isMobilePhone().withMessage("please enter a valid phone number "),
    body("role").optional().isIn(["user","admin"]).withMessage("role must be either user or admin"),

];

const loginValidator=[
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
];

export  {registerValidator,loginValidator};