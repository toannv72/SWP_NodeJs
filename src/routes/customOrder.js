const express = require('express')
const routerCustomOrder = express.Router()
const CustomOrderController = require('../app/controllers/CustomOrderController')
const { authenticatedStaff } = require('../config/db/authenticatedStaff')

routerCustomOrder
    .route("/user/pending")
    .get(CustomOrderController.getUserPending)
routerCustomOrder
    .route("/user/deposit")
    .get(CustomOrderController.getUserDeposit)
routerCustomOrder
    .route("/user/processing")
    .get(CustomOrderController.getUserProcessing)
routerCustomOrder
    .route("/user/shipped")
    .get(CustomOrderController.getUserShipped)
routerCustomOrder
    .route("/user/delivered")
    .get(CustomOrderController.getUserDelivered)
routerCustomOrder
    .route("/user/canceled")
    .get(CustomOrderController.getUserCanceled)
routerCustomOrder
    .route("/user/returned")
    .get(CustomOrderController.getUserReturned)

routerCustomOrder
    .route("/admin/pending")
    .get(authenticatedStaff,CustomOrderController.getAdminPending)
routerCustomOrder
    .route("/admin/deposit")
    .get(authenticatedStaff,CustomOrderController.getAdminDeposit)
routerCustomOrder
    .route("/admin/processing")
    .get(authenticatedStaff,CustomOrderController.getAdminProcessing)
routerCustomOrder
    .route("/admin/shipped")
    .get(authenticatedStaff,CustomOrderController.getAdminShipped)
routerCustomOrder
    .route("/admin/delivered")
    .get(authenticatedStaff,CustomOrderController.getAdminDelivered)
routerCustomOrder
    .route("/admin/canceled")
    .get(authenticatedStaff,CustomOrderController.getAdminCanceled)
routerCustomOrder
    .route("/admin/returned")
    .get(authenticatedStaff,CustomOrderController.getAdminReturned)

routerCustomOrder
    .route("/admin/all")
    .get(authenticatedStaff,CustomOrderController.getAdminAll)


routerCustomOrder
    .route("/admin/put/:status")
    .put(authenticatedStaff, CustomOrderController.putAdminStatus)

routerCustomOrder
    .route("/admin/put/price/:id")
    .put(authenticatedStaff,CustomOrderController.putAdminPrice)

routerCustomOrder
    .route("/user/:id")
    .get(CustomOrderController.getOrderUser)


routerCustomOrder
    .route("/user")
    .get(CustomOrderController.getUser)
    .post(CustomOrderController.post)


// routerCustomOrder
//     .route("/:id")
//     .get(authenticatedStaff, CustomOrderController.getOne)
//     .put(authenticatedStaff, CustomOrderController.put)
//     .delete(authenticatedStaff, CustomOrderController.delete)
// routerCustomOrder
//     .route("/")
//     .get(CustomOrderController.getAdmin)
//     .post(CustomOrderController.check, CustomOrderController.post)


module.exports = routerCustomOrder