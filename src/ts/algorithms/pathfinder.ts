import Node from "../nodes/node.js";

export default abstract class Pathfinder {
    protected GetFlattenedNodeList = (nodes: Node[][]): Node[] => {
        const nodeList = [];
        for (const row of nodes){
            for (const node of row){
                nodeList.push(node);
            }
        }
        return nodeList;
    }

    protected GetNeighbours = (node: Node, diagonals: boolean): Node[] => {
        const neighbours = node.neighbours.filter(n => !n.isWall);
        if (!diagonals) {
            return neighbours;
        }
        const dNeighbours = node.diagonalNeighbours.filter(d => !d.isWall);
        return neighbours.concat(dNeighbours);
    }
}