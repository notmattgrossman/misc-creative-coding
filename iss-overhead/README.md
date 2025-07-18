# ISS Overhead Tracker with Enhanced Spatial Curve Prediction

A real-time International Space Station tracker with an experimental ML orbital predictor enhanced with spatial curve analysis algorithms.

## 🧪 Experimental Development Journey

### Phase 1: Spatial Curve Prediction Research (`testml.html`)

Created an interactive drawing canvas to experiment with advanced spatial curve prediction algorithms:

- **Problem**: Traditional ML predictions were too linear and jumpy
- **Solution**: Developed sophisticated spatial analysis algorithms:
  - ✅ **Curvature Detection**: Mathematical analysis of path curves using 3-point geometry
  - ✅ **Pattern Recognition**: Detection of spirals, loops, and consistent turning patterns  
  - ✅ **Global Trend Analysis**: Understanding overall trajectory from entire drawing history
  - ✅ **Temporal Smoothing**: Moving averages to eliminate prediction jumpiness
  - ✅ **Multi-Point History**: Analysis of entire drawing context (not just recent points)

**Key Breakthrough**: Removed time-based calculations, focusing purely on spatial relationships for more stable predictions.

### Phase 2: Integration with ISS Orbital Predictor (`ml-predictor.js`)

Applied the proven spatial curve algorithms to enhance orbital predictions:

- **Enhanced Model Components**:
  - Traditional: Velocity + Acceleration + Physics
  - **NEW**: + Orbital Curvature + Pattern Recognition
- **Comprehensive Debug Logging**: Every calculation step visible in debug panel
- **Adaptive Weight Learning**: Model learns optimal balance between prediction methods

## 🎯 Current System Features

### ISS Tracking (`index.html`)
- Real-time ISS position with live map visualization
- Historical path tracking with configurable trail length
- Prediction visualization with confidence indicators

### ML Orbital Predictor (`ml-predictor.js`)
- **Multi-Component Prediction System**:
  - Velocity-based extrapolation
  - Acceleration trend analysis  
  - Physics-based orbital mechanics
  - **Spatial curve analysis** (new)
  - **Orbital pattern recognition** (new)
- **Adaptive Learning**: Weights adjust based on prediction accuracy
- **Comprehensive Debugging**: Full calculation transparency

### Spatial Curve Analysis (New)
- **Orbital Curvature**: Detects and continues natural orbital curves
- **Pattern Detection**: Recognizes inclination oscillations and orbital characteristics
- **Global Trend Analysis**: Uses entire orbital history for context
- **Confidence Scoring**: Provides reliability metrics for each prediction

## 🚧 Current Limitations & Improvement Areas

### Known Issues
- **ML Model Accuracy**: The current ML model doesn't work particularly well
- **Prediction Drift**: Multi-step predictions tend to accumulate errors
- **Weight Learning**: Simple gradient descent may not be optimal
- **Physics Modeling**: Simplified orbital mechanics need enhancement

### Areas for Improvement
- [ ] **Better Training Data**: Need more historical ISS position data
- [ ] **Advanced ML Algorithms**: Consider LSTM/RNN for temporal sequences  
- [ ] **Improved Physics**: More accurate orbital mechanics modeling
- [ ] **Kalman Filtering**: For better state estimation and noise reduction
- [ ] **External Factors**: Account for atmospheric drag, orbital maneuvers
- [ ] **Ensemble Methods**: Combine multiple prediction approaches

## 🛠️ Technical Architecture

```
Drawing Experiments (testml.html)
├── Spatial curve algorithms
├── Pattern recognition  
├── Curvature analysis
└── Smoothing techniques
          ↓
     Research Transfer
          ↓
ISS Orbital Predictor (ml-predictor.js)
├── Traditional ML components
├── Enhanced spatial analysis ← NEW
├── Comprehensive debug logging ← NEW
└── Adaptive weight learning ← ENHANCED
```

## 🔧 Usage

1. **Live Tracking**: Open `index.html` for real-time ISS tracking
2. **Prediction Analysis**: Use debug terminal to see detailed calculations
3. **Algorithm Testing**: Open `testml.html` to experiment with curve prediction
4. **Model Tuning**: Adjust weights and parameters in `ml-predictor.js`

## 📊 Debug Features

The enhanced system provides complete calculation transparency:
- Input data validation and preprocessing
- Component-wise prediction breakdowns
- Weight application and normalization
- Boundary condition handling
- Multi-step prediction sequences
- Spatial curve analysis details
- Model training progress

## 🎯 Next Steps

The spatial curve prediction research proved successful for drawing applications. However, the ISS orbital ML model requires significant improvement:

1. **Data Quality**: Gather more comprehensive training data
2. **Algorithm Enhancement**: Implement more sophisticated ML approaches
3. **Physics Integration**: Better orbital mechanics modeling
4. **Validation**: Extensive testing against actual ISS trajectories
5. **Performance Optimization**: Reduce computational overhead

## 🧮 Mathematical Foundation

The spatial curve prediction uses:
- **Curvature Formula**: `κ = |v₁ × v₂| / |v|³` for 2D path analysis
- **Pattern Recognition**: Statistical analysis of direction changes
- **Global Trend Analysis**: Linear regression over entire path history
- **Confidence Weighting**: Exponential decay based on prediction distance

---

*This project demonstrates the research and development process from experimental algorithms to practical implementation, highlighting both successes and areas requiring further work.* 