console.log("Nabin");

document.getElementById('crawlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const domain = document.getElementById('domainInput').value;
    if (domain) {
        fetchLinks(domain);
    }
});

async function fetchLinks(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const links = doc.querySelectorAll('a');
        const linksContainer = document.getElementById('links');
        linksContainer.innerHTML = ''; 
        
        links.forEach(link => {
            const href = link.href;
            const linkItem = document.createElement('div');
            linkItem.classList.add('link-item');
            linkItem.innerHTML = `<a href="${href}" target="_blank">${href}</a>`;
            linksContainer.appendChild(linkItem);
        });
    } catch (error) {
        console.error('Error fetching links:', error);
    }
}

document.getElementById('addPoint').addEventListener('click', function() {
    const traversePoints = document.getElementById('traversePoints');
    traversePoints.innerHTML += `
        <input type="text" placeholder="Point X" class="pointX" required />
        <input type="text" placeholder="Point Y" class="pointY" required /><br>
    `;
});

document.getElementById('traverseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const traverseType = document.getElementById('traverseType').value;
    const pointXs = document.querySelectorAll('.pointX');
    const pointYs = document.querySelectorAll('.pointY');
    
    const points = [];
    for (let i = 0; i < pointXs.length; i++) {
        points.push({
            x: parseFloat(pointXs[i].value),
            y: parseFloat(pointYs[i].value)
        });
    }
    
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (traverseType === 'closed') {
        const closureError = computeClosedTraverse(points);
        results.innerHTML = `Closure Error: ${closureError.toFixed(3)} units`;
    } else {
        const totalDistance = computeOpenTraverse(points);
        results.innerHTML = `Total Distance: ${totalDistance.toFixed(3)} units`;
    }
});

function computeClosedTraverse(points) {
    let xSum = 0, ySum = 0;
    for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length;
        xSum += points[next].x - points[i].x;
        ySum += points[next].y - points[i].y;
    }
    return Math.sqrt(xSum * xSum + ySum * ySum); 
}

function computeOpenTraverse(points) {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    return totalDistance; 
}
