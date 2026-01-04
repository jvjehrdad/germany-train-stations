import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const stationsFixture = [
  { id: 1, name: 'Berlin Hbf', city: 'Berlin', lat: 52.5251, lng: 13.3694 },
  { id: 2, name: 'Hamburg Hbf', city: 'Hamburg', lat: 53.553, lng: 10.0067 },
  { id: 3, name: 'Munich Hbf', city: 'Munich', lat: 48.1402, lng: 11.5586 },
]

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({
    children,
    eventHandlers,
  }: {
    children: ReactNode
    eventHandlers?: { click?: () => void }
  }) => (
    <div data-testid="marker" onClick={() => eventHandlers?.click?.()}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CircleMarker: () => <div data-testid="highlight" />,
  useMap: () => ({ flyTo: vi.fn() }),
}))

describe('App', () => {
  beforeEach(() => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => stationsFixture,
    })

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('filters stations by city and clears filter', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(await screen.findByRole('button', { name: /berlin hbf/i })).toBeInTheDocument()

    const select = screen.getByLabelText('City')
    await user.selectOptions(select, 'Hamburg')

    expect(screen.queryByRole('button', { name: /berlin hbf/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hamburg hbf/i })).toBeInTheDocument()

    await user.selectOptions(select, screen.getByRole('option', { name: /all cities/i }))

    expect(screen.getByRole('button', { name: /berlin hbf/i })).toBeInTheDocument()
  })
})
