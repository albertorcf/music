// react/src/utils/checkSpotifyAuth.ts
export async function checkSpotifyAuth(accessToken: string) {
  // Checa música atual
  const playingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  let playing = null;
  if (playingRes.status === 401) return { loggedIn: false, error: "Token expirado" };
  if (playingRes.status === 204) playing = "Nada tocando agora";
  else playing = await playingRes.json();

  // Checa dispositivos
  const devicesRes = await fetch("https://api.spotify.com/v1/me/player/devices", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  let devices = null;
  if (devicesRes.status === 401) return { loggedIn: false, error: "Token expirado" };
  devices = await devicesRes.json();

  return { loggedIn: true, playing, devices: devices.devices || [] };
}
