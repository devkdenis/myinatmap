import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import maplibregl, { Map as MapLibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

// ============================================================================
// SEARCH BAR CONFIGURATION
// ============================================================================
const geocodingApi = {
  forwardGeocode: async (config: any) => {
    // Better input sanitization
    const sanitizedQuery = config.query
      .trim()
      .replace(/[<>"'&]/g, '') // Remove potential XSS characters
      .slice(0, 100); // Limit length
      
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return { type: 'FeatureCollection' as const, features: [] };
    }
    
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(sanitizedQuery)}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request, {
        headers: {
          'User-Agent': 'MyiNatMap/1.0'
        }
      });
      
      const geojson = await response.json();
      
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
        ];
        features.push({
          id: feature.properties.place_id || Math.random().toString(),
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: center
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ['place'],
          center
        });
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }
    
    return { type: 'FeatureCollection' as const, features };
  }
};

// ============================================================================
// MAP TILE CONFIGURATION
// ============================================================================
const tileConfigs = {
  street: {
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    attribution: '© OpenStreetMap'
  },
  satellite: {
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    attribution: '© Esri, Maxar, Earthstar'
  }
};

// ============================================================================
// MAIN MAP COMPONENT
// ============================================================================
const MapComponent = (): ReactElement => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const isSatelliteRef = useRef(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // ========================================================================
    // MAP INITIALIZATION
    // ========================================================================
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: tileConfigs.street.tiles,
            tileSize: 256,
            attribution: tileConfigs.street.attribution
          }
        },
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19
        }]
      },
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18
    });

    // ========================================================================
    // SEARCH BAR - MapLibre Geocoder Control
    // ========================================================================
    const geocoder = new MaplibreGeocoder(geocodingApi, {
      maplibregl: maplibregl,
      placeholder: 'Search...',
      zoom: 12,
      flyTo: true,
      trackProximity: true,
      collapsed: false,
      clearOnBlur: false,
      limit: 6,
      minLength: 3,
      marker: true,
      clearAndBlurOnEsc: true,
      showResultsWhileTyping: true,
    });

    // Hide keyboard on mobile when result is selected
    geocoder.on('result', () => {
      const geocoderInput = document.querySelector('.maplibregl-ctrl-geocoder input') as HTMLInputElement;
      if (geocoderInput) {
        geocoderInput.blur();
      }
    });

    map.current.addControl(geocoder, 'top-left');

    // ========================================================================
    // MAP CONTROLS - Dashboard Toggle
    // ========================================================================
    class DashboardToggleControl {
      _container!: HTMLDivElement;
      _button!: HTMLButtonElement;

      onAdd() {
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        
        this._button = document.createElement('button');
        this._button.type = 'button';
        this._button.innerHTML = '◀';
        this._button.setAttribute('aria-label', 'Toggle Dashboard');
        
        this._button.addEventListener('click', () => {
          const event = new CustomEvent('dashboardToggle');
          window.dispatchEvent(event);
        });
        
        this._container.appendChild(this._button);
        return this._container;
      }

      onRemove() {
        this._container.parentNode?.removeChild(this._container);
      }
    }

    // Add Dashboard Toggle FIRST
    map.current.addControl(new DashboardToggleControl(), 'top-right');

    // ========================================================================
    // MAP CONTROLS - Navigation & Location
    // ========================================================================
    map.current.addControl(new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    // ========================================================================
    // MAP CONTROLS - Custom Style Toggle
    // ========================================================================
    class StyleToggleControl {
      _container!: HTMLDivElement;
      _button!: HTMLButtonElement;

      onAdd() {
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        
        this._button = document.createElement('button');
        this._button.type = 'button';
        this._button.innerHTML = '🛣️';
        this._button.setAttribute('aria-label', 'Toggle map style');
        
        this._button.addEventListener('click', () => {
          const currentState = isSatelliteRef.current;
          const newState = !currentState;
          const config = currentState ? tileConfigs.street : tileConfigs.satellite;
          
          if (map.current?.getLayer('osm')) map.current.removeLayer('osm');
          if (map.current?.getSource('osm')) map.current.removeSource('osm');
          
          map.current?.addSource('osm', {
            type: 'raster',
            tiles: config.tiles,
            tileSize: 256,
            attribution: config.attribution
          });
          
          map.current?.addLayer({
            id: 'osm',
            type: 'raster',
            source: 'osm'
          });
          
          isSatelliteRef.current = newState;
          this._button.innerHTML = currentState ? '🛣️' : '🗻';
        });
        
        this._container.appendChild(this._button);
        return this._container;
      }

      onRemove() {
        this._container.parentNode?.removeChild(this._container);
      }
    }

    map.current.addControl(new StyleToggleControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left');
    map.current.addControl(new NavigationControl(), 'bottom-right');

    // ========================================================================
    // DASHBOARD STATE LISTENER
    // ========================================================================
    const handleDashboardStateChange = (event: CustomEvent) => {
      const dashboardButton = document.querySelector('.maplibregl-ctrl-top-right .maplibregl-ctrl-group:first-child button');
      if (dashboardButton) {
        dashboardButton.innerHTML = event.detail.isVisible ? '◀' : '▶';
        dashboardButton.setAttribute('aria-label', event.detail.isVisible ? 'Hide Dashboard' : 'Show Dashboard');
      }
    };

    window.addEventListener('dashboardStateChange', handleDashboardStateChange as EventListener);

    return () => {
      map.current?.remove();
      window.removeEventListener('dashboardStateChange', handleDashboardStateChange as EventListener);
    };
  }, []); // Empty dependency array!

  return (
    <>
      {/* ================================================================== */}
      {/* MAP & SEARCH BAR STYLING */}
      {/* ================================================================== */}
      <style>{`
        /* MAP CONTROLS STYLING */
        .maplibregl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
        }
        
        /* Z-INDEX HIERARCHY */
        .maplibregl-ctrl-top-left {
          z-index: 10 !important;
        }
        
        .maplibregl-ctrl-top-right {
          z-index: 9 !important;
        }
        
        /* SEARCH BAR STYLING - Default for large desktop */
        .maplibregl-ctrl-geocoder {
          box-shadow: 0 0 0 2px rgba(0,0,0,.1) !important;
          min-width: 400px !important;
        }
        
        /* DESKTOP 700px-800px */
        @media (min-width: 700px) and (max-width: 799px) {
          .maplibregl-ctrl-geocoder {
            min-width: 300px !important;
          }
        }
        
        /* DESKTOP 640px-700px */
        @media (min-width: 640px) and (max-width: 700px) {
          .maplibregl-ctrl-geocoder {
            min-width: 250px !important;
          }
        }
        
        /* ATTRIBUTION STYLING */
        .maplibregl-ctrl-attrib.maplibregl-compact {
          margin: 10px 15px !important;
        }
        
        /* MOBILE ONLY: Full-width search bar */
        @media (max-width: 639px) {
          .maplibregl-ctrl-top-left .maplibregl-ctrl {
            margin: 10px;
          }
          
          .maplibregl-ctrl-geocoder {
            position: fixed !important;
            left: 0 !important;
            right: 0 !important; 
            width: auto !important;
            min-width: unset !important;
            max-width: unset !important;
          }
          
          .maplibregl-ctrl-top-right {
            top: 65px !important;
          }
        }
      `}</style>
      
      {/* ================================================================== */}
      {/* MAP CONTAINER */}
      {/* ================================================================== */}
      <div ref={mapContainer} className="map-container" />
    </>
  );
};

export default MapComponent;