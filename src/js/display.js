// Display page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');
    const backBtn = document.getElementById('backBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    let points = null;
    
    // Get points from sessionStorage
    const storedPoints = sessionStorage.getItem('trianglePoints');
    if (storedPoints) {
        points = JSON.parse(storedPoints);
        
        // Validate triangle
        if (!isValidTriangle(points)) {
            showErrorModal();
            return;
        }
        
        drawTriangle();
    } else {
        // If no points, redirect back to input page
        window.location.href = '../../index.html';
    }
    
    // Back button functionality
    backBtn.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });
    
    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        sessionStorage.removeItem('trianglePoints');
        window.location.href = '../../index.html';
    });
    
    // Show error modal for invalid triangle
    function showErrorModal() {
        const modal = document.getElementById('errorModal');
        modal.style.display = 'block';
        
        // Add event listener to OK button
        const okBtn = document.getElementById('modalOkBtn');
        okBtn.onclick = function() {
            modal.style.display = 'none';
            sessionStorage.removeItem('trianglePoints');
            window.location.href = '../../index.html';
        };
        
        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                sessionStorage.removeItem('trianglePoints');
                window.location.href = '../../index.html';
            }
        };
    }

    // Validate if three points form a valid triangle (not collinear)
    function isValidTriangle(points) {
        // Calculate vectors
        const vectorAB = { x: points.B.x - points.A.x, y: points.B.y - points.A.y };
        const vectorAC = { x: points.C.x - points.A.x, y: points.C.y - points.A.y };
        
        // Calculate cross product (determinant)
        const crossProduct = vectorAB.x * vectorAC.y - vectorAB.y * vectorAC.x;
        
        // If cross product is 0, points are collinear
        return Math.abs(crossProduct) > 0.001; // Small tolerance for floating point errors
    }
    
    // Validate angles (should sum to 180 degrees)
    function validateAngles(angles) {
        const sum = angles.A + angles.B + angles.C;
        const tolerance = 0.1; // Small tolerance for floating point errors
        
        if (Math.abs(sum - 180) > tolerance) {
            console.warn(`Angle validation failed: Sum = ${sum.toFixed(2)}°, Expected: 180°`);
            return false;
        }
        
        // Check for invalid angles (0 or 180 degrees)
        for (const [vertex, angle] of Object.entries(angles)) {
            if (angle <= 0 || angle >= 180) {
                console.warn(`Invalid angle at vertex ${vertex}: ${angle.toFixed(2)}°`);
                return false;
            }
        }
        
        return true;
    }

    function drawTriangle() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up coordinate system (flip Y-axis to match mathematical convention)
        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ///TODO- Understand this
        
        // Scale points to fit within canvas (assuming input coordinates are in reasonable range)
        const scaledPoints = scalePointsToCanvas(points);
        
        // Draw triangle
        drawTriangleShape(scaledPoints);
        
        // Calculate and draw angles
        const angles = calculateAngles(scaledPoints);
        
        // Validate angles
        if (!validateAngles(angles)) {
            console.warn('Angle validation failed - angles may not be accurate');
        }
        
        drawAngles(scaledPoints, angles);
        
        // Draw angle labels
        drawAngleLabels(scaledPoints, angles);
        
        ctx.restore();
    }
    
    function scalePointsToCanvas(originalPoints) {
        // Find bounding box of the triangle
        const xs = [originalPoints.A.x, originalPoints.B.x, originalPoints.C.x];
        const ys = [originalPoints.A.y, originalPoints.B.y, originalPoints.C.y];
        
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        // Add padding
        const padding = 50;
        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        
        // Calculate scale factors
        const scaleX = (canvas.width - 2 * padding) / rangeX;
        const scaleY = (canvas.height - 2 * padding) / rangeY;
        const scale = Math.min(scaleX, scaleY);
        
        // Center the triangle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const triangleCenterX = (minX + maxX) / 2;
        const triangleCenterY = (minY + maxY) / 2;
        
        return {
            A: {
                x: centerX + (originalPoints.A.x - triangleCenterX) * scale,
                y: centerY + (originalPoints.A.y - triangleCenterY) * scale
            },
            B: {
                x: centerX + (originalPoints.B.x - triangleCenterX) * scale,
                y: centerY + (originalPoints.B.y - triangleCenterY) * scale
            },
            C: {
                x: centerX + (originalPoints.C.x - triangleCenterX) * scale,
                y: centerY + (originalPoints.C.y - triangleCenterY) * scale
            }
        };
    }
    
    function drawTriangleShape(points) {
        ctx.beginPath();
        ctx.moveTo(points.A.x, points.A.y);
        ctx.lineTo(points.B.x, points.B.y);
        ctx.lineTo(points.C.x, points.C.y);
        ctx.closePath();
        
        // Draw triangle outline
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Fill triangle with light color
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.fill();
        
        // Draw vertices
        drawVertex(points.A, 'A');
        drawVertex(points.B, 'B');
        drawVertex(points.C, 'C');
    }
    
    function drawVertex(point, label) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#667eea';
        ctx.fill();
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw vertex label
        ctx.save();
        ctx.scale(1, -1); // Flip back for text
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, point.x, -point.y + 25);
        ctx.restore();
    }
    
    function calculateAngles(points) {
        // Helper function to create vector from point A to point B
        const createVector = (from, to) => ({
            x: to.x - from.x,
            y: to.y - from.y
        });
        
        // Calculate all angles using a loop
        const angles = {};
        const vertices = ['A', 'B', 'C'];
        
        vertices.forEach(vertex => {
            const currentPoint = points[vertex];
            const otherPoints = vertices.filter(v => v !== vertex);
            
            // Create vectors from current vertex to the other two vertices
            const vector1 = createVector(currentPoint, points[otherPoints[0]]);
            const vector2 = createVector(currentPoint, points[otherPoints[1]]);
            
            // Calculate angle at this vertex
            angles[vertex] = calculateAngleBetweenVectors(vector1, vector2);
        });
        
        return angles;
    }
    
    function calculateAngleBetweenVectors(v1, v2) {
        // Calculate dot product
        const dotProduct = v1.x * v2.x + v1.y * v2.y;
        
        // Calculate magnitudes
        const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        // Calculate angle in radians
        const cosAngle = dotProduct / (magnitude1 * magnitude2);
        
        // Clamp to avoid numerical errors
        const clampedCos = Math.max(-1, Math.min(1, cosAngle));
        
        // Convert to degrees
        return Math.acos(clampedCos) * (180 / Math.PI);
    }
    
    function drawAngles(points, angles) {
        const arcRadius = 30;
        
        // Draw angle arc at vertex A
        drawAngleArc(points.A, points.B, points.C, arcRadius, angles.A);
        
        // Draw angle arc at vertex B
        drawAngleArc(points.B, points.A, points.C, arcRadius, angles.B);
        
        // Draw angle arc at vertex C
        drawAngleArc(points.C, points.A, points.B, arcRadius, angles.C);
    }
    
    function drawAngleArc(vertex, point1, point2, radius, angleDegrees) {
        // Calculate vectors from vertex to the two points
        const v1 = { x: point1.x - vertex.x, y: point1.y - vertex.y };
        const v2 = { x: point2.x - vertex.x, y: point2.y - vertex.y };
        
        // Normalize vectors
        const length1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const length2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        const normalizedV1 = { x: v1.x / length1, y: v1.y / length1 };
        const normalizedV2 = { x: v2.x / length2, y: v2.y / length2 };
        
        // Calculate start and end angles
        const startAngle = Math.atan2(normalizedV1.y, normalizedV1.x);
        const endAngle = Math.atan2(normalizedV2.y, normalizedV2.x);
        
        // Draw arc
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, radius, startAngle, endAngle);
        ctx.strokeStyle = '#e53e3e';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function drawAngleLabels(points, angles) {
        const labelRadius = 45;
        
        // Draw angle labels
        drawAngleLabel(points.A, points.B, points.C, labelRadius, angles.A.toFixed(1) + '°');
        drawAngleLabel(points.B, points.A, points.C, labelRadius, angles.B.toFixed(1) + '°');
        drawAngleLabel(points.C, points.A, points.B, labelRadius, angles.C.toFixed(1) + '°');
    }
    
    function drawAngleLabel(vertex, point1, point2, radius, label) {
        // Calculate vectors from vertex to the two points
        const v1 = { x: point1.x - vertex.x, y: point1.y - vertex.y };
        const v2 = { x: point2.x - vertex.x, y: point2.y - vertex.y };
        
        // Normalize vectors
        const length1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const length2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        const normalizedV1 = { x: v1.x / length1, y: v1.y / length1 };
        const normalizedV2 = { x: v2.x / length2, y: v2.y / length2 };
        
        // Calculate midpoint of the angle
        const midVector = {
            x: (normalizedV1.x + normalizedV2.x) / 2,
            y: (normalizedV1.y + normalizedV2.y) / 2
        };
        
        // Normalize midpoint vector
        const midLength = Math.sqrt(midVector.x * midVector.x + midVector.y * midVector.y);
        const normalizedMid = { x: midVector.x / midLength, y: midVector.y / midLength };
        
        // Calculate label position
        const labelX = vertex.x + normalizedMid.x * radius;
        const labelY = vertex.y + normalizedMid.y * radius;
        
        // Draw label
        ctx.save();
        ctx.scale(1, -1); // Flip back for text
        ctx.fillStyle = '#e53e3e';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, labelX, -labelY);
        ctx.restore();
    }
});
