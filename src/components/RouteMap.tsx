import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteStop {
  time: string;
  date?: string;
  city: string;
  station: string;
}

interface RouteMapProps {
  stops: RouteStop[];
}

// City coordinates for Ukrainian cities
const cityCoordinates: Record<string, [number, number]> = {
  'Київ': [50.4501, 30.5234],
  'Львів': [49.8397, 24.0297],
  'Одеса': [46.4825, 30.7233],
  'Харків': [49.9935, 36.2304],
  'Дніпро': [48.4647, 35.0462],
  'Запоріжжя': [47.8388, 35.1396],
  'Вінниця': [49.2331, 28.4682],
  'Полтава': [49.5883, 34.5514],
  'Рівне': [50.6199, 26.2516],
  'Тернопіль': [49.5535, 25.5948],
  'Івано-Франківськ': [48.9226, 24.7111],
  'Хмельницький': [49.4229, 26.9871],
  'Житомир': [50.2649, 28.6767],
  'Черкаси': [49.4444, 32.0598],
  'Кропивницький': [48.5079, 32.2623],
  'Миколаїв': [46.9750, 31.9946],
  'Херсон': [46.6354, 32.6169],
  'Чернівці': [48.2920, 25.9358],
  'Чернігів': [51.4982, 31.2893],
  'Суми': [50.9077, 34.7981],
  'Луцьк': [50.7593, 25.3424],
  'Ужгород': [48.6208, 22.2879],
  'Умань': [48.7498, 30.2213],
  'Біла Церква': [49.7988, 30.1153],
  'Стрий': [49.2612, 23.8564],
  'Золочів': [49.8064, 24.9014],
  'Тарасівка': [50.1961, 30.6869],
  'Бориспіль': [50.3518, 30.9550],
  'Коростень': [50.9517, 28.6375],
  'Новоград-Волинський': [50.5877, 27.6226],
  'Козятин': [49.7139, 28.8407],
  'Немирів': [48.9715, 28.8388],
  'Гайсин': [48.8092, 29.3881],
  'Первомайськ': [48.0435, 30.8547],
  'Красноїльськ': [48.3500, 25.4167],
  'Заболотів': [48.4667, 25.2500],
  'Коломия': [48.5256, 25.0403],
  'Надвірна': [48.6339, 24.5794],
};

// Create custom marker icons
const createIcon = (color: string, isEndpoint: boolean = false) => {
  const size = isEndpoint ? 24 : 16;
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      ${isEndpoint ? '<circle cx="12" cy="12" r="4" fill="white"/>' : ''}
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const startIcon = createIcon('#10b981', true); // Green for start
const endIcon = createIcon('#6366f1', true); // Primary for end
const stopIcon = createIcon('#f59e0b'); // Accent/orange for intermediate

// Component to fit bounds
const FitBounds = ({ coordinates }: { coordinates: [number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  
  return null;
};

const RouteMap = ({ stops }: RouteMapProps) => {
  // Get coordinates for each stop
  const coordinates: [number, number][] = stops
    .map(stop => cityCoordinates[stop.city])
    .filter((coord): coord is [number, number] => coord !== undefined);

  if (coordinates.length < 2) {
    return (
      <div className="route-map-placeholder">
        <p>Недостатньо даних для відображення карти</p>
      </div>
    );
  }

  const centerLat = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
  const centerLng = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;

  return (
    <div className="route-map-container">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        <Polyline
          positions={coordinates}
          color="#6366f1"
          weight={4}
          opacity={0.8}
          dashArray="10, 10"
        />
        
        {/* Markers for each stop */}
        {stops.map((stop, index) => {
          const coord = cityCoordinates[stop.city];
          if (!coord) return null;
          
          const isStart = index === 0;
          const isEnd = index === stops.length - 1;
          const icon = isStart ? startIcon : isEnd ? endIcon : stopIcon;
          
          return (
            <Marker key={index} position={coord} icon={icon}>
              <Popup>
                <div className="route-map-popup">
                  <strong>{stop.city}</strong>
                  <br />
                  <span className="text-sm">{stop.station}</span>
                  <br />
                  <span className="text-sm text-muted">{stop.time}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        <FitBounds coordinates={coordinates} />
      </MapContainer>
      
      {/* Legend */}
      <div className="route-map-legend">
        <div className="legend-item">
          <span className="legend-dot start"></span>
          <span>Відправлення</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot stop"></span>
          <span>Зупинка</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot end"></span>
          <span>Прибуття</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
