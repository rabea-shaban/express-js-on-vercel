const role = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions and Access denied",
      });
    }
    next();
  };
};

module.exports = role;
