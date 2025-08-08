// CivitAI API service
const CIVITAI_BASE_URL = 'https://civitai.com/api/v1';

export interface CivitAIModel {
  id: number;
  name: string;
  description: string;
  type: string;
  nsfw: boolean;
  tags: string[];
  modelVersions: {
    id: number;
    name: string;
    description: string;
    baseModel: string;
    downloadUrl: string;
    files: {
      id: number;
      name: string;
      sizeKB: number;
      type: string;
      hashes: {
        SHA256: string;
      };
    }[];
  }[];
  creator: {
    username: string;
    image: string;
  };
  stats: {
    downloadCount: number;
    rating: number;
    ratingCount: number;
  };
  images: {
    id: number;
    url: string;
    width: number;
    height: number;
    nsfw: boolean;
    hash: string;
    meta: {
      prompt?: string;
      negativePrompt?: string;
      cfgScale?: number;
      steps?: number;
      sampler?: string;
      seed?: number;
    };
  }[];
}

export interface CivitAICharacter {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  modelName: string;
  creator: string;
  tags: string[];
}

export class CivitAIService {
  private static async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  static async getPopularModels(limit: number = 20): Promise<CivitAIModel[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${CIVITAI_BASE_URL}/models?limit=${limit}&sort=Download Count&period=AllTime&nsfw=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching popular models:', error);
      return [];
    }
  }

  static async getCharacterExamples(limit: number = 12): Promise<CivitAICharacter[]> {
    try {
      // Get popular character models
      const response = await this.fetchWithTimeout(
        `${CIVITAI_BASE_URL}/models?limit=${limit}&sort=Download Count&period=AllTime&nsfw=true&types=Checkpoint&tag=character`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const models = data.items || [];

      // Transform models into character examples
      const characters: CivitAICharacter[] = models
        .filter((model: CivitAIModel) => model.images && model.images.length > 0)
        .map((model: CivitAIModel) => {
          const firstImage = model.images[0];
          return {
            id: model.id,
            name: model.name,
            description: model.description || 'A beautiful AI character',
            imageUrl: firstImage.url,
            prompt: firstImage.meta?.prompt || 'beautiful character, high quality, detailed',
            negativePrompt: firstImage.meta?.negativePrompt || 'low quality, blurry, distorted',
            modelName: model.name,
            creator: model.creator?.username || 'Unknown',
            tags: model.tags || [],
          };
        })
        .slice(0, limit);

      return characters;
    } catch (error) {
      console.error('Error fetching character examples:', error);
      return [];
    }
  }

  static async searchModels(query: string, limit: number = 10): Promise<CivitAIModel[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${CIVITAI_BASE_URL}/models?limit=${limit}&query=${encodeURIComponent(query)}&nsfw=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error searching models:', error);
      return [];
    }
  }

  static async getModelById(id: number): Promise<CivitAIModel | null> {
    try {
      const response = await this.fetchWithTimeout(`${CIVITAI_BASE_URL}/models/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching model by ID:', error);
      return null;
    }
  }

  static async getModelImages(modelId: number, limit: number = 20): Promise<any[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${CIVITAI_BASE_URL}/models/${modelId}/images?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching model images:', error);
      return [];
    }
  }
}
