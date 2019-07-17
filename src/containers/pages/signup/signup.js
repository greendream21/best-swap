import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class SignUp extends Component {
  state = {
    username: '',
    password: '',
  };

  handleChange = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleSignUp = () => {};

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <div>SignUp Page</div>
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
          <button type="button" onClick={this.handleSignUp}>
            Sign Up
          </button>
          <br />
          <Link to="/signup">Try SignIn</Link>
        </div>
      </div>
    );
  }
}

export default SignUp;
