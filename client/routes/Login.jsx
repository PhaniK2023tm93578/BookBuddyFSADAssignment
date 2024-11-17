const React = require('react');
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  login = (e) => {
    e.preventDefault();
    fetch('/api/verifyUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    }).then(response => response.json())
      .then(data => {
        return this.props.changeState(data)
      }).catch(err => console.log('client error' + err))
  }

  render() {
    console.log(this.props);
    let { loggedIn, error } = this.props;
    return (
      <div className="usercred-box">
        {loggedIn && <Navigate to="/" replace={true} />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="usercred-title">Book Buddy</div>
          <form className="usercred-form">
            <input type="text" placeholder="enter username" name="username" id="username" required
              value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} />
            <input type="password" placeholder="enter password" name="password" id="password" required
              value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            <input type="submit" value="Log in" onClick={this.login}/>
            <Link to="/resetPassword">Reset password</Link>
          </form>
      </div>
    )
  }
}

export default Login;