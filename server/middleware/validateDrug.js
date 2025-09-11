// server/middleware/validateDrug.js

module.exports = (req, res, next) => {
    const { name, dosage, card, pack, perDay } = req.body;

    // a. Name length > 5
    if (!name || name.length <= 5) {
        return res.status(400).send({ message: "Name must be longer than 5 characters" });
    }

    // b. Dosage format: XX-morning,XX-afternoon,XX-night
    const dosagePattern = /^\d{1,2}-morning,\d{1,2}-afternoon,\d{1,2}-night$/;
    if (!dosagePattern.test(dosage)) {
        return res.status(400).send({
            message: "Dosage must follow format: XX-morning,XX-afternoon,XX-night"
        });
    }

    // c. Card > 1000
    if (isNaN(card) || card <= 1000) {
        return res.status(400).send({ message: "Card must be greater than 1000" });
    }

    // d. Pack > 0
    if (isNaN(pack) || pack <= 0) {
        return res.status(400).send({ message: "Pack must be greater than 0" });
    }

    // e. PerDay > 0 and < 90
    if (isNaN(perDay) || perDay <= 0 || perDay >= 90) {
        return res.status(400).send({ message: "PerDay must be between 1 and 89" });
    }

    next(); // Nếu ok thì cho qua tiếp controller
};
