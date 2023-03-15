const Offer = require('../../models/offerModel')


const offerManagement = async (req, res) => {
    try {
        const offerdata = await Offer.find()
        res.render('offerManagement', { offer: offerdata })

    } catch (error) {
        console.log(error.message);
    }
}

const offerStore = async (req, res) => {
    try {
            const offer = Offer({
            name: req.body.name,
            // type: req.body.type,
            discount: req.body.discount,
            min_value: req.body.min_value,
            // max_discount: req.body.max_discount
            expirydate:req.body.expire
        })
        await offer.save()
        res.redirect('/admin/offerManagement')

    } catch (error) {
        console.log(error.message);
    }
}

const deleteOffer = async (req, res) => {
    try {
        const id = req.query.id;
        await Offer.deleteOne({ _id: id });
        res.redirect('/admin/offerManagement')

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    offerManagement,
    offerStore,
    deleteOffer,
}