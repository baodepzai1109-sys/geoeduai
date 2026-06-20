import provinceInfo from "@/data/provinceInfo.json";

export function findProvince(question: string) {
  const provinces = Object.keys(provinceInfo);

  for (const province of provinces) {
    if (
      question
        .toLowerCase()
        .includes(province.toLowerCase())
    ) {
      return provinceInfo[
        province as keyof typeof provinceInfo
      ];
    }
  }

  return null;
}