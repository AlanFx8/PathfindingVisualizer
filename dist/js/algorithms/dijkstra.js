import Node from './../nodes/node.js';
import Pathfinder from './pathfinder.js';
export default class Dijkstra extends Pathfinder {
    //#region Publuc
    GetDijkstra(nodes, startNode, endNode, diagonals) {
        startNode.local_distance = 0;
        const unvisitedNodes = this.GetFlattenedNodeList(nodes);
        const visitedNodes = [];
        while (!!unvisitedNodes.length) {
            this.sortByDistance(unvisitedNodes);
            const nearestNode = unvisitedNodes.shift();
            if (nearestNode.local_distance === Infinity)
                return visitedNodes;
            nearestNode.isChecked = true;
            visitedNodes.push(nearestNode);
            if (nearestNode === endNode)
                return visitedNodes;
            this.updateUnvisitedNeighbours(nearestNode, diagonals);
        }
        return visitedNodes;
    }
    //#endregion
    //#region Private
    sortByDistance = (unvisitedNodes) => {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.local_distance - nodeB.local_distance);
    };
    updateUnvisitedNeighbours = (node, diagonal) => {
        const unvisitedNeighbours = this.GetNeighbours(node, diagonal);
        for (const neighbour of unvisitedNeighbours) {
            if (neighbour.isChecked)
                continue;
            neighbour.local_distance = node.local_distance + 1;
            if (neighbour.isWeighted) {
                neighbour.local_distance += Node.WeightCost;
            }
            neighbour.previousNode = node;
        }
    };
}
