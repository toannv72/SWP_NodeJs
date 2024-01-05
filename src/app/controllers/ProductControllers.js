const { addLeadingZeros } = require('../../util/UtilsFuntion');
const Artwork = require('../models/Artwork');
class ProductControllers {


    put(req, res, next) {

        Artwork.findByIdAndUpdate(req.params.id,
            req.body, { new: true })
            .then((product => {
                res.json(product)
            }
            ))
            .catch(next =>
                res.json(next)
            )
    }


    trash(req, res, next) {
        Artwork.findDeleted()
            .then(courses =>
                res.json(courses))
            .catch(next)

    }

    restore(req, res, next) {
        Artwork.restore({ _id: req.params.id })
            .then(() => {
                Artwork.findByIdAndUpdate(req.params.id,
                    // req.body
                    {
                        "deleted": false
                    }
                )
                    .then((e) => res.json(e))
                    .catch(next)
            })
            .catch(next)

    }
    search(req, res, next) {
        function escapeRegExp(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 9; // Số lượng phần tử trên mỗi trang, mặc định là 10
        const formData = req.query.name
        const escapedSearchTerm = escapeRegExp(formData);
        const regex = new RegExp(escapedSearchTerm, 'i');
        const options = {
            page: page,
            limit: limit,

            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
        };
        if (formData === "") {

            Artwork.find({})
                .then((movies) => {
                    res.json({ "movie": [movies] })
                })
                .catch(next)
        } else {
            Artwork.paginate({ name: { $regex: regex } }, options, function (err, result) {

                if (result.totalPages < result.page) {
                    const options1 = {
                        page: result.totalPages,
                        limit: 9,

                        // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
                        collation: {
                            locale: 'en',
                        },
                    };
                    Artwork.paginate({ name: { $regex: escapedSearchTerm } }, options1, function (err, data) {


                        return res.json(
                            {
                                products: (data.docs),
                                totalPages: data.totalPages,
                                page: result.totalPages,
                                prevPage: data.prevPage,
                                nextPage: data.nextPage,
                                totalDocs: data.totalDocs,
                                search: formData
                            })

                    })

                } else {

                    return res.json(
                        {
                            products: (result.docs),
                            totalPages: result.totalPages,
                            page: result.page,
                            prevPage: result.prevPage,
                            nextPage: result.nextPage,
                            totalDocs: result.totalDocs,
                            search: formData
                        })
                }
            });
        }


    }
    unlikeArtwork(req, res, next) {
     
        try {
            // Tìm tài liệu artwork cần hủy like
            const artwork = Artwork.findById(req.query.artworkId);

            if (!artwork) {
                throw new Error('Artwork not found');
            }

            // Tìm index của like trong mảng likes
            const likeIndex = artwork.likes.findIndex(like => like.user.toString() === req.query.userId);

            if (likeIndex === -1) {
                throw new Error('Like not found');
            }

            // Loại bỏ like khỏi mảng likes
            artwork.likes.splice(likeIndex, 1);

            // Lưu cập nhật
            artwork.save();

            console.log('Unlike successful');
        } catch (error) {
            console.error('Unlike failed:', error.message);
        }
    }

    post(req, res, next) {
        const formData = req.body
        const materialArray = formData.material
        const course = new Artwork(formData)
        console.log(Artwork.find().size);
        // here
        switch (materialArray[0]) {
            case "Gỗ":
                var numberMaterial = 0;
                Artwork.estimatedDocumentCount({}, (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        if (count > 0) {
                            Artwork.find({ materialCode: "GAA" })
                                .then(filterProduct => {
                                    if (filterProduct.length === 0) {
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "GAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "GAA";
                                    } else {
                                        filterProduct.forEach(product => {
                                            var result = product.materialName.slice(3); // Loại bỏ 3 ký tự đầu
                                            var numberResult = parseInt(result, 10); // Chuyển đổi thành số nguyên với hệ cơ số 10
                                            if (numberResult > numberMaterial) {
                                                numberMaterial = numberResult;
                                            }
                                        })
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "GAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "GAA";
                                    }
                                }).catch(err => {
                                    console.log("Không thể lấy được thông tin của sản phẩm !!!")
                                })
                        } else {
                            var tmpNumberMaterial = numberMaterial + 1;
                            course.materialName = "GAA" + addLeadingZeros(tmpNumberMaterial);
                            course.materialCode = "GAA";
                        }
                    }
                });
                break;
            case "Nhựa":
                var numberMaterial = 0;
                Artwork.estimatedDocumentCount({}, (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        if (count > 0) {
                            Artwork.find({ materialCode: "NAA" })
                                .then(filterProduct => {
                                    if (filterProduct.length === 0) {
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "NAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "NAA";
                                    } else {
                                        filterProduct.forEach(product => {
                                            var result = product.materialName.slice(3); // Loại bỏ 3 ký tự đầu
                                            var numberResult = parseInt(result, 10); // Chuyển đổi thành số nguyên với hệ cơ số 10
                                            if (numberResult > numberMaterial) {
                                                numberMaterial = numberResult;
                                            }
                                        })
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "NAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "NAA";
                                    }
                                }).catch(err => {
                                    console.log("Không thể lấy được thông tin của sản phẩm !!!")
                                })
                        } else {
                            var tmpNumberMaterial = numberMaterial + 1;
                            course.materialName = "NAA" + addLeadingZeros(tmpNumberMaterial);
                            course.materialCode = "NAA";
                        }
                    }
                });
                break;
            case "Kim loại":
                var numberMaterial = 0;
                Artwork.estimatedDocumentCount({}, (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        if (count > 0) {
                            Artwork.find({ materialCode: "KAA" })
                                .then(filterProduct => {
                                    if (filterProduct.length === 0) {
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "KAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "KAA";
                                    } else {
                                        filterProduct.forEach(product => {
                                            var result = product.materialName.slice(3); // Loại bỏ 3 ký tự đầu
                                            var numberResult = parseInt(result, 10); // Chuyển đổi thành số nguyên với hệ cơ số 10
                                            if (numberResult > numberMaterial) {
                                                numberMaterial = numberResult;
                                            }
                                        })
                                        var tmpNumberMaterial = numberMaterial + 1;
                                        course.materialName = "KAA" + addLeadingZeros(tmpNumberMaterial);
                                        course.materialCode = "KAA";
                                    }
                                }).catch(err => {
                                    console.log("Không thể lấy được thông tin của sản phẩm !!!")
                                })
                        } else {
                            var tmpNumberMaterial = numberMaterial + 1;
                            course.materialName = "KAA" + addLeadingZeros(tmpNumberMaterial);
                            course.materialCode = "KAA";
                        }
                    }
                });
                break;
        }
        // here
        // save thông tin
        course.save()
            .then(() => res.json(req.body))
            .catch((error) => {
                res.json(error)
            })

        // res.send(`oke`)
    }

    show(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10000000000;
        const sort = parseInt(req.query.sort) || -1;
        const sortPrice = parseInt(req.query.sortPrice)
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 10000000000;
        var sorts = { createdAt: sort }
        if (sortPrice) {
            sorts = { reducedPrice: sortPrice }
        }
        const options = {
            page: page,
            limit: limit,
            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
            sort: sorts,
        };
        const query = { quantity: { $gt: 0 }, reducedPrice: { $gte: minPrice, $lte: maxPrice } };
        Artwork.paginate(query, options, function (err, result) {
            return res.json(result)
        })
    }

    showProductStaff(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10000000000;
        const sort = parseInt(req.query.sort) || -1; // Trang hiện tại, mặc định là trang 1
        const options = {
            page: page,
            limit: limit,
            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
            sort: { createdAt: sort },
        };
        Artwork.paginate({}, options, function (err, result) {
            return res.json(result)
        })
    }

    showSold(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10000000000;
        const sort = parseInt(req.query.sort) || -1; // Trang hiện tại, mặc định là trang 1
        const sortPrice = parseInt(req.query.sortPrice)
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 10000000000;
        var sorts = { sold: sort }
        if (sortPrice) {
            sorts = { reducedPrice: sortPrice }
        }
        const options = {
            page: page,
            limit: limit,
            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
            sort: sorts,
        };
        const query = { quantity: { $gt: 0 }, reducedPrice: { $gte: minPrice, $lte: maxPrice } };
        Artwork.paginate(query, options, function (err, result) {
            return res.json(result)
        })
    }
    showPrice(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10000000000;
        const sort = parseInt(req.query.sort) || -1;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 10000000000;

        const options = {
            page: page,
            limit: limit,
            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
            sort: { reducedPrice: sort },
        };
        const query = { quantity: { $gt: 0 }, reducedPrice: { $gte: minPrice, $lte: maxPrice } };
        Artwork.paginate(query, options, function (err, result) {
            return res.json(result)
        })
    }

    get(req, res, next) {
        try {
            const id = req.params.id
            Artwork.findById(id)
                .then((Artwork => {
                    res.json(Artwork)
                }
                ))
                .catch(next => res.status(500).json({ error: 'Could not retrieve product.' }))

        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve product.' });
        }
    }

    delete(req, res, next) {
        Artwork.delete({ _id: req.params.id })
            .then((Artwork => {
                res.send(Artwork)
            }
            ))
            .catch(next => res.status(500).json({ error: 'Could not retrieve product.' }))

    } catch(error) {
        res.status(500).json(error);

    }

    countByProduct(req, res, next) {
        Artwork.aggregate([
            {
                $group: {
                    _id: null, // Nhóm theo trường 'name'
                    totalProducts: { $sum: 1 } // Đếm số lượng người dùng trong nhóm
                }
            }
        ]).then((result) => {
            res.json(result);
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Could not retrieve the user count.' });
        });
    }

}
module.exports = new ProductControllers;
