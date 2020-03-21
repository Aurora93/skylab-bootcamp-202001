const { deleteContact } = require('../../logic')
const { ContentError } = require('pill-o-clock-errors')

module.exports = (req, res) => {
    const { payload: { sub: id }, params: { id: idDelete } } = req

    try {
        deleteContact(id, idDelete)
            .then(() => res.status(200).end())
            .catch(error => {
                let status = 400

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}