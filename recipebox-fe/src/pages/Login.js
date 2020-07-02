import React from 'react'
import { navigate } from "@reach/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Button,
  Container,
  Form,
  FormInput,
  FormGroup,
} from 'shards-react'

import UserService from '../store/services/UserService'


export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        this.login()
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }

  async login() {
    this.props.propogateLogin()
    const now = new Date()
    const payload = {
      email: this.state.email,
      password: this.state.password
    }
    try {
      let loginResponse = await UserService.login(payload)
      if (loginResponse.status === 201) {
        const localStoragePayload = {
          token: loginResponse.data.token,
          expiry: now.getTime() + 1000*60*60*24
        }
        localStorage.setItem('authToken', JSON.stringify(localStoragePayload))
        navigate('/recipes')
      }
    } catch(error) {
      toast.error(error.response.data.message)
    }
  }

  render() {
    return(
      <Container className='mt-3'>
        <h2>Login</h2>
        <Form>
          <FormGroup>
            <label htmlFor="#email">Email</label>
            <FormInput name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor="#password">Password</label>
            <FormInput name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} />
          </FormGroup>
        </Form>
        <Button theme="primary"
                onClick={this.login}>Login
        </Button>
        <div className='mt-1'>
          <a href="/reset">Forgot Password?</a>
        </div>
        <ToastContainer/>
      </Container>
    )
  }
}
