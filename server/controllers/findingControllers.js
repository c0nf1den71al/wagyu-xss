const Finding = require('../models/Finding');

module.exports.getAllFindings = async function (req, res){
    try {
        const findings = await Finding.find();
        res.status(200).json(findings);
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports.deleteFindingById = async function(req, res) {
    try {
        const finding = await Finding.findByIdAndDelete(req.params.id);
        res.status(200).json(finding);
    } catch (err) {
        res.status(400).json(err);
    }
}