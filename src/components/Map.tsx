import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import maplibregl, { Map as MapLibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Main map component that handles the MapLibre instance and tile switching
const MapComponent = (): ReactElement => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  // Define tile configurations
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

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    const streetConfig = tileConfigs.street;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: streetConfig.tiles,
            tileSize: 256,
            attribution: streetConfig.attribution
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
    map.current.addControl(new NavigationControl(), 'top-right');
    map.current.addControl(new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left'); // Changed from 'top-right' to 'top-left'

    return () => map.current?.remove();
  }, []);

  // Handler for switching between satellite and street map tiles
  const toggleMapStyle = () => {
    if (!map.current) return;

    const config = isSatellite ? tileConfigs.street : tileConfigs.satellite;
    
    // Remove existing layer and source
    if (map.current.getLayer('osm')) map.current.removeLayer('osm');
    if (map.current.getSource('osm')) map.current.removeSource('osm');
    
    // Add new source and layer
    map.current.addSource('osm', {
      type: 'raster',
      tiles: config.tiles,
      tileSize: 256,
      attribution: config.attribution
    });
    
    map.current.addLayer({
      id: 'osm',
      type: 'raster',
      source: 'osm'
    });
    
    setIsSatellite(!isSatellite);
  };

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
      `}</style>
      <div ref={mapContainer} className="map-container" />
      <button 
        onClick={toggleMapStyle}
        className="
          absolute top-[146px] right-[10px]
          bg-white 
          w-[29px]
          py-[5px]
          rounded 
          shadow-sm
          cursor-pointer
          border border-gray-300
          hover:bg-gray-100 
          transition-colors
          z-10
          text-sm
          font-sans
        "
        aria-label={isSatellite ? 'Switch to Streets' : 'Switch to Satellite'}
      >
        {isSatellite ? '🛣️' : '🗺️'}
      </button>
    </>
  );
};

export default MapComponent;