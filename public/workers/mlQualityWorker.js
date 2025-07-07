// TensorFlow.js ML Quality Assessment Worker
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.15.0/dist/tf.min.js');

class MLQualityWorker {
  constructor() {
    this.qualityModel = null;
    this.isModelReady = false;
    this.initializeModel();
  }

  async initializeModel() {
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

      // Pre-train with synthetic data
      await this.preTrainModel();
      
      this.isModelReady = true;
      self.postMessage({ type: 'MODEL_READY' });
    } catch (error) {
      self.postMessage({ type: 'ERROR', error: error.message });
    }
  }

  async preTrainModel() {
    if (!this.qualityModel) return;

    // Generate synthetic training data
    const trainingData = this.generateSyntheticTrainingData(1000);
    
    const xs = tf.tensor2d(trainingData.features);
    const ys = tf.tensor2d(trainingData.labels);

    try {
      await this.qualityModel.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0
      });
    } finally {
      xs.dispose();
      ys.dispose();
    }
  }

  generateSyntheticTrainingData(samples) {
    const features = [];
    const labels = [];

    for (let i = 0; i < samples; i++) {
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
        fieldCount / 25,
        avgLength / 60,
        numericRatio,
        emailValid,
        phoneValid,
        dateValid,
        specialChars,
        duplicateKeywords / 5,
        inconsistentCasing
      ]);

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

  extractFeatures(record) {
    const fields = record.fields;
    const totalFields = fields.length;
    const filledFields = fields.filter(f => f.value && String(f.value).trim()).length;

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

  async predictQuality(features) {
    if (!this.qualityModel || !this.isModelReady) {
      throw new Error('Model not ready');
    }

    const featureVector = [
      features.completenessRatio,
      Math.min(features.fieldCount / 25, 1),
      Math.min(features.avgFieldLength / 60, 1),
      features.numericFieldRatio,
      features.emailFieldsValid,
      features.phoneFieldsValid,
      features.dateFieldsValid,
      Math.min(features.specialCharDensity, 1),
      Math.min(features.duplicateKeywordCount / 5, 1),
      features.inconsistentCasing
    ];

    const input = tf.tensor2d([featureVector]);
    
    try {
      const prediction = this.qualityModel.predict(input);
      const scores = await prediction.data();

      const dimensionScores = {
        completeness: Math.round(scores[0] * 100),
        consistency: Math.round(scores[1] * 100),
        uniqueness: Math.round(scores[2] * 100),
        validity: Math.round(scores[3] * 100),
        accuracy: Math.round(scores[4] * 100)
      };

      const overallScore = Math.round(
        (dimensionScores.completeness + 
         dimensionScores.consistency + 
         dimensionScores.uniqueness + 
         dimensionScores.validity + 
         dimensionScores.accuracy) / 5
      );

      const likelyDuplicate = features.duplicateKeywordCount > 0 ? 0.8 : 0.2;
      const dataQualityIssues = [];
      const recommendedActions = [];

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
        confidence: 0.85,
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

  async assessQuality(records) {
    const results = [];

    for (let i = 0; i < records.length; i++) {
      try {
        const features = this.extractFeatures(records[i]);
        const score = await this.predictQuality(features);
        results.push(score);
        
        // Send progress update
        if (i % 10 === 0) {
          self.postMessage({
            type: 'PROGRESS',
            processed: i + 1,
            total: records.length
          });
        }
      } catch (error) {
        results.push(this.fallbackQualityScore(records[i]));
      }
    }

    return results;
  }

  fallbackQualityScore(record) {
    const features = this.extractFeatures(record);
    
    const dimensionScores = {
      completeness: Math.round(features.completenessRatio * 100),
      consistency: Math.round((1 - features.inconsistentCasing) * 100),
      uniqueness: Math.round((1 - Math.min(features.duplicateKeywordCount / 5, 1)) * 100),
      validity: Math.round((features.emailFieldsValid + features.phoneFieldsValid + features.dateFieldsValid) / 3 * 100),
      accuracy: Math.round(features.completenessRatio * 85)
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
      confidence: 0.6,
      features: Object.values(features).slice(0, 10),
      predictions: {
        likelyDuplicate: features.duplicateKeywordCount > 0 ? 0.7 : 0.3,
        dataQualityIssues: [],
        recommendedActions: []
      }
    };
  }
}

const worker = new MLQualityWorker();

self.onmessage = async (event) => {
  const { type, data, id } = event.data;

  try {
    switch (type) {
      case 'ASSESS_QUALITY':
        if (!worker.isModelReady) {
          self.postMessage({ 
            id, 
            type: 'ERROR', 
            error: 'Model not ready yet' 
          });
          return;
        }
        
        const results = await worker.assessQuality(data.records);
        self.postMessage({ 
          id, 
          type: 'ASSESSMENT_COMPLETE', 
          results 
        });
        break;

      case 'GET_MODEL_INFO':
        self.postMessage({
          id,
          type: 'MODEL_INFO',
          info: {
            isReady: worker.isModelReady,
            modelParams: worker.qualityModel?.countParams() || 0,
            memoryUsage: tf.memory().numBytes
          }
        });
        break;

      default:
        self.postMessage({ 
          id, 
          type: 'ERROR', 
          error: 'Unknown message type' 
        });
    }
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'ERROR', 
      error: error.message 
    });
  }
};