import { useState } from 'react'
import RichTextEditor from '../../../components/editor/RichTextEditor'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Badge
} from '@chakra-ui/react'
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'

const emptyForm = {
  institution: '',
  degree: '',
  field: '',
  start_date: '',
  end_date: '',
  description: ''
}

export default function AdminEducation({ initialData }) {
  const [items, setItems] = useState(initialData)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose
  } = useDisclosure()
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  function openAdd() {
    setForm(emptyForm)
    setEditId(null)
    onOpen()
  }
  function openEdit(item) {
    setForm({
      institution: item.institution || '',
      degree: item.degree || '',
      field: item.field || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      description: item.description || ''
    })
    setEditId(item.id)
    onOpen()
  }

  async function handleSave() {
    if (!form.institution || !form.degree) {
      toast({
        title: 'Institution and degree are required',
        status: 'warning',
        duration: 3000
      })
      return
    }
    setSaving(true)
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/education/${editId}` : '/api/education'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (editId) {
        setItems(ps => ps.map(p => (p.id === editId ? data : p)))
        toast({ title: 'Updated!', status: 'success', duration: 2000 })
      } else {
        setItems(ps => [data, ...ps])
        toast({ title: 'Added!', status: 'success', duration: 2000 })
      }
      onClose()
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/education/${deleteId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Delete failed')
      setItems(ps => ps.filter(p => p.id !== deleteId))
      toast({ title: 'Deleted', status: 'info', duration: 2000 })
      onDelClose()
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
  }

  function f(key) {
    return {
      value: form[key],
      onChange: e => setForm(p => ({ ...p, [key]: e.target.value }))
    }
  }

  return (
    <DashboardLayout title="Education">
      <HStack justify="space-between" mb={6}>
        <Text color="gray.500">{items.length} education record(s)</Text>
        <Button leftIcon={<IoAdd />} colorScheme="blue" onClick={openAdd}>
          Add Education
        </Button>
      </HStack>

      {items.length === 0 ? (
        <Center py={16}>
          <VStack>
            <Text color="gray.500">No education records yet.</Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add your first record
            </Button>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {items.map(item => (
            <Box
              key={item.id}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={4}
              shadow="sm"
            >
              <HStack justify="space-between">
                <Box>
                  <HStack mb={1} flexWrap="wrap">
                    <Heading size="sm">{item.degree}</Heading>
                    {item.field && (
                      <Badge colorScheme="purple">{item.field}</Badge>
                    )}
                  </HStack>
                  <Text fontWeight="medium" color="blue.500">
                    {item.institution}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {item.start_date}
                    {item.end_date ? ` — ${item.end_date}` : ' — Present'}
                  </Text>
                  {item.description && (
                    <Text fontSize="sm" mt={1} noOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </Box>
                <HStack>
                  <IconButton
                    size="sm"
                    icon={<IoPencil />}
                    aria-label="Edit"
                    onClick={() => openEdit(item)}
                  />
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    icon={<IoTrash />}
                    aria-label="Delete"
                    onClick={() => {
                      setDeleteId(item.id)
                      onDelOpen()
                    }}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? 'Edit Education' : 'Add Education'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Institution</FormLabel>
                <Input
                  {...f('institution')}
                  placeholder="University of Ouargla"
                />
              </FormControl>
              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Degree</FormLabel>
                  <Input {...f('degree')} placeholder="Master's Degree" />
                </FormControl>
                <FormControl>
                  <FormLabel>Field of Study</FormLabel>
                  <Input {...f('field')} placeholder="Data Science" />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input {...f('start_date')} placeholder="Sep 2022" />
                </FormControl>
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    {...f('end_date')}
                    placeholder="Present (leave empty)"
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <RichTextEditor
                  value={form.description}
                  onChange={v => setForm(f => ({ ...f, description: v }))}
                  placeholder="Additional notes..."
                  height="200px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              {editId ? 'Save Changes' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDelOpen} onClose={onDelClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Education</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure? This cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDelClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  )
}

export async function getServerSideProps({ req }) {
  const { getAuthPayload } = await import('../../../lib/auth')
  if (!getAuthPayload(req))
    return { redirect: { destination: '/dashboard', permanent: false } }
  try {
    const { getAllEducation } = await import('../../../lib/db')
    return { props: { initialData: await getAllEducation() } }
  } catch {
    return { props: { initialData: [] } }
  }
}
