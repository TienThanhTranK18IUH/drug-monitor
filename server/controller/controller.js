let Drugdb = require('../model/model');

// ---------------------- CREATE ----------------------
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    try {
        const drug = new Drugdb({
            name: req.body.name,
            card: req.body.card,
            pack: req.body.pack,
            perDay: req.body.perDay,
            dosage: req.body.dosage
        });

        const data = await drug.save();
        console.log(`✅ Added: ${data.name} (id: ${data._id})`);

        res.redirect('/manage');
    } catch (err) {
        console.error("🔥 Error while adding drug:", err);
        res.status(500).send({
            message: err.message || "There was an error while adding the drug"
        });
    }
};

// ---------------------- FIND ----------------------
exports.find = async (req, res) => {
    try {
        if (req.query.id) {
            const id = req.query.id;
            const data = await Drugdb.findById(id);

            if (!data) {
                return res.status(404).send({ message: `Can't find drug with id: ${id}` });
            }

            console.log(`📌 Found drug: ${data.name} (id: ${id})`);
            res.send(data);
        } else {
            const drugs = await Drugdb.find();
            console.log(`📌 Retrieved ${drugs.length} drugs`);
            res.send(drugs);
        }
    } catch (err) {
        console.error("🔥 Error retrieving drugs:", err);
        res.status(500).send({
            message: err.message || "An error occurred while retrieving drug information"
        });
    }
};

// ---------------------- UPDATE ----------------------
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Cannot update with empty data" });
    }

    try {
        const id = req.params.id;
        const data = await Drugdb.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).send({ message: `Drug with id ${id} not found` });
        }

        console.log(`✅ Updated drug: ${data.name} (id: ${id})`);
        res.send(data);
    } catch (err) {
        console.error("🔥 Error updating drug:", err);
        res.status(500).send({ message: "Error updating drug information" });
    }
};

// ---------------------- DELETE ----------------------
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const drug = await Drugdb.findByIdAndDelete(id);

        if (!drug) {
            return res.status(404).send({ message: "Drug not found" });
        }

        console.log(`🗑️ Deleted drug: ${drug.name} (id: ${id})`);
        res.status(200).send({ message: `${drug.name} deleted successfully` });
    } catch (err) {
        console.error("🔥 Error deleting drug:", err);
        res.status(500).send({ error: err.message });
    }
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
