const Transaction = require("../models/Transaction");

exports.getStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({ userId });

        let totalIncome = 0;
        let totalExpense = 0;
        const expenseTrend = {};
        const categorySummary = {};

        for (const txn of transactions) {
            const date = new Date(txn.date);
            const dateKey = date.toISOString().split("T")[0];
            const amount = parseFloat(txn.amount);

            if (txn.type === "income") {
                totalIncome += amount;
            } else if (txn.type === "expense") {
                totalExpense += amount;

                // Trend
                if (!expenseTrend[dateKey]) expenseTrend[dateKey] = { date: dateKey, amount: 0 };
                expenseTrend[dateKey].amount += amount;

                // Category
                const category = txn.category || "Other";
                if (!categorySummary[category]) categorySummary[category] = 0;
                categorySummary[category] += amount;
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                categoryExpenses: categorySummary,
                expenseTrend: Object.values(expenseTrend).sort((a, b) => new Date(a.date) - new Date(b.date)),
            }
        });

    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ success: false, message: "Failed to generate stats" });
    }
};