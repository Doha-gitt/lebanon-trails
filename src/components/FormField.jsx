// Shared look for every text box, select and text area in the forms.
// The visual styling lives in index.css as .field so every control matches.
export const inputClass = 'field'

// A label and its form control. `id` must match the control's id, so the label
// is read out by screen readers and clicking it focuses the control.
export function FormField({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="label-map mt-1.5">{hint}</p>}
    </div>
  )
}

// The error box shown above a form. role="alert" makes screen readers announce it.
export function FormError({ message }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="mb-5 border-l-2 border-brand bg-brand/8 px-4 py-3 text-sm font-semibold text-brand dark:border-ember dark:bg-ember/12 dark:text-stone"
    >
      {message}
    </p>
  )
}
