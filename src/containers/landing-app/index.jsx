import React from 'react';

import Container from '@material-ui/core/Container';

import LoginForm from '../../components/login-form';

import { authenticate } from '../../api/session';

import './styles.css';

class LandingApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isEmailValid: true,
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    const { value } = e.target;

    this.setState({ email: value });
  }

  handlePasswordChange(e) {
    const { value } = e.target;

    this.setState({ password: value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    const authenticated = await authenticate(email, password);

    if (!authenticated) {
      alert('Invalid credentials');
      return;
    }

    window.location.pathname = '/teacher';
  }

  render() {
    const { email, password, isEmailValid } = this.state;

    return (
      <Container
        maxWidth="sm"
        className="LandingApp"
      >
        <LoginForm
          email={email}
          isEmailValid={isEmailValid}
          onEmailChange={this.handleEmailChange}
          password={password}
          onPasswordChange={this.handlePasswordChange}
          onSubmit={this.handleSubmit}
        />
      </Container>
    );
  }
}

export default LandingApp;