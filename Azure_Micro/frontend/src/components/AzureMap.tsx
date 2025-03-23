import { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";

function AzureMap(): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);

  useEffect((): (() => void) => {
    if (mapRef.current) {
      const map = new atlas.Map(mapRef.current, {
        view: "Auto",
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: import.meta.env.VITE_AZURE_MAPS_API_KEY as string, // Replace with your Azure Maps subscription key
        },
      });

      map.events.add("ready", () => {
        // Create a data source and add it to the map
        const datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        // Add a layer for rendering point data
        const resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
          iconOptions: {
            image: "pin-round-darkblue",
            anchor: "center",
            allowOverlap: true,
          },
          textOptions: {
            anchor: "top",
          },
        });

        map.layers.add(resultLayer);

        // Example: Adding a point to the data source
        datasource.add(new atlas.data.Point([-97.7431, 30.2672])); // Add coordinates
      });

      mapInstanceRef.current = map;
    }

    // Cleanup on component unmount
    return () => {
      mapInstanceRef.current?.dispose();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
      className="map-container"
    ></div>
  );
}

export default AzureMap;
