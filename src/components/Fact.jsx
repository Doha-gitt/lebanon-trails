// One label/value pair inside a <dl>, e.g. "Region" / "Chouf".
export default function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-sm opacity-75">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  )
}
