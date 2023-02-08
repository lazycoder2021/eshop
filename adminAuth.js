const adminAuth = function (req, res, next) {
    if (req.session.userId) {
        if (req.session.userRole == 'admin') {
            next()
        } else {
            return res.status(403).json({ "msg": "only admin can access this page" })
        }
        
    } else {
        console.log('you are not logged in')
        res.status(403).json({ "msg": "you are not logged in" })
    }
}

module.exports = adminAuth; 