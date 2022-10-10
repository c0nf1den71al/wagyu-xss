const router = require("express").Router();
const { login } = require("../controllers/authControllers");

router.post("/login", login);

// router.post("/signup", signup);
// router.get("/logout", logout);

module.exports = router;