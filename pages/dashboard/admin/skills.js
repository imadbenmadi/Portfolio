import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
  Badge,
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
  Image,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'

const CATEGORIES = [
  { value: 'languages', label: 'Programming Languages' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'databases', label: 'Databases' },
  { value: 'hosting', label: 'Hosting / DevOps' },
  { value: 'other', label: 'Other' }
]

const CATEGORY_COLORS = {
  languages: 'yellow',
  frontend: 'blue',
  backend: 'green',
  databases: 'orange',
  hosting: 'purple',
  other: 'gray'
}

const emptyForm = {
  name: '',
  category: 'other',
  icon_url: '',
  sort_order: 0
}

function groupByCategory(skills) {
  return CATEGORIES.reduce((acc, cat) => {
    const items = skills.filter(s => s.category === cat.value)
    if (items.length > 0) acc.push({ ...cat, items })
    return acc
  }, [])
}

export default function AdminSkills({ initialData }) {
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
  const pillBg = useColorModeValue('gray.50', 'gray.700')

  function openAdd() {
    setForm(emptyForm)
    setEditId(null)
    onOpen()
  }
  function openEdit(item) {
    setForm({
      name: item.name || '',
      category: item.category || 'other',
      icon_url: item.icon_url || '',
      sort_order: item.sort_order || 0
    })
    setEditId(item.id)
    onOpen()
  }

  async function handleSave() {
    if (!form.name) {
      toast({
        title: 'Skill name is required',
        status: 'warning',
        duration: 3000
      })
      return
    }
    setSaving(true)
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/skills/${editId}` : '/api/skills'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sort_order: Number(form.sort_order) || 0
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (editId) {
        setItems(ps => ps.map(p => (p.id === editId ? data : p)))
        toast({ title: 'Updated!', status: 'success', duration: 2000 })
      } else {
        setItems(ps => [...ps, data])
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
      const res = await fetch(`/api/skills/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setItems(ps => ps.filter(p => p.id !== deleteId))
      toast({ title: 'Deleted', status: 'info', duration: 2000 })
      onDelClose()
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
  }

  const groups = groupByCategory(items)

  return (
    <DashboardLayout title="Skills">
      <HStack justify="space-between" mb={6}>
        <Text color="gray.500">{items.length} skill(s)</Text>
        <Button leftIcon={<IoAdd />} colorScheme="blue" onClick={openAdd}>
          Add Skill
        </Button>
      </HStack>

      {items.length === 0 ? (
        <Center py={16}>
          <VStack>
            <Text color="gray.500">No skills yet.</Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add your first skill
            </Button>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={6} align="stretch">
          {groups.map(group => (
            <Box
              key={group.value}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={5}
              shadow="sm"
            >
              <Heading
                size="sm"
                mb={4}
                color={`${CATEGORY_COLORS[group.value]}.500`}
              >
                {group.label}
              </Heading>
              <SimpleGrid columns={[2, 3, 4]} gap={3}>
                {group.items.map(item => (
                  <HStack
                    key={item.id}
                    bg={pillBg}
                    borderRadius="md"
                    px={3}
                    py={2}
                    justify="space-between"
                  >
                    <HStack spacing={2}>
                      {item.icon_url && (
                        <Image
                          src={item.icon_url}
                          alt={item.name}
                          boxSize="20px"
                          objectFit="contain"
                        />
                      )}
                      <Text fontSize="sm" fontWeight="medium">
                        {item.name}
                      </Text>
                    </HStack>
                    <HStack spacing={0}>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<IoPencil />}
                        aria-label="Edit"
                        onClick={() => openEdit(item)}
                      />
                      <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        icon={<IoTrash />}
                        aria-label="Delete"
                        onClick={() => {
                          setDeleteId(item.id)
                          onDelOpen()
                        }}
                      />
                    </HStack>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Skill' : 'Add Skill'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Skill Name</FormLabel>
                <Input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. React, Node.js, Python"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={form.category}
                  onChange={e =>
                    setForm(p => ({ ...p, category: e.target.value }))
                  }
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Icon URL (optional)</FormLabel>
                <Input
                  value={form.icon_url}
                  onChange={e =>
                    setForm(p => ({ ...p, icon_url: e.target.value }))
                  }
                  placeholder="https://cdn.../react.svg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Paste a URL to an icon image (PNG, SVG, etc.)
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel>Sort Order</FormLabel>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={e =>
                    setForm(p => ({ ...p, sort_order: e.target.value }))
                  }
                  placeholder="0"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Lower numbers appear first within their category.
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              {editId ? 'Save Changes' : 'Add Skill'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={isDelOpen} onClose={onDelClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Skill</ModalHeader>
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
    const { getAllSkills } = await import('../../../lib/db')
    return { props: { initialData: await getAllSkills() } }
  } catch {
    return { props: { initialData: [] } }
  }
}
