const uuid = require("uuid");
const { validationResult } = require("express-validator");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  res.json({ users: await prisma.user.findMany() });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = await prisma.user.findFirst({
    where: { email : email }
  })
  if (
    identifiedUser == null ||
    (typeof identifiedUser === 'object' && identifiedUser.password !== password)
  ) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
  }
  res.json({ 
    user: identifiedUser, 
    message: "logged In" 
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check you data", 422);
  }
  const { name, email, password } = req.body;

  const hasUser = await prisma.user.findFirst({
    where: { email : email }
  })

  if (typeof hasUser === 'object' && hasUser.email === email) {
    throw new HttpError("Could not create user, email already exists", 422);
  }

  const createdUser = {
    name: name,
    email: email,
    password: password,
  };

  const user_created = await prisma.user.create({
    data: createdUser
  })

  res.status(201).json({
    user: user_created
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
