import './Toggle.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => {
  return (
    <div className="toggle">
      <label className="toggle__label">
        <input
          type="checkbox"
          role="switch"
          className="toggle__input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
        />
        <span className="toggle__slider" />
        {label && <span className="toggle__text">{label}</span>}
      </label>
    </div>
  )
}
