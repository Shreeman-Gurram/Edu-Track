function getHealth(req, res) {
  return res.json({
    success: true,
    message: 'Server is running',
  });
}

module.exports = { getHealth };
