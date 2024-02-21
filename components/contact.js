import { useState } from 'react'
import Section from './section'
import {
  Heading,
  useToast
} from '@chakra-ui/react'
import { sendContactForm } from '../lib/api'

const initValues = { name: '', email: '', subject: '', message: '' }
const initState = { values: initValues }

const ContactForm = () => {
  return (
    <Section delay={0.4}>
      <Heading as="h3" variant="section-title" mb={8}>
        Contact Me
      </Heading>
      
      
    </Section>
  )
}

export default ContactForm
