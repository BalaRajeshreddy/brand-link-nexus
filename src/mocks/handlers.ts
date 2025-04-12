
import { rest } from 'msw';
import { mockFiles } from './fileMock';

export const handlers = [
  // Handle files API endpoint
  rest.get('/api/brands/:brandId/files', (req, res, ctx) => {
    const { brandId } = req.params;
    
    // In a real implementation, filter by brandId
    return res(
      ctx.status(200),
      ctx.json(mockFiles)
    );
  }),
  
  // Handle file upload endpoint
  rest.post('/api/upload', async (req, res, ctx) => {
    // MSW doesn't easily handle multipart/form-data, so we simulate a successful upload
    return res(
      ctx.status(200),
      ctx.json({
        id: `file-${Date.now()}`,
        name: 'uploaded-file.jpg',
        url: 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a',
        type: 'image'
      })
    );
  })
];
