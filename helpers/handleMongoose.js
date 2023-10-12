const HandleMongoose = (error,data,next) => {
    error.status = 400
    next(error)
  }

  module.exports = HandleMongoose