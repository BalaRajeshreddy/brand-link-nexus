import React from 'react';
import { BlockForm } from '@/components/BlockForm';
import { BlockType } from '@/types/block';
import { Button } from '@/components/ui/button';
import { Image } from 'next/image';

export default function LandingPage() {
  const [selectedBlock, setSelectedBlock] = React.useState<BlockType | null>(null);
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const brandId = 'your-brand-id'; // Replace with actual brand ID

  const handleAddBlock = (type: BlockType) => {
    setSelectedBlock(type);
    setBlocks([
      ...blocks,
      {
        type,
        content: {},
        order: blocks.length,
        isActive: true
      }
    ]);
  };

  const handleBlockChange = (index: number, block: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = block;
    setBlocks(newBlocks);
  };

  const renderBlockPreview = (block: any) => {
    switch (block.type) {
      case BlockType.IMAGE:
        return (
          <div className="relative aspect-video w-full">
            {block.content.image?.url && (
              <Image
                src={block.content.image.url}
                alt={block.content.title || 'Image'}
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
        );
      case BlockType.IMAGE_TEXT:
        return (
          <div className={`flex ${block.content.imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
            <div className="relative aspect-video w-1/2">
              {block.content.image?.url && (
                <Image
                  src={block.content.image.url}
                  alt={block.content.title || 'Image'}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
            <div className="w-1/2 space-y-2">
              <h3 className="text-xl font-semibold">{block.content.title}</h3>
              <p className="text-gray-600">{block.content.description}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Landing Page Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add Blocks</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleAddBlock(BlockType.HERO)}
              variant="outline"
            >
              Hero
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.PDF)}
              variant="outline"
            >
              PDF
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.VIDEO)}
              variant="outline"
            >
              Video
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.FEATURES)}
              variant="outline"
            >
              Features
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.TESTIMONIALS)}
              variant="outline"
            >
              Testimonials
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.CONTACT)}
              variant="outline"
            >
              Contact
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.IMAGE)}
              variant="outline"
            >
              Image
            </Button>
            <Button
              onClick={() => handleAddBlock(BlockType.IMAGE_TEXT)}
              variant="outline"
            >
              Image + Text
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Edit Block</h2>
          {selectedBlock && (
            <BlockForm
              formData={{
                type: selectedBlock,
                content: {},
                isActive: true
              }}
              onChange={(data) => {
                const index = blocks.findIndex(b => b.type === selectedBlock);
                if (index !== -1) {
                  handleBlockChange(index, data);
                }
              }}
              brandId={brandId}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-8">
          {blocks.map((block, index) => (
            <div key={index} className="border rounded-lg p-4">
              {renderBlockPreview(block)}
              <BlockForm
                formData={block}
                onChange={(data) => handleBlockChange(index, data)}
                brandId={brandId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 