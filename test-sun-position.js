// Test script for sun position calculation
const { getSubsolarPoint } = require('./src/lib/getSubsolarPoint.ts');

// Test the sun position calculation
const now = new Date();
console.log('Current time:', now.toISOString());

const sunPosition = getSubsolarPoint(now);
console.log('Sun position:', sunPosition);

// Test with a specific date (summer solstice)
const summerSolstice = new Date('2024-06-21T12:00:00Z');
const summerPosition = getSubsolarPoint(summerSolstice);
console.log('Summer solstice sun position:', summerPosition);

// Test with winter solstice
const winterSolstice = new Date('2024-12-21T12:00:00Z');
const winterPosition = getSubsolarPoint(winterSolstice);
console.log('Winter solstice sun position:', winterPosition); 