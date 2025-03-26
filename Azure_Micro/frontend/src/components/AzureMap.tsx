import { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";

interface Report {
  location?: {
    latitude: number;
    longitude: number;
  };
  media: {
    text: string;
    image_description?: string | null;
    audio_transcription?: string | null;
  };
  _id: string;
  severity: string;
  description: string;
  destruction_type?: string;
  timestamp: string;
}



function AzureMap({ reports }: { reports: Report[] }): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    if (mapRef.current) {
      const map = new atlas.Map(mapRef.current, {
        view: "Auto",
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: import.meta.env.VITE_AZURE_MAPS_API_KEY as string,
        },
        zoom: 2,
        center: [0, 0],
      });

      map.events.add("ready", () => {
        const datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        const resultLayer = new atlas.layer.SymbolLayer(datasource, undefined, {
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

        for (const report of reports) {
          if (report.location) {
            const feature = new atlas.data.Feature(
              new atlas.data.Point([report.location.longitude, report.location.latitude]),
              {
                id: report._id,
                severity: report.severity || "Unknown",
                description: report.description || "No Description",
                destruction_type: report.destruction_type || "Unknown",
                timestamp: report.timestamp || "N/A",
                media: report.media || {},
              }
            );
            datasource.add(feature);
          }
        }

        const popup = new atlas.Popup({ pixelOffset: [0, -10] });

        map.events.add("click", resultLayer, (e) => {
          if (e.shapes && e.shapes.length > 0) {
            const feature = e.shapes[0] as atlas.Shape;
            const properties = feature.getProperties();
            const position = feature.getCoordinates() as atlas.data.Position;

            const content = `
<div class="bg-white p-2 rounded-md shadow-md text-sm">
  <strong class="block text-lg font-semibold">${properties.description}</strong>
  <p><span class="font-medium">Severity:</span> ${properties.severity}</p>
  <p><span class="font-medium">Type:</span> ${properties.destruction_type || "Unknown"}</p>
  <p><span class="font-medium">Timestamp:</span> ${new Date(properties.timestamp).toLocaleString()}</p>
</div>
`;

            popup.setOptions({
              position,
              content,
              pixelOffset: [0, -20],
              closeButton: true,
            });
            console.log(properties);
            map.popups.add(popup);
            popup.open(map);
          }
        });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      mapInstanceRef.current?.dispose();
      mapInstanceRef.current = null;
    };
  }, [reports]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
      className="map-container"
    ></div>
  );
}

export default AzureMap;