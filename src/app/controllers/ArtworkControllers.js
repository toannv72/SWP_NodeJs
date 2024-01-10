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
            console.log(111111111111);
            Artwork.findById(req.params.artworkId)
                .then((artwork) => {
                    if (!artwork) {
                        return res.status(404).json({ message: 'Artwork not found' });
                    }
                    const existingLikeIndex = artwork.likes.findIndex(like => like.user.toString() === req.params.userId);

                   

                    // Thêm like mới vào mảng likes
                    artwork.likes.splice(existingLikeIndex, 1);

                    // Lưu cập nhật
                    artwork.save();

                    console.log('UnLike successful');
                }).catch((error) => {
                    console.log(error);
                });

        } catch (error) {
            console.error('Unlike failed:', error.message);
        }
    }
    likeArtwork(req, res, next) {
        try {
            // Tìm tài liệu artwork cần thêm like

            Artwork.findById(req.params.artworkId)
                .then((artwork) => {
                    const existingLikeIndex = artwork.likes.findIndex(like => like.user.toString() === req.params.userId);
                    if (existingLikeIndex !== -1) {
                        throw new Error('User already liked this artwork');
                    }
                    // Thêm like mới vào mảng likes
                    artwork.likes.push({ user: req.params.userId });
                    // Lưu cập nhật
                    artwork.save();
                    console.log('Like successful');
                }).catch((error) => {
                    console.log(error);
                });


            // Kiểm tra xem người dùng đã like trước đó hay chưa

        } catch (error) {
            console.error('Like failed:', error.message);
        }
    }
    cmtArtwork(req, res, next) {
        try {
            // Tìm tài liệu artwork cần thêm like
            Artwork.findById(req.params.artworkId)
                .then((artwork) => {
                    // const existingLikeIndex = artwork.comments.findIndex(like => like.user.toString() === req.params.userId);
                    // if (existingLikeIndex !== -1) {
                    //     throw new Error('User already liked this artwork');
                    // }
                    // Thêm like mới vào mảng comments
                    artwork.comments.push({ user: req.params.userId, content: req.body.content });
                    // Lưu cập nhật
                    artwork.save();
                }).catch((error) => {
                    console.log(1111111111111111111, error);
                });


            // Kiểm tra xem người dùng đã like trước đó hay chưa


        } catch (error) {
            console.error('Like failed:', error.message);
        }
    }
    post(req, res, next) {
        const formData = req.body
        const course = new Artwork(formData)
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
