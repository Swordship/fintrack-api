const errorhandeler = (err, req, res, next) => {
    console.error("Unhandled Error:",err);
    res.status(500).json({ error: 'Internal Server Error',
        message:" An unexpected error occurred." });
};
module.exports = {
    errorhandeler
}