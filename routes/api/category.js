const express = require('express');
const router = express.Router();

const path = require("path");
const saveBuffer = require('save-buffer');
const uuidv4 = require('uuid/v4');

const keys = require('../../config/key');

const Category = require('../../models/Category');
const CategoryImage = require('../../models/CategoryImage');
const validateAddCategory = require('../../validation/add-category');

/**
 * @route GET /api/category/all
 * @description Get all categories
 * @access Public
 */
router.get('/all', (req, res) => {
    Category.find()
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            res.json([]);
        })
});

/**
 * @route GET /api/category/remove/:cateId
 * @description Remove category
 * @access Public
 */
router.get('/remove/:cateId', (req, res) => {
    Category.findOne({_id: req.params.cateId})
        .then(category => {
            if(category) {
                category.remove();
                res.json({message: 'Category removed succesfully.'});
            } else {
                res.status(400).json({message: 'Category not found in db.'});
            }
        })
        .catch(err => {
            res.status(400).json({message: 'Failed to remove category, Please try again.'});
        })
})

/**
 * @route POST /api/category/add
 * @description Add category
 * @access Public
 */
router.post('/add', (req, res) => {

    const { errors, isValid } = validateAddCategory(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const category = new Category;
    category.name = req.body.name;
    category.save()
        .then(category => res.json(category))
        .catch(err => res.status(400).json({ name: 'Something is wrong, Try again.' }));
});

 /**
 * @route GET /api/category/get_images/:cateId
 * @description Get category images
 * @access Public
 */
router.get('/get_images/:cateId', (req, res) => {
    CategoryImage.find({categoryId: req.params.cateId})
        .then(categoryImages => {
            res.json(categoryImages)
        })
        .catch(err => {
            res.json([]);
        })
})

 /**
 * @route POST /api/category/upload_images/:cateId
 * @description Store Images
 * @access Public
 */
router.post('/upload_images/:cateId', async (req, res) => {
    const errors = [];
    const result = [];

	for (var i = req.files.length - 1; i >= 0; i--) {
		let uniqueImageId = uuidv4();
        let currentFile = req.files[i];
        let fileToSave = uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
		let currentPath = './storage/images/'+ uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
        await saveBuffer(currentFile.buffer, currentPath);
        const categoryImage = new CategoryImage;
        categoryImage.categoryId = req.params.cateId;
        categoryImage.fileId = fileToSave;
        categoryImage.fileName = fileToSave;
        await categoryImage.save()
            .then(categoryImage => {
                result.push(categoryImage.fileName);
            })
            .catch(err => {
                errors.push(fileToSave);
            })
	}

	res.json({savedFiles: result, failedFiles: errors});
});

 /**
 * @route GET /api/cars/get_image/:imageId
 * @description Get all car images
 * @access Public
 */
router.get('/get_image/:imageId', (req, res) => {
	res.sendFile(path.join(__dirname, '../../storage/images/')+req.params.imageId);
});

module.exports = router;