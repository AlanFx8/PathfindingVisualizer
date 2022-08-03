import Node from './nodes/node.js';
import NodeController from './nodes/nodeController.js';
import Dijkstra from './algorithms/dijkstra.js';
import AStar from './algorithms/aStar.js';
import BFSDFS from './algorithms/BSFDFS.js';
import GreedyBestFirst from './algorithms/greedyBestFirst.js';
import Bidirectional from './algorithms/bidirectional.js';
import { EditorTypes } from './types/editorTypes.js';
import { AlgorithmTypes } from './types/algorithmsTypes.js';

class App {
    //#region Declarations
    private nodes = [] as Node[][];
    private nodeController = new NodeController();

    //Grid, mouse drag, and animating
    private showGrid = true; //We need to keep track of this for the NodeController
    private isDraggingMouse = false;
    private isAnimatingPath = false;
    private diagonalNodes = false;

    //Start and End node-related
    private startNode = null;
    private endNode = null;
    private isDragingStartNode = false;
    private isDragingEndNode = false;

    //Enums
    private editMode = EditorTypes.DrawWalls;
    private algorithmType = AlgorithmTypes.Dijkstra;

    //Algorithms
    private dijkstra = new Dijkstra();
    private aStar = new AStar();
    private bfsdfs = new BFSDFS();
    private greedy = new GreedyBestFirst();
    private bi = new Bidirectional();

    //Bee
    private bee = null;

    //Terminal
    private terminal = null;
    private dormantMessage = "Press \"Animate Path\" to begin animation.";
    private animatingMessage = "ANIMATING PATH! Please wait...";
    private failedMessage = "FAILED! Could not reach target.";
    private succeededMessage = "SUCCEEDED! Target was reached.";
    //#endregion

    //#region Constructor
    constructor(){
        //Debug
        console.log("The App is running!");

        //Set Grid Size
        const ROW_COUNT = 26;
        const COL_COUNT = 46;

        //First Loop: Initialize the Node objects
        for (let rowCount = 0; rowCount < ROW_COUNT; rowCount++){
            const newRow = [] as Node[];
            for (let colCount = 0; colCount < COL_COUNT; colCount++){
                const bgx = Math.floor((Math.random() * 4)) * 16;
                const bgy = Math.floor((Math.random() * 4)) * 16;
                newRow.push(new Node(rowCount, colCount, bgx, bgy));
            }
            this.nodes.push(newRow);
        }

        //Second loop: Assign Node neighbours
        for (let y = 0; y < ROW_COUNT; y++){
            for (let x = 0; x < COL_COUNT; x++){
                const node = this.nodes[y][x];
                
                //Cardinals             
                if (y > 0) node.neighbours.push(this.nodes[y - 1][x]); //North
                if (x < COL_COUNT - 1) node.neighbours.push(this.nodes[y][x + 1]); //East
                if (y < ROW_COUNT - 1) node.neighbours.push(this.nodes[y + 1][x]); //South
                if (x > 0)  node.neighbours.push(this.nodes[y][x - 1]); //West

                //Diagonals
                if (y > 0 && x > 0)
                    node.diagonalNeighbours.push(this.nodes[y - 1][x - 1]); //TopLeft
                if (y < ROW_COUNT - 1 && x > 0)
                    node.diagonalNeighbours.push(this.nodes[y + 1][x - 1]); //BottomLeft
                if (y > 0 && x < COL_COUNT - 1)
                    node.diagonalNeighbours.push(this.nodes[y - 1][x + 1]); //TopRight
                if (y < ROW_COUNT - 1 && x < COL_COUNT - 1)
                    node.diagonalNeighbours.push(this.nodes[y + 1][x + 1]); //BottomRight
            }
        }

        //Set StartNode and EndNode
        this.nodes[1][1].StartNodeOn();
        this.startNode = this.nodes[1][1];

        this.nodes[ROW_COUNT-2][COL_COUNT-2].EndNodeOn();
        this.endNode = this.nodes[ROW_COUNT-2][COL_COUNT-2];

        //Build the Nodes as HTML Elements
        const main = document.getElementById("main-content-inner");
        const grid = document.createElement("div");
        grid.id = "grid";
        grid.classList.add("grid");  
        this.buildNodeMap(grid, this.nodes, this.showGrid);
        main.appendChild(grid);

        //Set Events to Buttons
        document.getElementById("toggle-grid-btn")
        .addEventListener("click", this.toggleGrid, false);

        document.getElementById("clear-walls-btn")
        .addEventListener("click", this.clearWalls, false);

        document.getElementById("clear-weights-btn")
        .addEventListener("click", this.clearWeights, false);

        document.getElementById("clear-nodes-btn")
        .addEventListener("click", this.clearNodes, false);

        document.getElementById("animate-path-btn")
        .addEventListener("click", this.animatePath, false);

        //Set SelectEvents and set default values
        (document.getElementById("edit-mode-dropdown") as HTMLSelectElement).selectedIndex = 0;
        document.getElementById("edit-mode-dropdown")
        .addEventListener("change", this.setEditMode, false);

        (document.getElementById("neighbors-dropdown") as HTMLSelectElement).selectedIndex = 0;
        document.getElementById("neighbors-dropdown")
        .addEventListener("change", this.setDiagonalNodes, false);

        (document.getElementById("pathfinder-dropdown") as HTMLSelectElement).selectedIndex = 0;
        document.getElementById("pathfinder-dropdown")
        .addEventListener("change", this.setAlgorithmType, false);

        //Add the Bee
        this.bee = document.createElement("div");
        this.bee.id = "bee";
        this.bee.classList.add("idle");
        document.getElementById("root").appendChild(this.bee);
        this.setBeeToStartNode();

        //Grab terminal
        this.terminal = document.getElementById("terminal");
    }
    //#endregion

    //#region StartMethods
    private buildNodeMap = (container: HTMLDivElement, nodes: Node[][], showGrid: boolean):void => {
        nodes.map(row => {
            //Create a row-divider
            const newRow = document.createElement("div");
            newRow.className = "row-divider";

            //Add nodes to rows
            row.map(node => {
                //Get node data
                const {y, x, bgx, bgy} = node;

                //Set node className
                const clsName = this.setClass(node, showGrid);

                //Build node
                const newNode = document.createElement("div"); //The DIV
                newNode.id = `node-${y}-${x}`;
                newNode.className = clsName;
                newNode.setAttribute('style', `background-position: ${bgx}px ${bgy}px`);

                //Add Mouse Events
                newNode.addEventListener("mousedown", () => this.onMouseDown(y, x), false);
                newNode.addEventListener("mouseenter", () => this.onMouseEnter(y, x), false);
                newNode.addEventListener("mouseleave", () => this.onMouseLeave(y, x), false);
                newNode.addEventListener("mouseup", () => this.onMouseUp(y, x), false);

                //Add node to row
                newRow.appendChild(newNode);
            });

            //Add row to grid
            container.appendChild(newRow);
        });
    }
    //#endregion

    //#region MainMethods
    private toggleGrid = () => {
        if (this.isAnimatingPath)
            return;
        
        this.showGrid = !this.showGrid;
        const nodeElements = document.getElementsByClassName("node");
        for (let node of nodeElements){
            node.classList.toggle("grid", this.showGrid);
        }
        document.getElementById("grid").classList.toggle("grid", this.showGrid);
    }

    private clearWalls = () => {
        if (this.isAnimatingPath)
            return;
        this.nodeController.ResetWalls(this.nodes, this.setClass, this.showGrid);
    }

    private clearWeights = () => {
        if (this.isAnimatingPath)
            return;
        this.nodeController.ResetWeights(this.nodes, this.setClass, this.showGrid);
    }

    private clearNodes = () => {
        if (this.isAnimatingPath)
            return;
        this.nodeController.ClearCheckedNodes(this.nodes, this.setClass, this.showGrid);
    }

    private animatePath = () => {
        if (this.isAnimatingPath)
        return;

        this.clearNodes();
        this.setBeeToStartNode();
        this.terminal.className = "animating";
        this.terminal.innerHTML = this.animatingMessage;
        this.isAnimatingPath = true; //Do this AFTER clearing nodes otherwise they won't clear

        const pathNodes = this.getAlgorithmPath();
        if (pathNodes === null){
            console.error("No Node list was returned.");
            this.isAnimatingPath = false;
            return;
        }

        let _shortPathNodes = this.getShortestPath(this.endNode);

        //Animate path
        this.nodeController.AnimatePath(
            pathNodes,
            _shortPathNodes,
            this.showGrid,
            this.showResult,
            () => { this.isAnimatingPath = false; }
        );
    }

    private getAlgorithmPath = (): Node[] => {
        switch (this.algorithmType){
            case AlgorithmTypes.Dijkstra:
                return this.dijkstra.GetDijkstra(this.nodes, this.startNode, this.endNode, this.diagonalNodes);
            case AlgorithmTypes.AStar:
                return this.aStar.GetAStar(this.nodes, this.startNode, this.endNode, this.diagonalNodes);
            case AlgorithmTypes.BFS:
                return this.bfsdfs.GetBFSDFS(this.startNode, this.endNode, true, this.diagonalNodes);
            case AlgorithmTypes.DFS:
                return this.bfsdfs.GetBFSDFS(this.startNode, this.endNode, false, this.diagonalNodes);
            case AlgorithmTypes.GBF:
                return this.greedy.GetGBF(this.nodes, this.startNode, this.endNode, this.diagonalNodes);
            case AlgorithmTypes.Bi:
                return this.bi.GetBidirectional(this.startNode, this.endNode, this.diagonalNodes);
            default:
                return null;
        }
    }

    private setEditMode = (e: Event) => {
        const value = this.getSelectedIndex(e);
        this.editMode = (value === "Walls") ? EditorTypes.DrawWalls : EditorTypes.DrawWeights;
    }

    private setDiagonalNodes = (e: Event) => {
        const value = this.getSelectedIndex(e);
        this.diagonalNodes = value === "All";
    }

    private setAlgorithmType = (e: Event) => {
        const value = this.getSelectedIndex(e);
        const n = parseInt(value);
        if (isNaN(n)){
            console.error("Could not get valid value, defauling to Dijkstra");
            this.algorithmType = AlgorithmTypes.Dijkstra;
            return;
        }
        const newValue: AlgorithmTypes = n;
        this.algorithmType = newValue;
    }

    private getShortestPath = (endNode: Node): Node[] => {
        const nodes = [];
        let currentNode = endNode;
        while (currentNode !== null){
            nodes.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodes;
    }
    //#endregion

    //#region MouseEvents
    private onMouseDown = (y: number, x: number): void => {
        if (this.isAnimatingPath)
            return;
        
        //Stop dragging the grid
        window.event.preventDefault();

        //Get node
        const node = this.nodes[y][x];

        //Dragging StartNode
        if (node.isStartNode){           
            node.StartNodeOff();
            node.StartNodePreviewOn();
            this.getNodeElement(y, x).classList.replace("start", "start-hover");            
            this.startNode = null;
            this.isDragingStartNode = true;
            return;
        }

        //Dragging EndNode
        if (node.isEndNode){           
            node.EndNodeOff();
            node.EndNodePreviewOn();
            this.getNodeElement(y, x).classList.replace("end", "end-hover");            
            this.endNode = null;
            this.isDragingEndNode = true;
            return;
        }

        //Normal DragMode
        if (this.editMode === EditorTypes.DrawWalls){
            this.toggleWall(y, x);
        }
        else if (this.editMode == EditorTypes.DrawWeights){
            this.toggleWeight(y, x);
        }
        this.isDraggingMouse = true; //We're on wall mode
    }

    private onMouseEnter = (y: number, x: number): void => {
        const node = this.nodes[y][x];

        //Dragging StartNode
        if (this.isDragingStartNode){
            //If we over the end-node, show an error
            if (node.isEndNode){
                node.ErrorOn();
                this.getNodeElement(y, x).classList.add("error");
            }
            else { //Set node as new preview
                node.StartNodePreviewOn();
                const el = this.getNodeElement(y, x);
                el.classList.remove("wall", "visited", "shortest");
                node.WallOff();
                node.CheckOff();

                el.classList.add("start-hover");
            }
            return;
        }

        //Dragging EndNode
        if (this.isDragingEndNode){
            //If we over the start-node, show an error
            if (node.isStartNode){
                node.ErrorOn();
                this.getNodeElement(y, x).classList.add("error");
            }
            else { //Set node as new preview
                node.EndNodePreviewOn();
                const el = this.getNodeElement(y, x);

                el.classList.remove("wall", "visited", "shortest");
                node.WallOff();
                node.CheckOff();
                
                el.classList.add("end-hover");
            }
            return;
        }

        //Normal DragMode
        if (this.isDraggingMouse){
            if (this.editMode === EditorTypes.DrawWalls){
                this.toggleWall(y, x);
            }
            else if (this.editMode == EditorTypes.DrawWeights){
                this.toggleWeight(y, x);
            }
        }
    }

    private onMouseLeave = (y: number, x: number): void => {
        const node = this.nodes[y][x];

        //Dragging StartNode
        if (this.isDragingStartNode){
            if (node.isError){
                node.ErrorOff();
                this.getNodeElement(y, x).classList.remove("error");
            }
            else {
                node.StartNodePreviewOff();
                this.getNodeElement(y, x).classList.remove("start-hover");
            }
        }

        //Dragging EndNode
        if (this.isDragingEndNode){
            if (node.isError){
                node.ErrorOff();
                this.getNodeElement(y, x).classList.remove("error");
            }
            else {
                node.EndNodePreviewOff();
                this.getNodeElement(y, x).classList.remove("end-hover");
            }
        }
    }

    private onMouseUp = (y: number, x: number): void => {
        const node = this.nodes[y][x];

        //Dragging StartNode
        if (this.isDragingStartNode){
            if (node.isError)
                return;

            node.StartNodeOn();
            this.startNode = this.nodes[y][x];
            this.getNodeElement(y, x).classList.replace("start-hover", "start");
            this.isDragingStartNode = false;
            this.setBeeToStartNode();
            return;
        }

        //Dragging EndNode
        if (this.isDragingEndNode){
            if (node.isError)
                return;

            node.EndNodeOn();
            this.endNode = node;
            this.getNodeElement(y, x).classList.replace("end-hover", "end");
            this.isDragingEndNode = false;
            return;
        }

        //Normal DragMode
        this.isDraggingMouse = false;
    }
    //#endregion

    //#region HelperMethods
    private setClass = (node: Node, showGrid: boolean):string => {
        const { isStartNode, isStartNodePreview, isEndNode, isEndNodePreview,
            isError, isWall, wall_bgx, isWeighted: weighted } = node;

        let string = `node`;

        if (isError){
            string += ' error';
        }
        else if (isStartNode){
            string += ' start';
        }
        else if (isStartNodePreview){
            string += ' start-hover'
        }
        else if (isEndNode){
            string += ' end';
        }
        else if (isEndNodePreview){
            string += ' end-hover';
        }
        else if (isWall) {
            string += ` wall wall${wall_bgx}`;
        }
        else if (weighted){
            string+= ' weighted';
        }
        
        if (showGrid){
            string += ` grid`;
        }

        return string;
    }

    private getNodeElement = (y: number, x: number): HTMLDivElement => {
        return document.getElementById(`node-${y}-${x}`) as HTMLDivElement;
    }

    private toggleWall = (y: number, x: number): void => {
        const node = this.nodes[y][x];
        node.ToggleWall();
        const newClass = this.setClass(node, this.showGrid);
        this.getNodeElement(y, x).className = newClass;
    }

    private toggleWeight = (y: number, x: number): void => {
        const node = this.nodes[y][x];
        node.ToggleWeight();
        const newClass = this.setClass(node, this.showGrid);
        this.getNodeElement(y, x).className = newClass;
    }

    private setBeeToStartNode = (): void => {
        const {y, x} = this.startNode;
        const startNodeEl = document.getElementById(`node-${y}-${x}`);
        this.bee.style.top = startNodeEl.offsetTop + "px";
        this.bee.style.left = startNodeEl.offsetLeft + "px";
    }

    private getSelectedIndex = (e: Event): string => {
        const select = e.target as HTMLSelectElement;
        return select.options[select.selectedIndex].value;
    }

    private showResult = (succeeded: boolean): void => {
        if (succeeded){
            this.terminal.className = "succeeded";
            this.terminal.innerHTML = this.succeededMessage;
        }
        else {
            this.terminal.className = "failed";
            this.terminal.innerHTML = this.failedMessage;
        }

        setTimeout(() => {
            if (this.terminal.className !== "animating"){
                this.terminal.className = "dormant";
                this.terminal.innerHTML = this.dormantMessage;
            }
          }, 1000 * 5);
    }
    //#endregion
}

//Initialize an app instance
new App();