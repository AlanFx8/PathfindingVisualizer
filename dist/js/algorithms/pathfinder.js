export default class Pathfinder {
    GetFlattenedNodeList = (nodes) => {
        const nodeList = [];
        for (const row of nodes) {
            for (const node of row) {
                nodeList.push(node);
            }
        }
        return nodeList;
    };
    GetNeighbours = (node, diagonals) => {
        const neighbours = node.neighbours.filter(n => !n.isWall);
        if (!diagonals) {
            return neighbours;
        }
        const dNeighbours = node.diagonalNeighbours.filter(d => !d.isWall);
        return neighbours.concat(dNeighbours);
    };
}
