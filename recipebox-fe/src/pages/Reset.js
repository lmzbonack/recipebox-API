import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useForm } from 'react-hook-form'

import {
  Button,
  Container,
  FormFeedback,
  FormInput,
  FormGroup,
} from 'shards-react'

import MessageService from '../store/services/MessageService'

export default function Reset () {
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

  // Send reset password email on submit
  async function onSubmit (values) {
    const payload = {
      email: values.email
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

  return (
    <Container className='mt-3'>
      <h2>Reset</h2>
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
        <Button
          type="submit">
          Login
        </Button>
      </form>
      <ToastContainer />
    </Container>
  )
}
