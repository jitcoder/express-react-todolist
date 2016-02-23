import React from 'react';
import ReactDOM from 'react-dom';
import LabelledInput from 'labelledinput';
import 'login.scss';
import 'panel.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.login = this.login.bind(this);

    this.loginBtnStyle = {
      "float": "right",
      "display": "block",
      "marginRight": "15px"
    };

  }

  login(e) {
    e.preventDefault();
    if(this.state.username === 'test' && this.state.password === '123'){
      window.location = "/todo";
    }
    else{
      alert('invalid username or password');
    }
  }

  updateUsername(e) {
    setState({username: e.target.value});
  }

  updatePassword(e) {
    setState({password: e.target.value});
  }

  render() {
    return <div className="panel">
      <LabelledInput label="Username" type="text" onChange={this.updateUsername}/>
      <LabelledInput label="Password" type="password" onChange={this.updatePassword}/>
      <button onClick={this.login} style={this.loginBtnStyle}>
        Login
      </button>
    </div>;
  }
}

ReactDOM.render(
  <Login/>, document.getElementById('contents'));
