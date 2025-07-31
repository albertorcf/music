// src/utils/fetchWikipediaBio.ts

export async function fetchWikipediaBio(artistName: string): Promise<string | null> {
  const endpoint = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`;

  // Tenta buscar em pt.wikipedia
  let resp = await fetch(endpoint);
  if (resp.ok) {
    const data = await resp.json();
    if (data.extract && !data.extract.startsWith("Esta é uma página de desambiguação")) {
      return data.extract;
    }
  }

  // Se não encontrar, busca em en.wikipedia
  const endpointEn = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`;
  resp = await fetch(endpointEn);
  if (resp.ok) {
    const data = await resp.json();
    if (data.extract && !data.extract.startsWith("This disambiguation page")) {
      return data.extract;
    }
  }

  return null;
}
