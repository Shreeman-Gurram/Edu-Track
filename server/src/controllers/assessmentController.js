const {
  getAssessments: getAssessmentsService,
  getAssessmentById: getAssessmentByIdService,
  submitAssessment: submitAssessmentService,
  createQuestion: createQuestionService,
  getQuestions: getQuestionsService,
  createAssessment: createAssessmentService,
  getAdminAssessments: getAdminAssessmentsService,
  getSubjectCatalog: getSubjectCatalogService,
} = require('../services/assessmentService');

function getErrorStatusCode(error) {
  return error.statusCode || 500;
}

function getAssessments(req, res) {
  return getAssessmentsService({
    userId: req.user.userId,
    role: req.user.role,
  })
    .then((assessments) => {
      return res.status(200).json({
        success: true,
        assessments,
      });
    })
    .catch((error) => {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: error.message || 'Failed to fetch assessments',
      });
    });
}

function getAssessmentById(req, res) {
  return getAssessmentByIdService({
    assessmentId: req.params.id,
    userId: req.user.userId,
    role: req.user.role,
  })
    .then((assessment) => {
      return res.status(200).json({
        success: true,
        assessment,
      });
    })
    .catch((error) => {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: error.message || 'Failed to fetch assessment',
      });
    });
}

function submitAssessment(req, res) {
  const { answers } = req.body || {};

  return submitAssessmentService({
    assessmentId: req.params.id,
    answers,
    userId: req.user.userId,
    role: req.user.role,
  })
    .then((result) => {
      return res.status(200).json({
        success: true,
        message: 'Assessment submitted successfully',
        result,
      });
    })
    .catch((error) => {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: error.message || 'Failed to submit assessment',
      });
    });
}

function serviceResponse(service, successStatus, key) {
  return (req, res) => service(req.body || req.query || {}).then((data) => res.status(successStatus).json({ success: true, [key]: data })).catch((error) => res.status(getErrorStatusCode(error)).json({ success: false, message: error.message || 'Request failed' }));
}

const createQuestion = serviceResponse(createQuestionService, 201, 'question');
const getQuestions = (req, res) => getQuestionsService(req.query || {}).then((questions) => res.json({ success: true, questions })).catch((error) => res.status(getErrorStatusCode(error)).json({ success: false, message: error.message }));
const createAssessment = serviceResponse(createAssessmentService, 201, 'assessment');
const getAdminAssessments = (req, res) => getAdminAssessmentsService().then((assessments) => res.json({ success: true, assessments })).catch((error) => res.status(getErrorStatusCode(error)).json({ success: false, message: error.message }));

const getSubjectCatalog = (req, res) =>
  getSubjectCatalogService({ userId: req.user.userId })
    .then((catalog) => res.json({ success: true, catalog }))
    .catch((error) =>
      res.status(getErrorStatusCode(error)).json({ success: false, message: error.message })
    );

module.exports = {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  createQuestion,
  getQuestions,
  createAssessment,
  getAdminAssessments,
  getSubjectCatalog,
};
