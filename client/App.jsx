const React = require('react');
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Root from './routes/Root.jsx';
import Login from './routes/Login.jsx';
import ResetPassword from './routes/ResetPassword.jsx';
import Register from './routes/Register.jsx';
import MyPage from './routes/MyPage.jsx';
import Search from './routes/Search.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: null,
      error: null
    };
    this.changeState = this.changeState.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  changeState (data) {
    if (data.err) {
      this.setState({loggedIn: false, error: data.err});
    } else if (data.loggedIn) {
      const newState = {
            ...this.state,
            loggedIn: true, 
            userId: data.user.user_id,
            token: data.token
      }
      this.setState(newState);
    } else {
      this.setState({loggedIn: false, error: "Please Try Again"});
    }
  }

  logOut () {
    this.setState({loggedIn: false, token: null, userId: null, error: null});
  }
  
  render() {
    return (
      <div>
        <div className="header-container">
          <h1><a href="">Book Buddy</a></h1>
          <hr className="bottom-hr" />
        </div>
        <Router>
          {/* NAV will always be rendered */}
          <Nav logOut={this.logOut} loggedIn={this.state.loggedIn} userId={this.state.userId} />
          {console.log('Current states' + JSON.stringify(this.state))}
          <Routes>
            <Route path="/login" element={<Login changeState={this.changeState} loggedIn={this.state.loggedIn} userId={this.state.userId} error={this.state.error} />}></Route>
            <Route path="/resetPassword" element={<ResetPassword changeState={this.changeState} loggedIn={this.state.loggedIn} userId={this.state.userId} error={this.state.error} />}></Route>
            <Route path="/register" element={<Register changeState={this.changeState} loggedIn={this.state.loggedIn} userId={this.state.userId} error={this.state.error} />}></Route>
            <Route path="/mypage" element={<MyPage loggedIn={this.state.loggedIn} token={this.state.token} userId={this.state.userId} />}></Route>
            <Route path="/search" element={<Search loggedIn={this.state.loggedIn} token={this.state.token} userId={this.state.userId} />}></Route>
            <Route path="/" element={<Root />}></Route>
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App;