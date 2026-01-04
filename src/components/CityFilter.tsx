import styles from './CityFilter.module.css'

type CityFilterProps = {
  cities: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function CityFilter({ cities, value, onChange, disabled = false }: CityFilterProps) {
  const selectId = 'city-filter'

  return (
    <div className={styles.filter}>
      <div className={styles['filter__header']}>
        <label className={styles['filter__label']} htmlFor={selectId}>
          City
        </label>
        {value ? (
          <button
            type="button"
            className={styles['filter__clear']}
            onClick={() => onChange('')}
            disabled={disabled}
          >
            Clear
          </button>
        ) : null}
      </div>
      <select
        id={selectId}
        className={styles['filter__select']}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">All cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CityFilter
