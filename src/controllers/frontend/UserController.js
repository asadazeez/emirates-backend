import jwt from "jsonwebtoken";
import env from "../../env.js";
import bcrypt from "bcrypt";
import { serverError, validationError } from "../../utils/errorHandler.js";
import { UserModel } from "../../models/UserModel.js";

export const CreateUser = async (req, res, next) => {
  try {
    const { emailAddress, password, name, confirmPassword } = req.body;

    if (password != confirmPassword) {
      return res.status(200).json({
        success: false,
        message: "Password  And Confirm Password Are Not Same",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await UserModel.create({
      emailAddress: emailAddress,
      password: hash,
      name: name,
      deletedAt: null,
    });
    return res.status(200).json({
      success: true,
      message: "SignUp Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const UpdateUser = async (req, res, next) => {
  try {
    const {
      name,
      emailAddress,
      password,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    const user = await UserModel.findOne({ emailAddress });

    if (!user) {
      return next(validationError("User not found"));
    }
    const IsPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    const IsPasswordSame = bcrypt.compareSync(newPassword, user.password);

    if (!IsPasswordValid) {
      return res.status(201).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    if (IsPasswordSame) {
      return res.status(201).json({
        success: false,
        message: "Old Password  And New Password Cannot Be Same ",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(201).json({
        success: false,
        message: "New Password  And Confirm Password Are Not Same ",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    user.password = newHash;
    user.name = name;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { emailAddress, password } = req.body;
    if (!emailAddress && password) {
      next(validationError("Required"));
    }
    const user = await UserModel.findOne({ emailAddress: emailAddress });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return res.status(200).json({
        success: false,
        message: "Authentication Failed , Invalid Password ",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, env.USER_JWT_SECRET_KEY);
    const userData = { emailAddress: user.emailAddress, role: "user" };
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      accessToken,
      userData,
    });
  } catch (error) {
    next(serverError(error));
  }
};
