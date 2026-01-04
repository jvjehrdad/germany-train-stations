import type { CSSProperties } from 'react'
import styles from './StationsList.module.css'
import type { Station } from '../types'

type StationsListProps = {
  stations: Station[]
  selectedId: number | null
  onSelect: (station: Station) => void
}

function StationsList({ stations, selectedId, onSelect }: StationsListProps) {
  if (stations.length === 0) {
    return <div className={styles['empty-state']}>No stations match this filter.</div>
  }

  return (
    <div className={styles['station-list']}>
      {stations.map((station, index) => {
        const isSelected = station.id === selectedId
        const cardStyle = { '--i': index } as CSSProperties
        const cardClassName = isSelected
          ? `${styles['station-card']} ${styles['station-card--selected']}`
          : styles['station-card']

        return (
          <button
            key={station.id}
            type="button"
            className={cardClassName}
            onClick={() => onSelect(station)}
            aria-pressed={isSelected}
            style={cardStyle}
          >
            <div className={styles['station-card__info']}>
              <span className={styles['station-card__name']}>{station.name}</span>
              <span className={styles['station-card__city']}>{station.city}</span>
            </div>
            <span className={styles['station-card__cta']}>View</span>
          </button>
        )
      })}
    </div>
  )
}

export default StationsList
