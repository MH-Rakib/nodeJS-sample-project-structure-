const path = require("path");
const controller = require("./user.controller");
// const auth = require("./user.auth.middleware");
const { AuthStrategy } = require("./user.auth.middleware");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate"
));
const { userRegisterSchema, userUpdateSchema } = require("./user.schema");

module.exports = (app) => {
  app
    .route("/api/users")
    .get(AuthStrategy, controller.getUsers)
    .post(validate(userRegisterSchema), controller.createUser);

  app
    .route("/api/users/:id")
    .get(controller.getUser)
    .put(validate(userUpdateSchema), controller.putUser)
    .patch(validate(userUpdateSchema), controller.patchUser)
    .delete(controller.deleteUser);

  app.route("/api/users/login").post(controller.login);

};
