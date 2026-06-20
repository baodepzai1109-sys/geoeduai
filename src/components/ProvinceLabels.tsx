"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";

export default function ProvinceLabels({ geoData }: any) {
  if (!geoData) return null;

  const provinceCenters = new Map();

  geoData.features.forEach((feature: any) => {
    const provinceName =
      feature.properties?.name ||
      feature.properties?.oldName;

    if (!provinceName) return;

    let lng = 0;
    let lat = 0;
    let count = 0;

    try {
      const polygons = feature.geometry.coordinates;

      polygons.forEach((polygon: any) => {
        polygon.forEach((ring: any) => {
          ring.forEach((point: any) => {
            lng += point[0];
            lat += point[1];
            count++;
          });
        });
      });

      if (count === 0) return;

      const centerLat = lat / count;
      const centerLng = lng / count;

      if (!provinceCenters.has(provinceName)) {
        provinceCenters.set(provinceName, {
          lat: centerLat,
          lng: centerLng,
          count: 1,
        });
      } else {
        const old = provinceCenters.get(provinceName);

        provinceCenters.set(provinceName, {
          lat: old.lat + centerLat,
          lng: old.lng + centerLng,
          count: old.count + 1,
        });
      }
    } catch {}
  });

  return (
    <>
      {[...provinceCenters.entries()].map(
        ([provinceName, data]: any, index) => (
          <Marker
            key={index}
            position={[
              data.lat / data.count,
              data.lng / data.count,
            ]}
            icon={L.divIcon({
              className: "province-label",
              html: `
                <div>
                  ${provinceName}
                </div>
              `,
              iconSize: [100, 24],
            })}
          />
        )
      )}
    </>
  );
}