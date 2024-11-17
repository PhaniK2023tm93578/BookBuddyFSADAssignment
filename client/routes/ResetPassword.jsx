const React = require("react");
import { Navigate } from "react-router-dom";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      otp: "",
      newPassword: "",
      announcement: "",
      resetSuccess: false,
      otpSuccess: false
    };
  }

  resetPassword = (e) => {
    e.preventDefault();
    fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userEmail: this.state.email,
        otp: this.state.otp,
        newPassword: this.state.newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          this.setState({"resetSuccess": true});
        }
        else {
          data = { loggedIn: false, error: "" };
          return this.props.changeState(data);
        }
      })
      .catch((err) => console.log("client error" + err));
  };
  setOTP = (e) => {
    e.preventDefault();
    fetch("/api/users/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userEmail: this.state.email
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("user from server: ", data);
        if (!data.setOTP) {
          let error = data.error ? data.error : '';
          return this.props.changeState({err: 'Password Reset failed! ' + error});
        }
        else
          this.setState({"otpSuccess": true});
      })
      .catch((err) => {
        console.log("client error" + err)
        return this.props.changeState({err: 'Please try again'});        
      });
  };

  validateSecurityQuestion() {
    fetch("/api/validateSecurityQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userEmail: this.state.email,
        securityAnswer: this.state.securityAnswer,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("user from server: ", JSON.stringify(data));
        return this.props.changeState(data);
      })
      .catch((err) => console.log("client error" + err));
  }

  render() {
    let { loggedIn, error } = this.props;

    let resetOTPElement = (
      <>
        <input type="password" placeholder="Enter OTP" name="OTP" id="otp" required value={this.state.otp} onChange={(e) => this.setState({ otp: e.target.value })} />
        <input type="password" placeholder="Enter New Password" name="New Password" id="newPassword" required value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value })} />
        <input type="submit" value="Reset Password" onClick={this.resetPassword}/>
        <p>Please enter the OTP sent to the Email</p>
      </>
    );

    return (
      <div className="usercred-box">
        {loggedIn && <Navigate to="/" replace={true} />}
        {!this.state.resetSuccess && (
          <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="usercred-title">Book Buddy</div>
            <form className="usercred-form">
            <input type="email" placeholder="Enter your email" name="email" id="email" required value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            {!this.state.otpSuccess && <input type="submit" value="Send OTP" onClick={this.setOTP} />}
            {this.state.otpSuccess && resetOTPElement}
            </form>
          </div>
        )}

        {this.state.resetSuccess && (
          <p style={{ color: "green" }}>Password Reset Success!</p>
        )}
      </div>
    );
  }
}

export default ResetPassword;
