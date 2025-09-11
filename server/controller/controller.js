let Drugdb = require('../model/model');

// ---------------------- CREATE ----------------------
exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    const drug = new Drugdb({
        name: req.body.name,
        card: req.body.card,
        pack: req.body.pack,
        perDay: req.body.perDay,
        dosage: req.body.dosage
    });

    drug.save()
        .then(data => {
            console.log(`✅ ${data.name} added to the database`);
            res.redirect('/manage');
        })
        .catch(err => {
            console.error("🔥 Error while adding drug:", err);
            res.status(500).send({
                message: err.message || "There was an error while adding the drug"
            });
        });
};

// ---------------------- FIND ----------------------
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Can't find drug with id: " + id });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                console.error("🔥 Error retrieving drug:", err);
                res.status(500).send({ message: "Error retrieving drug with id: " + id });
            });
    } else {
        Drugdb.find()
            .then(drugs => {
                res.send(drugs);
            })
            .catch(err => {
                console.error("🔥 Error retrieving drugs:", err);
                res.status(500).send({
                    message: err.message || "An error occurred while retrieving drug information"
                });
            });
    }
};

// ---------------------- UPDATE ----------------------
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Cannot update with empty data" });
    }

    const id = req.params.id;

    Drugdb.findByIdAndUpdate(id, req.body, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Drug with id ${id} not found` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            console.error("🔥 Error updating drug:", err);
            res.status(500).send({ message: "Error updating drug information" });
        });
};

// ---------------------- DELETE ----------------------
exports.delete = (req, res) => {
    const id = req.params.id;

    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete drug with id: ${id}. Please check the id` });
            } else {
                res.send({ message: `${data.name} was deleted successfully!` });
            }
        })
        .catch(err => {
            console.error("🔥 Error deleting drug:", err);
            res.status(500).send({ message: "Could not delete drug with id=" + id });
        });
};

// ---------------------- PURCHASE ----------------------
exports.purchase = async (req, res) => {
    try {
        const id = req.params.id;
        const { quantity } = req.body;

        console.log("📦 Purchase request:", { id, quantity });

        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }

        const drug = await Drugdb.findById(id);
        if (!drug) {
            return res.status(404).send({ message: "Drug not found" });
        }

        console.log(`✅ Found drug: ${drug.name}, current stock: ${drug.pack}`);

        if (drug.pack < quantity) {
            return res.status(400).send({ message: "Not enough stock" });
        }

        drug.pack -= quantity;
        const updatedDrug = await drug.save();

        console.log(`✅ Purchase successful. Remaining stock: ${updatedDrug.pack}`);

        res.send({
            message: `Successfully purchased ${quantity} pack(s) of ${updatedDrug.name}`,
            drug: updatedDrug
        });
    } catch (err) {
        console.error("🔥 Error while purchasing drug:", err);
        res.status(500).send({ message: "Error while purchasing drug" });
    }
};
