const express = require('express')
const CategoryControllers = require('../app/controllers/CategoryControllers')
const routerCategory = express.Router()

// xóa mềm
routerCategory.delete('/:id', CategoryControllers.delete)
// lấy sản phẩm theo ID 
routerCategory.get('/:id', CategoryControllers.get)
routerCategory.put('/:id', CategoryControllers.put)
routerCategory.post('/', CategoryControllers.post)
routerCategory.get('/', CategoryControllers.show)

module.exports = routerCategory