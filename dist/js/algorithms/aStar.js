import Node from "../nodes/node.js";
import Pathfinder from "./pathfinder.js";
export default class AStar extends Pathfinder {
    //#region Public
    GetAStar = (nodes, startNode, endNode, diagonals) => {
        //Prepare the start node
        startNode.local_distance = 0;
        startNode.heuristic_distance = this.getHeuristic(startNode, endNode);
        startNode.global_distance = this.getFCost(startNode);
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
                let possibleGCost = nearestNode.local_distance + this.getHeuristic(nearestNode, neighbour);
                if (possibleGCost < neighbour.local_distance) {
                    neighbour.previousNode = nearestNode;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, endNode);
                    neighbour.global_distance = this.getFCost(neighbour);
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
            if (nodeA.global_distance !== nodeB.global_distance) {
                return nodeA.global_distance - nodeB.global_distance;
            }
            return nodeA.heuristic_distance - nodeB.heuristic_distance;
        });
    };
    //#endregion
    //#region Helpers
    getFCost = (node) => {
        return node.local_distance + node.heuristic_distance; //gCost + hCost = fCost
    };
}
