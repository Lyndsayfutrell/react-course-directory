import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: null,
    password: '',
  };

  constructor() {
    super();
    this.data = new Data();
    this.cookie = Cookies.get('authenticatedUser');
    this.password = Cookies.get('password');
    this.state = {
      authenticatedUser: this.cookie ? JSON.parse(this.cookie) : null,
      password: this.password ? JSON.parse(this.password) : null,
    };
  }


  render() {
    const { authenticatedUser } = this.state;
    const { password } = this.state

    const value = {
      authenticatedUser,
      password,
      data: this.data,
      actions: { // Add the 'actions' property and object
        signIn: this.signIn,
        signOut: this.signOut
      }
    };

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // Function to handle sign in
  
  signIn = async (username, password)  => {
    let user = null;
    if (username.length > 0 && password.length > 0) {
    user = await this.data.getUser(username, password);
    if (user !== null) {
      this.setState(() => {
        return {
          password,
          authenticatedUser: user,
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      Cookies.set('password', JSON.stringify(password), { expires: 1 });
    }
    return user;
  } else {
    return user;
  }
  }

//Function to hanlde sign out

  signOut = () => {
    this.setState(() => {
      return {
        password: '',
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser', 'password');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

