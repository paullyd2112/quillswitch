import * as tf from '@tensorflow/tfjs';
import { ExtractedData, ExtractedField } from '@/services/migration/extractionService';

export interface MLQualityScore {
  overallScore: number; // 0-100
  dimensionScores: {
    completeness: number;    // How much data is filled
    consistency: number;     // Data format consistency
    uniqueness: number;      // Duplicate likelihood
    validity: number;        // Data format validity
    accuracy: number;        // Predicted data accuracy
  };
  confidence: number;        // ML model confidence
  features: number[];        // Raw feature vector
  predictions: {
    likelyDuplicate: number;   // 0-1 probability
    dataQualityIssues: string[];
    recommendedActions: string[];
  };
}

export interface MLFeatures {
  completenessRatio: number;
  fieldCount: number;
  avgFieldLength: number;
  numericFieldRatio: number;
  emailFieldsValid: number;
  phoneFieldsValid: number;
  dateFieldsValid: number;
  specialCharDensity: number;
  duplicateKeywordCount: number;
  inconsistentCasing: number;
}

/**
 * Machine Learning powered data quality assessment using TensorFlow.js
 */
export class MLQualityService {
  private qualityModel: tf.LayersModel | null = null;
  private isModelReady = false;

  constructor() {
    this.initializeModel();
  }

  /**
   * Create and train a simple neural network for quality assessment
   */
  private async initializeModel() {
    try {
      // Create a simple feedforward neural network
      this.qualityModel = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [10], // 10 feature inputs
            units: 16,
            activation: 'relu',
            name: 'hidden1'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 8,
            activation: 'relu',
            name: 'hidden2'
          }),
          tf.layers.dense({
            units: 5, // 5 quality dimensions
            activation: 'sigmoid',
            name: 'output'
          })
        ]
      });

      // Compile the model
      this.qualityModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });

      // Pre-train with synthetic data for bootstrapping
      await this.preTrainModel();
      
      this.isModelReady = true;
      console.log('ML Quality Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML model:', error);
      this.isModelReady = false;
    }
  }

  /**
   * Pre-train the model with synthetic quality data
   */
  private async preTrainModel() {
    if (!this.qualityModel) return;

    // Generate synthetic training data
    const trainingData = this.generateSyntheticTrainingData(1000);
    
    const xs = tf.tensor2d(trainingData.features);
    const ys = tf.tensor2d(trainingData.labels);

    try {
      // Train the model
      await this.qualityModel.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0
      });

      console.log('Model pre-training completed');
    } finally {
      xs.dispose();
      ys.dispose();
    }
  }

  /**
   * Generate synthetic training data for bootstrapping
   */
  private generateSyntheticTrainingData(samples: number): {
    features: number[][];
    labels: number[][];
  } {
    const features: number[][] = [];
    const labels: number[][] = [];

    for (let i = 0; i < samples; i++) {
      // Generate realistic feature combinations
      const completeness = Math.random();
      const fieldCount = Math.random() * 20 + 5;
      const avgLength = Math.random() * 50 + 10;
      const numericRatio = Math.random();
      const emailValid = Math.random();
      const phoneValid = Math.random();
      const dateValid = Math.random();
      const specialChars = Math.random() * 0.3;
      const duplicateKeywords = Math.random() * 5;
      const inconsistentCasing = Math.random() * 0.5;

      features.push([
        completeness,
        fieldCount / 25, // normalize
        avgLength / 60,  // normalize
        numericRatio,
        emailValid,
        phoneValid,
        dateValid,
        specialChars,
        duplicateKeywords / 5, // normalize
        inconsistentCasing
      ]);

      // Calculate quality scores based on features (synthetic ground truth)
      const completenessScore = completeness;
      const consistencyScore = 1 - (inconsistentCasing + specialChars) / 2;
      const uniquenessScore = 1 - duplicateKeywords / 5;
      const validityScore = (emailValid + phoneValid + dateValid) / 3;
      const accuracyScore = (completenessScore + consistencyScore + validityScore) / 3;

      labels.push([
        completenessScore,
        consistencyScore,
        uniquenessScore,
        validityScore,
        accuracyScore
      ]);
    }

    return { features, labels };
  }

  /**
   * Assess data quality using ML
   */
  async assessQuality(records: ExtractedData[]): Promise<MLQualityScore[]> {
    if (!this.isModelReady || !this.qualityModel) {
      console.warn('ML model not ready, falling back to rule-based scoring');
      return records.map(record => this.fallbackQualityScore(record));
    }

    const results: MLQualityScore[] = [];

    for (const record of records) {
      try {
        const features = this.extractFeatures(record);
        const score = await this.predictQuality(features);
        results.push(score);
      } catch (error) {
        console.error('Error assessing record quality:', error);
        results.push(this.fallbackQualityScore(record));
      }
    }

    return results;
  }

  /**
   * Extract ML features from a record
   */
  private extractFeatures(record: ExtractedData): MLFeatures {
    const fields = record.fields;
    const totalFields = fields.length;
    const filledFields = fields.filter(f => f.value && String(f.value).trim()).length;

    // Calculate various feature metrics
    const completenessRatio = totalFields > 0 ? filledFields / totalFields : 0;
    
    const fieldLengths = fields
      .filter(f => f.value)
      .map(f => String(f.value).length);
    const avgFieldLength = fieldLengths.length > 0 
      ? fieldLengths.reduce((sum, len) => sum + len, 0) / fieldLengths.length 
      : 0;

    const numericFields = fields.filter(f => 
      f.type === 'number' || (!isNaN(Number(f.value)) && f.value !== '')
    ).length;
    const numericFieldRatio = totalFields > 0 ? numericFields / totalFields : 0;

    // Email validation
    const emailFields = fields.filter(f => 
      f.name.toLowerCase().includes('email') && f.value
    );
    const validEmails = emailFields.filter(f => 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.value))
    ).length;
    const emailFieldsValid = emailFields.length > 0 ? validEmails / emailFields.length : 1;

    // Phone validation
    const phoneFields = fields.filter(f => 
      (f.name.toLowerCase().includes('phone') || f.name.toLowerCase().includes('tel')) && f.value
    );
    const validPhones = phoneFields.filter(f => 
      /^[\+]?[\s\d\-\(\)]{10,}$/.test(String(f.value))
    ).length;
    const phoneFieldsValid = phoneFields.length > 0 ? validPhones / phoneFields.length : 1;

    // Date validation
    const dateFields = fields.filter(f => 
      f.name.toLowerCase().includes('date') && f.value
    );
    const validDates = dateFields.filter(f => 
      !isNaN(new Date(String(f.value)).getTime())
    ).length;
    const dateFieldsValid = dateFields.length > 0 ? validDates / dateFields.length : 1;

    // Special character density
    const allText = fields.map(f => String(f.value || '')).join('');
    const specialChars = (allText.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const specialCharDensity = allText.length > 0 ? specialChars / allText.length : 0;

    // Duplicate keywords
    const duplicateKeywords = fields.filter(f => 
      String(f.value || '').toLowerCase().includes('duplicate') ||
      String(f.value || '').toLowerCase().includes('copy') ||
      String(f.value || '').toLowerCase().includes('test')
    ).length;

    // Inconsistent casing
    const textFields = fields.filter(f => f.type === 'string' && f.value);
    const inconsistentCasing = textFields.filter(f => {
      const str = String(f.value);
      return str !== str.toLowerCase() && str !== str.toUpperCase() && 
             str !== str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }).length;
    const inconsistentCasingRatio = textFields.length > 0 ? inconsistentCasing / textFields.length : 0;

    return {
      completenessRatio,
      fieldCount: totalFields,
      avgFieldLength,
      numericFieldRatio,
      emailFieldsValid,
      phoneFieldsValid,
      dateFieldsValid,
      specialCharDensity,
      duplicateKeywordCount: duplicateKeywords,
      inconsistentCasing: inconsistentCasingRatio
    };
  }

  /**
   * Predict quality using the trained model
   */
  private async predictQuality(features: MLFeatures): Promise<MLQualityScore> {
    if (!this.qualityModel) {
      throw new Error('Model not available');
    }

    // Convert features to tensor
    const featureVector = [
      features.completenessRatio,
      Math.min(features.fieldCount / 25, 1), // normalize
      Math.min(features.avgFieldLength / 60, 1), // normalize
      features.numericFieldRatio,
      features.emailFieldsValid,
      features.phoneFieldsValid,
      features.dateFieldsValid,
      Math.min(features.specialCharDensity, 1),
      Math.min(features.duplicateKeywordCount / 5, 1), // normalize
      features.inconsistentCasing
    ];

    const input = tf.tensor2d([featureVector]);
    
    try {
      const prediction = this.qualityModel.predict(input) as tf.Tensor;
      const scores = await prediction.data();

      // Extract dimension scores
      const dimensionScores = {
        completeness: Math.round(scores[0] * 100),
        consistency: Math.round(scores[1] * 100),
        uniqueness: Math.round(scores[2] * 100),
        validity: Math.round(scores[3] * 100),
        accuracy: Math.round(scores[4] * 100)
      };

      // Calculate overall score
      const overallScore = Math.round(
        (dimensionScores.completeness + 
         dimensionScores.consistency + 
         dimensionScores.uniqueness + 
         dimensionScores.validity + 
         dimensionScores.accuracy) / 5
      );

      // Generate predictions and recommendations
      const likelyDuplicate = features.duplicateKeywordCount > 0 ? 0.8 : 0.2;
      const dataQualityIssues: string[] = [];
      const recommendedActions: string[] = [];

      if (dimensionScores.completeness < 70) {
        dataQualityIssues.push('Low data completeness');
        recommendedActions.push('Fill missing required fields');
      }
      if (dimensionScores.consistency < 70) {
        dataQualityIssues.push('Data format inconsistencies');
        recommendedActions.push('Standardize data formats');
      }
      if (dimensionScores.validity < 70) {
        dataQualityIssues.push('Invalid data formats detected');
        recommendedActions.push('Validate and correct data formats');
      }

      return {
        overallScore,
        dimensionScores,
        confidence: 0.85, // Model confidence
        features: featureVector,
        predictions: {
          likelyDuplicate,
          dataQualityIssues,
          recommendedActions
        }
      };
    } finally {
      input.dispose();
    }
  }

  /**
   * Fallback quality scoring when ML model is not available
   */
  private fallbackQualityScore(record: ExtractedData): MLQualityScore {
    const features = this.extractFeatures(record);
    
    const dimensionScores = {
      completeness: Math.round(features.completenessRatio * 100),
      consistency: Math.round((1 - features.inconsistentCasing) * 100),
      uniqueness: Math.round((1 - Math.min(features.duplicateKeywordCount / 5, 1)) * 100),
      validity: Math.round((features.emailFieldsValid + features.phoneFieldsValid + features.dateFieldsValid) / 3 * 100),
      accuracy: Math.round(features.completenessRatio * 85) // Conservative estimate
    };

    const overallScore = Math.round(
      (dimensionScores.completeness + 
       dimensionScores.consistency + 
       dimensionScores.uniqueness + 
       dimensionScores.validity + 
       dimensionScores.accuracy) / 5
    );

    return {
      overallScore,
      dimensionScores,
      confidence: 0.6, // Lower confidence for rule-based
      features: Object.values(features).slice(0, 10),
      predictions: {
        likelyDuplicate: features.duplicateKeywordCount > 0 ? 0.7 : 0.3,
        dataQualityIssues: [],
        recommendedActions: []
      }
    };
  }

  /**
   * Train the model with actual user data (incremental learning)
   */
  async trainWithUserData(
    records: ExtractedData[], 
    qualityLabels: number[][]
  ): Promise<void> {
    if (!this.qualityModel || records.length !== qualityLabels.length) {
      console.warn('Cannot train model: invalid input or model not ready');
      return;
    }

    try {
      const features = records.map(record => {
        const f = this.extractFeatures(record);
        return [
          f.completenessRatio,
          Math.min(f.fieldCount / 25, 1),
          Math.min(f.avgFieldLength / 60, 1),
          f.numericFieldRatio,
          f.emailFieldsValid,
          f.phoneFieldsValid,
          f.dateFieldsValid,
          Math.min(f.specialCharDensity, 1),
          Math.min(f.duplicateKeywordCount / 5, 1),
          f.inconsistentCasing
        ];
      });

      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(qualityLabels);

      await this.qualityModel.fit(xs, ys, {
        epochs: 10,
        batchSize: 8,
        verbose: 0
      });

      console.log(`Model retrained with ${records.length} user samples`);
      
      xs.dispose();
      ys.dispose();
    } catch (error) {
      console.error('Error training model with user data:', error);
    }
  }

  /**
   * Get model performance metrics
   */
  getModelInfo(): {
    isReady: boolean;
    modelParams: number;
    memoryUsage: number;
  } {
    return {
      isReady: this.isModelReady,
      modelParams: this.qualityModel?.countParams() || 0,
      memoryUsage: tf.memory().numBytes
    };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.qualityModel) {
      this.qualityModel.dispose();
      this.qualityModel = null;
    }
    this.isModelReady = false;
  }
}

export const mlQualityService = new MLQualityService();