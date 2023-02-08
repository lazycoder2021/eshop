const auth = function (req, res, next) {
    if (req.session.userId) {
        console.log('middleware meddling...')
        next()
    } else {
        res.redirect('/')
        console.log('you are not logged in')
        //res.status(200).json({ "msg": "you are not logged in" })
    }
}


module.exports = auth; 
