const auth = require("../utils/auth");
const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    if (await auth.isExistent(User, email)) {
      res.status(409).send("Email already in use");
      return;
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      ...req.body,
      email,
      password: hashedPassword,
    });

    const payload = {
      _id: user._id,
    };

    const token = await auth.generateToken(payload, "1d");
    user.token = token;
    await user.save();
    res.status(201).json({
      message: "User successfully created",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "User doesn't exist",
      });
      return;
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Wrong credentials",
      });
      return;
    }

    const payload = {
      _id: user._id,
    };

    const token = await auth.generateToken(payload, "1d");
    user.token = token;
    await user.save();
    res.status(201).json({
      message: "User successfully authorized",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.json({
      message: 'User logged out successfully',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};