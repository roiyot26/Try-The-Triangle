import { getRandomInt } from './utils.js';


document.addEventListener('DOMContentLoaded', function () {
    const showTriangleBtn = document.getElementById('showTriangleBtn');

    // Add event listener to the "Show Triangle" button
    showTriangleBtn.addEventListener('click', function () {
        // Get input values
        const points = {
            A: {
                x: parseFloat(document.getElementById('ax').value) || 0,
                y: parseFloat(document.getElementById('ay').value) || 0
            },
            B: {
                x: parseFloat(document.getElementById('bx').value) || 0,
                y: parseFloat(document.getElementById('by').value) || 0
            },
            C: {
                x: parseFloat(document.getElementById('cx').value) || 0,
                y: parseFloat(document.getElementById('cy').value) || 0
            }
        };

        // Check if any coordinates are missing
        if (!points.A.x || !points.A.y || !points.B.x || !points.B.y || !points.C.x || !points.C.y) {
            showErrorModal();
            return; // Stop execution if validation fails
        }
        
        // Store points in sessionStorage for the display page
        sessionStorage.setItem('trianglePoints', JSON.stringify(points));

        // Navigate to display page
        window.location.href = 'src/pages/display.html';
    });

    // Show error modal for missing coordinates
    function showErrorModal() {
        const modal = document.getElementById('errorModal');
        modal.style.display = 'block';
        
        // Add event listener to OK button
        const okBtn = document.getElementById('modalOkBtn');
        okBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

});
// Make loadSampleData globally accessible
window.loadSampleData = function () {
    // Load sample triangle data
    document.getElementById('ax').value = getRandomInt(50, 300);
    document.getElementById('ay').value = getRandomInt(50, 300);
    document.getElementById('bx').value = getRandomInt(50, 300);
    document.getElementById('by').value = getRandomInt(50, 300);
    document.getElementById('cx').value = getRandomInt(50, 300);
    document.getElementById('cy').value = getRandomInt(50, 300);
};
