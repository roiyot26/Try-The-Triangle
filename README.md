# Triangle Interface

A web application for visualizing triangles and calculating their angles based on three coordinate points.

## Quick Start

1. Open (https://roiyot26.github.io/Try-The-Triangle/) in your browser
2. Enter coordinates for three points (A, B, C)
3. Click "Show Triangle" to see the visualization

## Technical Approach

### Drawing Method
**HTML5 Canvas** - Chosen for precise pixel control, mathematical accuracy, and ability to draw custom geometric shapes with angle arcs and labels.

### Angle Calculation
**Vector Mathematics** using the dot product formula:
```
cos(θ) = (a·b) / (|a||b|)
```
For each vertex, I calculate vectors to adjacent points and use `Math.acos()` to get angles in degrees.

### Challenges
- **Time Constraint**: 1.5 hours was challenging for this assignment - required efficient problem-solving and AI assistance
- **Problem Prediction**: Used good prompts to identify potential challenges before they occurred
- **Vector Mathematics**: Initially unsure how to calculate angles between vectors, used AI to help implement the dot product formula
- **Scaling**: Dynamic scaling to fit any triangle size in 800×800px canvas - used AI to help with coordinate transformations
- **Angle Arc Positioning**: Precise positioning of curved arcs at triangle vertices - used AI to help with arc calculations and positioning


### External Tools
**AI Assistance (Claude)** - Helped with:
- Vector mathematics implementation
- Canvas coordinate transformations
- Code organization and structure
- styling

## File Structure
```
├── index.html              # Main input page
├── src/
│   ├── pages/display.html  # Triangle visualization
│   ├── css/styles.css     # Styling
│   └── js/                # JavaScript logic
└── docs/README.md         # This file
```

## Live Demo
[GitHub Repository](https://github.com/roiyot26/Try-The-Triangle)
