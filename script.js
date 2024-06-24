class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(x, y) {
        this.nodes.push({ x, y, color: null });
    }

    addEdge(node1, node2) {
        this.edges.push([node1, node2]);
    }

    colorGraph() {
        let color = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            let availableColors = Array(this.nodes.length).fill(true);
            for (let j = 0; j < this.edges.length; j++) {
                if (this.edges[j][0] === i || this.edges[j][1] === i) {
                    let neighbor = this.edges[j][0] === i ? this.edges[j][1] : this.edges[j][0];
                    if (this.nodes[neighbor].color !== null) {
                        availableColors[this.nodes[neighbor].color] = false;
                    }
                }
            }
            for (let c = 0; c < availableColors.length; c++) {
                if (availableColors[c]) {
                    this.nodes[i].color = c;
                    if (c > color) {
                        color = c;
                    }
                    break;
                }
            }
        }
        return color + 1; // Number of colors used
    }
}

const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const graph = new Graph();
let selectedNode = null;

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let clickedNode = null;
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        if (distance < 20) {
            clickedNode = i;
            break;
        }
    }

    if (clickedNode !== null) {
        if (selectedNode === null) {
            selectedNode = clickedNode;
        } else {
            graph.addEdge(selectedNode, clickedNode);
            selectedNode = null;
        }
    } else {
        graph.addNode(x, y);
        selectedNode = null; // reset selection if a new node is added
    }

    drawGraph();
});

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < graph.edges.length; i++) {
        const node1 = graph.nodes[graph.edges[i][0]];
        const node2 = graph.nodes[graph.edges[i][1]];
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
    }

    for (let i = 0; i < graph.nodes.length; i++) {
        ctx.beginPath();
        ctx.arc(graph.nodes[i].x, graph.nodes[i].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = graph.nodes[i].color !== null ? getColor(graph.nodes[i].color) : '#ffffff';
        ctx.fill();
        ctx.stroke();
    }
}

function colorGraph() {
    const numColors = graph.colorGraph();
    alert('Jumlah warna yang digunakan: ' + numColors);
    drawGraph();
}

function getColor(index) {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFFF33', '#33FFFF', '#FF8333'];
    return colors[index % colors.length];
}
