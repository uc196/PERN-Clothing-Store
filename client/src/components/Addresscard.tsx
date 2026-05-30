import { MapPin, Pencil, Trash2, Check, Navigation } from "lucide-react"
import type { Address } from "../types"

type Props = {
  addr: Address
  onEditHandler: (addr: Address) => void
  onDeleteHandler: (id: string) => void
  onSetDefault: (id: string) => void
  expanded: boolean
  onToggle: () => void
}

const AddressCard = ({
  addr,
  onEditHandler,
  onDeleteHandler,
  onSetDefault,
  expanded,
  onToggle,
}: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      {/* ---- ROW ---- */}
      <div
        onClick={onToggle}
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? "bg-amber-100" : "bg-gray-100"}`}>
          <MapPin size={18} className={addr.isDefault ? "text-amber-600" : "text-gray-400"} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{addr.label}</p>
            {addr.isDefault && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{addr.address}, {addr.city}</p>
        </div>

        <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* ---- EXPANDED ---- */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">

          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{addr.address}</p>
                <p className="text-xs text-gray-400">{addr.city}, {addr.state} · {addr.zip}</p>
              </div>
            </div>
            {addr.lat && addr.lng && (
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-amber-600 shrink-0" />
                <p className="text-xs text-gray-400">
                  {addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!addr.isDefault && (
              <button
                onClick={() => onSetDefault(addr._id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-xl hover:bg-green-100 transition"
              >
                <Check size={13} />
                Set Default
              </button>
            )}
            <button
              onClick={() => onEditHandler(addr)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              onClick={() => onDeleteHandler(addr._id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-100 ml-auto transition"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default AddressCard