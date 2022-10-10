/* eslint-disable @typescript-eslint/no-explicit-any */
interface props {
  label: string;
  type?: string;
  value?: any;
  onChange?: any;
  name: string;
  className?: string;
}

export default function FormField({ label, type = "text", name }: props) {
  return (
    <div className="my-4 w-full">
      <label htmlFor={name} className="text-left block text-lg mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="ring-1 ring-slate-900/10 rounded-md p-2 w-full"
      />
    </div>
  );
}
