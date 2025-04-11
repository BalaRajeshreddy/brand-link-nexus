import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: {
        brandId: params.brandId,
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // TODO: Implement file upload to storage (e.g., S3, Cloudinary)
    // For now, we'll just store the file metadata
    const newFile = await prisma.file.create({
      data: {
        name: file.name,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'PDF',
        size: file.size,
        mimeType: file.type,
        url: 'placeholder-url', // Replace with actual file URL after upload
        userId: session.user.id,
        brandId: params.brandId
      }
    });

    return NextResponse.json(newFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 