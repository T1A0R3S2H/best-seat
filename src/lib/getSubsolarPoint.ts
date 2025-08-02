// getSubsolarPoint.ts
export function getSubsolarPoint(date: Date) {
  const rad = Math.PI / 180;

  // Julian date => number of days since J2000.0
  function toDays(date: Date): number {
    return (date.getTime() / 86400000) - 10957.5;
  }

  // Sun position helper math
  function rightAscension(l: number, b: number): number {
    return Math.atan2(Math.sin(l) * Math.cos(0) - Math.tan(b) * Math.sin(0), Math.cos(l));
  }

  function declination(l: number, b: number): number {
    return Math.asin(Math.sin(b) * Math.cos(0) + Math.cos(b) * Math.sin(0) * Math.sin(l));
  }

  function solarMeanAnomaly(d: number): number {
    return rad * (357.5291 + 0.98560028 * d);
  }

  function eclipticLongitude(M: number): number {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372; // perihelion of the Earth
    return M + C + P + Math.PI;
  }

  function sunCoords(d: number) {
    const M = solarMeanAnomaly(d);
    const L = eclipticLongitude(M);
    return {
      dec: declination(L, 0),
      ra: rightAscension(L, 0)
    };
  }

  function siderealTime(d: number, lw: number): number {
    return rad * (280.16 + 360.9856235 * d) - lw;
  }

  // Main subsolar point computation
  const d = toDays(date);
  const sc = sunCoords(d);
  const ra = sc.ra;
  const dec = sc.dec;

  const gst = siderealTime(d, 0); // Greenwich sidereal time
  const lon = ((ra - gst) * 180 / Math.PI + 180) % 360 - 180; // wrap to [-180, 180]
  const lat = dec * 180 / Math.PI;

  return { lat, lon };
} 