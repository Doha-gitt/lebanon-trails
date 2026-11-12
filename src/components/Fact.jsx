// One label/value pair inside a <dl>, e.g. "Region" / "Chouf".
export default function Fact({ label, value }) {
  return (
    <div>
      <dt className="label-map">{label}</dt>
      <dd className="tabular mt-1 font-semibold">{value}</dd>
    </div>
  )
}
