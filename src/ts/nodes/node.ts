export default class Node {
    //#region Variables
    static WeightCost = 10;
    public x: number;
    public y: number;
    public bgx: number;
    public bgy: number;
    public isWall: boolean = false;   
    public isStartNode: boolean = false;
    public isStartNodePreview: boolean = false;
    public isEndNode: boolean = false;
    public isEndNodePreview: boolean = false;
    public isError: boolean = false;
    public isChecked: boolean = false;
    public local_distance: number = Infinity; //AKA the g value
    public heuristic_distance: number = Infinity; //AKA the h value
    public global_distance: number = Infinity; //AKA the f value of f = g + h
    public neighbours = [] as Node[];
    public diagonalNeighbours = [] as Node[];
    public previousNode: Node = null;
    public wall_bgx: number = 0;
    public isWeighted: boolean = false;
    //#endregion

    //#region Constructor
    constructor(y: number, x: number, bgx: number, bgy: number){
        this.y = y;
        this.x = x;
        this.bgx = bgx;
        this.bgy = bgy;
    }
    //#endregion

    //#region Methods
    public StartNodeOn = (): void => {
        this.isWall = false;
        this.isWeighted = false;
        this.isStartNodePreview  = false;
        this.isStartNode = true;
    }

    public StartNodeOff = (): void => { this.isStartNode = false; }

    public StartNodePreviewOn = (): void => { this.isStartNodePreview = true; }

    public StartNodePreviewOff = (): void => { this.isStartNodePreview = false; }

    //End Nodes
    public EndNodeOn = (): void => {
        this.isWall = false;
        this.isWeighted = false;
        this.isEndNodePreview = false;
        this.isEndNode = true;
    }

    public EndNodeOff = (): void => { this.isEndNode = false; }

    public EndNodePreviewOn = (): void => { this.isEndNodePreview = true; }

    public EndNodePreviewOff = (): void => { this.isEndNodePreview = false; }

    //Errors
    public ErrorOn = (): void => { this.isError = true; }

    public ErrorOff = (): void => { this.isError = false; }

    //Walls
    public WallOn = (): void => {
        if (this.isStartNode || this.isEndNode) return;
        this.isChecked = false;
        this.isWeighted = false;
        this.wall_bgx = Math.floor((Math.random() * 4));
        this.isWall = true;
    }

    public WallOff = (): void => { this.isWall = false; }

    public ToggleWall = (): void => {
        if (!this.isWall){
            this.WallOn();
        }
        else {
            this.WallOff();
        }
    }

    //Weights
    public WeightOn = (): void => { this.isWeighted = true; }
    
    public WeightOff = (): void => { this.isWeighted = false; }

    public ToggleWeight = (): void => {
        if (!this.isWeighted){
            this.WeightOn();
        }
        else {
            this.WeightOff();
        }
    }

    //Checks
    public CheckOn = (): void => { this.isChecked = true; }

    public CheckOff = (): void => { this.isChecked = false; }
    //#endregion
}