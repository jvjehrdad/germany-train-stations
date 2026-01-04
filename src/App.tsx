import { useEffect, useMemo, useState } from 'react';
import styles from './App.module.css';
import CityFilter from './components/CityFilter';
import StationsList from './components/StationsList';
import StationsMap from './components/StationsMap';
import type { Station } from './types';

const API_URL =
  'https://gist.githubusercontent.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c/raw/';

type FetchStatus = 'loading' | 'success' | 'error';

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null,
  );
  const [requestNonce, setRequestNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadStations = async () => {
      setStatus('loading');
      setErrorMessage(null);

      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = (await response.json()) as Station[];
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format.');
        }
        setStations(data);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    };

    void loadStations();

    return () => {
      controller.abort();
    };
  }, [requestNonce]);

  const cities = useMemo(
    () =>
      Array.from(new Set(stations.map((station) => station.city))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [stations],
  );

  const filteredStations = useMemo(() => {
    if (!selectedCity) {
      return stations;
    }
    return stations.filter((station) => station.city === selectedCity);
  }, [stations, selectedCity]);

  const selectedStation = useMemo(
    () => stations.find((station) => station.id === selectedStationId) ?? null,
    [stations, selectedStationId],
  );

  useEffect(() => {
    if (
      selectedStationId &&
      !filteredStations.some((station) => station.id === selectedStationId)
    ) {
      setSelectedStationId(null);
    }
  }, [filteredStations, selectedStationId]);

  const handleRetry = () => setRequestNonce((value) => value + 1);
  const handleSelectStation = (station: Station) =>
    setSelectedStationId(station.id);

  const statusCopy =
    status === 'loading'
      ? 'Fetching station data...'
      : status === 'error'
      ? errorMessage ?? 'Unable to load station data.'
      : 'Ready';

  const statusClassName =
    status === 'error'
      ? `${styles.status} ${styles['status--error']}`
      : styles.status;

  return (
    <div className={styles.app}>
      <header className={styles['app__header']}>
        <div className={styles['app__title']}>
          <h1>Germany Station Atlas</h1>
          <p className={styles.subtitle}>
            Explore major German stations on an interactive map. Filter by city
            and jump to any stop.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles['stat__label']}>Stations</span>
            <span className={styles['stat__value']}>
              {status === 'success' ? filteredStations.length : '-'}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles['stat__label']}>Cities</span>
            <span className={styles['stat__value']}>
              {status === 'success' ? cities.length : '-'}
            </span>
          </div>
        </div>
      </header>

      <section className={styles.layout}>
        <aside className={styles.panel}>
          <div className={styles['panel__top']}>
            <CityFilter
              cities={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              disabled={status !== 'success'}
            />
            <div className={statusClassName}>
              <span>{statusCopy}</span>
              {status === 'error' ? (
                <button
                  type="button"
                  className={styles['status__retry']}
                  onClick={handleRetry}
                >
                  Retry
                </button>
              ) : null}
            </div>
            <div className={styles['panel__meta']}>
              {status === 'success' ? (
                <span>
                  {selectedCity
                    ? `Showing ${filteredStations.length} station${
                        filteredStations.length === 1 ? '' : 's'
                      } in ${selectedCity}.`
                    : `Showing ${filteredStations.length} station${
                        filteredStations.length === 1 ? '' : 's'
                      } across Germany.`}
                </span>
              ) : (
                <span>Waiting for data...</span>
              )}
            </div>
          </div>

          {status === 'loading' ? (
            <div className={styles['skeleton-list']}>
              {Array.from({ length: 6 }, (_, index) => (
                <div className={styles['skeleton-card']} key={index} />
              ))}
            </div>
          ) : null}

          {status === 'error' ? (
            <div className={styles['error-card']}>
              <p>
                We could not reach the station feed. Check your connection and
                try again.
              </p>
            </div>
          ) : null}

          {status === 'success' ? (
            <StationsList
              stations={filteredStations}
              selectedId={selectedStationId}
              onSelect={handleSelectStation}
            />
          ) : null}
        </aside>

        <div className={styles.mapCard}>
          <StationsMap
            stations={filteredStations}
            selectedStation={selectedStation}
            onMarkerSelect={handleSelectStation}
          />
          {status !== 'success' ? (
            <div className={styles['map-overlay']}>
              <p>
                {status === 'loading'
                  ? 'Loading stations...'
                  : 'Map ready. Station data unavailable.'}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default App;
