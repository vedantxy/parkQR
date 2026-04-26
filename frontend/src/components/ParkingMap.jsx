import { GoogleMap, Marker, InfoWindow, useLoadScript, DirectionsRenderer, Circle } from '@react-google-maps/api';
import { useState, useCallback, useMemo } from 'react';

// 📍 Apni actual parking ki lat/lng yahan daalo
const PARKING_LOCATION = { lat: 23.0225, lng: 72.5714 };
const LIBRARIES = ['places'];

export default function ParkingMap({ availableSlots = 12, occupiedSlots = 8 }) {
  const [selected, setSelected]       = useState(false);
  const [directions, setDirections]   = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingDir, setLoadingDir]   = useState(false);
  const [error, setError]             = useState('');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
  const isDummyKey = apiKey.includes('XXXX') || apiKey === '';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES
  });

  // 🧭 Visitor ki current location se directions lao
  const getDirections = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation supported nahi hai');
      return;
    }

    setLoadingDir(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(origin);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin,
            destination: PARKING_LOCATION,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            setLoadingDir(false);
            if (status === 'OK') {
              setDirections(result);
            } else {
              setError('Directions nahi mili: ' + status);
            }
          }
        );
      },
      () => {
        setLoadingDir(false);
        setError('Location access denied kiya');
      }
    );
  }, []);

  if (isDummyKey) return (
    <div style={{...styles.wrapper, padding: 40, textAlign: 'center', background: '#FEF2F2', border: '1px solid #FCA5A5'}}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🔑</div>
      <h3 style={{ color: '#991B1B', margin: '0 0 10px', fontFamily: 'Inter, sans-serif' }}>Google Maps API Key Required</h3>
      <p style={{ color: '#B91C1C', fontSize: 14, margin: 0, fontFamily: 'Inter, sans-serif' }}>
        Please open <b>frontend/.env</b> and replace the dummy VITE_GOOGLE_MAPS_KEY with your actual Google Cloud API key.
      </p>
    </div>
  );

  if (loadError) return (
    <div style={styles.loading}>❌ Error loading Google Maps</div>
  );

  if (!isLoaded) return (
    <div style={styles.loading}>🗺️ Map load ho raha hai...</div>
  );

  const totalSlots = availableSlots + occupiedSlots;
  const occupancyPercent = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // 🚗 Generate dynamic slot coordinates on the map around the parking center
  const slotMarkers = useMemo(() => {
    const markers = [];
    const startLat = 23.0227;
    const startLng = 72.5711;
    
    for(let i = 0; i < totalSlots; i++) {
      const isOccupied = i < occupiedSlots;
      markers.push({
        id: `slot-${i+1}`,
        position: {
          // Creates a nice grid layout of slots on the map
          lat: startLat - (Math.floor(i / 6) * 0.00015),
          lng: startLng + ((i % 6) * 0.00015)
        },
        status: isOccupied ? 'occupied' : 'available'
      });
    }
    return markers;
  }, [totalSlots, occupiedSlots]);

  return (
    <div style={styles.wrapper}>

      {/* 📊 Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statBox('#10B981')}>
          <span style={styles.statNum}>{availableSlots}</span>
          <span>Available</span>
        </div>
        <div style={styles.statBox('#EF4444')}>
          <span style={styles.statNum}>{occupiedSlots}</span>
          <span>Occupied</span>
        </div>
        <div style={styles.statBox('#2563EB')}>
          <span style={styles.statNum}>{occupancyPercent}%</span>
          <span>Full</span>
        </div>
      </div>

      {/* 🗺️ Google Map */}
      <GoogleMap
        zoom={17}
        center={PARKING_LOCATION}
        mapContainerStyle={styles.map}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        }}
      >
        {/* 🅿️ Parking Center Marker */}
        <Marker
          position={PARKING_LOCATION}
          onClick={() => setSelected(true)}
          label={{ text: 'P', color: 'white', fontWeight: 'bold' }}
          icon={{
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />

        {/* 🚗 Live Slot Markers (Red/Green Grid) */}
        {slotMarkers.map((slot) => (
          <Circle
            key={slot.id}
            center={slot.position}
            radius={3} // 3 meters radius
            options={{
              fillColor: slot.status === 'occupied' ? '#EF4444' : '#10B981',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 1,
            }}
          />
        ))}

        {/* 📍 User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2
            }}
          />
        )}

        {/* 🛣️ Route Line */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: { strokeColor: '#1a73e8', strokeWeight: 5 }
            }}
          />
        )}

        {/* ℹ️ Info Window */}
        {selected && (
          <InfoWindow
            position={PARKING_LOCATION}
            onCloseClick={() => setSelected(false)}
          >
            <div style={styles.infoBox}>
              <h3 style={{ margin: '0 0 8px', color: '#1a73e8' }}>🅿️ ParkSmart Parking</h3>
              <p style={styles.infoRow}>✅ Available: <b>{availableSlots} slots</b></p>
              <p style={styles.infoRow}>🔴 Occupied: <b>{occupiedSlots} slots</b></p>
              <p style={styles.infoRow}>🕐 Open: <b>24/7</b></p>
              <button onClick={getDirections} style={styles.dirBtn}>
                🧭 Directions Lo
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 🔘 Buttons */}
      <div style={styles.buttonRow}>
        <button onClick={() => setSelected(true)} style={styles.btnBlue}>
          ℹ️ Parking Info
        </button>
        <button onClick={getDirections} disabled={loadingDir} style={styles.btnGreen}>
          {loadingDir ? '⏳ Loading...' : '🧭 Get Directions'}
        </button>
        {directions && (
          <button onClick={() => { setDirections(null); setUserLocation(null); }} style={styles.btnRed}>
            ✖ Clear Route
          </button>
        )}
      </div>

      {/* Route Info */}
      {directions && (
        <div style={styles.routeInfo}>
          🛣️ Distance: <b>{directions.routes[0].legs[0].distance.text}</b> &nbsp;|&nbsp;
          ⏱️ ETA: <b>{directions.routes[0].legs[0].duration.text}</b>
        </div>
      )}

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}
    </div>
  );
}

// 🎨 Styles (Updated with ParkSmart theme colors)
const styles = {
  wrapper:  { borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#fff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
  loading:  { padding: 40, textAlign: 'center', fontSize: 16, color: '#64748B', fontFamily: 'Inter, sans-serif' },
  map:      { width: '100%', height: '350px' },
  statsBar: { display: 'flex', gap: 12, padding: '16px', background: '#F8FAFC' },
  statBox:  (color) => ({
    flex: 1, background: color, color: 'white', borderRadius: 8,
    padding: '12px', textAlign: 'center', display: 'flex',
    flexDirection: 'column', gap: 4, fontFamily: 'Inter, sans-serif'
  }),
  statNum:  { fontSize: 24, fontWeight: 'bold' },
  infoBox:  { minWidth: 200, padding: 8, fontFamily: 'Inter, sans-serif' },
  infoRow:  { margin: '6px 0', fontSize: 14, color: '#0F172A' },
  dirBtn:   {
    marginTop: 12, width: '100%', padding: '10px 0',
    background: '#2563EB', color: 'white',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '500'
  },
  buttonRow: { display: 'flex', gap: 12, padding: 16, fontFamily: 'Inter, sans-serif' },
  btnBlue:  { flex: 1, padding: '10px 0', background: '#2563EB', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' },
  btnGreen: { flex: 1, padding: '10px 0', background: '#10B981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' },
  btnRed:   { flex: 1, padding: '10px 0', background: '#EF4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' },
  routeInfo: { padding: '12px 16px', background: '#F0FDF4', color: '#166534', textAlign: 'center', fontSize: 14, fontFamily: 'Inter, sans-serif', borderTop: '1px solid #DCFCE7' },
  errorBox:  { padding: '12px 16px', background: '#FEF2F2', color: '#991B1B', fontSize: 14, fontFamily: 'Inter, sans-serif', borderTop: '1px solid #FEE2E2', textAlign: 'center' }
};
