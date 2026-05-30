import { useEffect, useState } from "react"
import { MapPin, Plus, Trash2, X } from "lucide-react"
import type { Address } from "../types"
import AddressCard from "../components/Addresscard"

// ===================== FAKE DATA =====================
const fakeData: Address[] = [
  {
    _id: "1",
    label: "Home",
    address: "123 Main St, Lagos Island",
    city: "Lagos",
    state: "Lagos",
    zip: "100001",
    isDefault: true,
    lat: 6.4550,
    lng: 3.3841,
  },
  {
    _id: "2",
    label: "Office",
    address: "456 Central Ave",
    city: "Abuja",
    state: "FCT",
    zip: "900001",
    isDefault: false,
    lat: 9.0579,
    lng: 7.4951,
  },
]

const emptyForm = {
  label: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
  lat: 0,
  lng: 0,
}

// ===================== MODAL =====================
const Modal = ({
  show,
  onClose,
  children,
}: {
  show: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
        {children}
      </div>
    </div>
  )
}

// ===================== MAIN =====================
const Addresses = () => {
  const [addresses, setAddresses]   = useState<Address[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [form, setForm]             = useState(emptyForm)

  useEffect(() => {
    setTimeout(() => {
      setAddresses(fakeData)
      setLoading(false)
    }, 800)
  }, [])

  // ---- helpers ----
  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
      lat: addr.lat,
      lng: addr.lng,
    })
    setEditingId(addr._id)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a._id === editingId ? { ...a, ...form } : a))
      )
    } else {
      const newAddr: Address = { ...form, _id: Date.now().toString() }
      if (form.isDefault) {
        setAddresses((prev) => [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          newAddr,
        ])
      } else {
        setAddresses((prev) => [...prev, newAddr])
      }
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a._id !== id))
    setDeleteId(null)
    if (expandedId === id) setExpandedId(null)
  }

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a._id === id }))
    )
  }

  // ===================== LOADING =====================
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700 active:scale-95 transition"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {/* EMPTY STATE */}
        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MapPin size={40} className="mb-3 text-gray-300" />
            <p className="font-semibold">No addresses yet</p>
            <p className="text-sm mt-1">Add a delivery address to get started</p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              addr={addr}
              expanded={expandedId === addr._id}
              onToggle={() => setExpandedId(expandedId === addr._id ? null : addr._id)}
              onEditHandler={openEdit}
              onDeleteHandler={(id) => setDeleteId(id)}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>

      </div>

      {/* ===================== ADD / EDIT MODAL ===================== */}
      <Modal show={showForm} onClose={resetForm}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{editingId ? "Edit Address" : "Add New Address"}</h2>
          <button onClick={resetForm} className="text-gray-400 hover:text-black transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Label</label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Home, Office, etc."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Main St, Lagos Island"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">City</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Lagos"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">State</label>
              <input
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Lagos"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Zip / Postal Code</label>
              <input
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                placeholder="100001"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Latitude</label>
              <input
                type="number"
                value={form.lat || ""}
                onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                placeholder="6.4550"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Longitude</label>
            <input
              type="number"
              value={form.lng || ""}
              onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
              placeholder="3.3841"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* DEFAULT TOGGLE */}
          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <div
              onClick={() => setForm({ ...form, isDefault: !form.isDefault })}
              className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form.isDefault ? "bg-amber-600" : "bg-gray-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.isDefault ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Set as default address</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 active:scale-95 transition"
            >
              {editingId ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===================== DELETE CONFIRM MODAL ===================== */}
      <Modal show={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">Delete Address?</h2>
          <p className="text-sm text-gray-500 mb-6">
            This address will be permanently removed from your account.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default Addresses