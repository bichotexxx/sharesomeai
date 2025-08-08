import { NextRequest, NextResponse } from 'next/server';
import { CivitAIService } from '@/lib/civitai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const query = searchParams.get('query') || '';

    let models;

    if (query) {
      models = await CivitAIService.searchModels(query, limit);
    } else {
      models = await CivitAIService.getPopularModels(limit);
    }

    return NextResponse.json({ 
      success: true, 
      models,
      count: models.length 
    });

  } catch (error) {
    console.error('Error fetching CivitAI models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' }, 
      { status: 500 }
    );
  }
}
