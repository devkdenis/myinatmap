import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import maplibregl, { Map as MapLibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

// Geocoding API configuration
const geocodingApi = {
  forwardGeocode: async (config: any) => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
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

// Tile configurations
const tileConfigs = {
  street: {
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    attribution: '© Esri, Maxar, Earthstar Geographics'
  }
};

const MapComponent = (): ReactElement => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
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

    // Add controls
    map.current.addControl(
      new MaplibreGeocoder(geocodingApi, {
        maplibregl: maplibregl,
        placeholder: 'Search parks, cities, coordinates...',
        zoom: 12,
        flyTo: true,
        trackProximity: true,
        collapsed: true,
        clearOnBlur: false,
        limit: 6,
        minLength: 3,
        marker: true,
        clearAndBlurOnEsc: true,
        showResultsWhileTyping: true,
      }),
      'top-right'
    );

    map.current.addControl(new NavigationControl(), 'top-right');
    map.current.addControl(new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    // Custom style toggle control
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
          setIsSatellite(currentState => {
            const newState = !currentState;
            const config = currentState ? tileConfigs.street : tileConfigs.satellite;
            
            // Update map source
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
            
            this._button.innerHTML = currentState ? '🛣️' : '🗻';
            return newState;
          });
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

    return () => map.current?.remove();
  }, []);

  return (
    <>
      <style>{`
        .maplibregl-ctrl-scale {
          position: absolute !important;
          bottom: 0px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .maplibregl-ctrl-bottom-left {
          width: 100% !important;
        }
        
        .maplibregl-ctrl-group button {
          width: 35px !important;
          height: 35px !important;
        }
        
        /* Geocoder styling */
        .maplibregl-ctrl-geocoder {
          font-size: 13px !important;
          box-shadow: 0 0 0 2px rgba(0,0,0,.1) !important;
          border-radius: 4px !important;
        }
        
        .maplibregl-ctrl-geocoder.maplibregl-ctrl-geocoder--collapsed {
          width: 35px !important;
          height: 35px !important;
          min-width: 35px !important;
          min-height: 35px !important;
        }
        
        .maplibregl-ctrl-geocoder--button {
          width: 25px !important;
          height: 25px !important;
          min-width: 25px !important;
          min-height: 25px !important;
          font-size: 12px !important;
          right: 6px !important;
          top: 6px !important;
        }
        
        .maplibregl-ctrl-geocoder--icon-search {
          width: 18px !important;
          height: 18px !important;
          left: 8px !important;
          top: 8px !important;
        }
        .maplibregl-ctrl-geocoder--icon-close {
          margin-top: 0;
          margin-right: 0;
        }
        
        .maplibregl-ctrl-geocoder--input {
          height: 35px !important;
          font-size: 13px !important;
          padding-left: 35px !important;
        }
      `}</style>
      <div ref={mapContainer} className="map-container" />
    </>
  );
};

export default MapComponent;