import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Form from './Form';

class UserSignIn extends Component {

  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
        <div className="form--centered">
          <h2>Sign In</h2>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
              <label for="emailAddress">Email Address</label>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="User Name" />
                  <label for="password">Password</label>
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
    );
  }


  //handles change and updates value field
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  //handles submit

  submit = () => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { emailAddress, password } = this.state;
    context.actions.signIn(emailAddress, password)
    .then( user => {
      if (user === null) {
        this.setState(() => {
          return { errors: [ 'Sign-in was unsuccessful' ] };
        });
      } else {
        this.props.history.push(from);
     }
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error')
    })
  }


  //handles cancel and takes to home page
  cancel = () => {
   this.props.history.push('/')
  }
}

export default withRouter(UserSignIn);
