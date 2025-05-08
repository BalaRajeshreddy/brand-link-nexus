import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brandId = formData.get('brandId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', brandId);
    await mkdir(uploadDir, { recursive: true });

    // Create unique filename
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const uniqueId = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    // Convert file to buffer
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);

    // Save file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${brandId}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
