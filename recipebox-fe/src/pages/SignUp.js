import React from 'react'
import { useForm } from 'react-hook-form'

import { navigate } from '@reach/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import UserService from '../store/services/UserService'

import {
  Button,
  Container,
  FormFeedback,
  FormInput,
  FormGroup,
} from 'shards-react'

export default function SignUp () {
  const { handleSubmit, errors, register } = useForm()

  function validateEmail (value) {
    let error
    const mailformat = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

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

  function validateVerifyPassword (value) {
    let error
    if (!value) {
      error = 'Password verification is required'
    }
    return error || true
  }

  async function onSubmit (values) {
    const payload = {
      email: values.email,
      password: values.password
    }
    if (values.password === values.passwordVerify) {
      try {
        const registerResponse = await UserService.signUp(payload)
        if (registerResponse.status === 201) {
          navigate('/login')
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error('Passwords do not match')
    }
  }

  return (
    <Container className='mt-3'>
      <h2>Sign Up</h2>
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

        <FormGroup>
          <label htmlFor="#passwordVerify">Verify Password</label>
          <FormInput name="passwordVerify"
            type="password"
            invalid = { Boolean(errors.passwordVerify) }
            placeholder="*********"
            innerRef={register({ validate: validateVerifyPassword })} />
          <FormFeedback>
            {errors.passwordVerify && errors.passwordVerify.message}
          </FormFeedback>
        </FormGroup>

        <Button
          type="submit">
          Register
        </Button>
      </form>
      <ToastContainer />
    </Container>
  )
}
