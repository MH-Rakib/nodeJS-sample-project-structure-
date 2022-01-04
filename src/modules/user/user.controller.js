const User = require("./user.model");
const UserType = require("./user-type.model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || !user.password || !user.validPassword(password)) return res.status(400).send("Invalid email or password!");

    const token = jwt.sign({ id: user.id }, "token_secret", { expiresIn: "1h" });

    res.cookie("access_token", token, { httpOnly: true, sameSite: true, signed: true });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error!");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserType,
          as: "user_type",
        },
      ],
    });

    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) return res.status(404).send("User not found!");

    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, user_type_id } = req.body;

    const existUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existUser)
      return res
        .status(400)
        .send("Already registered with this email address.");

    const user = await User.create({
      username,
      email,
      password,
      user_type_id: user_type_id,
    });

    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const putUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email } = req.body;

    const user = await User.update(
      {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!user) return res.status(404).send("User not found!");

    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email } = req.body;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) return res.status(404).send("User not found!");

    if (firstName) user.update({ first_name: firstName });
    if (lastName) user.update({ first_name: lastName });
    if (username) user.update({ username });
    if (email) user.update({ email });

    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) return res.status(404).send("User not found!");

    await user.destroy();

    res.sendStatus(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

module.exports.login = login;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.putUser = putUser;
module.exports.patchUser = patchUser;
module.exports.deleteUser = deleteUser;
