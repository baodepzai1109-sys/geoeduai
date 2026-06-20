const fs = require("fs");
const polygonClipping = require("polygon-clipping");

const geojson = JSON.parse(
  fs.readFileSync("./public/vn_geo.json", "utf8")
);

const groups = {};

geojson.features.forEach((feature) => {
  const name = feature.properties.name;

  if (!groups[name]) {
    groups[name] = [];
  }

  groups[name].push(feature);
});

const mergedFeatures = [];

for (const name in groups) {
  const features = groups[name];

  if (features.length === 1) {
    mergedFeatures.push(features[0]);
    continue;
  }

  try {
    const geometries = features.map((f) =>
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates
    );

    const mergedCoords =
      polygonClipping.union(...geometries);

    mergedFeatures.push({
      type: "Feature",
      properties: features[0].properties,
      geometry: {
        type: "MultiPolygon",
        coordinates: mergedCoords,
      },
    });
  } catch (err) {
    console.log("Lỗi:", name);

    mergedFeatures.push(features[0]);
  }
}

const output = {
  type: "FeatureCollection",
  features: mergedFeatures,
};

console.log("Số tỉnh mới:", mergedFeatures.length);

console.log(
  mergedFeatures.map(f => f.properties.name).sort()
);

fs.writeFileSync(
  "./public/vn_geo_34.json",
  JSON.stringify(output)
);
console.log(
  output.features.filter(
    f => f.properties.name === "Cần Thơ"
  ).length
);
console.log(
  `Đã gộp xong: ${mergedFeatures.length} tỉnh`
);