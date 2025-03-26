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



function AzureMap(): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
const fetchReports = async () => { 
  try {
    const response = await fetch("http://localhost:3000/fetch_reports");
    if (!response.ok) {
      throw new Error("error fetching reports");
    }
    const data = await response.json();
    if (!data.reports || !Array.isArray(data.reports)) {
      throw new Error("Invalid data structure received from backend");
    }
    setReports(data.reports);
    console.log("Reports fetched:", data.reports);
  } catch (err: unknown) {
    setError((err as Error).message);
    console.error("Error fetching reports:", err);
  }
};

  
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
            console.log("Adding Feature:", report); // Debugging Log
        
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
            fetchReports();
            console.log("Created Feature with properties:", feature.properties); // Debugging Log
            datasource.add(feature);
          }
        }
        
        // Create a popup instance (only once)
        const popup = new atlas.Popup({ pixelOffset: [0, -10] });

        // Add click event to display popup
        map.events.add("click", resultLayer, (e) => {
          if (e.shapes && e.shapes.length > 0) {
            const feature = e.shapes[0] as atlas.Shape;
            console.log("Feature Clicked:", feature);

            const properties = feature.getProperties();
            if (!properties) {
              console.warn("Feature properties are missing.");
              return;
            }

            console.log("Feature Properties:", properties);

            const position = feature.getCoordinates() as atlas.data.Position;
            if (!position) {
              console.warn("No coordinates found for clicked feature.");
              return;
            }

            console.log("Popup Position:", position);

            // Generate popup content
            // Generate popup content using Tailwind classes
const content = `
<div class="bg-white p-2 rounded-md shadow-md text-sm">
  <strong class="block text-lg font-semibold">${properties.description}</strong>
  <p><span class="font-medium">Severity:</span> ${properties.severity}</p>
  <p><span class="font-medium">Type:</span> ${properties.destruction_type || "Unknown"}</p>
  <p><span class="font-medium">Timestamp:</span> ${new Date(properties.timestamp).toLocaleString()}</p>
</div>
`;

            if (!position || position.length !== 2 || isNaN(position[0]) || isNaN(position[1])) {
              console.error("Invalid position for popup:", position);
              return;
            }
            popup.setOptions({
              position, // Ensure valid coordinates
              content,
              pixelOffset: [0, -20], // Move the popup slightly above the pin
              closeButton: true, // Ensure there's a close button
            });
           
            
            console.log("Opening Popup...");
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