module.exports = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      aboutEarly: false,
    });
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};
