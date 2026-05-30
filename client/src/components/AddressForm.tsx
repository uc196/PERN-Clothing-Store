import React from "react";

type AddressFormProps = {
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  f: {
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat?: number;
    lng?: number;
  };
  setF: React.Dispatch<React.SetStateAction<any>>;
};

const AddressForm = ({ resetForm, handleSubmit, f, setF }: AddressFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setF((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm"
    >
      <h2 className="font-semibold text-gray-700">Add / Edit Address</h2>

      <input
        name="label"
        value={f.label}
        onChange={handleChange}
        placeholder="Label (e.g Home, Office)"
        className="w-full border rounded-xl px-3 py-2 text-sm"
      />

      <input
        name="address"
        value={f.address}
        onChange={handleChange}
        placeholder="Full Address"
        className="w-full border rounded-xl px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="city"
          value={f.city}
          onChange={handleChange}
          placeholder="City"
          className="border rounded-xl px-3 py-2 text-sm"
        />

        <input
          name="state"
          value={f.state}
          onChange={handleChange}
          placeholder="State"
          className="border rounded-xl px-3 py-2 text-sm"
        />
      </div>

      <input
        name="zip"
        value={f.zip}
        onChange={handleChange}
        placeholder="ZIP Code"
        className="w-full border rounded-xl px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          Save Address
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="border px-4 py-2 rounded-xl text-sm"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddressForm;