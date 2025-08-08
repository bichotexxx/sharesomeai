import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, characterPersonality, conversationHistory = [] } = await request.json();

    if (!message || !characterPersonality) {
      return NextResponse.json({ error: 'Message and character personality are required' }, { status: 400 });
    }

    // Build context from conversation history and character personality
    const context = `
Character Personality: ${characterPersonality}

Previous conversation:
${conversationHistory.map((msg: any) => `${msg.is_character ? 'Character' : 'User'}: ${msg.content}`).join('\n')}

User: ${message}
Character:`;

    // In a real implementation, you would call an AI API here
    // For now, we'll simulate a response based on the character's personality
    const response = generateCharacterResponse(message, characterPersonality, conversationHistory);

    return NextResponse.json({ 
      success: true, 
      response 
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' }, 
      { status: 500 }
    );
  }
}

function generateCharacterResponse(message: string, personality: string, history: any[]): string {
  // Simple response generation based on personality keywords
  const personalityLower = personality.toLowerCase();
  
  if (personalityLower.includes('friendly') || personalityLower.includes('warm')) {
    return "That's wonderful! I love how you think about things. Tell me more about your perspective on this.";
  } else if (personalityLower.includes('mysterious') || personalityLower.includes('enigmatic')) {
    return "Hmm, that's an intriguing thought. There's more to this than meets the eye, isn't there?";
  } else if (personalityLower.includes('playful') || personalityLower.includes('fun')) {
    return "Oh, that's so interesting! I can't help but be curious about what you're thinking. What else is on your mind?";
  } else if (personalityLower.includes('intellectual') || personalityLower.includes('smart')) {
    return "That's a fascinating point. The implications of what you're saying are quite profound. I'd love to explore this further.";
  } else {
    return "That's really interesting! I'm enjoying our conversation. What else would you like to talk about?";
  }
}
