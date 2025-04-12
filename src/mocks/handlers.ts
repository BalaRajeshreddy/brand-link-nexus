
import { http, HttpResponse } from 'msw';
import { mockFiles } from './fileMock';

export const handlers = [
  // Handle files API endpoint
  http.get('/api/brands/:brandId/files', ({ params }) => {
    const { brandId } = params;
    
    // In a real implementation, filter by brandId
    return HttpResponse.json(mockFiles);
  }),
  
  // Handle file upload endpoint
  http.post('/api/upload', async () => {
    // MSW doesn't easily handle multipart/form-data, so we simulate a successful upload
    return HttpResponse.json({
      id: `file-${Date.now()}`,
      name: 'uploaded-file.jpg',
      url: 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a',
      type: 'image'
    });
  })
];
