import jsonServer from 'json-server'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { runHybridSearch } from './search.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.json')
const server = jsonServer.create()
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults({ noCors: false })

server.use(middlewares)
server.use(jsonServer.bodyParser)

const DEMO_OTP = '123456'

server.get('/search', (req, res) => {
  const raw = req.query?.q
  const q = Array.isArray(raw) ? String(raw[0] ?? '') : String(raw ?? '')
  const payload = runHybridSearch(router.db.getState(), q)
  return res.json(payload)
})

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body ?? {}
  const db = router.db
  const user = db.get('users').find({ email, password }).value()
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const { password: _pw, ...safe } = user
  return res.json({
    requiresOtp: Boolean(user.twoFactorEnabled),
    user: safe,
    token: user.twoFactorEnabled ? null : `mock-token-${user.id}`,
  })
})

server.post('/auth/otp/request', (req, res) => {
  const { email } = req.body ?? {}
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' })
  }
  const user = router.db.get('users').find({ email: email.trim() }).value()
  if (!user) {
    // Avoid account enumeration in a real system; for the mock we still reveal existence.
    return res.status(404).json({ message: 'User not found' })
  }
  return res.json({
    message: 'OTP sent',
    email: user.email,
    demoOtp: DEMO_OTP,
    purpose: 'login',
  })
})

server.post('/auth/otp', (req, res) => {
  const { email, code } = req.body ?? {}
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' })
  }
  if (code !== DEMO_OTP) {
    return res.status(400).json({ message: 'Invalid OTP code' })
  }
  const user = router.db.get('users').find({ email: email.trim() }).value()
  if (!user) return res.status(404).json({ message: 'User not found' })
  const { password: _pw, ...safe } = user
  return res.json({ user: safe, token: `mock-token-${user.id}` })
})

server.post('/auth/signup', (req, res) => {
  const { name, organizationName, email, password } = req.body ?? {}
  if (!name || !organizationName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }
  const db = router.db
  if (db.get('users').find({ email }).value()) {
    return res.status(409).json({ message: 'Email already registered' })
  }
  const tenantId = String(Date.now())
  db.get('tenants')
    .push({
      id: tenantId,
      name: organizationName,
      slug: organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      plan: 'starter',
      status: 'active',
      usersCount: 1,
      createdAt: new Date().toISOString(),
    })
    .write()
  const id = String(Date.now() + 1)
  const user = {
    id,
    name,
    email,
    password,
    role: 'owner',
    tenantId,
    status: 'active',
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  }
  db.get('users').push(user).write()
  const { password: _pw, ...safe } = user
  return res.status(201).json({ user: safe, token: `mock-token-${id}` })
})

server.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body ?? {}
  if (!email) return res.status(400).json({ message: 'Email is required' })
  return res.json({ message: 'If the email exists, a reset link was sent.', demoOtp: DEMO_OTP })
})

server.post('/auth/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body ?? {}
  const db = router.db
  const user = db.get('users').find({ email, password: currentPassword }).value()
  if (!user) return res.status(400).json({ message: 'Current password is incorrect' })
  db.get('users').find({ id: user.id }).assign({ password: newPassword }).write()
  return res.json({ message: 'Password updated' })
})

server.post('/menu/reorder', (req, res) => {
  const items = req.body?.items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items array is required' })
  }

  const db = router.db
  const menu = db.get('menu')

  for (const patch of items) {
    if (!patch || typeof patch !== 'object' || patch.id == null) {
      return res.status(400).json({ message: 'Each patch requires an id' })
    }
    if (typeof patch.order !== 'number' || Number.isNaN(patch.order)) {
      return res.status(400).json({ message: `Invalid order for menu item ${patch.id}` })
    }
    const existing = menu.find({ id: String(patch.id) }).value()
    if (!existing) {
      return res.status(404).json({ message: `Menu item ${patch.id} not found` })
    }
    const parentId =
      patch.parentId === undefined || patch.parentId === null || patch.parentId === ''
        ? null
        : String(patch.parentId)
    if (parentId === String(patch.id)) {
      return res.status(400).json({ message: 'A menu item cannot be its own parent' })
    }
    menu.find({ id: String(patch.id) }).assign({ parentId, order: patch.order }).write()
  }

  return res.json(menu.value())
})

server.use(router)

const port = Number(process.env.MOCK_PORT || 4001)
server.listen(port, () => {
  console.log(`ACP mock API listening on http://localhost:${port}`)
  console.log(`Demo OTP: ${DEMO_OTP}`)
})
