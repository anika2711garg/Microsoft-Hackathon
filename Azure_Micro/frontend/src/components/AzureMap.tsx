import { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const [hoverData, setHoverData] = useState<{
    position: [number, number];
    properties: any;
  } | null>(null);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [showBlueDot, setShowBlueDot] = useState(false);

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
        });

        map.layers.add(resultLayer);

        for (const report of reports) {
          if (report.location) {
            const feature = new atlas.data.Feature(
              new atlas.data.Point([
                report.location.longitude,
                report.location.latitude,
              ]),
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

        map.events.add("click", resultLayer, (e) => {
          if (e.shapes && e.shapes.length > 0) {
            const feature = e.shapes[0] as atlas.Shape;
            const properties = feature.getProperties();
            const position = feature.getCoordinates() as [number, number];

            setHoverData({
              position,
              properties,
            });
            setShowHoverCard(true);
            setShowBlueDot(true);
          }
        });

        map.events.add("click", (e) => {
          if (!e.shapes || e.shapes.length === 0) {
            setShowHoverCard(false);
            setShowBlueDot(false);
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

  const renderHoverCard = () => {
    if (!hoverData || !mapInstanceRef.current || !showHoverCard) return null;

    const { position, properties } = hoverData;
    const pixelPosition = mapInstanceRef.current.positionsToPixels([
      position,
    ])[0];

    return (
      <div
        style={{
          position: "absolute",
          top: pixelPosition[1],
          left: pixelPosition[0],
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
        onMouseEnter={() => setShowBlueDot(true)}
        onMouseLeave={() => {
          setShowBlueDot(false);
          setShowHoverCard(false);
        }}
      >
        <HoverCard>
          <HoverCardTrigger>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "blue",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="p-4 bg-white rounded-lg shadow-md text-gray-800">
              <h3 className="font-bold text-lg mb-2 text-red-600">
                Severity: {properties.severity }
              </h3>
              <p className="text-sm mb-1">
                <span className="font-semibold">Description:</span>{" "}
                {properties.description}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Destruction Type:</span>{" "}
                {properties.destruction_type}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Timestamp:</span>{" "}
                {new Date(properties.timestamp).toLocaleString()}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  };

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
      className="map-container"
    >
      {showBlueDot && renderHoverCard()}
    </div>
  );
}

export default AzureMap;
