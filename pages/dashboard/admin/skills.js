import { useMemo, useRef, useState } from 'react'
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
  Spinner
} from '@chakra-ui/react'
import {
  IoAdd,
  IoCloudUpload,
  IoPencil,
  IoReorderThree,
  IoTrash
} from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  SKILL_CATEGORIES,
  CATEGORY_BY_VALUE,
  BUILTIN_SKILL_ICONS,
  BUILTIN_ICON_BY_VALUE
} from '../../../lib/skillsMeta'

const emptyForm = {
  name: '',
  category: 'other',
  icon_url: '',
  icon_name: '',
  sort_order: 0
}

function sortByOrderThenName(a, b) {
  const ao = Number(a.sort_order) || 0
  const bo = Number(b.sort_order) || 0
  if (ao !== bo) return ao - bo
  return String(a.name || '').localeCompare(String(b.name || ''))
}

function SkillIcon({ item }) {
  const builtIn = item.icon_name ? BUILTIN_ICON_BY_VALUE[item.icon_name] : null
  if (builtIn) {
    return <Box as={builtIn.Icon} boxSize="18px" />
  }
  if (item.icon_url) {
    return (
      <Image
        src={item.icon_url}
        alt={item.name}
        boxSize="18px"
        objectFit="contain"
      />
    )
  }
  return null
}

function SortableSkillRow({ item, pillBg, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: String(item.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  }

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      bg={pillBg}
      borderRadius="md"
      px={3}
      py={2}
      justify="space-between"
    >
      <HStack spacing={2} minW={0}>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Drag"
          icon={<IoReorderThree />}
          cursor="grab"
          {...attributes}
          {...listeners}
        />
        <SkillIcon item={item} />
        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
          {item.name}
        </Text>
      </HStack>
      <HStack spacing={0}>
        <IconButton
          size="xs"
          variant="ghost"
          icon={<IoPencil />}
          aria-label="Edit"
          onClick={onEdit}
        />
        <IconButton
          size="xs"
          variant="ghost"
          colorScheme="red"
          icon={<IoTrash />}
          aria-label="Delete"
          onClick={onDelete}
        />
      </HStack>
    </HStack>
  )
}

export default function AdminSkills({ initialData }) {
  const [items, setItems] = useState(initialData)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingIcon, setUploadingIcon] = useState(false)
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
  const iconFileRef = useRef()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const groups = useMemo(() => {
    const sorted = [...(items || [])].sort(sortByOrderThenName)
    return SKILL_CATEGORIES.map(cat => {
      const catItems = sorted.filter(s => (s.category || 'other') === cat.value)
      return { cat, items: catItems }
    }).filter(g => g.items.length > 0)
  }, [items])

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
      icon_name: item.icon_name || '',
      sort_order: item.sort_order || 0
    })
    setEditId(item.id)
    onOpen()
  }

  async function handleIconUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIcon(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(p => ({ ...p, icon_url: data.url, icon_name: '' }))
      toast({ title: 'Icon uploaded!', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploadingIcon(false)
    }
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

      const nextSortOrder = editId
        ? Number(form.sort_order) || 0
        : Math.max(
            -1,
            ...items
              .filter(
                s => (s.category || 'other') === (form.category || 'other')
              )
              .map(s => Number(s.sort_order) || 0)
          ) + 1

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          icon_url: form.icon_url || null,
          icon_name: form.icon_name || null,
          sort_order: nextSortOrder
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

  async function persistReorder(category, orderedIds) {
    try {
      const res = await fetch('/api/skills/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, orderedIds })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Replace only this category with server-confirmed rows
      setItems(prev => {
        const keep = prev.filter(s => (s.category || 'other') !== category)
        return [...keep, ...(data || [])]
      })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const activeId = Number(active.id)
    const overId = Number(over.id)
    const activeItem = items.find(s => s.id === activeId)
    const overItem = items.find(s => s.id === overId)
    if (!activeItem || !overItem) return
    if ((activeItem.category || 'other') !== (overItem.category || 'other'))
      return

    const category = activeItem.category || 'other'
    const categoryItems = items
      .filter(s => (s.category || 'other') === category)
      .sort(sortByOrderThenName)
    const oldIndex = categoryItems.findIndex(s => s.id === activeId)
    const newIndex = categoryItems.findIndex(s => s.id === overId)
    if (oldIndex < 0 || newIndex < 0) return

    const reordered = arrayMove(categoryItems, oldIndex, newIndex)
    const orderedIds = reordered.map(s => s.id)

    setItems(prev => {
      const other = prev.filter(s => (s.category || 'other') !== category)
      const updated = reordered.map((s, idx) => ({ ...s, sort_order: idx }))
      return [...other, ...updated]
    })

    persistReorder(category, orderedIds)
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {groups.map(group => (
              <Box
                key={group.cat.value}
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
                  color={`${(CATEGORY_BY_VALUE[group.cat.value] || group.cat).color || 'gray'}.500`}
                >
                  {group.cat.label}
                </Heading>
                <Text fontSize="xs" color="gray.500" mb={3}>
                  Drag skills to change their order.
                </Text>
                <SortableContext
                  items={group.items.map(s => String(s.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <VStack spacing={2} align="stretch">
                    {group.items.map(item => (
                      <SortableSkillRow
                        key={item.id}
                        item={item}
                        pillBg={pillBg}
                        onEdit={() => openEdit(item)}
                        onDelete={() => {
                          setDeleteId(item.id)
                          onDelOpen()
                        }}
                      />
                    ))}
                  </VStack>
                </SortableContext>
              </Box>
            ))}
          </DndContext>
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
                  {SKILL_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Icon</FormLabel>
                <HStack align="start" spacing={3}>
                  <VStack align="stretch" spacing={3} flex={1}>
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Built-in icon (optional)
                      </FormLabel>
                      <Select
                        value={form.icon_name || ''}
                        onChange={e =>
                          setForm(p => ({
                            ...p,
                            icon_name: e.target.value,
                            icon_url: e.target.value ? '' : p.icon_url
                          }))
                        }
                      >
                        <option value="">None</option>
                        {BUILTIN_SKILL_ICONS.map(i => (
                          <option key={i.value} value={i.value}>
                            {i.label}
                          </option>
                        ))}
                      </Select>

                      <SimpleGrid columns={[5, 6]} spacing={2} mt={2}>
                        {BUILTIN_SKILL_ICONS.map(i => (
                          <Button
                            key={i.value}
                            variant={
                              form.icon_name === i.value ? 'solid' : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                              setForm(p => ({
                                ...p,
                                icon_name: i.value,
                                icon_url: ''
                              }))
                            }
                            aria-label={i.label}
                          >
                            <Box as={i.Icon} boxSize="18px" />
                          </Button>
                        ))}
                      </SimpleGrid>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm">Icon URL (optional)</FormLabel>
                      <HStack>
                        <Input
                          value={form.icon_url}
                          onChange={e =>
                            setForm(p => ({
                              ...p,
                              icon_url: e.target.value,
                              icon_name: e.target.value ? '' : p.icon_name
                            }))
                          }
                          placeholder="https://.../icon.svg"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={iconFileRef}
                          style={{ display: 'none' }}
                          onChange={handleIconUpload}
                        />
                        <Button
                          leftIcon={
                            uploadingIcon ? (
                              <Spinner size="xs" />
                            ) : (
                              <IoCloudUpload />
                            )
                          }
                          onClick={() => iconFileRef.current?.click()}
                          isDisabled={uploadingIcon}
                          size="sm"
                          flexShrink={0}
                        >
                          {uploadingIcon ? 'Uploading…' : 'Upload'}
                        </Button>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Choose a built-in icon, upload an image, or paste an
                        icon URL.
                      </Text>
                    </FormControl>
                  </VStack>

                  <Box
                    w="72px"
                    h="72px"
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={useColorModeValue('white', 'gray.900')}
                    flexShrink={0}
                  >
                    {form.icon_name && BUILTIN_ICON_BY_VALUE[form.icon_name] ? (
                      <Box
                        as={BUILTIN_ICON_BY_VALUE[form.icon_name].Icon}
                        boxSize="32px"
                      />
                    ) : form.icon_url ? (
                      <Image
                        src={form.icon_url}
                        alt="Icon preview"
                        boxSize="32px"
                        objectFit="contain"
                      />
                    ) : (
                      <Text fontSize="xs" color="gray.500">
                        Preview
                      </Text>
                    )}
                  </Box>
                </HStack>
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
    const initialData = JSON.parse(JSON.stringify(await getAllSkills()))
    return { props: { initialData } }
  } catch {
    return { props: { initialData: [] } }
  }
}
