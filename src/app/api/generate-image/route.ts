import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'realistic', width = 1024, height = 1024 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhanced prompt based on style for realistic character generation
    let enhancedPrompt = prompt;
    switch (style) {
      case 'anime':
        enhancedPrompt = `${prompt}, anime style, high quality, detailed, beautiful character`;
        break;
      case 'realistic':
        enhancedPrompt = `${prompt}, photorealistic, high quality, detailed, beautiful person, professional photography`;
        break;
      case 'cartoon':
        enhancedPrompt = `${prompt}, cartoon style, vibrant colors, detailed, cute character`;
        break;
      case 'fantasy':
        enhancedPrompt = `${prompt}, fantasy art style, magical, detailed, ethereal beauty`;
        break;
    }

    // Use Flux 1 Schnell for faster generation
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "evalstate/flux1_schnell",
        input: {
          prompt: enhancedPrompt,
          width: width,
          height: height,
          num_inference_steps: 4,
          randomize_seed: true,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const prediction = await response.json();
    
    // Poll for completion
    let result;
    while (true) {
      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        }
      });
      
      result = await statusResponse.json();
      
      if (result.status === 'succeeded') {
        break;
      } else if (result.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl: result.output[0] 
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' }, 
      { status: 500 }
    );
  }
}
