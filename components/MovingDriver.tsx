import React, { useEffect, useState } from 'react';

import { Marker } from 'react-native-maps';

export default function MovingDriver() {

  const [coordinate, setCoordinate] = useState({
    latitude: 14.064000,
    longitude: 120.622000,
  });

  useEffect(() => {

    const interval = setInterval(() => {

      setCoordinate(prev => ({
        latitude: prev.latitude + 0.00015,
        longitude: prev.longitude + 0.00012,
      }));

    }, 1500);

    return () => clearInterval(interval);

  }, []);

  return (

    <Marker
      coordinate={coordinate}
      title="Driver"
      description="TRIVORA Driver"
      image={require('../assets/tricycle.png')}
    />

  );

}