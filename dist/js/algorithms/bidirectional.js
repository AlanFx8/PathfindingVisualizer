import Node from "../nodes/node.js";
import Pathfinder from "./pathfinder.js";
export default class Bidirectional extends Pathfinder {
    //#region Public
    GetBidirectional = (startNode, endNode, diagonals) => {
        //Prepare lists
        const nodesToAnimate = [];
        const unvisitedStart = [];
        const unvisitedEnd = [];
        const visitedStart = [];
        const visitedEnd = [];
        //Set up Start and End nodes
        startNode.local_distance = 0;
        startNode.heuristic_distance = this.getHeuristic(startNode, endNode);
        endNode.local_distance = 0;
        endNode.heuristic_distance = this.getHeuristic(endNode, startNode);
        unvisitedStart.push(startNode);
        unvisitedEnd.push(endNode);
        //Start loop
        while (!!unvisitedStart.length && !!unvisitedEnd.length) {
            //sort lists
            this.sortByDistance(unvisitedStart);
            this.sortByDistance(unvisitedEnd);
            //Get nearest nodes
            const nearestStart = unvisitedStart.shift();
            const nearestEnd = unvisitedEnd.shift();
            //Check of infinity
            if (nearestStart.local_distance === Infinity || nearestEnd.local_distance === Infinity)
                return nodesToAnimate;
            //Clear nearests nodes
            nearestStart.isChecked = true;
            nearestEnd.isChecked = true;
            visitedStart.push(nearestStart);
            visitedEnd.push(nearestEnd);
            nodesToAnimate.push(nearestStart, nearestEnd);
            //Check for connection
            if (this.isNeighbor(nearestStart, nearestEnd, diagonals)) {
                this.connectPaths(visitedStart[visitedStart.length - 1], visitedEnd[visitedEnd.length - 1]);
                return nodesToAnimate;
            }
            //Get neighbours from Start
            const neighbours = this.GetNeighbours(nearestStart, diagonals);
            for (const neighbour of neighbours) {
                if (neighbour.isChecked)
                    continue;
                if (unvisitedEnd.indexOf(neighbour) !== -1) {
                    visitedEnd.push(neighbour);
                    nodesToAnimate.push(neighbour);
                    this.connectPaths(visitedStart[visitedStart.length - 1], visitedEnd[visitedEnd.length - 1]);
                    return nodesToAnimate;
                }
                let possibleGCost = nearestStart.local_distance + this.getHeuristic(neighbour, endNode);
                if (unvisitedStart.indexOf(neighbour) === -1) {
                    unvisitedStart.push(neighbour);
                    neighbour.previousNode = nearestStart;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, endNode);
                }
                else if (possibleGCost < neighbour.local_distance) {
                    neighbour.previousNode = nearestStart;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, endNode);
                }
            }
            //Get neigbours from End
            const neighboursEnd = this.GetNeighbours(nearestEnd, diagonals);
            for (const neighbour of neighboursEnd) {
                if (neighbour.isChecked)
                    continue;
                if (unvisitedStart.indexOf(neighbour) !== -1) {
                    visitedStart.push(neighbour);
                    nodesToAnimate.push(neighbour);
                    this.connectPaths(visitedStart[visitedStart.length - 1], visitedEnd[visitedEnd.length - 1]);
                    return nodesToAnimate;
                }
                let possibleGCost = nearestEnd.local_distance + this.getHeuristic(neighbour, startNode);
                if (unvisitedEnd.indexOf(neighbour) === -1) {
                    unvisitedEnd.push(neighbour);
                    neighbour.previousNode = nearestEnd;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, startNode);
                }
                else if (possibleGCost < neighbour.local_distance) {
                    neighbour.previousNode = nearestEnd;
                    neighbour.local_distance = possibleGCost;
                    neighbour.heuristic_distance = this.getHeuristic(neighbour, startNode);
                }
            }
        } //End loop
        //Finish
        return nodesToAnimate;
    };
    //#endregion
    //#region Helpers
    connectPaths = (lastStart, lastEnd) => {
        let current = lastEnd;
        let prev = null;
        while (current !== null) {
            const next = current.previousNode;
            current.previousNode = prev;
            prev = current;
            current = next;
        }
        lastEnd.previousNode = lastStart;
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
    isNeighbor = (nodeA, nodeB, useDiagonals) => {
        const neighbors = this.GetNeighbours(nodeA, useDiagonals);
        for (let x = 0; x < neighbors.length; x++) {
            const neighbor = neighbors[x];
            if (neighbor.x === nodeB.x && neighbor.y === nodeB.y) {
                return true;
            }
        }
        return false;
    };
}
