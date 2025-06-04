
/**
 * Bloom Filter Implementation for Duplicate Detection
 * Provides extremely fast duplicate checking with minimal memory usage
 */
export class BloomFilter {
  private bitArray: Uint8Array;
  private size: number;
  private hashFunctions: number;

  constructor(expectedItems: number, falsePositiveRate: number = 0.01) {
    // Calculate optimal size and hash functions
    this.size = Math.ceil(-expectedItems * Math.log(falsePositiveRate) / (Math.log(2) ** 2));
    this.hashFunctions = Math.ceil((this.size / expectedItems) * Math.log(2));
    
    // Initialize bit array
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8));
    
    console.log(`🔍 Bloom filter initialized: ${this.size} bits, ${this.hashFunctions} hash functions`);
  }

  /**
   * Add item to filter
   */
  add(item: string): void {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      const index = hash % this.size;
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      this.bitArray[byteIndex] |= (1 << bitIndex);
    }
  }

  /**
   * Test if item might be in the set
   */
  test(item: string): boolean {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      const index = hash % this.size;
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      if ((this.bitArray[byteIndex] & (1 << bitIndex)) === 0) {
        return false; // Definitely not in set
      }
    }
    return true; // Might be in set
  }

  /**
   * Generate hash values for an item
   */
  private getHashes(item: string): number[] {
    const hashes: number[] = [];
    const hash1 = this.djb2Hash(item);
    const hash2 = this.fnvHash(item);

    for (let i = 0; i < this.hashFunctions; i++) {
      hashes.push(Math.abs(hash1 + i * hash2));
    }

    return hashes;
  }

  /**
   * DJB2 hash function
   */
  private djb2Hash(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash;
  }

  /**
   * FNV hash function
   */
  private fnvHash(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash *= 16777619;
    }
    return hash;
  }

  /**
   * Get memory usage in bytes
   */
  getMemoryUsage(): number {
    return this.bitArray.length;
  }

  /**
   * Clear the filter
   */
  clear(): void {
    this.bitArray.fill(0);
  }
}
