# Unsplash API Integration Setup

## Overview
The Scenic View Finder application now includes landmark images fetched from the Unsplash API to provide visual context for visible landmarks.

## Setup Instructions

### 1. Get Unsplash API Access
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a developer account
3. Register a new application
4. Copy your Access Key

### 2. Configure Environment Variables
Create a `.env.local` file in your project root with:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

Replace `your_unsplash_access_key_here` with your actual Unsplash Access Key.

### 3. API Rate Limits
- **Demo Mode**: 50 requests per hour (perfect for development)
- **Production Mode**: 5000 requests per hour (apply when ready for production)

### 4. Features Implemented

#### LandmarkImage Component (`src/components/LandmarkImage.tsx`)
- **Automatic Image Fetching**: Searches Unsplash for landmark-specific images
- **Loading States**: Shows skeleton loading while fetching
- **Error Handling**: Falls back to landmark emoji if image fails to load
- **Optimized Images**: Uses Next.js Image component for performance
- **Responsive Design**: Adapts to different container sizes

#### Unsplash API Route (`src/app/api/unsplash/route.ts`)
- **Search Photos**: Queries Unsplash API with landmark name and type
- **Landscape Orientation**: Prioritizes landscape images for better display
- **Error Handling**: Graceful fallbacks for API failures
- **Rate Limiting**: Respects Unsplash API limits

#### Enhanced FlightForm
- **Visual Landmarks**: Each landmark now displays a relevant image
- **Improved UX**: Users can see what landmarks look like
- **Compact Design**: Small 24x24px images that don't clutter the interface

### 5. Image Search Strategy
The component searches for images using the pattern:
```
"{landmarkName} {landmarkType}"
```

Examples:
- "Mount Fuji Mountain"
- "Eiffel Tower Monument"
- "New York City City"

### 6. Usage Examples

#### Basic Usage
```tsx
<LandmarkImage 
  landmarkName="Mount Fuji"
  landmarkType="Mountain"
  className="w-8 h-8 rounded"
/>
```

#### In FlightForm Component
```tsx
{visibleLandmarks.map((landmark, index) => (
  <div key={index}>
    <LandmarkImage 
      landmarkName={landmark.name}
      landmarkType={landmark.type}
      className="w-6 h-6 rounded"
    />
    {/* Other landmark info */}
  </div>
))}
```

### 7. Performance Considerations
- **Caching**: Images are cached by the browser
- **Lazy Loading**: Images load only when needed
- **Optimized Sizes**: Uses appropriate image sizes for display
- **Error Boundaries**: Graceful degradation if images fail

### 8. Attribution
Following [Unsplash API guidelines](https://unsplash.com/documentation#search-photos), the application properly attributes photographers and Unsplash.

### 9. Troubleshooting

#### Common Issues:
1. **"Unsplash API key not configured"**: Check your `.env.local` file
2. **No images found**: Some landmarks may not have good search results
3. **Rate limit exceeded**: Wait for the hourly limit to reset

#### Debug Steps:
1. Check browser console for API errors
2. Verify environment variable is loaded
3. Test API endpoint directly: `/api/unsplash?query=mount%20fuji%20mountain`

### 10. Future Enhancements
- Add image caching layer
- Implement image preloading for better UX
- Add image hover states with photographer info
- Support for different image orientations
- Add image quality preferences 