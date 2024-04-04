
const Category = require("../models/Category");

class CategoryControllers {
  put(req, res, next) {
    Category.findByIdAndUpdate(req.params.id, req.body)
      .then((Category) => {
      
        res.json(Category);
      })
      .catch((next) => res.json(next));
  }




  post(req, res, next) {
    const formData = req.body;
    const course = new Category(formData);
    course
      .save()
      .then(() => res.json(req.body))
      .catch((error) => {
        res.json(error);
      });

  }

  show(req, res, next) {
    Category.find()
      .then((Category) => {
        res.json(Category);
      })
      .catch((next) =>
        res.status(500).json({ error: "Could not retrieve Category." })
      );

  }




  get(req, res, next) {
    try {
      const id = req.params.id;
      Category.findById(id)
        // .populate("user")
        .then((Category) => {
          res.json(Category);
        })
        .catch((next) =>
          res.status(500).json({ error: "Could not retrieve Category." })
        );
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve Category." });
    }
  }

  delete(req, res, next) {
    Category.delete({ _id: req.params.id })
      .then((Category) => {
        res.send(Category);
      })
      .catch((next) =>
        res.status(500).json({ error: "Could not retrieve Category." })
      );
  }
  catch(error) {
    res.status(500).json(error);
  }





}
module.exports = new CategoryControllers();
