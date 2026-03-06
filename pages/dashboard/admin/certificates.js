import { useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  Badge,
  Link,
  Image
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  IoAdd,
  IoPencil,
  IoTrash,
  IoCloudUpload,
  IoDocumentText,
  IoReorderThree
} from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import PdfThumbnail from '../../../components/PdfThumbnail'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const emptyForm = {
  title: '',
  issuer: '',
  issue_date: '',
  file_url: '',
  file_type: 'application/pdf'
}

function isPdf(mimeOrUrl) {
  if (!mimeOrUrl) return false
  if (mimeOrUrl === 'application/pdf') return true
  return String(mimeOrUrl).toLowerCase().includes('.pdf')
}

export default function AdminCertificates({ initialData }) {
  const [items, setItems] = useState(initialData)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose
  } = useDisclosure()
  const fileRef = useRef()
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
      title: item.title || '',
      issuer: item.issuer || '',
      issue_date: item.issue_date || '',
      file_url: item.file_url || '',
      file_type: item.file_type || 'application/pdf'
    })
    setEditId(item.id)
    onOpen()
  }

  function f(key) {
    return {
      value: form[key],
      onChange: e => setForm(p => ({ ...p, [key]: e.target.value }))
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload/certificate', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setForm(p => ({
        ...p,
        file_url: data.url,
        file_type: data.type || p.file_type
      }))

      toast({ title: 'Uploaded!', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.file_url) {
      toast({
        title: 'Title and certificate file are required',
        status: 'warning',
        duration: 3000
      })
      return
    }

    setSaving(true)
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/certificates/${editId}` : '/api/certificates'

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
      const res = await fetch(`/api/certificates/${deleteId}`, {
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

  async function persistOrder(nextItems, prevItems) {
    setReordering(true)
    try {
      const res = await fetch('/api/certificates/reorder', {
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
    <DashboardLayout title="Certificates">
      <HStack justify="space-between" mb={6}>
        <Text color="gray.500">{items.length} certificate(s)</Text>
        <Button leftIcon={<IoAdd />} colorScheme="blue" onClick={openAdd}>
          Add Certificate
        </Button>
      </HStack>

      {items.length === 0 ? (
        <Center py={16}>
          <VStack>
            <Text color="gray.500">No certificates yet.</Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add your first certificate
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
                <SortableCertificateCard
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
            {editId ? 'Edit Certificate' : 'Add Certificate'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input {...f('title')} placeholder="AWS Certified ..." />
              </FormControl>

              <FormControl>
                <FormLabel>Issuer</FormLabel>
                <Input {...f('issuer')} placeholder="Amazon Web Services" />
              </FormControl>

              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input {...f('issue_date')} placeholder="2025" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Certificate File (PNG or PDF)</FormLabel>
                <HStack>
                  <Input
                    value={form.file_url}
                    onChange={e =>
                      setForm(p => ({ ...p, file_url: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                  <Button
                    leftIcon={<IoCloudUpload />}
                    onClick={() => fileRef.current?.click()}
                    isLoading={uploading}
                    loadingText="Uploading"
                  >
                    Upload
                  </Button>
                </HStack>
                <input
                  type="file"
                  accept="image/png,application/pdf"
                  hidden
                  ref={fileRef}
                  onChange={handleUpload}
                />
                {form.file_url && (
                  <Text fontSize="sm" mt={2} color="gray.500">
                    Current:{' '}
                    {isPdf(form.file_type || form.file_url) ? 'PDF' : 'PNG'}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              {editId ? 'Save' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDelOpen} onClose={onDelClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete certificate?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.600">This action cannot be undone.</Text>
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

function SortableCertificateCard({
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
    transition,
    opacity: isDragging ? 0.8 : 1
  }

  const pdf = isPdf(item.file_type || item.file_url)

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow="sm"
    >
      <HStack justify="space-between" align="flex-start" spacing={4}>
        <HStack spacing={3} align="flex-start">
          <IconButton
            size="sm"
            variant="ghost"
            icon={<IoReorderThree />}
            aria-label="Reorder"
            cursor={disabled ? 'not-allowed' : 'grab'}
            isDisabled={disabled}
            {...attributes}
            {...listeners}
          />

          {pdf ? (
            <PdfThumbnail
              url={item.file_url}
              alt={item.title}
              boxSize="56px"
              borderRadius="md"
              borderColor={borderColor}
            />
          ) : (
            <Image
              src={item.file_url}
              alt={item.title}
              w="56px"
              h="56px"
              objectFit="cover"
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              flexShrink={0}
            />
          )}

          <Box>
            <HStack mb={1} flexWrap="wrap">
              <Heading size="sm">{item.title}</Heading>
              {item.issue_date && (
                <Badge colorScheme="purple">{item.issue_date}</Badge>
              )}
            </HStack>
            {item.issuer && (
              <Text fontWeight="medium" color="blue.500">
                {item.issuer}
              </Text>
            )}
            <HStack mt={2} spacing={3} flexWrap="wrap">
              <Link href={item.file_url} isExternal color="teal.500">
                Open file
              </Link>
              <NextLink href="/certificates" passHref legacyBehavior>
                <Link color="gray.500">View public page</Link>
              </NextLink>
            </HStack>
          </Box>
        </HStack>

        <HStack>
          <IconButton
            size="sm"
            icon={<IoPencil />}
            aria-label="Edit"
            onClick={onEdit}
            isDisabled={disabled}
          />
          <IconButton
            size="sm"
            colorScheme="red"
            variant="ghost"
            icon={<IoTrash />}
            aria-label="Delete"
            onClick={onDelete}
            isDisabled={disabled}
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
    const { getAllCertificates } = await import('../../../lib/db')
    const initialData = JSON.parse(JSON.stringify(await getAllCertificates()))
    return { props: { initialData } }
  } catch {
    return { props: { initialData: [] } }
  }
}
