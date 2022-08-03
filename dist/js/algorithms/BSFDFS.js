import Pathfinder from './pathfinder.js';
export default class BFSDFS extends Pathfinder {
    //#region Public
    GetBFSDFS = (startNode, endNode, isBFS, diagonals) => {
        //Set lists
        const visitedNodes = [];
        const immediateNodes = [];
        immediateNodes.push(startNode);
        while (!!immediateNodes.length) {
            const nearestNode = (isBFS) ? immediateNodes.shift() : immediateNodes.pop();
            nearestNode.isChecked = true;
            visitedNodes.push(nearestNode);
            if (nearestNode === endNode)
                return visitedNodes;
            //Get neighors
            const neighbours = this.GetNeighbours(nearestNode, diagonals);
            //Loop through neighbors
            for (const neighbour of neighbours) {
                if (!neighbour.isChecked) {
                    if (immediateNodes.indexOf(neighbour) !== -1)
                        continue;
                    neighbour.previousNode = nearestNode;
                    immediateNodes.push(neighbour);
                }
            }
        } //End loop
        //Finished
        return visitedNodes;
    };
}
