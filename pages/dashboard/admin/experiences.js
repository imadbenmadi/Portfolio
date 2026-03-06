import { useMemo, useState } from 'react'
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
  Center
} from '@chakra-ui/react'
import { IoAdd, IoPencil, IoTrash, IoReorderThree } from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const emptyForm = {
  company: '',
  role: '',
  description: '',
  start_date: '',
  end_date: '',
  location: ''
}

export default function AdminExperiences({ initialData }) {
  const [items, setItems] = useState(initialData)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
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

  const ids = useMemo(() => items.map(i => i.id), [items])

  function openAdd() {
    setForm(emptyForm)
    setEditId(null)
    onOpen()
  }
  function openEdit(item) {
    setForm({
      company: item.company || '',
      role: item.role || '',
      description: item.description || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      location: item.location || ''
    })
    setEditId(item.id)
    onOpen()
  }

  async function handleSave() {
    if (!form.company || !form.role) {
      toast({
        title: 'Company and role are required',
        status: 'warning',
        duration: 3000
      })
      return
    }
    setSaving(true)
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/experiences/${editId}` : '/api/experiences'
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
      const res = await fetch(`/api/experiences/${deleteId}`, {
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

  async function persistOrder(nextItems, prevItems) {
    setReordering(true)
    try {
      const res = await fetch('/api/experiences/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: nextItems.map(i => i.id) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reorder failed')
      setItems(data)
    } catch (err) {
      setItems(prevItems)
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setReordering(false)
    }
  }

  return (
    <DashboardLayout title="Experiences">
      <HStack justify="space-between" mb={6}>
        <Text color="gray.500">{items.length} experience(s)</Text>
        <Button leftIcon={<IoAdd />} colorScheme="blue" onClick={openAdd}>
          Add Experience
        </Button>
      </HStack>

      {items.length === 0 ? (
        <Center py={16}>
          <VStack>
            <Text color="gray.500">No experiences yet.</Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add your first experience
            </Button>
          </VStack>
        </Center>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return
            const prev = items
            const oldIndex = items.findIndex(i => i.id === active.id)
            const newIndex = items.findIndex(i => i.id === over.id)
            if (oldIndex < 0 || newIndex < 0) return
            const next = arrayMove(items, oldIndex, newIndex)
            setItems(next)
            persistOrder(next, prev)
          }}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <VStack spacing={4} align="stretch">
              {items.map(item => (
                <SortableExperienceCard
                  key={item.id}
                  item={item}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  onEdit={() => openEdit(item)}
                  onDelete={() => {
                    setDeleteId(item.id)
                    onDelOpen()
                  }}
                  disabled={reordering}
                />
              ))}
            </VStack>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? 'Edit Experience' : 'Add Experience'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Company</FormLabel>
                  <Input {...f('company')} placeholder="Company name" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Input {...f('role')} placeholder="Software Engineer" />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input {...f('location')} placeholder="Budapest, Hungary" />
              </FormControl>
              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input {...f('start_date')} placeholder="Jan 2023" />
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
                  placeholder="What did you do?"
                  height="200px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} mt={12} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mt={12}
              onClick={handleSave}
              isLoading={saving}
            >
              {editId ? 'Save Changes' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDelOpen} onClose={onDelClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Experience</ModalHeader>
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

function SortableExperienceCard({
  item,
  cardBg,
  borderColor,
  onEdit,
  onDelete,
  disabled
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow={isDragging ? 'md' : 'sm'}
      opacity={isDragging ? 0.9 : 1}
    >
      <HStack justify="space-between" align="start">
        <HStack align="start" spacing={3} flex={1}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<IoReorderThree />}
            aria-label="Drag"
            cursor={disabled ? 'not-allowed' : 'grab'}
            isDisabled={disabled}
            {...attributes}
            {...listeners}
          />
          <Box flex={1}>
            <Heading size="sm">{item.role}</Heading>
            <Text fontWeight="medium" color="blue.500">
              {item.company}
            </Text>
            {item.location && (
              <Text fontSize="sm" color="gray.500">
                {item.location}
              </Text>
            )}
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
        </HStack>
        <HStack>
          <IconButton
            size="sm"
            icon={<IoPencil />}
            aria-label="Edit"
            onClick={onEdit}
          />
          <IconButton
            size="sm"
            colorScheme="red"
            variant="ghost"
            icon={<IoTrash />}
            aria-label="Delete"
            onClick={onDelete}
          />
        </HStack>
      </HStack>
    </Box>
  )
}

export async function getServerSideProps({ req }) {
  const { getAuthPayload } = await import('../../../lib/auth')
  if (!getAuthPayload(req))
    return { redirect: { destination: '/dashboard', permanent: false } }
  try {
    const { getAllExperiences } = await import('../../../lib/db')
    const initialData = JSON.parse(JSON.stringify(await getAllExperiences()))
    return { props: { initialData } }
  } catch {
    return { props: { initialData: [] } }
  }
}
