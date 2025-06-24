// Mock implementation for build time
let transformers = null;

// Try to import transformers, but provide a fallback if it fails
try {
  // This will only work in browser environment
  if (typeof window !== 'undefined') {
    // Dynamic import will be handled at runtime
  }
} catch (error) {
  // This is expected during build time
  console.log('Transformers not available during build time');
}

class ClientJobMatcherModel {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.loadingPromise = null;
    this.loadError = null;
    this.usingFallbackModel = false;
    this.transformers = null;
  }

  async loadModel() {
    if (this.isLoaded) {
      return this.model;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._loadModel();
    return this.loadingPromise;
  }

  async _loadModel() {
    try {
      console.log('Loading AI job matching model...');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Model loading is not supported in server-side environment');
      }
      
      // Dynamically import transformers only on client side
      if (!this.transformers) {
        try {
          this.transformers = await import('@xenova/transformers');
        } catch (importError) {
          console.log('Failed to import transformers:', importError.message);
          throw new Error('Transformers library not available');
        }
      }
      
      // Skip local model loading for now due to format compatibility issues
      // and go directly to the reliable fallback model
      console.log('Using pre-trained sentence transformer model for semantic matching...');
      
      this.model = await this.transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: false,
        progress_callback: (progress) => {
          console.log(`Loading AI model progress: ${Math.round(progress * 100)}%`);
        }
      });
      
      this.isLoaded = true;
      this.usingFallbackModel = true;
      this.loadError = null;
      console.log('AI sentence transformer model loaded successfully');
      return this.model;
    } catch (error) {
      console.error('Error loading AI model:', error);
      this.loadError = error.message;
      this.isLoaded = false;
      this.usingFallbackModel = false;
      throw error;
    }
  }

  async getEmbeddings(texts) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      // Ensure texts is an array
      const textArray = Array.isArray(texts) ? texts : [texts];
      
      // Get embeddings for all texts
      const embeddings = await Promise.all(
        textArray.map(async (text) => {
          const result = await this.model(text, {
            pooling: 'mean',
            normalize: true
          });
          return result.data;
        })
      );

      return embeddings;
    } catch (error) {
      console.error('Error getting embeddings:', error);
      throw error;
    }
  }

  async calculateSimilarity(text1, text2) {
    try {
      const [embedding1, embedding2] = await this.getEmbeddings([text1, text2]);
      
      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(embedding1, embedding2);
      return similarity;
    } catch (error) {
      console.error('Error calculating similarity:', error);
      throw error;
    }
  }

  cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  async findBestMatches(queryText, candidates, topK = 5) {
    try {
      const queryEmbedding = await this.getEmbeddings([queryText]);
      const candidateEmbeddings = await this.getEmbeddings(candidates.map(c => c.text));
      
      const similarities = candidateEmbeddings.map((embedding, index) => ({
        index,
        similarity: this.cosineSimilarity(queryEmbedding[0], embedding),
        candidate: candidates[index]
      }));
      
      // Sort by similarity and return top K
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
        .map(item => ({
          ...item.candidate,
          similarity: item.similarity,
          matchScore: Math.round(item.similarity * 100)
        }));
    } catch (error) {
      console.error('Error finding best matches:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isLoaded: this.isLoaded,
      loadError: this.loadError,
      usingFallbackModel: this.usingFallbackModel,
      message: this.isLoaded ? 
        'AI semantic matching model loaded successfully' : 
        this.loadError ? `Model loading failed: ${this.loadError}` : 
        'Model not loaded'
    };
  }
}

// Create a singleton instance
const clientJobMatcherModel = new ClientJobMatcherModel();

export default clientJobMatcherModel; 