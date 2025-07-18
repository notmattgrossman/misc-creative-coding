// Enhanced ML Orbital Predictor for ISS
// Uses proper train/test methodology with historical data
// Enhanced with spatial curve analysis and pattern recognition

class OrbitalPredictor {
    constructor() {
        this.data = [];
        this.predictions = [];
        this.predictionHistory = []; // Store predictions and their actual outcomes
        this.accuracy = 0;
        this.confidence = 'Low';
        
        // Orbital parameters for ISS
        this.ORBITAL_PERIOD = 93 * 60; // 93 minutes in seconds
        this.EARTH_RADIUS = 6371; // km
        this.ISS_ALTITUDE = 408; // average km
        this.ORBITAL_VELOCITY = 27600; // km/h
        
        // Model weights that will be learned
        this.modelWeights = {
            velocityWeight: 0.25,
            accelerationWeight: 0.15,
            physicsWeight: 0.35,
            curvatureWeight: 0.15,      // New: spatial curvature influence
            patternWeight: 0.10         // New: orbital pattern recognition
        };
        
        this.learningRate = 0.01;
        
        // Debug logging function (can be overridden)
        this.debugLog = null;
    }

    setDebugLogger(logFunction) {
        this.debugLog = logFunction;
    }

    log(level, message, data = null) {
        if (this.debugLog) {
            this.debugLog(level, message, data);
        }
    }

    addDataPoint(issData) {
        const dataPoint = {
            latitude: issData.latitude,
            longitude: issData.longitude,
            altitude: issData.altitude,
            velocity: issData.velocity,
            timestamp: Date.now()
        };
        
        // If we have enough data, make a prediction for this new point first
        if (this.data.length >= 3) {
            this.log('INFO', 'Making prediction for validation...');
            const prediction = this.predictNextPosition();
            
            if (prediction) {
                // Calculate prediction error
                const error = this.calculatePredictionError(prediction, dataPoint);
                
                this.log('INFO', 'Prediction vs Actual comparison', {
                    predicted: {
                        lat: prediction.latitude.toFixed(4),
                        lon: prediction.longitude.toFixed(4)
                    },
                    actual: {
                        lat: dataPoint.latitude.toFixed(4),
                        lon: dataPoint.longitude.toFixed(4)
                    },
                    error: error.toFixed(4) + '°'
                });
                
                // Store the prediction and actual outcome for accuracy calculation
                this.predictionHistory.push({
                    predicted: prediction,
                    actual: dataPoint,
                    timestamp: dataPoint.timestamp,
                    error: error
                });
                
                // Keep only recent prediction history (last 50 predictions)
                if (this.predictionHistory.length > 50) {
                    this.predictionHistory.shift();
                }
                
                // Update accuracy based on this new prediction vs actual
                this.updateAccuracyFromPredictions();
            }
        }
        
        this.data.push(dataPoint);
        
        // Keep only last 100 data points for efficiency
        if (this.data.length > 100) {
            this.data.shift();
        }
        
        // Train the model with new data
        this.trainModel();
    }

    calculateVelocity(point1, point2) {
        const deltaTime = (point2.timestamp - point1.timestamp) / 1000; // seconds
        if (deltaTime === 0) return { lat: 0, lon: 0 };
        
        const deltaLat = point2.latitude - point1.latitude;
        let deltaLon = point2.longitude - point1.longitude;
        
        // Handle longitude wraparound
        if (deltaLon > 180) deltaLon -= 360;
        if (deltaLon < -180) deltaLon += 360;
        
        const velocity = {
            lat: deltaLat / deltaTime,
            lon: deltaLon / deltaTime,
            deltaTime: deltaTime
        };
        
        this.log('INFO', 'Velocity calculated', {
            deltaTime: deltaTime.toFixed(1) + 's',
            lat_vel: velocity.lat.toFixed(6) + '°/s',
            lon_vel: velocity.lon.toFixed(6) + '°/s'
        });
        
        return velocity;
    }

    calculateAcceleration(vel1, vel2, deltaTime) {
        if (deltaTime === 0) return { lat: 0, lon: 0 };
        
        const acceleration = {
            lat: (vel2.lat - vel1.lat) / deltaTime,
            lon: (vel2.lon - vel1.lon) / deltaTime
        };
        
        this.log('INFO', 'Acceleration calculated', {
            lat_accel: acceleration.lat.toFixed(8) + '°/s²',
            lon_accel: acceleration.lon.toFixed(8) + '°/s²'
        });
        
        return acceleration;
    }

    physicsBasedComponent(current, timeAhead) {
        // Simplified orbital mechanics
        const earthRotationRate = 360 / (24 * 3600); // degrees per second
        const orbitalRate = 360 / this.ORBITAL_PERIOD; // degrees per second
        const relativeRate = orbitalRate - earthRotationRate;
        
        let newLon = current.longitude + (relativeRate * timeAhead);
        while (newLon > 180) newLon -= 360;
        while (newLon < -180) newLon += 360;
        
        // Simple latitude oscillation based on inclination
        const phase = (current.timestamp / 1000) * (2 * Math.PI / this.ORBITAL_PERIOD);
        const futurePhase = phase + (timeAhead * 2 * Math.PI / this.ORBITAL_PERIOD);
        const latOscillation = Math.sin(futurePhase) * 51.6;
        
        const result = {
            latitude: latOscillation,
            longitude: newLon
        };
        
        this.log('INFO', 'Physics prediction computed', {
            orbital_rate: orbitalRate.toFixed(6) + '°/s',
            earth_rate: earthRotationRate.toFixed(6) + '°/s',
            relative_rate: relativeRate.toFixed(6) + '°/s',
            predicted: {
                lat: result.latitude.toFixed(4),
                lon: result.longitude.toFixed(4)
            }
        });
        
        return result;
    }

    predictNextPosition() {
        if (this.data.length < 3) return null;
        
        const current = this.data[this.data.length - 1];
        const prev1 = this.data[this.data.length - 2];
        const prev2 = this.data[this.data.length - 3];
        
        this.log('INFO', 'Starting prediction calculation with 3 data points');
        this.log('INFO', 'Input data points', {
            current: { lat: current.latitude.toFixed(4), lon: current.longitude.toFixed(4), time: new Date(current.timestamp).toLocaleTimeString() },
            prev1: { lat: prev1.latitude.toFixed(4), lon: prev1.longitude.toFixed(4), time: new Date(prev1.timestamp).toLocaleTimeString() },
            prev2: { lat: prev2.latitude.toFixed(4), lon: prev2.longitude.toFixed(4), time: new Date(prev2.timestamp).toLocaleTimeString() }
        });
        
        // Calculate velocities
        const vel1 = this.calculateVelocity(prev2, prev1);
        const vel2 = this.calculateVelocity(prev1, current);
        
        // Calculate acceleration
        const accel = this.calculateAcceleration(vel1, vel2, vel2.deltaTime);
        
        // Predict time step (assume similar to last interval)
        const timeStep = (current.timestamp - prev1.timestamp) / 1000;
        this.log('INFO', 'Time step calculated', { time_step: timeStep.toFixed(1) + 's' });
        
        // Velocity-based prediction
        const velocityPred = {
            latitude: current.latitude + (vel2.lat * timeStep),
            longitude: current.longitude + (vel2.lon * timeStep)
        };
        this.log('INFO', 'Velocity-based prediction', {
            base_lat: current.latitude.toFixed(4),
            base_lon: current.longitude.toFixed(4),
            vel_contribution_lat: (vel2.lat * timeStep).toFixed(6),
            vel_contribution_lon: (vel2.lon * timeStep).toFixed(6),
            result: {
                lat: velocityPred.latitude.toFixed(4),
                lon: velocityPred.longitude.toFixed(4)
            }
        });
        
        // Acceleration-based prediction
        const accelPred = {
            latitude: velocityPred.latitude + (0.5 * accel.lat * timeStep * timeStep),
            longitude: velocityPred.longitude + (0.5 * accel.lon * timeStep * timeStep)
        };
        this.log('INFO', 'Acceleration-based prediction', {
            vel_base_lat: velocityPred.latitude.toFixed(4),
            vel_base_lon: velocityPred.longitude.toFixed(4),
            accel_contribution_lat: (0.5 * accel.lat * timeStep * timeStep).toFixed(6),
            accel_contribution_lon: (0.5 * accel.lon * timeStep * timeStep).toFixed(6),
            result: {
                lat: accelPred.latitude.toFixed(4),
                lon: accelPred.longitude.toFixed(4)
            }
        });
        
        // Physics-based prediction
        const physicsPred = this.physicsBasedComponent(current, timeStep);
        
        // NEW: Spatial curve analysis prediction
        let spatialPred = null;
        let smoothingFactor = 0.8; // Default smoothing
        if (this.data.length >= 4) {
            this.log('INFO', 'Computing spatial curve prediction...');
            spatialPred = this.spatialPredictComponent(this.data, timeStep, smoothingFactor);
            if (spatialPred) {
                this.log('SUCCESS', 'Spatial curve prediction computed', {
                    spatial: {
                        lat: spatialPred.latitude.toFixed(4),
                        lon: spatialPred.longitude.toFixed(4),
                        confidence: spatialPred.confidence.toFixed(3)
                    }
                });
            }
        } else {
            this.log('WARNING', 'Insufficient data for spatial curve analysis (need 4+ points)');
        }
        
        this.log('INFO', 'All component predictions calculated', {
            velocity: {
                lat: velocityPred.latitude.toFixed(4),
                lon: velocityPred.longitude.toFixed(4)
            },
            acceleration: {
                lat: accelPred.latitude.toFixed(4),
                lon: accelPred.longitude.toFixed(4)
            },
            physics: {
                lat: physicsPred.latitude.toFixed(4),
                lon: physicsPred.longitude.toFixed(4)
            },
            spatial: spatialPred ? {
                lat: spatialPred.latitude.toFixed(4),
                lon: spatialPred.longitude.toFixed(4)
            } : 'Not computed'
        });
        
        // Combine predictions using learned weights
        let finalPred = {
            latitude: (velocityPred.latitude * this.modelWeights.velocityWeight) +
                     (accelPred.latitude * this.modelWeights.accelerationWeight) +
                     (physicsPred.latitude * this.modelWeights.physicsWeight),
            longitude: (velocityPred.longitude * this.modelWeights.velocityWeight) +
                      (accelPred.longitude * this.modelWeights.accelerationWeight) +
                      (physicsPred.longitude * this.modelWeights.physicsWeight),
            altitude: current.altitude // Assume altitude stays relatively constant
        };
        
        // Add spatial prediction if available
        if (spatialPred) {
            this.log('INFO', 'Integrating spatial prediction', {
                before_spatial: {
                    lat: finalPred.latitude.toFixed(4),
                    lon: finalPred.longitude.toFixed(4)
                },
                spatial_contribution: {
                    lat: (spatialPred.latitude * this.modelWeights.curvatureWeight).toFixed(6),
                    lon: (spatialPred.longitude * this.modelWeights.curvatureWeight).toFixed(6)
                },
                weights: {
                    curvature: this.modelWeights.curvatureWeight.toFixed(3),
                    pattern: this.modelWeights.patternWeight.toFixed(3)
                }
            });
            
            finalPred.latitude += (spatialPred.latitude * this.modelWeights.curvatureWeight);
            finalPred.longitude += (spatialPred.longitude * this.modelWeights.curvatureWeight);
        }
        
        this.log('INFO', 'Weight application breakdown', {
            velocity_contribution: {
                lat: (velocityPred.latitude * this.modelWeights.velocityWeight).toFixed(6),
                lon: (velocityPred.longitude * this.modelWeights.velocityWeight).toFixed(6),
                weight: this.modelWeights.velocityWeight.toFixed(3)
            },
            acceleration_contribution: {
                lat: (accelPred.latitude * this.modelWeights.accelerationWeight).toFixed(6),
                lon: (accelPred.longitude * this.modelWeights.accelerationWeight).toFixed(6),
                weight: this.modelWeights.accelerationWeight.toFixed(3)
            },
            physics_contribution: {
                lat: (physicsPred.latitude * this.modelWeights.physicsWeight).toFixed(6),
                lon: (physicsPred.longitude * this.modelWeights.physicsWeight).toFixed(6),
                weight: this.modelWeights.physicsWeight.toFixed(3)
            },
            spatial_contribution: spatialPred ? {
                lat: (spatialPred.latitude * this.modelWeights.curvatureWeight).toFixed(6),
                lon: (spatialPred.longitude * this.modelWeights.curvatureWeight).toFixed(6),
                weight: this.modelWeights.curvatureWeight.toFixed(3)
            } : 'Not available'
        });
        
        // Handle boundary conditions
        const beforeBoundaries = { ...finalPred };
        finalPred.latitude = Math.max(-90, Math.min(90, finalPred.latitude));
        let originalLon = finalPred.longitude;
        while (finalPred.longitude > 180) finalPred.longitude -= 360;
        while (finalPred.longitude < -180) finalPred.longitude += 360;
        
        if (beforeBoundaries.latitude !== finalPred.latitude || originalLon !== finalPred.longitude) {
            this.log('WARNING', 'Boundary corrections applied', {
                before: {
                    lat: beforeBoundaries.latitude.toFixed(4),
                    lon: originalLon.toFixed(4)
                },
                after: {
                    lat: finalPred.latitude.toFixed(4),
                    lon: finalPred.longitude.toFixed(4)
                }
            });
        }
        
        this.log('SUCCESS', 'Final prediction calculated', {
            total_weights_sum: (this.modelWeights.velocityWeight + this.modelWeights.accelerationWeight + 
                              this.modelWeights.physicsWeight + this.modelWeights.curvatureWeight + 
                              this.modelWeights.patternWeight).toFixed(3),
            active_weights: {
                velocity: this.modelWeights.velocityWeight.toFixed(3),
                acceleration: this.modelWeights.accelerationWeight.toFixed(3),
                physics: this.modelWeights.physicsWeight.toFixed(3),
                curvature: this.modelWeights.curvatureWeight.toFixed(3),
                pattern: this.modelWeights.patternWeight.toFixed(3)
            },
            final_position: {
                lat: finalPred.latitude.toFixed(4),
                lon: finalPred.longitude.toFixed(4),
                alt: finalPred.altitude.toFixed(1)
            },
            prediction_confidence: spatialPred ? spatialPred.confidence.toFixed(3) : 'N/A'
        });
        
        return finalPred;
    }

    calculatePredictionError(predicted, actual) {
        const latError = Math.abs(predicted.latitude - actual.latitude);
        let lonError = Math.abs(predicted.longitude - actual.longitude);
        
        // Handle longitude wraparound
        if (lonError > 180) lonError = 360 - lonError;
        
        // Calculate distance error in degrees
        const totalError = Math.sqrt(latError * latError + lonError * lonError);
        return totalError;
    }

    updateAccuracyFromPredictions() {
        if (this.predictionHistory.length < 3) {
            this.accuracy = 0;
            this.confidence = 'Low';
            return;
        }
        
        // Calculate average error from recent predictions
        const recentPredictions = this.predictionHistory.slice(-10); // Last 10 predictions
        let totalError = 0;
        
        recentPredictions.forEach(pred => {
            totalError += pred.error;
        });
        
        const avgError = totalError / recentPredictions.length;
        
        // Convert error to accuracy percentage
        // Error of 0.1 degrees = 90% accuracy, 0.5 degrees = 50% accuracy, etc.
        const newAccuracy = Math.max(0, Math.min(100, 100 - (avgError * 200)));
        
        this.log('INFO', 'Accuracy updated', {
            predictions_evaluated: recentPredictions.length,
            avg_error: avgError.toFixed(4) + '°',
            old_accuracy: this.accuracy.toFixed(1) + '%',
            new_accuracy: newAccuracy.toFixed(1) + '%'
        });
        
        this.accuracy = newAccuracy;
        
        // Set confidence based on accuracy and data amount
        const oldConfidence = this.confidence;
        if (this.accuracy > 70 && this.predictionHistory.length >= 10) {
            this.confidence = 'High';
        } else if (this.accuracy > 40 && this.predictionHistory.length >= 5) {
            this.confidence = 'Medium';
        } else {
            this.confidence = 'Low';
        }
        
        if (oldConfidence !== this.confidence) {
            this.log('INFO', `Confidence level changed: ${oldConfidence} → ${this.confidence}`);
        }
    }

    trainModel() {
        if (this.predictionHistory.length < 5) return;
        
        this.log('INFO', 'Starting model training cycle...');
        
        // Simple gradient descent to improve weights based on prediction errors
        const recentPredictions = this.predictionHistory.slice(-5);
        let avgError = 0;
        
        recentPredictions.forEach(pred => {
            avgError += pred.error;
        });
        avgError /= recentPredictions.length;
        
        this.log('INFO', 'Training data analysis', {
            recent_predictions: recentPredictions.length,
            avg_error: avgError.toFixed(4) + '°',
            error_threshold_high: '0.2°',
            error_threshold_low: '0.1°',
            individual_errors: recentPredictions.map(p => p.error.toFixed(4) + '°')
        });
        
        const oldWeights = { ...this.modelWeights };
        
        // Adjust weights based on performance (enhanced with spatial components)
        if (avgError > 0.2) { // If error is high, adjust weights
            this.log('WARNING', 'High error detected - adjusting weights towards physics and spatial analysis');
            
            // Increase physics and spatial weights if velocity/accel isn't working well
            this.modelWeights.physicsWeight = Math.min(0.5, this.modelWeights.physicsWeight + this.learningRate);
            this.modelWeights.curvatureWeight = Math.min(0.25, this.modelWeights.curvatureWeight + this.learningRate * 0.8);
            this.modelWeights.patternWeight = Math.min(0.15, this.modelWeights.patternWeight + this.learningRate * 0.6);
            
            this.modelWeights.velocityWeight = Math.max(0.1, this.modelWeights.velocityWeight - this.learningRate * 0.7);
            this.modelWeights.accelerationWeight = Math.max(0.05, this.modelWeights.accelerationWeight - this.learningRate * 0.5);
            
            this.log('INFO', 'Weight adjustments for high error', {
                physics_increase: (this.modelWeights.physicsWeight - oldWeights.physicsWeight).toFixed(4),
                curvature_increase: (this.modelWeights.curvatureWeight - oldWeights.curvatureWeight).toFixed(4),
                pattern_increase: (this.modelWeights.patternWeight - oldWeights.patternWeight).toFixed(4),
                velocity_decrease: (this.modelWeights.velocityWeight - oldWeights.velocityWeight).toFixed(4),
                acceleration_decrease: (this.modelWeights.accelerationWeight - oldWeights.accelerationWeight).toFixed(4)
            });
            
        } else if (avgError < 0.1) { // If doing well, trust learned patterns more
            this.log('SUCCESS', 'Low error detected - increasing trust in learned patterns');
            
            this.modelWeights.velocityWeight = Math.min(0.4, this.modelWeights.velocityWeight + this.learningRate * 0.6);
            this.modelWeights.curvatureWeight = Math.min(0.3, this.modelWeights.curvatureWeight + this.learningRate * 0.5);
            this.modelWeights.physicsWeight = Math.max(0.15, this.modelWeights.physicsWeight - this.learningRate * 0.4);
            
            this.log('INFO', 'Weight adjustments for low error', {
                velocity_increase: (this.modelWeights.velocityWeight - oldWeights.velocityWeight).toFixed(4),
                curvature_increase: (this.modelWeights.curvatureWeight - oldWeights.curvatureWeight).toFixed(4),
                physics_decrease: (this.modelWeights.physicsWeight - oldWeights.physicsWeight).toFixed(4)
            });
            
        } else {
            this.log('INFO', 'Error within normal range - no weight adjustments needed', {
                current_error: avgError.toFixed(4) + '°',
                acceptable_range: '0.1° - 0.2°'
            });
        }
        
        // Normalize weights to ensure they sum to 1.0
        const beforeNormalization = { ...this.modelWeights };
        const total = this.modelWeights.velocityWeight + this.modelWeights.accelerationWeight + 
                     this.modelWeights.physicsWeight + this.modelWeights.curvatureWeight + 
                     this.modelWeights.patternWeight;
        
        this.log('INFO', 'Weight normalization', {
            total_before: total.toFixed(4),
            should_be: '1.0000'
        });
        
        this.modelWeights.velocityWeight /= total;
        this.modelWeights.accelerationWeight /= total;
        this.modelWeights.physicsWeight /= total;
        this.modelWeights.curvatureWeight /= total;
        this.modelWeights.patternWeight /= total;
        
        const totalAfter = this.modelWeights.velocityWeight + this.modelWeights.accelerationWeight + 
                          this.modelWeights.physicsWeight + this.modelWeights.curvatureWeight + 
                          this.modelWeights.patternWeight;
        
        this.log('INFO', 'Post-normalization verification', {
            total_after: totalAfter.toFixed(4),
            normalization_factor: (1.0 / total).toFixed(4),
            weights_after_norm: {
                velocity: this.modelWeights.velocityWeight.toFixed(4),
                acceleration: this.modelWeights.accelerationWeight.toFixed(4),
                physics: this.modelWeights.physicsWeight.toFixed(4),
                curvature: this.modelWeights.curvatureWeight.toFixed(4),
                pattern: this.modelWeights.patternWeight.toFixed(4)
            }
        });
        
        // Log weight changes if significant
        const significantChange = 0.01;
        const weightChanged = Math.abs(oldWeights.velocityWeight - this.modelWeights.velocityWeight) > significantChange ||
                            Math.abs(oldWeights.accelerationWeight - this.modelWeights.accelerationWeight) > significantChange ||
                            Math.abs(oldWeights.physicsWeight - this.modelWeights.physicsWeight) > significantChange ||
                            Math.abs(oldWeights.curvatureWeight - this.modelWeights.curvatureWeight) > significantChange ||
                            Math.abs(oldWeights.patternWeight - this.modelWeights.patternWeight) > significantChange;
        
        if (weightChanged) {
            this.log('WARNING', 'Significant model weight changes detected', {
                threshold: significantChange.toFixed(3),
                avg_error: avgError.toFixed(4) + '°',
                learning_rate: this.learningRate.toFixed(3),
                changes: {
                    velocity: {
                        from: oldWeights.velocityWeight.toFixed(4),
                        to: this.modelWeights.velocityWeight.toFixed(4),
                        delta: (this.modelWeights.velocityWeight - oldWeights.velocityWeight).toFixed(4)
                    },
                    acceleration: {
                        from: oldWeights.accelerationWeight.toFixed(4),
                        to: this.modelWeights.accelerationWeight.toFixed(4),
                        delta: (this.modelWeights.accelerationWeight - oldWeights.accelerationWeight).toFixed(4)
                    },
                    physics: {
                        from: oldWeights.physicsWeight.toFixed(4),
                        to: this.modelWeights.physicsWeight.toFixed(4),
                        delta: (this.modelWeights.physicsWeight - oldWeights.physicsWeight).toFixed(4)
                    },
                    curvature: {
                        from: oldWeights.curvatureWeight.toFixed(4),
                        to: this.modelWeights.curvatureWeight.toFixed(4),
                        delta: (this.modelWeights.curvatureWeight - oldWeights.curvatureWeight).toFixed(4)
                    },
                    pattern: {
                        from: oldWeights.patternWeight.toFixed(4),
                        to: this.modelWeights.patternWeight.toFixed(4),
                        delta: (this.modelWeights.patternWeight - oldWeights.patternWeight).toFixed(4)
                    }
                }
            });
        } else {
            this.log('INFO', 'No significant weight changes - model is stable', {
                all_changes_below: significantChange.toFixed(3)
            });
        }
        
        this.log('SUCCESS', 'Model training cycle completed', {
            training_data_used: recentPredictions.length + ' predictions',
            avg_error: avgError.toFixed(4) + '°',
            weights_updated: weightChanged ? 'Yes' : 'No',
            final_weights: {
                velocity: this.modelWeights.velocityWeight.toFixed(4),
                acceleration: this.modelWeights.accelerationWeight.toFixed(4),
                physics: this.modelWeights.physicsWeight.toFixed(4),
                curvature: this.modelWeights.curvatureWeight.toFixed(4),
                pattern: this.modelWeights.patternWeight.toFixed(4)
            }
        });
    }

    predict(stepsAhead = 5, timeStepSeconds = 30) {
        if (this.data.length < 3) return [];
        
        this.log('INFO', `Starting multi-step prediction: ${stepsAhead} steps, ${timeStepSeconds}s intervals`);
        this.log('INFO', 'Initial prediction parameters', {
            total_data_points: this.data.length,
            prediction_steps: stepsAhead,
            time_step: timeStepSeconds + 's',
            starting_position: {
                lat: this.data[this.data.length - 1].latitude.toFixed(4),
                lon: this.data[this.data.length - 1].longitude.toFixed(4),
                alt: this.data[this.data.length - 1].altitude.toFixed(1),
                timestamp: new Date(this.data[this.data.length - 1].timestamp).toLocaleTimeString()
            }
        });
        
        const predictions = [];
        let currentData = {...this.data[this.data.length - 1]};
        
        for (let i = 0; i < stepsAhead; i++) {
            this.log('INFO', `Computing prediction step ${i + 1}/${stepsAhead}`, {
                current_position: {
                    lat: currentData.latitude.toFixed(4),
                    lon: currentData.longitude.toFixed(4),
                    time: new Date(currentData.timestamp).toLocaleTimeString()
                },
                confidence_decay: (1 - i * 0.1).toFixed(2)
            });
            
            // Create a temporary data array for this prediction
            const tempData = [...this.data.slice(-2), currentData];
            this.log('INFO', `Step ${i + 1}: Using ${tempData.length} data points for prediction`);
            
            // Use the same prediction logic as predictNextPosition
            const vel = this.calculateVelocity(tempData[tempData.length - 2], tempData[tempData.length - 1]);
            const physicsPred = this.physicsBasedComponent(currentData, timeStepSeconds);
            
            // NEW: Enhanced spatial prediction for multi-step
            let spatialPred = null;
            if (tempData.length >= 4 || (this.data.length >= 4 && i === 0)) {
                const dataForSpatial = i === 0 ? this.data : tempData;
                spatialPred = this.spatialPredictComponent(dataForSpatial, timeStepSeconds, 0.8);
                if (spatialPred) {
                    this.log('SUCCESS', `Step ${i + 1}: Spatial prediction computed`, {
                        spatial_lat: spatialPred.latitude.toFixed(4),
                        spatial_lon: spatialPred.longitude.toFixed(4),
                        spatial_confidence: spatialPred.confidence.toFixed(3)
                    });
                }
            } else {
                this.log('WARNING', `Step ${i + 1}: Insufficient data for spatial prediction`);
            }
            
            // Combine predictions using current model weights
            let nextPred = {
                latitude: (currentData.latitude + (vel.lat * timeStepSeconds)) * this.modelWeights.velocityWeight +
                         (physicsPred.latitude * this.modelWeights.physicsWeight),
                longitude: (currentData.longitude + (vel.lon * timeStepSeconds)) * this.modelWeights.velocityWeight +
                          (physicsPred.longitude * this.modelWeights.physicsWeight),
                altitude: currentData.altitude,
                confidence: Math.max(0.3, this.accuracy / 100 * (1 - i * 0.1))
            };
            
            // Add spatial prediction if available
            if (spatialPred) {
                this.log('INFO', `Step ${i + 1}: Integrating spatial prediction`, {
                    before_spatial: {
                        lat: nextPred.latitude.toFixed(4),
                        lon: nextPred.longitude.toFixed(4)
                    },
                    spatial_weight: this.modelWeights.curvatureWeight.toFixed(3)
                });
                
                nextPred.latitude += spatialPred.latitude * this.modelWeights.curvatureWeight;
                nextPred.longitude += spatialPred.longitude * this.modelWeights.curvatureWeight;
                
                // Update confidence based on spatial confidence
                nextPred.confidence = Math.min(nextPred.confidence, spatialPred.confidence * (1 - i * 0.05));
            }
            
            this.log('INFO', `Step ${i + 1}: Component contributions`, {
                velocity_component: {
                    lat_contribution: ((currentData.latitude + (vel.lat * timeStepSeconds)) * this.modelWeights.velocityWeight).toFixed(6),
                    lon_contribution: ((currentData.longitude + (vel.lon * timeStepSeconds)) * this.modelWeights.velocityWeight).toFixed(6),
                    weight: this.modelWeights.velocityWeight.toFixed(3)
                },
                physics_component: {
                    lat_contribution: (physicsPred.latitude * this.modelWeights.physicsWeight).toFixed(6),
                    lon_contribution: (physicsPred.longitude * this.modelWeights.physicsWeight).toFixed(6),
                    weight: this.modelWeights.physicsWeight.toFixed(3)
                },
                spatial_component: spatialPred ? {
                    lat_contribution: (spatialPred.latitude * this.modelWeights.curvatureWeight).toFixed(6),
                    lon_contribution: (spatialPred.longitude * this.modelWeights.curvatureWeight).toFixed(6),
                    weight: this.modelWeights.curvatureWeight.toFixed(3)
                } : 'Not available'
            });
            
            // Handle boundaries
            const beforeBoundaries = { ...nextPred };
            nextPred.latitude = Math.max(-90, Math.min(90, nextPred.latitude));
            let originalLon = nextPred.longitude;
            while (nextPred.longitude > 180) nextPred.longitude -= 360;
            while (nextPred.longitude < -180) nextPred.longitude += 360;
            
            if (beforeBoundaries.latitude !== nextPred.latitude || originalLon !== nextPred.longitude) {
                this.log('WARNING', `Step ${i + 1}: Boundary corrections applied`, {
                    before: {
                        lat: beforeBoundaries.latitude.toFixed(4),
                        lon: originalLon.toFixed(4)
                    },
                    after: {
                        lat: nextPred.latitude.toFixed(4),
                        lon: nextPred.longitude.toFixed(4)
                    }
                });
            }
            
            this.log('SUCCESS', `Step ${i + 1}: Prediction completed`, {
                predicted_position: {
                    lat: nextPred.latitude.toFixed(4),
                    lon: nextPred.longitude.toFixed(4),
                    alt: nextPred.altitude.toFixed(1)
                },
                final_confidence: nextPred.confidence.toFixed(3),
                time_ahead: ((i + 1) * timeStepSeconds) + 's',
                future_timestamp: new Date(currentData.timestamp + (timeStepSeconds * 1000)).toLocaleTimeString()
            });
            
            predictions.push(nextPred);
            
            // Update current data for next iteration
            currentData = {
                ...nextPred,
                timestamp: currentData.timestamp + (timeStepSeconds * 1000)
            };
            
            this.log('INFO', `Step ${i + 1}: Updated current data for next iteration`, {
                next_iteration_base: {
                    lat: currentData.latitude.toFixed(4),
                    lon: currentData.longitude.toFixed(4),
                    timestamp: new Date(currentData.timestamp).toLocaleTimeString()
                }
            });
        }
        
        this.predictions = predictions;
        
        this.log('SUCCESS', 'Multi-step prediction sequence completed', {
            total_predictions: predictions.length,
            confidence_range: {
                highest: Math.max(...predictions.map(p => p.confidence)).toFixed(3),
                lowest: Math.min(...predictions.map(p => p.confidence)).toFixed(3)
            },
            position_range: {
                lat_min: Math.min(...predictions.map(p => p.latitude)).toFixed(4),
                lat_max: Math.max(...predictions.map(p => p.latitude)).toFixed(4),
                lon_min: Math.min(...predictions.map(p => p.longitude)).toFixed(4),
                lon_max: Math.max(...predictions.map(p => p.longitude)).toFixed(4)
            },
            total_time_span: (stepsAhead * timeStepSeconds) + 's',
            final_position: {
                lat: predictions[predictions.length - 1].latitude.toFixed(4),
                lon: predictions[predictions.length - 1].longitude.toFixed(4)
            }
        });
        
        return predictions;
    }

    getStats() {
        return {
            dataPoints: this.data.length,
            accuracy: Math.round(this.accuracy),
            confidence: this.confidence,
            nextPosition: this.predictions.length > 0 ? 
                `${this.predictions[0].latitude.toFixed(2)}°, ${this.predictions[0].longitude.toFixed(2)}°` : 
                'Learning...',
            progress: Math.min(100, Math.max(5, (this.predictionHistory.length / 20) * 100)), // Based on predictions made
            predictionsMade: this.predictionHistory.length
        };
    }

    // New: Calculate orbital curvature from position points
    calculateOrbitalCurvature(p1, p2, p3) {
        // Convert lat/lon to vectors for curvature calculation
        const v1 = [p2.longitude - p1.longitude, p2.latitude - p1.latitude];
        const v2 = [p3.longitude - p2.longitude, p3.latitude - p2.latitude];
        
        // Handle longitude wraparound
        if (v1[0] > 180) v1[0] -= 360;
        if (v1[0] < -180) v1[0] += 360;
        if (v2[0] > 180) v2[0] -= 360;
        if (v2[0] < -180) v2[0] += 360;
        
        // Cross product for 2D vectors (orbital curvature direction)
        const cross = v1[0] * v2[1] - v1[1] * v2[0];
        
        // Magnitudes
        const mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        const mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
        
        if (mag1 === 0 || mag2 === 0) return 0;
        
        // Curvature formula - keeping the sign for orbital direction
        const avgMag = (mag1 + mag2) / 2;
        const curvature = cross / (avgMag * avgMag * avgMag);
        
        return curvature;
    }

    // New: Get recent orbital curvatures for pattern analysis
    getRecentOrbitalCurvatures(points, window = 5) {
        const curvatures = [];
        const startIdx = Math.max(0, points.length - window);
        
        for (let i = startIdx; i < points.length - 2; i++) {
            const curvature = this.calculateOrbitalCurvature(points[i], points[i + 1], points[i + 2]);
            curvatures.push(curvature);
        }
        
        return curvatures;
    }

    // New: Analyze global orbital patterns and trends
    analyzeOrbitalTrend(points, window) {
        if (points.length < 4) return null;
        
        const analysisPoints = points.slice(-Math.min(window, points.length));
        if (analysisPoints.length < 4) return null;
        
        // Calculate overall orbital direction trend
        const firstPoint = analysisPoints[0];
        const lastPoint = analysisPoints[analysisPoints.length - 1];
        let globalDirection = [
            lastPoint.longitude - firstPoint.longitude,
            lastPoint.latitude - firstPoint.latitude
        ];
        
        // Handle longitude wraparound for global direction
        if (globalDirection[0] > 180) globalDirection[0] -= 360;
        if (globalDirection[0] < -180) globalDirection[0] += 360;
        
        // Calculate orbital path length and straightness
        let totalLength = 0;
        for (let i = 1; i < analysisPoints.length; i++) {
            let dLon = analysisPoints[i].longitude - analysisPoints[i-1].longitude;
            const dLat = analysisPoints[i].latitude - analysisPoints[i-1].latitude;
            
            // Handle longitude wraparound
            if (dLon > 180) dLon -= 360;
            if (dLon < -180) dLon += 360;
            
            totalLength += Math.sqrt(dLon * dLon + dLat * dLat);
        }
        
        const directLength = Math.sqrt(globalDirection[0] * globalDirection[0] + globalDirection[1] * globalDirection[1]);
        const straightness = directLength > 0 ? directLength / totalLength : 0;
        
        // Enhanced orbital curvature analysis
        const curvatures = [];
        const recentCurvatures = [];
        for (let i = 1; i < analysisPoints.length - 1; i++) {
            const curvature = this.calculateOrbitalCurvature(analysisPoints[i-1], analysisPoints[i], analysisPoints[i+1]);
            curvatures.push(curvature);
            
            // Store recent curvatures (last 30% of points)
            if (i >= analysisPoints.length * 0.7) {
                recentCurvatures.push(curvature);
            }
        }
        
        // Calculate curvature statistics
        const avgCurvature = curvatures.length > 0 ? 
            curvatures.reduce((sum, c) => sum + c, 0) / curvatures.length : 0;
        
        const recentAvgCurvature = recentCurvatures.length > 0 ?
            recentCurvatures.reduce((sum, c) => sum + c, 0) / recentCurvatures.length : avgCurvature;
        
        // Analyze curvature trend (orbital evolution)
        let curvatureTrend = 0;
        if (curvatures.length > 4) {
            const firstHalf = curvatures.slice(0, Math.floor(curvatures.length / 2));
            const secondHalf = curvatures.slice(Math.floor(curvatures.length / 2));
            
            const firstAvg = firstHalf.reduce((sum, c) => sum + Math.abs(c), 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, c) => sum + Math.abs(c), 0) / secondHalf.length;
            
            curvatureTrend = secondAvg - firstAvg; // Positive = orbit getting more curved
        }
        
        // Calculate average orbital step size
        const stepSizes = [];
        for (let i = 1; i < analysisPoints.length; i++) {
            let dLon = analysisPoints[i].longitude - analysisPoints[i-1].longitude;
            const dLat = analysisPoints[i].latitude - analysisPoints[i-1].latitude;
            
            if (dLon > 180) dLon -= 360;
            if (dLon < -180) dLon += 360;
            
            stepSizes.push(Math.sqrt(dLon * dLon + dLat * dLat));
        }
        
        const avgStepSize = stepSizes.length > 0 ? 
            stepSizes.reduce((sum, s) => sum + s, 0) / stepSizes.length : 0.01;
        
        // Enhanced orbital pattern detection (inclination changes, etc.)
        let orbitalPattern = 0;
        if (analysisPoints.length > 6) {
            // Detect latitude oscillation patterns (inclination effects)
            const latitudes = analysisPoints.map(p => p.latitude);
            let latOscillation = 0;
            
            for (let i = 2; i < latitudes.length; i++) {
                const trend1 = latitudes[i-1] - latitudes[i-2];
                const trend2 = latitudes[i] - latitudes[i-1];
                if (trend1 * trend2 < 0) { // Direction change
                    latOscillation++;
                }
            }
            
            orbitalPattern = latOscillation / (latitudes.length - 2);
        }
        
        return {
            globalDirection,
            straightness,
            avgCurvature,
            recentAvgCurvature,
            curvatureTrend,
            avgStepSize,
            orbitalPattern,
            pathLength: totalLength,
            analysisPoints: analysisPoints.length
        };
    }

    // New: Enhanced spatial prediction using curve analysis
    spatialPredictComponent(recentPoints, timeStep, smoothingFactor) {
        if (recentPoints.length < 4) return null;
        
        const historyWindow = Math.min(15, recentPoints.length); // Use last 15 points
        const globalAnalysis = this.analyzeOrbitalTrend(recentPoints, historyWindow);
        
        if (!globalAnalysis) return null;
        
        // Calculate local curvature trend
        const curvatures = this.getRecentOrbitalCurvatures(recentPoints, Math.min(6, recentPoints.length));
        let localCurvature = 0;
        if (curvatures.length > 0) {
            localCurvature = curvatures.reduce((sum, c) => sum + c, 0) / curvatures.length;
        }
        
        // Blend local and global curvature
        let blendedCurvature = localCurvature;
        if (globalAnalysis) {
            const localWeight = Math.max(0.7, 1 - globalAnalysis.straightness);
            blendedCurvature = localCurvature * localWeight + globalAnalysis.recentAvgCurvature * (1 - localWeight);
            
            // Amplify if curvature is increasing (orbital changes)
            if (globalAnalysis.curvatureTrend > 0) {
                blendedCurvature *= (1 + globalAnalysis.curvatureTrend * 2);
            }
        }
        
        // Calculate initial orbital direction
        const lastPoint = recentPoints[recentPoints.length - 1];
        const prevPoint = recentPoints[recentPoints.length - 2];
        
        let initialDirection = [1, 0]; // Default eastward
        let dLon = lastPoint.longitude - prevPoint.longitude;
        const dLat = lastPoint.latitude - prevPoint.latitude;
        
        // Handle longitude wraparound
        if (dLon > 180) dLon -= 360;
        if (dLon < -180) dLon += 360;
        
        const length = Math.sqrt(dLon * dLon + dLat * dLat);
        if (length > 0) {
            initialDirection = [dLon / length, dLat / length];
        }
        
        // Apply spatial curvature to predict orbital curve
        let currentDirection = [...initialDirection];
        let predCurvature = blendedCurvature;
        
        // Convert time step to orbital degrees (rough approximation)
        const degreeStepSize = globalAnalysis.avgStepSize * smoothingFactor;
        
        // Apply curvature influence
        if (Math.abs(predCurvature) > 0.0001) {
            const currentAngle = Math.atan2(currentDirection[1], currentDirection[0]);
            
            // Apply orbital curvature (inverted for correct direction)
            const curvatureEffect = -predCurvature * smoothingFactor * 0.15;
            const newAngle = currentAngle + curvatureEffect;
            
            // Update direction based on curvature
            const newDirection = [Math.cos(newAngle), Math.sin(newAngle)];
            
            // Blend with current direction
            const blendFactor = Math.min(0.8, Math.abs(predCurvature) * 15);
            currentDirection[0] = currentDirection[0] * (1 - blendFactor) + newDirection[0] * blendFactor;
            currentDirection[1] = currentDirection[1] * (1 - blendFactor) + newDirection[1] * blendFactor;
        }
        
        // Apply orbital pattern influence
        if (globalAnalysis.orbitalPattern > 0.3) {
            const currentAngle = Math.atan2(currentDirection[1], currentDirection[0]);
            const patternAngleChange = -globalAnalysis.orbitalPattern * 0.4 * smoothingFactor;
            const newAngle = currentAngle + patternAngleChange;
            
            const patternWeight = Math.min(0.6, globalAnalysis.orbitalPattern * 1.5);
            const patternDirection = [Math.cos(newAngle), Math.sin(newAngle)];
            currentDirection[0] = currentDirection[0] * (1 - patternWeight) + patternDirection[0] * patternWeight;
            currentDirection[1] = currentDirection[1] * (1 - patternWeight) + patternDirection[1] * patternWeight;
        }
        
        // Normalize direction
        const dirLength = Math.sqrt(currentDirection[0] * currentDirection[0] + currentDirection[1] * currentDirection[1]);
        if (dirLength > 0) {
            currentDirection[0] /= dirLength;
            currentDirection[1] /= dirLength;
        }
        
        // Calculate predicted position
        const predictedLon = lastPoint.longitude + (currentDirection[0] * degreeStepSize);
        const predictedLat = lastPoint.latitude + (currentDirection[1] * degreeStepSize);
        
        // Handle longitude wraparound
        let finalLon = predictedLon;
        while (finalLon > 180) finalLon -= 360;
        while (finalLon < -180) finalLon += 360;
        
        // Constrain latitude
        const finalLat = Math.max(-90, Math.min(90, predictedLat));
        
        this.log('INFO', 'Spatial prediction computed', {
            curvature: blendedCurvature.toFixed(6),
            pattern_factor: globalAnalysis.orbitalPattern.toFixed(3),
            direction: {
                lon: currentDirection[0].toFixed(4),
                lat: currentDirection[1].toFixed(4)
            },
            predicted: {
                lat: finalLat.toFixed(4),
                lon: finalLon.toFixed(4)
            }
        });
        
        return {
            latitude: finalLat,
            longitude: finalLon,
            confidence: Math.min(1.0, globalAnalysis.straightness + 0.3)
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrbitalPredictor;
} else if (typeof window !== 'undefined') {
    window.OrbitalPredictor = OrbitalPredictor;
} 