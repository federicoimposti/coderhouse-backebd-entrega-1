module.exports = {
    auth: function(req, res, next){
        const admin = false;
        res.admin = admin;
        next();
    }
}