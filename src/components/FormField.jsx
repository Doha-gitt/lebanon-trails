// Shared look for every text box, select and text area in the forms.
export const inputClass =
  'w-full rounded border border-ink/25 bg-paper px-3 py-2 text-ink placeholder:text-ink/50 focus:outline-2 focus:outline-offset-1 focus:outline-brand dark:border-stone/30 dark:bg-earth dark:text-stone dark:placeholder:text-stone/50 dark:focus:outline-stone'

// A label and its form control. `id` must match the control's id, so the label
// is read out by screen readers and clicking it focuses the control.
export function FormField({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm opacity-75">{hint}</p>}
    </div>
  )
}

// The error box shown above a form. role="alert" makes screen readers announce it.
export function FormError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="mb-5 rounded border border-brand/40 bg-brand/10 px-4 py-3 font-semibold text-brand dark:border-stone/40 dark:bg-stone/10 dark:text-stone">
      {message}
    </p>
  )
}
