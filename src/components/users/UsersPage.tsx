'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { UserPlus, Pencil, Trash2, Shield, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserRow {
  id: string
  username: string
  email: string | null
  role: string
  createdAt: string
}

export default function UsersPage() {
  const { user: currentUser } = useAppStore()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'USER' })

  const isAdmin = currentUser?.role === 'ADMIN'

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-user-id': currentUser?.id || '',
  })

  const fetchUsers = async () => {
    if (!isAdmin) return
    setLoading(true)
    try {
      const res = await fetch('/api/users', { headers: headers() })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else if (res.status === 403) {
        toast.error('Admin access required')
      }
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [isAdmin])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username.trim()) return
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password || undefined,
          email: form.email.trim() || undefined,
          role: form.role,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('User created')
        setForm({ username: '', password: '', email: '', role: 'USER' })
        setShowForm(false)
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to create user')
      }
    } catch {
      toast.error('Failed to create user')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId || !form.username.trim()) return
    try {
      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim() || undefined,
          password: form.password || undefined,
          role: form.role,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('User updated')
        setEditingId(null)
        setForm({ username: '', password: '', email: '', role: 'USER' })
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: headers() })
      const data = await res.json()
      if (res.ok) {
        toast.success('User deleted')
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const startEdit = (u: UserRow) => {
    setEditingId(u.id)
    setForm({ username: u.username, password: '', email: u.email || '', role: u.role })
  }

  if (!isAdmin) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
        </div>
        <div className="card p-8 text-center text-gray-500">
          You need admin access to manage users.
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500">Manage users and roles (Neon DB)</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ username: '', password: '', email: '', role: 'USER' }); }}
          className="btn btn-primary text-sm"
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {(showForm || editingId) && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">{editingId ? 'Edit User' : 'New User'}</h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Username"
              className="input text-sm"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email (optional)"
              className="input text-sm"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder={editingId ? 'New password (leave blank to keep)' : 'Password'}
              className="input text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="input text-sm"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="btn btn-primary text-sm">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); setForm({ username: '', password: '', email: '', role: 'USER' }); }}
                className="btn btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-th">Username</th>
                  <th className="table-th">Email</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Created</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-td font-medium">{u.username}</td>
                    <td className="table-td text-gray-600">{u.email || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-gray'}`}>
                        {u.role === 'ADMIN' ? <Shield size={10} /> : <UserIcon size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="table-td text-gray-500 text-xs">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="table-td text-right">
                      {u.id !== currentUser?.id && (
                        <>
                          <button type="button" onClick={() => startEdit(u)} className="p-1.5 text-gray-500 hover:text-shopify-600 rounded">
                            <Pencil size={14} />
                          </button>
                          <button type="button" onClick={() => handleDelete(u.id, u.username)} className="p-1.5 text-gray-500 hover:text-red-600 rounded ml-1">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
