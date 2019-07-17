import React, { Component } from 'react';

class OverView extends Component {
  handleLogOut = () => {};

  render() {
    return (
      <div>
        <div>OverView Page</div>
        <button type="button" onClick={this.handleLogOut}>
          Log out
        </button>
      </div>
    );
  }
}

export default OverView;
