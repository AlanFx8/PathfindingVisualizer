export default class Node {
    //#region Variables
    static WeightCost = 10;
    x;
    y;
    bgx;
    bgy;
    isWall = false;
    isStartNode = false;
    isStartNodePreview = false;
    isEndNode = false;
    isEndNodePreview = false;
    isError = false;
    isChecked = false;
    local_distance = Infinity; //AKA the g value
    heuristic_distance = Infinity; //AKA the h value
    global_distance = Infinity; //AKA the f value of f = g + h
    neighbours = [];
    diagonalNeighbours = [];
    previousNode = null;
    wall_bgx = 0;
    isWeighted = false;
    //#endregion
    //#region Constructor
    constructor(y, x, bgx, bgy) {
        this.y = y;
        this.x = x;
        this.bgx = bgx;
        this.bgy = bgy;
    }
    //#endregion
    //#region Methods
    StartNodeOn = () => {
        this.isWall = false;
        this.isWeighted = false;
        this.isStartNodePreview = false;
        this.isStartNode = true;
    };
    StartNodeOff = () => { this.isStartNode = false; };
    StartNodePreviewOn = () => { this.isStartNodePreview = true; };
    StartNodePreviewOff = () => { this.isStartNodePreview = false; };
    //End Nodes
    EndNodeOn = () => {
        this.isWall = false;
        this.isWeighted = false;
        this.isEndNodePreview = false;
        this.isEndNode = true;
    };
    EndNodeOff = () => { this.isEndNode = false; };
    EndNodePreviewOn = () => { this.isEndNodePreview = true; };
    EndNodePreviewOff = () => { this.isEndNodePreview = false; };
    //Errors
    ErrorOn = () => { this.isError = true; };
    ErrorOff = () => { this.isError = false; };
    //Walls
    WallOn = () => {
        if (this.isStartNode || this.isEndNode)
            return;
        this.isChecked = false;
        this.isWeighted = false;
        this.wall_bgx = Math.floor((Math.random() * 4));
        this.isWall = true;
    };
    WallOff = () => { this.isWall = false; };
    ToggleWall = () => {
        if (!this.isWall) {
            this.WallOn();
        }
        else {
            this.WallOff();
        }
    };
    //Weights
    WeightOn = () => { this.isWeighted = true; };
    WeightOff = () => { this.isWeighted = false; };
    ToggleWeight = () => {
        if (!this.isWeighted) {
            this.WeightOn();
        }
        else {
            this.WeightOff();
        }
    };
    //Checks
    CheckOn = () => { this.isChecked = true; };
    CheckOff = () => { this.isChecked = false; };
}
