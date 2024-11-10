import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/project'
import Paragraph from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Project = () => (
  <Layout title="FlexEdu">
    <Container my={6}>
      <Title>
        FlexEdu<Badge>2024</Badge>
      </Title>
      <Paragraph>
        I developed a comprehensive web platform for FlexEdu, a startup designed
        to connect clients with freelancers seamlessly.
        <br /> Using React and Tailwind CSS, I crafted a modern, responsive user
        interface, incorporating various React libraries to enhance
        functionality. On the backend, I employed Node.js and Express to ensure
        robust server-side operations, alongside MySQL and Sequelize for
        efficient data management.
        <br /> This platform allows for secure and scalable communication
        between clients and freelancers, featuring user authentication, project
        tracking, and real-time notifications.
        <br /> The result is a user-friendly and efficient tool that
        significantly improves the ease of collaboration and project management
        within the freelance community.
      </Paragraph>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Stream :</Meta>
          <Link href="https://FlexEdu-dz.com/" target="_black">
            Link <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Coded by :</Meta>
          <span>
            Reactjs, TaillwinddCss, ReactRouter, ExpressJs, JWT Authenthication,
            MySql and Sequelize
          </span>
        </ListItem>
      </List>

      <WorkImage src="/images/projects/FlexEdu/1.jpg" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/4.png" alt="FlexEdu" />
      {/* <WorkImage src="/images/projects/FlexEdu/2.jpg" alt="FlexEdu" /> */}
      {/* <WorkImage src="/images/projects/FlexEdu/3.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/4.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/5.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/6.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/7.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/8.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/9.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/10.png" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/11.png" alt="FlexEdu" /> */}
    </Container>
  </Layout>
)

export default Project
