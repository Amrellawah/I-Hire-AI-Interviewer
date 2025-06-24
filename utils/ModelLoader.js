import { pipeline, AutoTokenizer, AutoModel } from '@xenova/transformers';

class JobMatcherModel {
  constructor() {
    this.model = null;
    this.tokenizer = null;
    this.isLoaded = false;
    this.loadingPromise = null;
    this.loadError = null;
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
      console.log('Loading fine-tuned job matcher model...');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        // This is expected in server environment
        throw new Error('Model loading is not supported in server-side environment');
      }
      
      // Load the model from the local fine-tuned-job-matcher directory
      const modelPath = '/fine-tuned-job-matcher';
      
      // Create a custom pipeline for sentence similarity
      this.model = await pipeline('feature-extraction', modelPath, {
        quantized: false,
        progress_callback: (progress) => {
          console.log(`Loading progress: ${Math.round(progress * 100)}%`);
        }
      });

      this.isLoaded = true;
      this.loadError = null;
      console.log('Fine-tuned job matcher model loaded successfully');
      return this.model;
    } catch (error) {
      // This is expected behavior in server environment
      this.loadError = error.message;
      this.isLoaded = false;
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
      message: this.isLoaded ? 'Model loaded successfully' : 
               this.loadError ? `Model loading failed: ${this.loadError}` : 
               'Model not loaded'
    };
  }
}

// Create a singleton instance
const jobMatcherModel = new JobMatcherModel();

export default jobMatcherModel; 