const React = require('react');
import { Link } from "react-router-dom";

class Nav extends React.Component {

  render() {
    const navComponents = [];
    if (this.props.loggedIn) {
      navComponents.push(
        <ul key={0} className="nav-items">
          <li key={0}><Link to="/">Home</Link></li>
          <li key={1}><Link to="/mypage">Profile</Link></li>
          <li key={3}><Link to="/search">Search</Link></li>
          <li key={4}><Link to="/" onClick={this.props.logOut}>Log out</Link></li>
        </ul>
      )
    } else {
      navComponents.push(
        <ul key={1} className="nav-items">
          <li key={1}><Link to="/login">Login</Link></li>
          <li key={2}><Link to="/register">Register</Link></li>
        </ul>
      )
    }

    return (
      <div className="nav-bar">
        {navComponents}
      </div>
    )
  }
}

export default Nav;
