import { useEffect } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import styles from './StationsMap.module.css'
import type { Station } from '../types'

const DEFAULT_CENTER: [number, number] = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6
const HIGHLIGHT_COLOR = '#ff7a59'

type StationsMapProps = {
  stations: Station[]
  selectedStation: Station | null
  onMarkerSelect: (station: Station) => void
}

type MapFocusProps = {
  station: Station | null
}

function MapFocus({ station }: MapFocusProps) {
  const map = useMap()

  useEffect(() => {
    if (!station) {
      return
    }

    map.flyTo([station.lat, station.lng], 12, { duration: 0.75 })
  }, [map, station])

  return null
}

function StationsMap({ stations, selectedStation, onMarkerSelect }: StationsMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className={styles.map}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFocus station={selectedStation} />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          eventHandlers={{
            click: () => onMarkerSelect(station),
          }}
        >
          <Popup>
            <strong>{station.name}</strong>
            <div>{station.city}</div>
          </Popup>
        </Marker>
      ))}
      {selectedStation ? (
        <CircleMarker
          center={[selectedStation.lat, selectedStation.lng]}
          radius={18}
          pathOptions={{ color: HIGHLIGHT_COLOR, weight: 2, fillOpacity: 0.15 }}
        />
      ) : null}
    </MapContainer>
  )
}

export default StationsMap
