import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import maplibregl, { Map as MapLibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Main map component that handles the MapLibre instance and tile switching
const MapComponent = (): ReactElement => {
  // Ref to hold the HTML element where the map will be rendered
  const mapContainer = useRef<HTMLDivElement>(null);
  // Ref to store the MapLibre instance (persists between renders)
  const map = useRef<MapLibre | null>(null);
  // State to track which tile set is currently displayed
  const [isSatellite, setIsSatellite] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create new MapLibre instance
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          // Define the OpenStreetMap tile source
          'osm': {
            type: 'raster',
            // Use multiple subdomains (a,b,c) for better performance
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        // Define how the tiles should be rendered
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19
        }]
      },
      // Initial map position
      center: [0, 0],
      zoom: 2,
      minZoom: 2,    // Prevents zooming out beyond world view
      maxZoom: 18.99    // Limits maximum zoom level
    });

    // Add zoom level listener
    map.current.on('zoom', () => {
      if (map.current) {
        const zoomLevel = map.current.getZoom();
        console.log('Current zoom level:', Math.round(zoomLevel * 100) / 100);
      }
    });
    
    // Add zoom and rotation controls
    map.current.addControl(new NavigationControl(), 'top-right');
    
    // Add geolocation control for finding user's position
    map.current.addControl(new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-right');

    // Cleanup function to remove map when component unmounts
    return () => {
      map.current?.remove();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handler for switching between satellite and street map tiles
  const toggleMapStyle = () => {
    if (!map.current) return;

    // Get the current tile source
    const currentSource = map.current.getSource('osm') as maplibregl.RasterTileSource;
    if (currentSource) {
      // Define tile URLs based on current state
      const tiles = isSatellite 
        ? [
            // OpenStreetMap tiles (street view)
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ]
        : [
            // ESRI satellite imagery tiles
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ];
      
      // Update the tile source without recreating the map
      currentSource.setTiles(tiles);
      setIsSatellite(!isSatellite);
    }
  };

  return (
    <>
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
           border-gray-300
          hover:bg-gray-100 
          transition-colors
          z-10
          text-sm
          font-sans
        "
        aria-label={isSatellite ? 'Switch to Streets' : 'Switch to Satellite'}
      >
        {isSatellite ? '🏔️' : '🗺️'}
      </button>
    </>
  );
};

export default MapComponent;