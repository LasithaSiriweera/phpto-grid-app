const express = require('express'),
    router = express.Router(),
    PhotoGrid = require('../models/photoGrid');

    /**
     * Getting photo grids from database
     */
    router.get('/photogrids', function (req, res, next) {
        const params = req.query
        PhotoGrid.find({ userId } = params).then(function (photoGrid) {
            res.send(photoGrid);
        }).catch(next);
    });

/**
 * Create new photo grid
 */
router.post('/photogrids', function (req, res, next) {
    PhotoGrid.create(req.body).then((photpGrid) => {
        res.send(photpGrid);
    }).catch(next);
});

/**
 * Upadte specific photo grid
 */
router.put('/photogrids/:id', function (req, res, next) {
    const { id } = req.params;
    PhotoGrid.findByIdAndUpdate(id, req.body, { new: true }).then((photpGrid) => {
        res.send(photpGrid);
    }).catch(next);
});

/**
 * Removing photo grid
 */
router.delete('/photogrids/:id', function (req, res, next) {
    const { id } = req.params;
    PhotoGrid.findByIdAndDelete(id, req.body).then((result) => {
        res.send(result);
    }).catch(next);
});

module.exports = router;