import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const query = searchParams.get('query') || '';

    // Simulated CivitAI characters data
    const characters = [
      {
        id: 1,
        name: "Anime Girl",
        description: "Beautiful anime character with vibrant colors",
        creator: "AnimeArtist",
        image: "https://civitai.com/api/download/models/12345",
        tags: ["anime", "girl", "cute"],
        rating: 4.5,
        downloads: 1500
      },
      {
        id: 2,
        name: "Fantasy Warrior",
        description: "Epic fantasy warrior with magical armor",
        creator: "FantasyCreator",
        image: "https://civitai.com/api/download/models/67890",
        tags: ["fantasy", "warrior", "magic"],
        rating: 4.8,
        downloads: 2300
      },
      {
        id: 3,
        name: "Sci-Fi Robot",
        description: "Advanced AI robot with futuristic design",
        creator: "SciFiDesigner",
        image: "https://civitai.com/api/download/models/11111",
        tags: ["sci-fi", "robot", "futuristic"],
        rating: 4.2,
        downloads: 890
      }
    ];

    // Filter by query if provided
    const filteredCharacters = query 
      ? characters.filter(char => 
          char.name.toLowerCase().includes(query.toLowerCase()) ||
          char.description.toLowerCase().includes(query.toLowerCase())
        )
      : characters;

    return NextResponse.json({
      success: true,
      characters: filteredCharacters.slice(0, parseInt(limit))
    });

  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}
