const UserController = require("./user_controller");
const userDb         = require("../model/sql");
var bodyParser = require('body-parser')
const userRoute = () => {
  const router = require("express").Router();
  const checkAuthenticationMiddleware = require("../middlewares/check_authentication");
  const controller = new UserController();
  const controllerdb = new userDb();

  router.get("/login", controller.loginPage);
  router.post("/login", controller.doLogin);
  router.get("/user" , controllerdb.user);
  router.get("/register", controller.registerPage);
  router.post("/register", controller.doregister);
  router.get("/biodata", controller.biodataPage);
  router.get("/edit", controller.editPage);
  router.get("/delete",controller.deletePage);
  router.post("/edit",controller.doEdit);

  router.get("/room", controller.gamePage);
  router.post("/room", controller.doGame);

  router.post("/createRoom", controller.gameRoom);
  router.post("/figthRoom", controller.figthRoom);
  
  const authenticated = router.use(checkAuthenticationMiddleware);
  authenticated.get("/", controller.userPage);
  authenticated.get("/admin", controller.adminPage);

  router.get("/logout", controller.logout);

  return router;
};

module.exports = (app) => {
  app.use("/", userRoute());
};
