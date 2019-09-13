import React from 'react'

import './styles.css'

class QuestionForm extends React.Component {
  constructor(props) {
    super(props)

    let correctInputs = 1
    let incorrectInputs = 3

    if (this.props.answers) {
      correctInputs = this.props.answers.filter((a) => a.correct).length + 1
      incorrectInputs = this.props.answers.filter((a) => !a.correct).length + 1
    }

    this.state = {
      correctInputs,
      incorrectInputs,
      themes: [],
    }

    this.addAnswer = this.addAnswer.bind(this)
    this.renderAnswers = this.renderAnswers.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubjectChange = this.handleSubjectChange.bind(this)

    this.renderSubjects = this.renderSubjects.bind(this)
    this.renderThemes = this.renderThemes.bind(this)
  }

  componentDidMount() {
    if (this.props.subjects.length === 0)
      return

    const subject = this.props.subject ?
      this.props.subject :
      this.props.subjects[0]

    this.getAndSetThemes(subject)
  }

  componentDidUpdate(prevProps) {
    if (this.props.subjects === prevProps.subjects)
      return

    const subject = this.props.subject ?
      this.props.subject :
      this.props.subjects[0]

    this.getAndSetThemes(subject)
  }

  getAndSetThemes(subject) {
    this.props.getThemes(subject)
      .then((themes) => {
        this.setState({ themes })
      })
  }

  handleSubjectChange(e) {
    const subjectName = e.target.value
    const subject = this.props.subjects.find((s) => s === subjectName)

    if (!subject)
      return

    this.getAndSetThemes(subject)
  }

  handleSubmit(e) {
    e.preventDefault()
    const form = e.target

    const formData = new FormData(form)
    const correct = formData.getAll('correctAnswers[]').filter(a => a.length > 0)
    const incorrect = formData.getAll('incorrectAnswers[]').filter(a => a.length > 0)

    formData.delete('correctAnswers[]')
    formData.delete('incorrectAnswers[]')

    correct.map((answer) => formData.append('correctAnswers[]', answer))
    incorrect.map((answer) => formData.append('incorrectAnswers[]', answer))

    form.reset()
    this.setState({
      correctInputs: 1,
      incorrectInputs: 3,
    })

    if (this.props.handleSubmit)
      this.props.handleSubmit(formData)
  }

  addAnswer(correct) {
    if (correct)
      this.setState((state) => ({ correctInputs: state.correctInputs + 1}))
    else
      this.setState((state) => ({ incorrectInputs: state.incorrectInputs + 1}))
  }

  renderAnswers(correct) {
    const numOfInputs = correct ? this.state.correctInputs : this.state.incorrectInputs
    const inputName = correct ? 'correctAnswers[]' : 'incorrectAnswers[]'

    const defaultValues = this.props.answers ?
      this.props.answers.filter((a) => a.correct === correct).map(a => a.text) :
      [...Array(numOfInputs).keys()].map((i) => '')

    return [...Array(numOfInputs).keys()].map((i) => {
      // If it's the last input
      if (i === numOfInputs-1) {
        return (<input type="text" key={i} name={inputName}
          onChange={(e) => this.addAnswer(correct)} />)
      }

      const value = defaultValues[i]

      return <input type="text" key={i} name={inputName} defaultValue={value} />
    })
  }

  renderSubjects() {
    return (
      <select
        defaultValue={this.props.subject}
        onChange={this.handleSubjectChange}
        name="subject"
      >
        {this.props.subjects.map((subject) => {
          return <option key={subject}>{subject}</option>
        })}
      </select>
    )
  }

  renderThemes() {
    const defaultValue = this.props.theme ?
      this.props.theme :
      ""

    return (
      <div>
        <input
          name="theme"
          defaultValue={defaultValue}
          type="text"
          list="themes-list"
        />
        <datalist id="themes-list">
          {this.state.themes.map((theme) => {
            return <option key={theme} value={theme} />
          })}
        </datalist>
      </div>
    )
  }

  render() {
    return (
      <form
        className="QuestionForm"
        onSubmit={this.handleSubmit}
      >

        <div className="subject">
          <label><p>Subject:</p></label>{this.renderSubjects()}

          <label><p>Theme:</p></label>{this.renderThemes()}
        </div>

        <div className="question">
          <label><p>Question:</p></label>
          <textarea defaultValue={this.props.text || ''} name="text" />
          <input defaultValue={this.props.points || 0} type="number" name="points" />
        </div>

        <div className="answers">
          <fieldset>
            <legend>Correct</legend>
            {this.renderAnswers(true)}
          </fieldset>

          <fieldset>
            <legend>Incorrect</legend>
            {this.renderAnswers(false)}
          </fieldset>
        </div>

        {this.props.showMedia &&
        <div className="media">
          <Media defaultValue={this.props.media} />
        </div>
        }

        <div className="submit">
          <button>Submit</button>
        </div>

      </form>
    )
  }
}

function Media(props) {
  return (
    <fieldset>
      <legend>Media</legend>
      <input name="media" type="file" multiple />
    </fieldset>
  )
}

export default QuestionForm
