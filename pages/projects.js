/* eslint-disable react-hooks/rules-of-hooks */
import NextLink from 'next/link'
import {
  Container,
  Heading,
  SimpleGrid,
  Divider,
  Button,
  useColorModeValue,
  Box
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import { IoLogoGithub } from 'react-icons/io5'



import thumbAOS from '../public/images/projects/AOS.png'
import thumbAlgerieTelecome from '../public/images/projects/AlgerieTelecome3.png'
const projects = () => (
  <Layout title="Proyectos">
    <Container>
      <Heading as="h3" fontSize={20} my={4}>
        Projects
      </Heading>

      <SimpleGrid columns={[1, 1, 1]} gap={6}>
        <WorkGridItem id="Skate" title="Skate" thumbnail={thumbAOS}>
          Skate Company
        </WorkGridItem>
        <WorkGridItem id="AOS" title="AOS" thumbnail={thumbAOS}>
          the Algeria Online Store
        </WorkGridItem>
        <WorkGridItem
          id="AlgerieTelecome"
          title="مشروع تحسين خدمة الزبائن"
          thumbnail={thumbAlgerieTelecome}
        ></WorkGridItem>
      </SimpleGrid>

      {/* <Section delay={0.4}>
        <Divider my={6} />

        <Heading as="h3" fontSize={20} mb={4}>
          Proyectos antiguos
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.5}>
          <WorkGridItem
            id="creadorcv"
            title="Creador CV"
            thumbnail={thumbCreadorCV}
          >
            Un creador de CV con opción de imprimir
          </WorkGridItem>
        </Section>
        <Section delay={0.5}>
          <WorkGridItem
            id="superheromemory"
            title="Superhero Memory"
            thumbnail={thumbSuperheroMemory}
          >
            Juego de memoria usando una API de superheroes
          </WorkGridItem>
        </Section>
        <Section delay={0.6}>
          <WorkGridItem
            id="battleship"
            title="Battleship"
            thumbnail={thumbBattleship}
          >
            Juego de batalla naval
          </WorkGridItem>
        </Section>
        <Section delay={0.6}>
          <WorkGridItem
            id="etch-a-sketch"
            title="Etch-A-Sketch"
            thumbnail={thumbEtchASketch}
          >
            Sitio web para dibujar con varias opciones
          </WorkGridItem>
        </Section>
      </SimpleGrid> */}

      <Box textAlign="center" my={2} mb={4}>
        <Button
          as={NextLink}
          href="https://github.com/imadbenmadi"
          scroll={false}
          rightIcon={<IoLogoGithub />}
          colorScheme={useColorModeValue('blue', 'red')}
        >
          View All on GitHub
        </Button>
      </Box>
    </Container>
  </Layout>
)

export default projects
export { getServerSideProps } from '../components/chakra'
