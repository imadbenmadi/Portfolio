import { useMemo, useState, useRef } from 'react'
import RichTextEditor from '../../../components/editor/RichTextEditor'
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
  Badge,
  IconButton,
  Image,
  Divider,
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
  Alert,
  AlertIcon,
  Spinner,
  Center
} from '@chakra-ui/react'
import {
  IoAdd,
  IoPencil,
  IoTrash,
  IoCloudUpload,
  IoReorderThree
} from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  year: new Date().getFullYear().toString(),
  tech_stack: '',
  live_url: '',
  github_url: '',
  thumbnail_url: '',
  category: 'main'
}

export default function AdminProjects({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()
  const fileRef = useRef()
  const toast = useToast()

  const mainProjects = useMemo(
    () => projects.filter(p => (p.category || 'main') === 'main'),
    [projects]
  )
  const oldProjects = useMemo(
    () => projects.filter(p => p.category === 'old'),
    [projects]
  )
  const otherProjects = useMemo(
    () => projects.filter(p => p.category !== 'main' && p.category !== 'old'),
    [projects]
  )

  const mainIds = useMemo(() => mainProjects.map(p => p.id), [mainProjects])
  const oldIds = useMemo(() => oldProjects.map(p => p.id), [oldProjects])

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  function openAdd() {
    setForm(emptyForm)
    setEditId(null)
    onOpen()
  }

  function openEdit(project) {
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      year: project.year || '',
      tech_stack: Array.isArray(project.tech_stack)
        ? project.tech_stack.join(', ')
        : project.tech_stack || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      thumbnail_url: project.thumbnail_url || '',
      category: project.category || 'main'
    })
    setEditId(project.id)
    onOpen()
  }

  function autoSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(f => ({ ...f, thumbnail_url: data.url }))
      toast({ title: 'Image uploaded!', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
      toast({
        title: 'Title and slug are required',
        status: 'warning',
        duration: 3000
      })
      return
    }
    setSaving(true)
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/projects/${editId}` : '/api/projects'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (editId) {
        setProjects(ps => ps.map(p => (p.id === editId ? data : p)))
        toast({ title: 'Project updated!', status: 'success', duration: 2000 })
      } else {
        setProjects(ps => [...ps, data])
        toast({ title: 'Project added!', status: 'success', duration: 2000 })
      }
      onClose()
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  function confirmDelete(id) {
    setDeleteId(id)
    onDeleteOpen()
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/projects/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProjects(ps => ps.filter(p => p.id !== deleteId))
      toast({ title: 'Project deleted', status: 'info', duration: 2000 })
      onDeleteClose()
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
  }

  async function persistOrder(category, nextProjects, prevProjects) {
    setReordering(true)
    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          orderedIds: nextProjects.map(p => p.id)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reorder failed')
      setProjects(data)
    } catch (err) {
      setProjects(prevProjects)
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setReordering(false)
    }
  }

  function applyCategoryOrder(category, nextCategoryList) {
    // Keep a stable grouping: main -> old -> other
    if (category === 'main') {
      return [...nextCategoryList, ...oldProjects, ...otherProjects]
    }
    if (category === 'old') {
      return [...mainProjects, ...nextCategoryList, ...otherProjects]
    }
    return [...mainProjects, ...oldProjects, ...otherProjects]
  }

  return (
    <DashboardLayout title="Projects">
      <HStack justify="space-between" mb={6}>
        <Text color="gray.500">{projects.length} project(s) in database</Text>
        <Button leftIcon={<IoAdd />} colorScheme="blue" onClick={openAdd}>
          Add Project
        </Button>
      </HStack>

      {projects.length === 0 ? (
        <Center py={16}>
          <VStack>
            <Text color="gray.500">No projects yet.</Text>
            <Button colorScheme="blue" onClick={openAdd}>
              Add your first project
            </Button>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={6} align="stretch">
          <Box>
            <HStack justify="space-between" mb={2}>
              <Heading size="sm">Main Projects</Heading>
              <Text fontSize="sm" color="gray.500">
                Drag to reorder ({mainProjects.length})
              </Text>
            </HStack>

            {mainProjects.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                No main projects.
              </Text>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return
                  const prevAll = projects
                  const oldIndex = mainProjects.findIndex(
                    p => p.id === active.id
                  )
                  const newIndex = mainProjects.findIndex(p => p.id === over.id)
                  if (oldIndex < 0 || newIndex < 0) return
                  const nextMain = arrayMove(mainProjects, oldIndex, newIndex)
                  const nextAll = applyCategoryOrder('main', nextMain)
                  setProjects(nextAll)
                  persistOrder('main', nextMain, prevAll)
                }}
              >
                <SortableContext items={mainIds} strategy={rectSortingStrategy}>
                  <SimpleGrid columns={1} gap={4}>
                    {mainProjects.map(project => (
                      <SortableProjectCard
                        key={project.id}
                        project={project}
                        cardBg={cardBg}
                        borderColor={borderColor}
                        onEdit={() => openEdit(project)}
                        onDelete={() => confirmDelete(project.id)}
                        disabled={reordering}
                      />
                    ))}
                  </SimpleGrid>
                </SortableContext>
              </DndContext>
            )}
          </Box>

          <Box>
            <HStack justify="space-between" mb={2}>
              <Heading size="sm">Old Projects</Heading>
              <Text fontSize="sm" color="gray.500">
                Drag to reorder ({oldProjects.length})
              </Text>
            </HStack>

            {oldProjects.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                No old projects.
              </Text>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return
                  const prevAll = projects
                  const oldIndex = oldProjects.findIndex(
                    p => p.id === active.id
                  )
                  const newIndex = oldProjects.findIndex(p => p.id === over.id)
                  if (oldIndex < 0 || newIndex < 0) return
                  const nextOld = arrayMove(oldProjects, oldIndex, newIndex)
                  const nextAll = applyCategoryOrder('old', nextOld)
                  setProjects(nextAll)
                  persistOrder('old', nextOld, prevAll)
                }}
              >
                <SortableContext items={oldIds} strategy={rectSortingStrategy}>
                  <SimpleGrid columns={1} gap={4}>
                    {oldProjects.map(project => (
                      <SortableProjectCard
                        key={project.id}
                        project={project}
                        cardBg={cardBg}
                        borderColor={borderColor}
                        onEdit={() => openEdit(project)}
                        onDelete={() => confirmDelete(project.id)}
                        disabled={reordering}
                      />
                    ))}
                  </SimpleGrid>
                </SortableContext>
              </DndContext>
            )}
          </Box>

          {otherProjects.length > 0 && (
            <Box>
              <HStack justify="space-between" mb={2}>
                <Heading size="sm">Other</Heading>
                <Text fontSize="sm" color="gray.500">
                  {otherProjects.length} project(s)
                </Text>
              </HStack>
              <SimpleGrid columns={1} gap={4}>
                {otherProjects.map(project => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    cardBg={cardBg}
                    borderColor={borderColor}
                    onEdit={() => openEdit(project)}
                    onDelete={() => confirmDelete(project.id)}
                    disabled={true}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Project' : 'Add Project'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={form.title}
                    onChange={e => {
                      const t = e.target.value
                      setForm(f => ({
                        ...f,
                        title: t,
                        slug: f.slug || autoSlug(t)
                      }))
                    }}
                    placeholder="My Awesome Project"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Slug (URL)</FormLabel>
                  <Input
                    value={form.slug}
                    onChange={e =>
                      setForm(f => ({ ...f, slug: e.target.value }))
                    }
                    placeholder="my-awesome-project"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <RichTextEditor
                  value={form.description}
                  onChange={v => setForm(f => ({ ...f, description: v }))}
                  placeholder="Brief description of the project..."
                  height="200px"
                />
              </FormControl>

              <SimpleGrid columns={2} gap={4} mt={10} w="full">
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Input
                    value={form.year}
                    onChange={e =>
                      setForm(f => ({ ...f, year: e.target.value }))
                    }
                    placeholder="2024"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={form.category}
                    onChange={e =>
                      setForm(f => ({ ...f, category: e.target.value }))
                    }
                  >
                    <option value="main">Main Projects</option>
                    <option value="old">Old Projects</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Tech Stack (comma-separated)</FormLabel>
                <Input
                  value={form.tech_stack}
                  onChange={e =>
                    setForm(f => ({ ...f, tech_stack: e.target.value }))
                  }
                  placeholder="React, Node.js, PostgreSQL"
                />
              </FormControl>

              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Live URL</FormLabel>
                  <Input
                    value={form.live_url}
                    onChange={e =>
                      setForm(f => ({ ...f, live_url: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>GitHub URL</FormLabel>
                  <Input
                    value={form.github_url}
                    onChange={e =>
                      setForm(f => ({ ...f, github_url: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Thumbnail Image</FormLabel>
                <HStack>
                  <Input
                    value={form.thumbnail_url}
                    onChange={e =>
                      setForm(f => ({ ...f, thumbnail_url: e.target.value }))
                    }
                    placeholder="Paste URL or upload below"
                    flex={1}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                  />
                  <Button
                    leftIcon={
                      uploading ? <Spinner size="xs" /> : <IoCloudUpload />
                    }
                    onClick={() => fileRef.current?.click()}
                    isDisabled={uploading}
                    size="sm"
                    flexShrink={0}
                  >
                    {uploading ? 'Uploading…' : 'Upload'}
                  </Button>
                </HStack>
                {form.thumbnail_url && (
                  <Image
                    src={form.thumbnail_url}
                    alt="thumbnail preview"
                    mt={2}
                    maxH="120px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              {editId ? 'Save Changes' : 'Add Project'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure? This cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
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

function SortableProjectCard({
  project,
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
  } = useSortable({ id: project.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const plainDescription = (project.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

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
        <Box flex={1} mr={2}>
          <HStack mb={1} flexWrap="wrap">
            <Heading size="sm">{project.title}</Heading>
            <Badge colorScheme={project.category === 'main' ? 'blue' : 'gray'}>
              {project.category}
            </Badge>
            {project.year && <Badge variant="outline">{project.year}</Badge>}
          </HStack>
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {plainDescription || 'No description'}
          </Text>
          <Text fontSize="xs" color="gray.400" mt={1}>
            /{project.slug}
          </Text>
        </Box>
        {project.thumbnail_url && (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            boxSize="64px"
            objectFit="cover"
            borderRadius="md"
            flexShrink={0}
          />
        )}
      </HStack>

      <HStack mt={3} spacing={2}>
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
    </Box>
  )
}

export async function getServerSideProps({ req }) {
  const { getAuthPayload } = await import('../../../lib/auth')
  const payload = getAuthPayload(req)
  if (!payload) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }
  try {
    const { getAllProjects } = await import('../../../lib/db')
    const projects = await getAllProjects()
    const initialProjects = JSON.parse(JSON.stringify(projects))
    return { props: { initialProjects } }
  } catch {
    return { props: { initialProjects: [] } }
  }
}
