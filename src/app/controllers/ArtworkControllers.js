const { addLeadingZeros } = require("../../util/UtilsFuntion");
const Artwork = require("../models/Artwork");
const User = require("../models/User");
const Token = require("../../config/db/config");
var jwt = require("jsonwebtoken");
class ProductControllers {
  put(req, res, next) {
    Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((product) => {
        res.json(product);
      })
      .catch((next) => res.json(next));
  }

  trash(req, res, next) {
    Artwork.findDeleted()
      .then((courses) => res.json(courses))
      .catch(next);
  }

  restore(req, res, next) {
    Artwork.restore({ _id: req.params.id })
      .then(() => {
        Artwork.findByIdAndUpdate(
          req.params.id,
          // req.body
          {
            deleted: false,
          }
        )
          .then((e) => res.json(e))
          .catch(next);
      })
      .catch(next);
  }
  search(req, res, next) {
    function escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 9; // Số lượng phần tử trên mỗi trang, mặc định là 10
    const formData = req.query.name;
    const escapedSearchTerm = escapeRegExp(formData);
    const regex = new RegExp(escapedSearchTerm, "i");
    const options = {
      page: page,
      limit: limit,

      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
    };
    if (formData === "") {
      Artwork.find({})
        .then((movies) => {
          res.json({ movie: [movies] });
        })
        .catch(next);
    } else {
      Artwork.paginate(
        { content: { $regex: regex } },
        options,
        function (err, result) {
          // if (result.totalPages < result.page) {
          //     const options1 = {
          //         page: result.totalPages,
          //         limit: 9,

          //         // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
          //         collation: {
          //             locale: 'en',
          //         },
          //     };
          //     Artwork.paginate({ content: { $regex: escapedSearchTerm } }, options1, function (err, data) {

          //         return res.json(
          //             {
          //                 products: (data.docs),
          //                 totalPages: data.totalPages,
          //                 page: result.totalPages,
          //                 prevPage: data.prevPage,
          //                 nextPage: data.nextPage,
          //                 totalDocs: data.totalDocs,
          //                 search: formData
          //             })

          //     })

          // } else {

          return res.json({
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            totalDocs: result.totalDocs,
            search: formData,
          });
          // }
        }
      );
    }
  }
  searchGenre(req, res, next) {
    function escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/[^\w\s&]/g, "\\$&");
      // Thêm replace(/[^\w\s]/g, "\\$&") để giữ lại ký tự không phải chữ cái hoặc khoảng trắng
    }
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 15; // Số lượng phần tử trên mỗi trang, mặc định là 10
    const formData = req.query.name;
    console.log('====================================');
    console.log(formData);
    console.log('====================================');
    const escapedSearchTerm = escapeRegExp(formData);
    const regex = new RegExp(escapedSearchTerm, "i");
    const options = {
      page: page,
      limit: limit,

      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
    };
    if (formData === "") {
      Artwork.find({})
        .then((movies) => {
          res.json({ movie: [movies] });
        })
        .catch(next);
    } else {
      Artwork.paginate(
        { genre: { $regex: regex } }, // Sử dụng $regex để áp dụng biểu thức chính quy
        options,
        function (err, result) {

          return res.json({
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            totalDocs: result.totalDocs,
            search: formData,
          });
        }
      );
    }
  }
  // searchGenre(req, res, next) {
  //   function escapeRegExp(text) {
  //     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  //   }
  //   const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
  //   const limit = parseInt(req.query.limit) || 15; // Số lượng phần tử trên mỗi trang, mặc định là 10
  //   const formData = req.query.name;
  //   const escapedSearchTerm = escapeRegExp(formData);
  //   const regex = new RegExp(escapedSearchTerm, "i");
  //   const options = {
  //     page: page,
  //     limit: limit,

  //     // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
  //     collation: {
  //       locale: "en",
  //     },
  //   };
  //   if (formData === "") {
  //     Artwork.find({})
  //       .then((movies) => {
  //         res.json({ movie: [movies] });
  //       })
  //       .catch(next);
  //   } else {
  //     Artwork.paginate(
  //       { genre: { $in: [regex] } },
  //       options,
  //       function (err, result) {

  //         return res.json({
  //           products: result.docs,
  //           totalPages: result.totalPages,
  //           page: result.page,
  //           prevPage: result.prevPage,
  //           nextPage: result.nextPage,
  //           totalDocs: result.totalDocs,
  //           search: formData,
  //         });
  //       }
  //       // }
  //     );
  //   }
  // }
  unlikeArtwork(req, res, next) {
    try {
      var checkTokenValid = jwt.verify(
        req.cookies.accessToken,
        Token.refreshToken
      );
      User.findById(checkTokenValid.user._id)
        .then((artwork) => {
          if (artwork.hidden) {
            return res.status(500).json({ error: "bạn đang bị chặn!" });
          }
          Artwork.findById(req.params.artworkId)
            .then((artwork) => {
              if (!artwork) {
                return res.status(404).json({ message: "Artwork not found" });
              }
              const existingLikeIndex = artwork.likes.findIndex(
                (like) => like.user.toString() === req.params.userId
              );
              // Thêm like mới vào mảng likes
              artwork.likes.splice(existingLikeIndex, 1);
              // Lưu cập nhật
              artwork.save();
              return res.json(artwork);
            })
            .catch((error) => {
              return res.json(error);
            });
        })
        .catch((error) => { });
    } catch (error) {
      console.error("Unlike failed:", error.message);
    }
  }
  likeArtwork(req, res, next) {
    try {
      // Tìm tài liệu artwork cần thêm like
      var checkTokenValid = jwt.verify(
        req.cookies.accessToken,
        Token.refreshToken
      );
      User.findById(checkTokenValid.user._id)
        .then((artwork) => {
          if (artwork.hidden) {
            return res.status(500).json({ error: "bạn đang bị chặn!" });
          }
          Artwork.findById(req.params.artworkId)
            .then((artwork) => {
              const existingLikeIndex = artwork.likes.findIndex(
                (like) => like.user.toString() === req.params.userId
              );
              if (existingLikeIndex !== -1) {
                throw new Error("User already liked this artwork");
              }
              // Thêm like mới vào mảng likes
              artwork.likes.push({ user: req.params.userId });
              // Lưu cập nhật
              artwork.save();
              return res.json(artwork);
            })
            .catch((error) => {
              return res.json(error);
            });
        })
        .catch((error) => { });

      // Kiểm tra xem người dùng đã like trước đó hay chưa
    } catch (error) {
      console.error("Like failed:", error.message);
    }
  }
  cmtArtwork(req, res, next) {
    try {
      var checkTokenValid = jwt.verify(
        req.cookies.accessToken,
        Token.refreshToken
      );
      User.findById(checkTokenValid.user._id)
        .then((artwork) => {
          if (artwork.hidden) {
            return res.status(500).json({ error: "bạn đang bị chặn!" });
          }
          Artwork.findById(req.params.artworkId)
            .then((artwork) => {
              // const existingLikeIndex = artwork.comments.findIndex(like => like.user.toString() === req.params.userId);
              // if (existingLikeIndex !== -1) {
              //     throw new Error('User already liked this artwork');
              // }
              // Thêm like mới vào mảng comments
              artwork.comments.push({
                user: req.params.userId,
                content: req.body.content,
              });
              // Lưu cập nhật
              artwork.save();
              return res.json(artwork);
            })
            .catch((error) => {
              return res.json(error);
            });
        })
        .catch((error) => { });
      // Tìm tài liệu artwork cần thêm like

      // Kiểm tra xem người dùng đã like trước đó hay chưa
    } catch (error) {
      return res.json(error);
    }
  }
  post(req, res, next) {
    const formData = req.body;
    const course = new Artwork(formData);
    var checkTokenValid = jwt.verify(
      req.cookies.accessToken,
      Token.refreshToken
    );
    User.findById(checkTokenValid.user._id)
      .then((artwork) => {
        if (artwork.hidden) {
          return res.status(500).json({ error: "bạn đang bị chặn!" });
        }
        course
          .save()
          .then(() => res.json(req.body))
          .catch((error) => {
            res.status(500).json({
              error: "Hiện đang gặp phải vấn đề vui lòng thử lại sau!",
            });
          });
      })
      .catch((error) => { });

    // res.send(`oke`)
  }

  async show(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10000000000;
    const sort = parseInt(req.query.sort) || -1;
    const cate = req.query.cate || "all";
    var sorts = { createdAt: sort };
    function escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const escapedSearchTerm = escapeRegExp(cate);
    const regex = new RegExp(escapedSearchTerm, "i");
    const options = {
      page: page,
      limit: limit,
      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
      sort: sorts,
    };
    const nonHiddenUsers = await User.find({ hidden: false });
    const userIds = nonHiddenUsers.map((user) => user._id);
    const query = {};
    query.user = { $in: userIds };
    if (cate !== "all") {
      query.genre = {
        $in: Array.isArray(regex) ? regex : [regex],
      };
    }
    Artwork.paginate(query, options, function (err, result) {
      return res.json(result);
    });
  }
  showFollow(req, res, next) {
    const userId = req.params.id; // Lấy _id của người dùng từ request, bạn cần đảm bảo rằng đã xác thực người dùng và có thông tin người dùng trong request
    // Bước 1: Tìm người dùng dựa trên _id
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        // Bước 2: Lấy danh sách các người dùng mà người dùng đã follow
        const followedUsers = user.followAdd.map((follow) => follow.user);

        // Bước 3: Sử dụng danh sách đã follow để tìm các bài viết từ những người dùng không ẩn
        const options = {
          page: parseInt(req.query.page) || 1,
          limit: parseInt(req.query.limit) || 10000000000,
          collation: {
            locale: "en",
          },
          sort: { createdAt: parseInt(req.query.sort) || -1 },
        };

        // Lọc ra những người dùng không ẩn từ danh sách đã follow
        User.find({ _id: { $in: followedUsers }, hidden: false })
          .then((nonHiddenFollowAdd) => {
            const nonHiddenFollowAddIds = nonHiddenFollowAdd.map((u) => u._id);

            // Sử dụng danh sách đã follow và không ẩn để tìm các bài viết
            Artwork.paginate(
              { user: { $in: nonHiddenFollowAddIds } },
              options,
              (err, result) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
                return res.json(result);
              }
            );
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }

  showUserFollow(req, res, next) {
    const userId = req.params.id; // Lấy _id của người dùng từ request, bạn cần đảm bảo rằng đã xác thực người dùng và có thông tin người dùng trong request

    // Bước 1: Tìm người dùng dựa trên _id
    User.findById(userId).then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Bước 2: Lấy danh sách các người dùng mà người dùng đã follow
      const followedUsers = user.followAdd.map((follow) => follow.user);
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10000000000,
        collation: {
          locale: "en",
        },
        sort: { createdAt: parseInt(req.query.sort) || -1 },
      };
      User.paginate(
        { _id: { $in: followedUsers }, hidden: false },
        options,
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          return res.json(result);
        }
      );
    });
  }
  showRandom(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10000000000;

    const options = {
      page: page,
      limit: limit,
      // Tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
    };

    Artwork.countDocuments().exec(function (err, count) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const randomSkip = Math.floor(Math.random() * count);

      options.sort = { _id: 1 }; // Sắp xếp theo _id để đảm bảo ngẫu nhiên

      Artwork.paginate({}, options, function (err, result) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.json(result);
      });
    });
  }

  getArtworkUser(req, res, next) {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10000000000;
    const sort = parseInt(req.query.sort) || -1;
    const sortPrice = parseInt(req.query.sortPrice);
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 10000000000;
    var sorts = { createdAt: sort };
    if (sortPrice) {
      sorts = { reducedPrice: sortPrice };
    }
    const options = {
      page: page,
      limit: limit,
      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
      sort: sorts,
    };
    const query = { user: id };
    Artwork.paginate(query, options, function (err, result) {
      return res.json(result);
    });
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
        locale: "en",
      },
      sort: { createdAt: sort },
    };
    Artwork.paginate({}, options, function (err, result) {
      return res.json(result);
    });
  }

  showSold(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10000000000;
    const sort = parseInt(req.query.sort) || -1; // Trang hiện tại, mặc định là trang 1
    const sortPrice = parseInt(req.query.sortPrice);
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 10000000000;
    var sorts = { sold: sort };
    if (sortPrice) {
      sorts = { reducedPrice: sortPrice };
    }
    const options = {
      page: page,
      limit: limit,
      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
      sort: sorts,
    };
    const query = {
      quantity: { $gt: 0 },
      reducedPrice: { $gte: minPrice, $lte: maxPrice },
    };
    Artwork.paginate(query, options, function (err, result) {
      return res.json(result);
    });
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
        locale: "en",
      },
      sort: { reducedPrice: sort },
    };
    const query = {
      quantity: { $gt: 0 },
      reducedPrice: { $gte: minPrice, $lte: maxPrice },
    };
    Artwork.paginate(query, options, function (err, result) {
      return res.json(result);
    });
  }

  get(req, res, next) {
    try {
      const id = req.params.id;
      Artwork.findById(id)
        .then((Artwork) => {
          res.json(Artwork);
        })
        .catch((next) =>
          res.status(500).json({ error: "Could not retrieve product." })
        );
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve product." });
    }
  }

  delete(req, res, next) {
    Artwork.delete({ _id: req.params.id })
      .then((Artwork) => {
        res.send(Artwork);
      })
      .catch((next) =>
        res.status(500).json({ error: "Could not retrieve product." })
      );
  }
  catch(error) {
    res.status(500).json(error);
  }

  countByProduct(req, res, next) {
    Artwork.aggregate([
      {
        $group: {
          _id: null, // Nhóm theo trường 'name'
          totalProducts: { $sum: 1 }, // Đếm số lượng người dùng trong nhóm
        },
      },
    ])
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve the user count." });
      });
  }
  hide = async (req, res, next) => {
    await Artwork.findByIdAndUpdate({ _id: req.params.id }, { hidden: true });
    return res.status(200).json({ hide: true });
  };

  unhide = async (req, res, next) => {
    await Artwork.findByIdAndUpdate({ _id: req.params.id }, { hidden: false });
    return res.status(200).json({ unhide: true });
  };
}
module.exports = new ProductControllers();
