import Node from './node.js';

export default class NodeController {
    //#region Public
    public ResetWalls = (nodes: Node[][], classSetter: Function, showGrid: boolean): Node[][] => {
        for (let row of nodes){
            for (let node of row){
                node.WallOff();

                const newClass = classSetter(node, showGrid);
                const { y, x } = node;
                document.getElementById(`node-${y}-${x}`).className = newClass;
            }
        }

        return nodes;
    }

    public ClearCheckedNodes = (nodes: Node[][], classSetter: Function, showGrid: boolean): Node[][] => {
        for (let row of nodes){
            for (let node of row){
                //Reset distances
                node.local_distance = Infinity;
                node.heuristic_distance = Infinity;
                node.global_distance = Infinity;

                //Reset checked flag and reset previousNode
                node.isChecked = false;
                node.previousNode = null;

                //Reset the class and re-draw the node
                const newClass = classSetter(node, showGrid);
                const { y, x } = node;
                document.getElementById(`node-${y}-${x}`).className = newClass;
            }
        }
        return nodes;
    }

    public ResetWeights = (nodes: Node[][], classSetter: Function, showGrid: boolean): Node[][] => {
        for (let row of nodes){
            for (let node of row){
                node.WeightOff();

                const newClass = classSetter(node, showGrid);
                const { y, x } = node;
                document.getElementById(`node-${y}-${x}`).className = newClass;
            }
        }

        return nodes;
    }

    public AnimatePath = (visitedList: Node[], shortestPath: Node[], showGrid: boolean,
        showResult: Function, callback: Function): void => {
        for (let x = 0; x <= visitedList.length; x++){
            //Check Shortest Path
            if (x === visitedList.length){
                setTimeout(() => {
                    this._animateShortestPath(shortestPath, 0, showGrid, showResult, callback);
                  }, 10 * x);
                return;
            }

            const node = visitedList[x];
            if (node.isStartNode || node.isEndNode) continue;

            let clsName = showGrid?'node visited grid':'node visited';
            if (node.isWeighted) { 
                clsName += ' weighted';
            }

            setTimeout(() => {
                document.getElementById(`node-${node.y}-${node.x}`).className =
               clsName;
            }, 10 * x);
        }
    }
    //#endregion

    //#region Private
    private _animateShortestPath = (path: Node[], index: number, showGrid: boolean,
        showResult: Function, callback: Function): void => {
        if (path.length <= 1){
            console.error("Could not reached target.");
            showResult(false);
            callback();
            return;
        }
        showResult(true);

        //Set the animationWrapper and get the bee
        var pathAnimWrapper;
        const bee = document.getElementById("bee");

        //The actual animation
        var pathAnim = () => {
            const node = document.getElementById(`node-${path[index].y}-${path[index].x}`);

            if (bee.offsetTop !== node.offsetTop || bee.offsetLeft !== node.offsetLeft) {
                const anim = (node.offsetTop > bee.offsetTop) ? "down" :
                (node.offsetTop < bee.offsetTop)? "up" :
                (node.offsetLeft > bee.offsetLeft) ? "right" : "left";                
                bee.className = anim;                
                bee.style.top = node.offsetTop + "px"; 
                bee.style.left = node.offsetLeft + "px";

                //Reset the animation
                pathAnimWrapper = requestAnimationFrame(pathAnim);
            }
            else { //When we reach the target node
                if (path[index].isEndNode){
                    bee.className = "idle";
                    bee.style.left = bee.offsetLeft-2 + "px";
                    bee.style.top = bee.offsetTop-2 + "px";
                    cancelAnimationFrame(pathAnimWrapper);
                    callback();
                }
                else {
                    if (!path[index].isStartNode){
                        let clsName = showGrid?'node shortest grid':'node shortest';
                        document.getElementById(`node-${path[index].y}-${path[index].x}`).className =
                        clsName;
                    }
                    index++;
                    pathAnimWrapper = requestAnimationFrame(pathAnim);
                }
            }
        }

        pathAnimWrapper = requestAnimationFrame(pathAnim);
    }
    //#endregion
}