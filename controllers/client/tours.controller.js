const Tour = require('../../models/tours.model')

module.exports.tour = async (req, res) => {
    const tourList = await Tour.find({});
    res.render('client/pages/list', {
        tourList: tourList
    });
}