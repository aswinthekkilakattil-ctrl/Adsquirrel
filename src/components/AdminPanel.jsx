import { useEffect, useMemo, useState } from 'react'
import './AdminPanel.css'

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'ASWIN'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'NEXSTON@2026'

function prettyLabel(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase())
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function defaultValueFor(value) {
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') return {}
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  return ''
}

function setValueAtPath(source, path, nextValue) {
  if (path.length === 0) return nextValue

  const [head, ...rest] = path
  const clone = Array.isArray(source) ? [...source] : { ...source }
  clone[head] = setValueAtPath(source[head], rest, nextValue)
  return clone
}

function getValueAtPath(source, path) {
  return path.reduce((acc, key) => acc[key], source)
}

function buildArrayItemTemplate(value) {
  if (value.length > 0) {
    return defaultValueFor(value[0]) && typeof value[0] === 'object'
      ? cloneValue(value[0])
      : defaultValueFor(value[0])
  }

  return ''
}

function FieldRenderer({ label, value, path, onChange, onAddItem, onRemoveItem }) {
  const isLongText = typeof value === 'string' && value.length > 90

  if (Array.isArray(value)) {
    return (
      <div className="admin-panel__field admin-panel__field--group">
        <div className="admin-panel__field-head">
          <h5>{label}</h5>
          <button className="admin-panel__button" onClick={() => onAddItem(path)} type="button">
            Add Item
          </button>
        </div>

        <div className="admin-panel__array">
          {value.map((item, index) => (
            <div key={`${label}-${index}`} className="admin-panel__array-item">
              <div className="admin-panel__field-head">
                <span className="admin-panel__item-title">{label} {index + 1}</span>
                <button className="admin-panel__button" onClick={() => onRemoveItem(path, index)} type="button">
                  Remove
                </button>
              </div>
              <FieldRenderer
                label={`${label} ${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="admin-panel__nested">
        {Object.entries(value).map(([childKey, childValue]) => (
          <div key={childKey} className="admin-panel__nested-card">
            <FieldRenderer
              label={prettyLabel(childKey)}
              value={childValue}
              path={[...path, childKey]}
              onChange={onChange}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            />
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="admin-panel__toggle">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
        />
      </label>
    )
  }

  return (
    <label className="admin-panel__label">
      {label}
      {isLongText ? (
        <textarea
          className="admin-panel__input admin-panel__input--textarea"
          value={value}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <input
          className="admin-panel__input"
          type={typeof value === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(event) =>
            onChange(path, typeof value === 'number' ? Number(event.target.value) : event.target.value)
          }
        />
      )}
    </label>
  )
}

export default function AdminPanel({
  content,
  onSave,
  onReset,
  isAuthenticated,
  onLogin,
  onLogout,
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState(cloneValue(content))
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [saving, setSaving] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)

  const seoPreview = useMemo(() => draft.seo || {}, [draft])

  useEffect(() => {
    setDraft(cloneValue(content))
  }, [content])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoggingIn(true)
    setStatus({ type: 'idle', message: '' })

    try {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new Error('Invalid username or password.')
      }

      onLogin({ username })
      setPassword('')
      setUsername('')
      setStatus({ type: 'success', message: 'Logged in successfully.' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Login failed.',
      })
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus({ type: 'idle', message: '' })

    try {
      await onSave(draft)
      setStatus({ type: 'success', message: 'Website content saved to Firebase.' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save content.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    const resetValue = onReset()
    setDraft(cloneValue(resetValue))
    setStatus({ type: 'success', message: 'Reset to default content locally. Save to publish it.' })
  }

  const handleLogout = () => {
    onLogout()
    setStatus({ type: 'success', message: 'Logged out.' })
  }

  const handleFieldChange = (path, nextValue) => {
    setDraft((prev) => setValueAtPath(prev, path, nextValue))
  }

  const handleAddItem = (path) => {
    setDraft((prev) => {
      const currentArray = getValueAtPath(prev, path)
      const nextItem = buildArrayItemTemplate(currentArray)
      return setValueAtPath(prev, path, [...currentArray, nextItem])
    })
  }

  const handleRemoveItem = (path, index) => {
    setDraft((prev) => {
      const currentArray = getValueAtPath(prev, path)
      return setValueAtPath(
        prev,
        path,
        currentArray.filter((_, currentIndex) => currentIndex !== index),
      )
    })
  }

  return (
    <main className="admin-panel-page">
      <aside className="admin-panel admin-panel--page">
        <div className="admin-panel__inner">
          <div className="admin-panel__header">
            <div>
              <h3>CPannel</h3>
              <p className="admin-panel__hint">Change every section of the website using simple form fields.</p>
            </div>
            <a className="admin-panel__close" href="/">
              View Site
            </a>
          </div>

          <section className="admin-panel__section">
            <h4>SEO Preview</h4>
            <p className="admin-panel__hint">Title: {seoPreview.title}</p>
            <p className="admin-panel__hint">Description: {seoPreview.description}</p>
          </section>

          {!isAuthenticated ? (
            <form className="admin-panel__section admin-panel__section--login" onSubmit={handleLogin}>
              <h4>Admin Login</h4>
              <label className="admin-panel__label">
                Username
                <input
                  className="admin-panel__input"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>
              <label className="admin-panel__label">
                Password
                <input
                  className="admin-panel__input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <button className="admin-panel__button admin-panel__button--primary" disabled={loggingIn}>
                {loggingIn ? 'Signing in...' : 'Login'}
              </button>
              <p className="admin-panel__hint">Use the fixed admin credentials stored in your local env file.</p>
            </form>
          ) : (
            <>
              <section className="admin-panel__section">
                <div className="admin-panel__row">
                  <h4>Website Sections</h4>
                  <span className="admin-panel__hint">{ADMIN_USERNAME}</span>
                </div>

                <section className="admin-panel__section-card admin-panel__section-card--featured">
                  <div className="admin-panel__field-head">
                    <h5>Meta Description</h5>
                  </div>
                  <label className="admin-panel__label">
                    Search result description
                    <textarea
                      className="admin-panel__input admin-panel__input--textarea admin-panel__input--meta"
                      value={draft.seo?.description || ''}
                      onChange={(event) => handleFieldChange(['seo', 'description'], event.target.value)}
                    />
                  </label>
                </section>

                <div className="admin-panel__sections-grid">
                  {Object.entries(draft).map(([sectionKey, sectionValue]) => {
                    const displayValue =
                      sectionKey === 'seo' && sectionValue && typeof sectionValue === 'object'
                        ? Object.fromEntries(
                            Object.entries(sectionValue).filter(([fieldKey]) => fieldKey !== 'description'),
                          )
                        : sectionValue

                    return (
                    <section key={sectionKey} className="admin-panel__section-card">
                      <div className="admin-panel__field-head">
                        <h5>{prettyLabel(sectionKey)}</h5>
                      </div>
                      <FieldRenderer
                        label={prettyLabel(sectionKey)}
                        value={displayValue}
                        path={[sectionKey]}
                        onChange={handleFieldChange}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                      />
                    </section>
                    )
                  })}
                </div>

                <div className="admin-panel__actions">
                  <button className="admin-panel__button" onClick={handleReset} type="button">
                    Reset
                  </button>
                  <button
                    className="admin-panel__button admin-panel__button--primary"
                    onClick={handleSave}
                    type="button"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save to Firebase'}
                  </button>
                </div>
              </section>

              <section className="admin-panel__section">
                <button className="admin-panel__button" onClick={handleLogout} type="button">
                  Logout
                </button>
              </section>
            </>
          )}

          {status.message && (
            <p
              className={`admin-panel__status ${
                status.type === 'error'
                  ? 'admin-panel__status--error'
                  : status.type === 'success'
                    ? 'admin-panel__status--success'
                    : ''
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </aside>
    </main>
  )
}
