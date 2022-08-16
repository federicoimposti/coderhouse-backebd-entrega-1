module.exports = {
    auth: function(req, res, next){
        const admin = true;
        res.admin = admin;
        next();
    }
}