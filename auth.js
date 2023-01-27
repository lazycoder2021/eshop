const auth = function (req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.status(200).json({ "msg": "you are not logged in" })
    }
}

module.exports = auth; 
