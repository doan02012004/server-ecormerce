import express from 'express'
import categoryController from '../../controllers/categoryController.js'


const router = express.Router()

router.get('/',categoryController.categoryGet)
router.get('/form',categoryController.categoriesGetFormAdmin)
router.get('/id/:categoryId',categoryController.categoryGetById)
router.post('/',categoryController.createCategory)
router.get('/path/:slug',categoryController.categoriesGetPath)
router.get('/slug/:slug',categoryController.categoryGetBySlug)
router.put('/:id',categoryController.categoryUpdate)
router.delete('/:id',categoryController.categoryUpdate)

export default router