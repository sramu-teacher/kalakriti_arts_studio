export default function FormField({ label, name, type = "text", required, children, ...rest }) {
  const inputClass =
    "mt-1 w-full rounded-lg border border-brand-green-800/20 bg-white px-4 py-2.5 text-brand-green-950 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30";

  return (
    <label className="block text-sm font-medium text-brand-green-900">
      {label}
      {required && <span className="text-brand-gold-600"> *</span>}
      {children ? (
        children
      ) : type === "textarea" ? (
        <textarea name={name} id={name} required={required} rows={3} className={inputClass} {...rest} />
      ) : (
        <input name={name} id={name} type={type} required={required} className={inputClass} {...rest} />
      )}
    </label>
  );
}
