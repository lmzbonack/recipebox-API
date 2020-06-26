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

import MessageService from '../store/services/MessageService'

export default class NewPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetPw = this.resetPw.bind(this);
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
        this.signUp()
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }

  async resetPw() {
    const payload = {
      password: this.state.password,
      reset_token: this.props.token
    }
    try {
      let resetPwResponse = await MessageService.reset(payload)
      if (resetPwResponse.status === 200) {
        toast.success("Password has been reset. Redirecting you to login now")
        navigate('/login')
      }
    } catch(error) {
      toast.error(error.response.data.message)
    }
  }

  render() {
    return(
      <Container className='mt-3'>
        <h2>Reset Password</h2>
        <Form>
          <FormGroup>
            <label htmlFor="#password">New Password</label>
            <FormInput name="password" type="password" placeholder="New Password" value={this.state.password} onChange={this.handleInputChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="#passwordConfirm">Confirm New Password</label>
            <FormInput name="passwordConfirm" type="password" placeholder="Confirm New Password" value={this.state.passwordConfirm} onChange={this.handleInputChange} />
          </FormGroup>
        </Form>
        <Button theme="primary"
                onClick={this.resetPw}>Reset</Button>
        <ToastContainer />
      </Container>
    )
  }
}
