import React from 'react'
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

import MessageService from '../store/services/MessageService'


export default function NewPassword (props) {
  const { handleSubmit, errors, register } = useForm()

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

  async function onSubmit(values) {
    const payload = {
      password: values.password,
      reset_token: props.token
    }
    if (values.password === values.passwordVerify) {
      try {
        const resetPwResponse = await MessageService.reset(payload)
        if (resetPwResponse.status === 200) {
          toast.success("Password has been reset. Redirecting you to login now")
          navigate('/login')
        }
      } catch(error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error('Passwords do not match')
    }
  }

  return(
    <Container className='mt-3'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
