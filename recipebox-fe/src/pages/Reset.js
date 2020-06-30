import React from 'react'
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

export default class Reset extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        this.reset()
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  async reset() {
    const payload = {
      email: this.state.email
    }
    try {
      let resetResponse = await MessageService.forgot(payload)
      if (resetResponse.status === 200){
        toast.success("Please check your email for reset instructions")
      }
    } catch(error) {
      toast.error(error.response.data.message)
    }
  }

  render() {
    return(
      <Container className='mt-3'>
        <h2>Reset</h2>
        <Form>
          <FormGroup>
            <label htmlFor="#email">Email</label>
            <FormInput name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange}/>
          </FormGroup>
        </Form>
        <Button theme="primary"
                onClick={this.reset}>Reset
        </Button>
        <ToastContainer />
      </Container>
    )
  }

}
