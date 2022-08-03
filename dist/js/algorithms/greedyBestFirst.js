import Node from "../nodes/node.js";
import Pathfinder from "./pathfinder.js";
export default class GreedyBestFirst extends Pathfinder {
    //#region Public
    GetGBF = (nodes, startNode, endNode, diagonals) => {
        //Prepare the start node
        startNode.local_distance = 0;
        startNode.heuristic_distance = this.getHeuristic(startNode, endNode);
        //Build open and closed lists
        const unvisitedNodes = this.GetFlattenedNodeList(nodes);
        const visitedNodes = [];
        //Start loop
        while (!!unvisitedNodes.length) {
            this.sortByDistance(unvisitedNodes);
            const nearestNode = unvisitedNodes.shift();
            if (nearestNode.local_distance === Infinity)
                return visitedNodes;
            visitedNodes.push(nearestNode);
            if (nearestNode === endNode)
                return visitedNodes;
            const neighbours = this.GetNeighbours(nearestNode, diagonals);
            //Loop through neighbours
            for (const neighbour of neighbours) {
                let possibleGCost = nearestNode.local_distance + this.getHeuristic(neighbour, endNode);
                if (possibleGCost < neighbour.local_distance) {
                    neighbour.previousNode = nearestNode;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, endNode);
                }
            }
        } //End loop
        //Finished
        return visitedNodes;
    };
    //#endregion
    //#region Private
    getHeuristic = (nodeA, nodeB) => {
        return this.getManhattanDistance(nodeA, nodeB);
    };
    getManhattanDistance = (nodeA, nodeB) => {
        const nodeAWeight = nodeA.isWeighted ? Node.WeightCost : 0;
        const nodeBWeight = nodeB.isWeighted ? Node.WeightCost : 0;
        return Math.abs((nodeA.x + nodeAWeight) - (nodeB.x + nodeBWeight))
            + Math.abs((nodeA.y + nodeAWeight) - (nodeB.y + nodeBWeight));
    };
    sortByDistance = (unvisitedNodes) => {
        unvisitedNodes.sort((nodeA, nodeB) => {
            return nodeA.heuristic_distance - nodeB.heuristic_distance;
        });
    };
}
