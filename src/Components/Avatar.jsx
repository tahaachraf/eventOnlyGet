export default function Avatar({ name, role, size = 40 }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className={`avatar role-${role}`} style={{ width: size, height: size }} aria-hidden="true">
      {initials}
    </span>
  )
}
