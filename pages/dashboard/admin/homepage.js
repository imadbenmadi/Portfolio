import { useState, useRef } from 'react'
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
  Text,
  Image,
  Spinner,
  useToast,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { IoCloudUpload, IoSave } from 'react-icons/io5'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'

export default function AdminHomepage({ initialData }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    bio2: initialData?.bio2 || '',
    email: initialData?.email || '',
    github_url: initialData?.github_url || '',
    linkedin_url: initialData?.linkedin_url || '',
    instagram_url: initialData?.instagram_url || '',
    profile_image_url: initialData?.profile_image_url || '',
    cv_url: initialData?.cv_url || ''
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef()
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(p => ({ ...p, profile_image_url: data.url }))
      toast({
        title: 'Profile image uploaded!',
        status: 'success',
        duration: 2000
      })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: 'Homepage updated!', status: 'success', duration: 2000 })
      setSaved(true)
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Homepage Content">
      <Box maxW="700px">
        {saved && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            Homepage saved! The changes are now live on your portfolio.
          </Alert>
        )}

        <Box
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          shadow="sm"
        >
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={2} gap={4}>
              <FormControl>
                <FormLabel>Your Name</FormLabel>
                <Input {...f('name')} placeholder="Benmadi Imed Eddine" />
              </FormControl>
              <FormControl>
                <FormLabel>Title / Role</FormLabel>
                <Input {...f('title')} placeholder="Full Stack Web Developer" />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Bio (first paragraph)</FormLabel>
              <RichTextEditor
                value={form.bio}
                onChange={v => setForm(f => ({ ...f, bio: v }))}
                placeholder="Tell visitors who you are..."
                height="200px"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio (second paragraph / call to action)</FormLabel>
              <RichTextEditor
                value={form.bio2}
                onChange={v => setForm(f => ({ ...f, bio2: v }))}
                placeholder="Let's chat and see how we can create something awesome together!"
                height="150px"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                {...f('email')}
                type="email"
                placeholder="you@example.com"
              />
            </FormControl>

            <SimpleGrid columns={2} gap={4}>
              <FormControl>
                <FormLabel>GitHub URL</FormLabel>
                <Input
                  {...f('github_url')}
                  placeholder="https://github.com/..."
                />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn URL</FormLabel>
                <Input
                  {...f('linkedin_url')}
                  placeholder="https://linkedin.com/in/..."
                />
              </FormControl>
              <FormControl>
                <FormLabel>Instagram URL</FormLabel>
                <Input
                  {...f('instagram_url')}
                  placeholder="https://instagram.com/..."
                />
              </FormControl>
              <FormControl>
                <FormLabel>CV / Resume URL</FormLabel>
                <Input {...f('cv_url')} placeholder="/CV.pdf or https://..." />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Profile Image</FormLabel>
              <HStack>
                <Input
                  {...f('profile_image_url')}
                  placeholder="Paste URL or upload"
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
              {form.profile_image_url && (
                <Image
                  src={form.profile_image_url}
                  alt="Profile preview"
                  mt={2}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={borderColor}
                />
              )}
            </FormControl>

            <Button
              colorScheme="blue"
              leftIcon={<IoSave />}
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving…"
              size="lg"
            >
              Save Homepage
            </Button>
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export async function getServerSideProps({ req }) {
  const { getAuthPayload } = await import('../../../lib/auth')
  if (!getAuthPayload(req))
    return { redirect: { destination: '/dashboard', permanent: false } }
  try {
    const { getHomepage } = await import('../../../lib/db')
    const data = await getHomepage()
    return { props: { initialData: data || null } }
  } catch {
    return { props: { initialData: null } }
  }
}
