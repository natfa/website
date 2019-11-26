import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ForwardIcon from '@material-ui/icons/ArrowForward';
import BackIcon from '@material-ui/icons/ArrowBack';

import './styles.css';

const QuestionsNav = ({
  questions,
  questionId,

  selectQuestion,
}) => questions.map((question, i) => {
  const props = {
    variant: 'h5',
    key: question.id,
    onClick: () => selectQuestion(question.id),
  };

  if (question.selectedAnswerId !== undefined) {
    props.className = 'answered';
    if (question.id === questionId) {
      props.className = 'answered-and-selected';
    }
  } else if (question.id === questionId) {
    props.className = 'selected';
  }

  return (
    <Typography {...props}>
      {i + 1}
    </Typography>
  );
});


const ExamSolverNavBar = ({
  questions,
  questionId,

  selectQuestion,
  onSubmit,
}) => (
  <div className="exam-solver-nav-bar">
    <Grid
      container
      direction="row"
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      spacing={2}
    >
      <Grid
        className="question-navigator"
        item
        container
        direction="row"
        wrap="nowrap"
        xs={12}
        sm={5}
      >
        <QuestionsNav
          questions={questions}
          questionId={questionId}
          selectQuestion={selectQuestion}
        />
      </Grid>

      <Grid
        item
        container
        justify="center"
        xs={12}
        sm={2}
      >
        <Grid item>
          <Typography variant="h2">00:00</Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justify="flex-end"
        xs={12}
        sm={5}
      >
        <Grid item>
          <Button
            startIcon={<BackIcon />}
            color="secondary"
            size="large"
            variant="contained"
            style={{
              marginRight: '10px',
            }}
            onClick={() => {
              const questionIndex = questions
                .findIndex((q) => q.id === questionId);

              if (questionIndex === -1) return;

              if (questionIndex === 0) {
                const qId = questions[questions.length - 1].id;
                selectQuestion(qId);
                return;
              }

              const qId = questions[questionIndex - 1].id;
              selectQuestion(qId);
            }}
          >
            назад
          </Button>
        </Grid>

        <Grid item>
          <Button
            endIcon={<ForwardIcon />}
            size="large"
            color="primary"
            variant="contained"
            onClick={() => {
              const questionIndex = questions
                .findIndex((q) => q.id === questionId);

              if (questionIndex === -1) return;

              if (questionIndex === questions.length - 1) {
                const qId = questions[0].id;
                selectQuestion(qId);
                return;
              }

              const qId = questions[questionIndex + 1].id;
              selectQuestion(qId);
            }}
          >
            напред
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

ExamSolverNavBar.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  questionId: PropTypes.string.isRequired,

  selectQuestion: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ExamSolverNavBar;
