const express = require('express')
const routerProduct = express.Router()
const ProductControllers = require('../app/controllers/ArtworkControllers')
const { authenticatedStaff } = require('../config/db/authenticatedStaff')

routerProduct
    .route("/countByProduct")
    .get(ProductControllers.countByProduct)
// xóa mềm
routerProduct.delete('/:id', authenticatedStaff, ProductControllers.delete)

// khôi phục dữ liệu đã xóa
routerProduct.put('/restore/:id', authenticatedStaff, ProductControllers.restore)
// danh sách đã xóa 
routerProduct.get('/trash', authenticatedStaff, ProductControllers.trash)
routerProduct.get('/search?', ProductControllers.search)

routerProduct.get('/staff', ProductControllers.showProductStaff)
// sắp xếp sản phẩm theo thứ tự bán chạy
routerProduct.get('/sold', ProductControllers.showSold)

// routerProduct.get('/sold', ProductControllers.showSold)
// lấy sản phẩm theo ID 

routerProduct.get('/:id', ProductControllers.get)
routerProduct.post('/unlikeArtwork/:artworkId/:userId', ProductControllers.unlikeArtwork)
routerProduct.post('/likeArtwork/:artworkId/:userId', ProductControllers.likeArtwork)
routerProduct.post('/comments/:artworkId/:userId', ProductControllers.cmtArtwork)
routerProduct.put('/:id', ProductControllers.put)
routerProduct.post('/', ProductControllers.post)
routerProduct.get('/', ProductControllers.show)

module.exports = routerProduct