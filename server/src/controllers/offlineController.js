const { getLearningPackage: getLearningPackageService, syncOfflineActivity: syncOfflineActivityService } = require('../services/offlineService');

function getLearningPackage(req, res) {
  return getLearningPackageService(req.user._id)
    .then((learningPackage) => res.status(200).json({ success: true, package: learningPackage }))
    .catch((error) => res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Unable to get learning package' }));
}

function syncOfflineActivity(req, res) {
  const { packageVersion, activities } = req.body || {};
  return syncOfflineActivityService({ userId: req.user._id, packageVersion, activities })
    .then(({ synced, failed, currentVersion, packageOutdated }) => res.status(200).json({ success: true, synced, failed, currentVersion, packageOutdated }))
    .catch((error) => res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Unable to sync offline activity' }));
}

module.exports = { getLearningPackage, syncOfflineActivity };
