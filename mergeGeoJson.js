const fs = require("fs");
const turf = require("@turf/turf");

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
let merged = groups[name][0];

for (let i = 1; i < groups[name].length; i++) {
try {
merged = turf.union(merged, groups[name][i]);
} catch (err) {
console.log(`Lỗi khi gộp ${name}:`, err.message);
}
}

merged.properties = groups[name][0].properties;

mergedFeatures.push(merged);
}

const output = {
type: "FeatureCollection",
features: mergedFeatures,
};

fs.writeFileSync(
"./public/vn_geo_34.json",
JSON.stringify(output)
);

console.log(
`Đã gộp xong: ${mergedFeatures.length} tỉnh`
);
