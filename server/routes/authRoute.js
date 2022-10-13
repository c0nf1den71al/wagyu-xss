const router = require("express").Router();
const { login } = require("../controllers/authControllers");

router.post("/login", login);

// router.get("/logout", logout);

module.exports = router;