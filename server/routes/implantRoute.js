const router = require("express").Router();
const { getImplantById, getAllImplants, deleteImplantById, updateImplantInitialPayloadById } = require("../controllers/implantControllers");
const auth = require("../middlewares/authMiddleware");

router.get("/implants/:id.js", async (req, res) => {
    if(req.params.id){
        getImplantById(req.params.id).then((implant) => {
            res.header("Content-Type", "application/javascript");
            res.send(implant);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
});


router.get("/api/v1/implants/get", auth, getAllImplants)

router.delete("/api/v1/implants/delete/:id", auth, deleteImplantById);
router.post("/api/v1/implants/updateInitialPayload/:id", auth, updateImplantInitialPayloadById);

module.exports = router;