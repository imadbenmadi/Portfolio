import NextLink from 'next/link'
import {
  Heading,
  Box,
  Image,
  Link,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const Title = ({ children }) => (
  <Box>
    <Link as={NextLink} href="/projects">
      Projects
    </Link>
    <span>
      {'  '}
      <ChevronRightIcon />
      {'  '}
    </span>
    <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
      {children}
    </Heading>
  </Box>
)

export const WorkImage = ({ src, alt }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Image
        borderRadius="lg"
        w="full"
        src={src}
        alt={alt}
        mb={4}
        cursor="zoom-in"
        onClick={onOpen}
        _hover={{ opacity: 0.9 }}
        transition="opacity 0.2s"
      />
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" size="lg" zIndex={10} />
          <ModalBody
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={src}
              alt={alt}
              maxH="90vh"
              maxW="100%"
              objectFit="contain"
              borderRadius="lg"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const Meta = ({ children }) => (
  <Badge colorScheme="green" mr={2}>
    {children}
  </Badge>
)
