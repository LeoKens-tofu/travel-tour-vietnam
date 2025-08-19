const Tour = require('../../models/tours.model')

module.exports.tour = async (req, res) => {
    const tourList = await Tour.find({});
    res.render('client/pages/list', {
        title: 'Tour List',
        tourList: tourList
    });
}

module.exports.detail = async (req, res) => {
    res.render('client/pages/tour-detail', {
        title: 'Tour Detail',
    });
}
