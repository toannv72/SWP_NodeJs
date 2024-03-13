const User = require("../models/User");
const Token = require("../../config/db/config");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { sendMailForgotPassword } = require("../../config/mail");
const { sendEmail } = require("../../config/sendEmail");
const _ = require("lodash");
var bcrypt = require("bcryptjs");
class UserController {
  put(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        User.findById(req.params.id)
          .then((data) => {
            return res.json({ _doc: data });
          })
          .catch((next) => res.json(next));
      })
      .catch((next) => res.json(next));
  }
  followUser(req, res, next) {
    try {
      // Tìm tài liệu artwork cần thêm like
      User.findById(req.params.id)
        .then((follow) => {
          const existingLikeIndex = follow.follow.findIndex(
            (follows) => follows.user.toString() === req.params.userId
          );
          if (existingLikeIndex !== -1) {
            return res.json({ message: "Users have followed this " });
          }
          follow.follow.push({ user: req.params.userId });
          follow.save();
          User.findById(req.params.userId).then((followAdd) => {
            const existingFollowAddIndex = followAdd.followAdd.findIndex(
              (followAdd) => followAdd.user.toString() === req.params.id
            );
            if (existingFollowAddIndex !== -1) {
              return res.json({ message: "Users have followed this1" });
            }
            followAdd.followAdd.push({ user: req.params.id });
            followAdd.save();
            return res.json(follow);
          });
        })
        .catch((error) => {
          return res.json(error);
        });
    } catch (error) {
      console.error("follow failed:", error);
    }
  }
  undFollowUser(req, res, next) {
    try {
      // Tìm tài liệu artwork cần thêm like
      User.findById(req.params.id)
        .then((follow) => {
          follow.follow.splice({ user: req.params.userId });
          follow.save();
          User.findById(req.params.userId).then((followAdd) => {
            followAdd.followAdd.splice({ user: req.params.id });
            followAdd.save();
            return res.json(follow);
          });
        })
        .catch((error) => {
          return res.json(error);
        });
    } catch (error) {
      console.error("follow failed:", error);
    }
  }

  trash(req, res, next) {
    User.findDeleted()
      .then((courses) => res.json(courses))
      .catch(next);
  }
  countByRole(req, res, next) {
    req.params.role;
    User.aggregate([
      {
        $match: { role: req.params.role }, // Chỉ lấy người dùng có vai trò là "user"
      },
      {
        $group: {
          _id: "$role", // Nhóm theo trường 'role'
          totalUsers: { $sum: 1 }, // Đếm số lượng người dùng trong nhóm
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

  changePassword(req, res, next) {
    const formData = req.body;

    var checkTokenValid = jwt.verify(
      req.cookies.accessToken,
      Token.refreshToken
    );

    User.findById(checkTokenValid.user._id)
      .then((user) => {
        bcrypt.compare(formData.password, user.password, function (err, check) {
          console.log(1111111111111, check);
          if (check) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(formData.newPassword, salt);
            formData.newPassword = hash;

            User.findByIdAndUpdate(
              checkTokenValid.user._id,
              { password: formData.newPassword },
              { new: true }
            )
              .then((courses) => {
                var token = jwt.sign({ user }, Token.refreshToken);
                res.cookie("accessToken", token);
                return res.json({ ...courses, accessToken: token });
              })
              .catch((next) => {
                res.json(next);
              });
          } else {
            return res.status(401).send({
              error: "Incorrect password",
            });
          }
        });
      })
      .catch((next) => {
        res.status(500).json(next);
      });
  }

  restore(req, res, next) {
    User.restore({ _id: req.params.id })
      .then(() => {
        User.findByIdAndUpdate(
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
    const limit = parseInt(req.query.limit) || 10; // Số lượng phần tử trên mỗi trang, mặc định là 10
    const formData = req.query.name;
    const escapedSearchTerm = escapeRegExp(formData);

    const options = {
      page: page,
      limit: 5,

      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
    };

    User.paginate(
      { name: { $regex: escapedSearchTerm }, hidden: false },
      options,
      function (err, result) {
        return res.json({
          user: result.docs,
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

  post(req, res, next) {
    const formData = req.body;
    const course = new User(formData);
    course
      .save()
      .then(() => res.json(req.body))
      .catch((error) => {
        res.json(error);
      });

    // res.send(`oke`)
  }

  get(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 100; // Số lượng phần tử trên mỗi trang, mặc định là 10
    const options = {
      page: page,
      limit: limit,
      // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
      collation: {
        locale: "en",
      },
    };
    User.paginate({}, options, function (err, result) {
      res.json(result);
    });
  }

  getOne(req, res, next) {
    User.findById(req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(err));
  }

  unblock(req, res, next) {
    User.findById(req.params.id)
      .then((data) => {
        console.log(1111111111111111, data.role);
        if (data.role === "admin") {
          res.status(500).json({ error: "Không thể xóa tài khoản này" });
        } else {
          console.log(req.params.id);
          User.findOneAndUpdate(
            { _id: req.params.id },
            { deleted: false },
            { hidden: false },
            { new: true, upsert: true }
          )
            .then((User) => {
              console.log(User);
              console.log(11111222);
              res.send(User);
            })
            .catch((error) =>
              res.status(500).json({ error: "Could not retrieve User." })
            );
        }
      })
      .catch((err) => res.status(err));
  }

  forgotPassword(req, res, next) {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
      return res.status(400).json({ message: "No Email in request body" });
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err || !user)
        return res.status("401").json({
          error: "User with that email does not exist!",
        });
      const token = jwt.sign({ _id: user._id }, Token.refreshToken);
      const emailData = {
        from: "noreply@node-react.com",
        to: email,
        subject: "Password Reset Instructions",
        html: sendMailForgotPassword(token),
      };
      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
          return res.json({ message: err });
        } else {
          sendEmail(emailData);
          return res.status(200).json({
            message: `Email has been sent to ${email}!`,
          });
        }
      });
    });
  }

  resetPassword(req, res) {
    const { resetPasswordLink, newPassword } = req.body;
    User.findOne({ resetPasswordLink }, (err, user) => {
      if (err || !user)
        return res.status("401").json({
          error: "Invalid Link!",
        });
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(newPassword, salt);
      const updatedFields = {
        password: hash,
        resetPasswordLink: "",
      };
      user = _.extend(user, updatedFields);
      user.updated = Date.now();
      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json({
          message: `Great! login with your new password.`,
        });
      });
    });
  }
  changePassword(req, res) {
    const { email, oldPassword, password } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err || !user)
        return res.status("401").json({
          error: "Invalid Link!",
        });
      bcrypt.compare(oldPassword, user.password, function (err, check) {
        if (!check) {
          return res.status(401).json({
            error: "password do not match",
          });
        }
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const updatedFields = {
          password: hash,
        };
        user = _.extend(user, updatedFields);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          res.json({
            message: `Great! change password success.`,
          });
        });
      });
    });
  }
  delete(req, res, next) {
    User.findById(req.params.id)
      .then((data) => {
        console.log(1111111111111111, data.role);
        if (data.role === "admin") {
          res.status(500).json({ error: "Không thể xóa tài khoản này" });
        } else {
          User.findOneAndUpdate(
            { _id: req.params.id },
            { deleted: true },
            { hidden: true }
          )
            .then((User) => {
              res.send(User);
            })
            .catch((error) =>
              res.status(500).json({ error: "Could not retrieve User." })
            );
        }
      })
      .catch((err) => res.status(err));
  }
  catch(error) {
    res.status(500).json(error);
  }
}
module.exports = new UserController();
