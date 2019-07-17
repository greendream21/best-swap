import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class SignIn extends Component {
  state = {
    username: '',
    password: '',
  };

  handleChange = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleSignIn = () => {};

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <div>SignIn Page</div>
        <div>
          <input
            type="text"
            value={username}
            onChange={this.handleChange('username')}
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={this.handleChange('password')}
          />
          <br />
          <button type="button" onClick={this.handleSignIn}>
            Sign In
          </button>
          <br />
          <Link to="/signup">Try SignUp</Link>
        </div>
      </div>
    );
  }
}

export default SignIn;
