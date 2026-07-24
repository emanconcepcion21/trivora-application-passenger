const API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjRmY2RkOThjMzNkMTQ2YzI5ZDcxNDVhMDM5MThhNTEyIiwiaCI6Im11cm11cjY0In0=';

export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
) {
  try {
    const response = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        method: 'POST',
        headers: {
          Authorization: API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [startLng, startLat],
            [endLng, endLat],
          ],
        }),
      },
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}