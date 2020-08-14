import React from 'react'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'

import { navigate } from "@reach/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Button,
  Container,
  FormFeedback,
  FormInput,
  FormGroup,
} from 'shards-react'

import UserService from '../store/services/UserService'

Login.propTypes = {
  propogateLogin: PropTypes.func.isRequired
}

export default function Login (props) {
  const { handleSubmit, errors, register } = useForm()

  function validateEmail (value) {
    let error
    const mailformat = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    console.log(value)
    if (!value) {
      error = 'Email is required'
    }
    if (!value.match(mailformat)) {
      error = 'Please enter a valid email address'
    }
    return error || true
  }

  function validatePassword (value) {
    let error
    if (!value) {
      error = 'Password is required'
    }
    return error || true
  }

  async function onSubmit (values) {
    const now = new Date()
    const payload = {
      email: values.email,
      password: values.password
    }
    try {
      const loginResponse = await UserService.login(payload)
      if (loginResponse.status === 201) {
        const localStoragePayload = {
          token: loginResponse.data.token,
          expiry: now.getTime() + 1000 * 60 * 60 * 24
        }
        localStorage.setItem('authToken', JSON.stringify(localStoragePayload))
        props.propogateLogin()
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <Container className='mt-3'>
      <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label htmlFor="#email">Email</label>
            <FormInput name="email"
              invalid = { Boolean(errors.email) }
              placeholder="user@example.com"
              innerRef={register({ validate: validateEmail })} />
            <FormFeedback>
              {errors.email && errors.email.message}
            </FormFeedback>
          </FormGroup>

          <FormGroup>
            <label htmlFor="#password">Password</label>
            <FormInput name="password"
              type="password"
              invalid = { Boolean(errors.password) }
              placeholder="*********"
              innerRef={register({ validate: validatePassword })} />
            <FormFeedback>
              {errors.password && errors.password.message}
            </FormFeedback>
          </FormGroup>
          <Button
            type="submit">
            Login
          </Button>
        </form>
        <a href="/reset">Forgot Password?</a>
      <ToastContainer />
    </Container>
  )

}
