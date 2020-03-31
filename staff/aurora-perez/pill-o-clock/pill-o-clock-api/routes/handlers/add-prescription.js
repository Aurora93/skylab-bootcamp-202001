const { addPrescription } = require('../../logic')
const { ContentError, NotAllowedError, NotFoundError } = require('pill-o-clock-errors')

module.exports = (req, res) => {
    const { payload: { sub: id }, body: { drugId, time } } = req

    try {
        addPrescription(id, drugId, time) 
            .then(() => res.status(201).end())
            .catch(error => {
                 let status = 400

                if (error instanceof TypeError || error instanceof ContentError)
                    status = 406 // not acceptable

                if (error instanceof NotFoundError)
                    status = 404

                if (error instanceof NotAllowedError)
                    status = 401

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

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof NotAllowedError)
            status = 401

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}