const History = require("../models/history.model")


exports.getUserHistory = async (req, res) => {

    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const history = await History.find({ userId })

        if (!history) {
            return res.status(404).json({
                success: true,
                message: "No history found for this user"
            });
        }
        console.log("History ---------->> ", history)
        return res.status(200).json({
            success: true,
            history
        });


    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}