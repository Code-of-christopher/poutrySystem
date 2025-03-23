/* global process */
import { AppDataSource } from "../data-source.js";
import { User } from "../entities/User.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Repository instance for User
const userRepository = AppDataSource.getRepository(User);

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = userRepository.create({ username, email, password: hashedPassword });

  try {
    await userRepository.save(newUser);
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const validUser = await userRepository.findOne({ where: { email } });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    // eslint-disable-next-line no-unused-vars
    const { password: pass, ...rest } = validUser;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user was set by verifyToken middleware
    // eslint-disable-next-line no-unused-vars
    const { password, ...userData } = req.user;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};


export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
