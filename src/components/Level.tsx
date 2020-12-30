import React from "react";
import {Square} from "./Square";
import Col from "react-bootstrap/cjs/Col";
import Row from "react-bootstrap/esm/Row";
import {CustomTypes} from "../const/types";
import Button from "react-bootstrap/cjs/Button";
import {EditorPlayerFinish} from "./EditorPlayerFinish";
import Container from "react-bootstrap/cjs/Container";
import {Arrow} from "./Arrow";
import {SquareEditor} from "./SquareEditor";
import FileSaver from 'file-saver';
import Form from "react-bootstrap/esm/Form";

interface LevelProps{
    level:any;
    gameMap:any;
    blockType:string;
    tilesPictures:any;
    playerPictures:any;
    defaultPlayerDirection:string;
    playerPosition:CustomTypes.Point;
    finishPosition:CustomTypes.Point
}

interface LevelState{
    playerPosition:CustomTypes.Point;
    editorPlayerPosition:CustomTypes.Point;
    editorPlayerDirection:string;
    playerDirection:string;
    toggleLevel:boolean;
    gameMap:any;
    editorNmbRows: number;
    editorNmbCols: number;
    editorMap: any;
    editorFinishPosition:CustomTypes.Point;
    finishPosition:CustomTypes.Point;
    result:boolean;
    minArrows:number;
    numberOfCoinsToGather:number;
    gatheredCoins:number;
    speedValue:number;
    editorMaxCoins:number;
    playerInFinish:boolean;
}

export class Level extends React.Component<LevelProps,LevelState> {
    level: any;
    tilesPictures: any;
    playerPictures: any;
    defaultGameMap: any;
    movementInterval: any;
    defaultPlayerDirection:string;
    movementPoint: CustomTypes.Point;
    defaultPlayerPosition: CustomTypes.Point;
    defaultFinishPosition:CustomTypes.Point;
    minNumberRowsColsEditor: number = 1;
    maxNumberRowsColsEditor: number = 12;

    constructor(props: LevelProps) {
        super(props);

        this.defaultGameMap = this.createDeepCopyArray(this.props.gameMap);
        this.movementPoint = [0, 1]; //GO RIGHT
        this.tilesPictures = props.tilesPictures;
        this.playerPictures = props.playerPictures;
        this.defaultPlayerPosition = this.createDeepCopyCoord(props.playerPosition);
        this.defaultFinishPosition = this.createDeepCopyCoord(props.finishPosition);
        this.defaultPlayerDirection = props.defaultPlayerDirection;

        this.state = {
            editorMaxCoins:0,
            playerPosition: props.playerPosition,
            finishPosition: props.finishPosition,
            gameMap: props.gameMap,
            editorMap: this.createDeepCopyArray(this.defaultGameMap),
            editorPlayerDirection: "d",
            playerDirection: "d",
            editorPlayerPosition: [-1,-1],
            editorFinishPosition: [-1,-1],
            editorNmbRows: props.gameMap.length,
            editorNmbCols: props.gameMap[0].length,
            toggleLevel: true,
            numberOfCoinsToGather:3,
            gatheredCoins:0,
            speedValue:1000,
            minArrows:-1,
            playerInFinish: false,
            result: false
        }
        this.changePlayerPosition = this.changePlayerPosition.bind(this);
        this.changeValueInArray = this.changeValueInArray.bind(this);
        this.removeObjectFromTile = this.removeObjectFromTile.bind(this);
        this.setToggleLevel = this.setToggleLevel.bind(this);
        this.setEditorPlayerDirection = this.setEditorPlayerDirection.bind(this);
        this.changeValueInArrayEditor = this.changeValueInArrayEditor.bind(this);
        this.checkIfFinishOnTileEditor = this.checkIfFinishOnTileEditor.bind(this);
        this.checkIfPlayerOnTileEditor = this.checkIfPlayerOnTileEditor.bind(this);
    }

    setEditorPlayerDirection(isPlayer:boolean) {
        if (isPlayer) {
            let playerDirection: string = this.state.editorPlayerDirection;
            switch (playerDirection) {
                case("w"):
                    playerDirection = "d";
                    break;
                case("d"):
                    playerDirection = "s";
                    break;
                case("s"):
                    playerDirection = "a";
                    break;
                case("a"):
                    playerDirection = "w";
                    break;
                default:
                    break;
            }
            this.setState({editorPlayerDirection: playerDirection});
        }
    }

    setToggleLevel(boolean:boolean){
        this.setState({editorPlayerPosition: [-1,-1],editorFinishPosition: [-1,-1],editorMap:this.createDeepCopyArray(this.defaultGameMap), editorNmbCols: this.defaultGameMap.length, editorNmbRows:this.defaultGameMap[0].length,toggleLevel:boolean});
        if(this.movementInterval!==null){
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
    }

    changePlayerPosition() {
        this.checkPlayerCollisionWithObject();
    }

    createDeepCopyCoord(coord:any):CustomTypes.Point{
        return [coord[0],coord[1]];
    }

    createDeepCopyArray(gameMap: any): string[] {
        let finalArray: string[] = [];
        gameMap.map((subArray: any) => {
            let subArrayCopy: any = [];
            subArray.map((value: string) => {
                subArrayCopy.push(value);
            });
            finalArray.push(subArrayCopy);
        });
        return finalArray;
    }

    removeCoinsFromArray(coords:CustomTypes.Point){
        let newGameMapCopy: any = [...this.state.gameMap];
        newGameMapCopy[coords[0]][coords[1]] = "0";
        this.setState({gameMap: newGameMapCopy});
    }

    checkPlayerCollisionWithObject() {
        let x = this.state.playerPosition[0] + this.movementPoint[0];
        let y = this.state.playerPosition[1] + this.movementPoint[1];
        if (this.defaultGameMap && this.defaultGameMap.length !== 0 && this.defaultGameMap[0].length !== 0
            && (x > -1 && x < this.defaultGameMap.length) && (y > -1 && y < this.defaultGameMap[0].length)) {
            let value = this.state.gameMap[x][y]

            if(this.state.playerPosition[0] === this.state.finishPosition[0] && this.state.playerPosition[1] === this.state.finishPosition[1]){
                this.stopMovementInterval();
                this.setState({playerInFinish:true});
                return;
            }

            if (value !== "1") {
                this.setState({playerPosition: [this.state.playerPosition[0] + this.movementPoint[0]
                        , this.state.playerPosition[1] + this.movementPoint[1]]});
            }
            switch (value) {
                case("1"):
                    if(this.state.playerDirection === "w"){
                        this.setState({playerDirection:"d"});
                        this.movementPoint = [0,1];
                    }
                    else if(this.state.playerDirection === "s"){
                        this.setState({playerDirection:"a"});
                        this.movementPoint = [0, -1];
                    }
                    else if(this.state.playerDirection === "a"){
                        this.setState({playerDirection:"w"});
                        this.movementPoint = [-1, 0];
                    }
                    else if(this.state.playerDirection === "d"){
                        this.setState({playerDirection:"s"});
                        this.movementPoint = [1, 0];
                    }
                    break;
                case("4"):
                    this.removeCoinsFromArray([x,y]);
                    this.setState({gatheredCoins:this.state.gatheredCoins+1})
                    break;
                case("w"):
                    this.movementPoint = [-1, 0];
                    this.setState({playerDirection: "w"});
                    break;
                case("s"):
                    this.movementPoint = [1, 0];
                    this.setState({playerDirection: "s"});
                    break;
                case("a"):
                    this.movementPoint = [0, -1];
                    this.setState({playerDirection: "a"});
                    break;
                case("d"):
                    this.movementPoint = [0, 1];
                    this.setState({playerDirection: "d"});
                    break;
                case("0"):
                default:
                    break;
            }
        }
    }

    startMovementInterval() {
        if (this.movementInterval == null) {
            this.movementInterval = setInterval(this.changePlayerPosition, this.state.speedValue);
            this.setState({gatheredCoins:0});
        }
    }

    stopMovementInterval() {
        clearInterval(this.movementInterval);
        this.movementInterval = null;
    }

    checkIfPlayerOnTile(countRow: number, countCol: number): boolean {
        return countRow === this.state.playerPosition[0] && countCol === this.state.playerPosition[1];
    }

    checkIfPlayerOnTileEditor(countRow: number, countCol: number): boolean {
        return countRow === this.state.editorPlayerPosition[0] && countCol === this.state.editorPlayerPosition[1];
    }

    checkIfFinishOnTile(countRow: number, countCol: number): boolean {
        return countRow === this.state.finishPosition[0] && countCol === this.state.finishPosition[1];
    }

    checkIfFinishOnTileEditor(countRow: number, countCol: number): boolean {
        return countRow === this.state.editorFinishPosition[0] && countCol === this.state.editorFinishPosition[1];
    }


    resetPlayerPositionToPrevious() {
        this.stopMovementInterval();
        this.movementPoint = [0, 1];
        this.setState({
            gameMap: this.createDeepCopyArray(this.defaultGameMap),
            playerPosition: this.defaultPlayerPosition,
            playerDirection: this.defaultPlayerDirection,
            finishPosition: this.defaultFinishPosition,
            playerInFinish: false,
            gatheredCoins: 0
        });
    }


    changeValueEditor(value:string, coords:CustomTypes.Point){
        let newGameMapCopy: any = [...this.state.editorMap];
        newGameMapCopy[coords[0]][coords[1]] = value;
        this.setState({editorMap: newGameMapCopy});
    }

    changeValueInArrayEditor(coords: CustomTypes.Point, type:string, isDraggableObject:boolean = false) {
        let previousValue = this.state.editorMap[coords[0]][coords[1]];

        if (!isDraggableObject) {
            if ((coords[0] === this.state.editorPlayerPosition[0] && coords[1] === this.state.editorPlayerPosition[1]) || previousValue === "2") {
                return;
            }
            let value = "0";
            if (previousValue === "0") {
                value = "1";
            }
            if(previousValue === "4"){
                let newValue = this.state.editorMaxCoins-1;

                if(newValue<this.state.numberOfCoinsToGather){
                    this.setState({editorMaxCoins:newValue, numberOfCoinsToGather:newValue});
                }
                else{
                    this.setState({editorMaxCoins:newValue});
                }
            }
            this.changeValueEditor(value,coords);

        } else {
            if(this.checkIfFinishOnTileEditor(coords[0],coords[1])){
                this.setState({editorFinishPosition:[-1,-1]});
            }
            if(this.checkIfPlayerOnTileEditor(coords[0],coords[1])){
                this.setState({editorPlayerPosition:[-1,-1]});
            }

            if(previousValue === "4"){
                if(type === "4"){
                    return;
                }
                let newValue:number = this.state.editorMaxCoins-1;
                if(newValue<this.state.numberOfCoinsToGather){
                    this.setState({editorMaxCoins:newValue,numberOfCoinsToGather:newValue});
                }
                else{
                    this.setState({editorMaxCoins:newValue});
                }
            }

            if (type === "0" || type === "1") {
                this.changeValueEditor(type,coords);
                return;
            }

            if(type === "4"){
                this.setState({editorMaxCoins:this.state.editorMaxCoins+1});
                this.changeValueEditor(type,coords);
                return;
            }

            type==="player"?this.setState({editorPlayerPosition: coords}):this.setState({editorFinishPosition: coords})
        }
    }

    changeValueInArray(value: string, coords: CustomTypes.Point) {
        if(this.checkIfPlayerOnTile(coords[0],coords[1]) || this.checkIfFinishOnTile(coords[0],coords[1])){
            return;
        }

        let previousValue = this.state.gameMap[coords[0]][coords[1]];
        if (previousValue === "1" || previousValue === "4") {
            return;
        }

        let newGameMapCopy: any = [...this.state.gameMap];
        newGameMapCopy[coords[0]][coords[1]] = value;
        this.setState({gameMap: newGameMapCopy});
    }

    removeObjectFromTile(tileCoords: CustomTypes.Point) {
        let tileType = this.state.gameMap[tileCoords[0]][tileCoords[1]];
        if (tileType === "w" || tileType === "s" || tileType === "a" || tileType === "d") {
            let newGameMapCopy: any = [...this.state.gameMap];
            newGameMapCopy[tileCoords[0]][tileCoords[1]] = "0";
            this.setState({gameMap: newGameMapCopy});
        }
    }

    checkResult() {
        let result:any = {};
        fetch("/checkResult/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //make sure to serialize your JSON body
            body: JSON.stringify({
                "board": this.defaultGameMap,
                "playerCoords": [this.state.playerPosition[1],this.state.playerPosition[0]],
                "finishCoords": [this.state.finishPosition[1],this.state.finishPosition[0]],
                "playerDirection": this.state.playerDirection
            })
        }).then(res => res.json())
            .then((response) => {
                result = response;
                if(result.board.length === 0){
                    this.setState({result:false,minArrows:result.minArrows});
                    return;
                }

                let gameMap = this.state.gameMap;
                let resBoard = result.board;

                for(let x=0;x<resBoard.length;x++){
                    let subArray = resBoard[x];
                    let isSame = true;
                    for(let i = 0; i<subArray.length;i++){
                        if(isSame){
                            for(let a = 0; a<subArray[i].length;a++){
                                if(gameMap[i][a] !== subArray[i][a]){
                                    isSame = false;
                                    break;
                                }
                            }
                        }
                        else{
                            break;
                        }
                    }
                    if(isSame){
                        this.setState({result:true, minArrows:result.minArrows});
                        return;
                    }
                    else{
                        this.setState({result:false, minArrows:result.minArrows});
                    }
                }
            });
    }

    changeNmbCoins(incNumb:boolean){
        let incCount:number = incNumb?+1:-1;
        let newCount:number = this.state.numberOfCoinsToGather + incCount;

        if(newCount>this.state.editorMaxCoins || newCount<0){
            return;
        }

        this.setState({numberOfCoinsToGather: newCount});
    }

    changeNmbRowsCols(type:string, incNmb:boolean){
        let incCount: number = incNmb?+1:-1;
        let maxNmb: number = type === "c"?(this.state.editorNmbCols+incCount):(this.state.editorNmbRows+incCount);

        if(maxNmb>this.maxNumberRowsColsEditor){
            maxNmb = this.maxNumberRowsColsEditor;
        }

        if(maxNmb<1){
            maxNmb = 1;
        }

        if(type === "r"){
            this.setState({editorNmbRows: maxNmb});
            this.changeArraySize(maxNmb, "r", incNmb);
        }
        else{
            this.setState({editorNmbCols: maxNmb});
            this.changeArraySize(maxNmb, "c", incNmb);
        }
    }

    changeArraySize(size:number, type:string, increaseNmb:boolean){
        let newGameMapCopy: any = [...this.state.editorMap];

        if(type === "r"){
            if(increaseNmb){
                let sizeCols = newGameMapCopy[0].length;
                while(size>newGameMapCopy.length){
                    let array = [];
                    for(let i = 0; i<sizeCols;i++){
                        array.push("0");
                    }
                    newGameMapCopy.push(array);
                }
            }
            else{
                while(size<newGameMapCopy.length){
                    newGameMapCopy.pop();
                    if((newGameMapCopy.length-1)<this.state.editorFinishPosition[0]){
                        this.setState({editorFinishPosition:[-1,-1]});
                    }
                    if((newGameMapCopy.length-1)<this.state.editorPlayerPosition[0]){
                        this.setState({editorPlayerPosition:[-1,-1]});
                    }
                }
            }
        }
        else {
            if(increaseNmb){
                while(size > newGameMapCopy[0].length) {
                    for (let i = 0; i < newGameMapCopy.length; i++) {
                        newGameMapCopy[i].push("0");
                    }
                }
            }
            else{
                while(newGameMapCopy[0].length > size){
                    for (let i = 0; i < newGameMapCopy.length; i++) {
                        newGameMapCopy[i].pop();
                        if((newGameMapCopy[i].length-1)<this.state.editorFinishPosition[1]){
                            this.setState({editorFinishPosition:[-1,-1]});
                        }
                        if((newGameMapCopy[i].length-1)<this.state.editorPlayerPosition[1]){
                            this.setState({editorPlayerPosition:[-1,-1]});
                        }
                    }
                }
            }
        }
        this.setState({editorMap: newGameMapCopy});
    }

    importState(e:any) {
        let fr = new FileReader();
        let file = e.target.files[0];
        let ref = this;

        fr.onload = function (e:any) {
            let stateFromJson = JSON.parse(e.target.result);
            ref.setState({...stateFromJson})
        }
        fr.readAsText(file);
    }

    saveFile(fileName:any){
        let blob = new Blob([JSON.stringify(this.state)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, fileName+".json");
    }

    checkNumberOfCoins(){
        let numberCoins: number = 0;
        for(let i=0;i<this.defaultGameMap.length;i++){
            for(let a = 0; a<this.defaultGameMap[i].length;a++){
                if(this.defaultGameMap[i][a] === "4"){
                    numberCoins+=1;
                }
            }
        }
        this.setState({editorMaxCoins:numberCoins});
    }

    saveEditorMap() {
        this.defaultGameMap = this.createDeepCopyArray(this.state.editorMap);

        this.setState({
            gameMap: this.createDeepCopyArray(this.state.editorMap),
            playerDirection: this.state.editorPlayerDirection,
            playerPosition: this.state.editorPlayerPosition,
            finishPosition: this.state.editorFinishPosition,
        });
        this.defaultPlayerPosition = this.state.editorPlayerPosition;
        this.defaultPlayerDirection = this.state.editorPlayerDirection;
        this.defaultFinishPosition = this.state.editorFinishPosition;
    }

    changeSpeed(event:any){
        let value:number = event.target.value;
        this.setState({speedValue:value}, () => this.changeIntervalSpeed());
    }

    changeIntervalSpeed(){
        if(this.movementInterval!==null && this.movementInterval!==undefined){
            this.stopMovementInterval();
            this.startMovementInterval();
        }
    }

    render() {
        return (
            <Container fluid={true} className={"game-grid"}>
            {this.state.toggleLevel ?
                    <div>
                        <Row className={"margin-top"}>
                            <Col className={"justify-content-center button-group-properties"}>
                                <Button className={"m-1"} variant="outline-success"
                                        onClick={() => this.startMovementInterval()}>
                                    Štartuj simuláciu
                                </Button>
                                <Button className={"m-1"} variant="outline-danger"
                                        onClick={() => this.stopMovementInterval()}>
                                    Zastav simuláciu
                                </Button>
                                <Button className={"m-1"} variant="outline-secondary"
                                        onClick={() => this.resetPlayerPositionToPrevious()}>
                                    Vymaž zmeny
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={"justify-content-center button-group-properties"}>
                                <Form>
                                    <Form.Group controlId="formBasicRange">
                                        <Form.Label>Rýchlosť posunu</Form.Label>
                                        <Form.Control onChange={(e: any) => this.changeSpeed(e)} min={100} max={1000}
                                                      step={50} value={this.state.speedValue} type="range"/>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={"my-auto col-2"}>
                                <Row>
                                    <Arrow arrowType={"w"} tilePicture={this.tilesPictures["w"]}/>
                                </Row>
                                <Row>
                                    <Arrow arrowType={"s"} tilePicture={this.tilesPictures["s"]}/>
                                </Row>
                                <Row>
                                    <Arrow arrowType={"a"} tilePicture={this.tilesPictures["a"]}/>
                                </Row>
                                <Row>
                                    <Arrow arrowType={"d"} tilePicture={this.tilesPictures["d"]}/>
                                </Row>
                            </Col>
                            <Col className={"col-8 justify-content-center playground-properties-center"}>
                                <div className={"playground-properties"}>
                                {this.state.gameMap.map((row: Array<string>, countRow: number) =>
                                    <Row className={"no-padding"} key={"gameRow" + countRow}>
                                        {row.map((colType: string, countCol: number) =>
                                            <Col className={"no-padding"} key={"gameCol" + countCol}>
                                                <Square
                                                    finishPicture={this.tilesPictures[this.state.gatheredCoins === this.state.numberOfCoinsToGather?"3":"2"]}
                                                    removeObjectFromTile={this.removeObjectFromTile}
                                                    changeValueInArray={this.changeValueInArray}
                                                    tileCoordsInArray={[countRow, countCol]}
                                                    playerPicture={this.playerPictures[this.state.playerDirection]}
                                                    tilePicture={this.tilesPictures[colType]}
                                                    isPlayerOn={this.checkIfPlayerOnTile(countRow, countCol)}
                                                    isFinishOn={this.checkIfFinishOnTile(countRow, countCol)}
                                                />
                                            </Col>)}
                                    </Row>)}
                                </div>
                            </Col>
                            <Col className={"col-2 button-group-properties-right my-auto"}>
                                <Row>
                                    <Button className={"m-1 min-width-properties"} variant="outline-primary"
                                            onClick={() => {this.setToggleLevel(false); this.checkNumberOfCoins();}}>
                                        Editor
                                    </Button>
                                </Row>
                                <Row>
                                    <Button className={"m-1 min-width-properties"} variant="outline-dark"
                                            onClick={() => this.saveFile("savedSipky")}>
                                        Ulož</Button>
                                </Row>
                                <Row>
                                    <Button className={"m-1 min-width-properties"} variant="outline-dark"
                                            onClick={() => {
                                                let doc = document.getElementById('uploadInput');
                                                if (doc) {
                                                    doc.click()
                                                }
                                            }}>
                                        Načítaj
                                        <input id='uploadInput' type='file' name='jsonFile'
                                               onChange={(e) => {
                                                   this.importState(e);
                                               }}
                                               hidden={true}
                                               style={{display: 'none'}}/>
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center margin-top"}>
                            <p>Počet pozbieraných mincí: {this.state.gatheredCoins}</p>
                        </Row>
                        <Row className={"justify-content-center margin-top task-details-properties"}>
                            <p>Pozbieraj práve {this.state.numberOfCoinsToGather} {this.state.numberOfCoinsToGather===0?"mincí":this.state.numberOfCoinsToGather===1?"mincu":"mince"} aby si vedel zobrať poklad.</p>
                        </Row>
                        <Row className={"justify-content-center result-details-properties"}>
                            {this.state.playerInFinish?<p>{this.state.numberOfCoinsToGather === this.state.gatheredCoins?"Gratulujeme, splnil si úlohu podľa zadania.":"Tvoje riešenie nie je úplne správne, skús nájsť iné."}</p>:<p></p>}
                        </Row>
                    </div> :
                <div>
                    <Row className={"margin-top"}>
                            <Col className={"d-flex justify-content-center"}>
                                <label className={"m-1"} htmlFor="rows">Počet riadkov (min {this.minNumberRowsColsEditor},
                                    max {this.maxNumberRowsColsEditor}): {this.state.editorNmbRows}</label>
                                <Button className={"m-1 button-add-dec"} variant={"outline-success"}
                                        onClick={() => this.changeNmbRowsCols("r",true)}>
                                    +
                                </Button>
                                <Button className={"m-1 button-add-dec"} variant={"outline-danger"}
                                        onClick={() => this.changeNmbRowsCols("r",false)}>
                                    -
                                </Button>
                            </Col>
                        </Row>
                        <Row className={"margin-top"}>
                            <Col className={"d-flex justify-content-center"}>
                                <label className={"m-1"} htmlFor="rows">Počet stĺpcov (min {this.minNumberRowsColsEditor},
                                    max {this.maxNumberRowsColsEditor}): {this.state.editorNmbCols}</label>
                                <Button className={"m-1 button-add-dec"} variant={"outline-success"}
                                        onClick={() => this.changeNmbRowsCols("c",true)}>
                                    +
                                </Button>
                                <Button className={"m-1 button-add-dec"} variant={"outline-danger"}
                                        onClick={() => this.changeNmbRowsCols("c",false)}>
                                    -
                                </Button>
                            </Col>
                        </Row>
                    <Row className={"margin-top"}>
                        <Col className={"d-flex justify-content-center"}>
                            <label className={"m-1"} htmlFor="rows">Počet mincí, ktoré má hráč pozbierať: (min 0, max {this.state.editorMaxCoins} - maximálny počet mincí zavísí od počtú mincí v hre): {this.state.numberOfCoinsToGather}</label>
                            <Button className={"m-1 button-add-dec"} variant={"outline-success"}
                                    onClick={() => this.changeNmbCoins(true)}>
                                +
                            </Button>
                            <Button className={"m-1 button-add-dec"} variant={"outline-danger"}
                                    onClick={() => this.changeNmbCoins(false)}>
                                -
                            </Button>
                        </Col>
                    </Row>
                    <Row className={"margin-top-big"}>
                        <Col className={"my-auto"}>
                            <Row>
                                {(this.state.editorPlayerPosition[0]===-1 && this.state.editorPlayerPosition[1]===-1)?
                                    <EditorPlayerFinish type={"player"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.playerPictures[this.state.editorPlayerDirection]}/>:
                                    <div>
                                    </div>
                                }
                            </Row>
                           <Row>
                               {(this.state.editorFinishPosition[0]===-1 && this.state.editorFinishPosition[1]===-1)?
                                   <EditorPlayerFinish type={"finish"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.tilesPictures["2"]}/>:
                                   <div>
                                   </div>
                               }
                           </Row>
                           <Row>
                               <EditorPlayerFinish type={"coin"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.tilesPictures["4"]}/>
                           </Row>
                        </Col>
                        <Col className={"col-8 justify-content-center playground-properties-center"}>
                            <div className={"playground-properties"}>
                                {this.state.editorMap.map((row: Array<string>, countRow: number) =>
                                    <Row className={"no-padding"} key={"gameRow" + countRow}>
                                        {row.map((colType: string, countCol: number) =>
                                            <Col className={"no-padding"} key={"gameCol" + countCol}>
                                                <SquareEditor
                                                    setEditorPlayerDirection={this.setEditorPlayerDirection}
                                                    checkIfFinishOnTileEditor={this.checkIfFinishOnTileEditor}
                                                    checkIfPlayerOnTileEditor={this.checkIfPlayerOnTileEditor}
                                                    changeValueInArrayEditor={this.changeValueInArrayEditor}
                                                    tileCoordsInArray={[countRow, countCol]}
                                                    playerPicture={this.playerPictures[this.state.editorPlayerDirection]}
                                                    colType={colType}
                                                    tilePicture={this.tilesPictures[colType]}
                                                    finishPicture={this.tilesPictures["2"]}
                                                    isPlayerOn={this.checkIfPlayerOnTileEditor(countRow, countCol)}
                                                    isFinishOn={this.checkIfFinishOnTileEditor(countRow, countCol)}
                                                />
                                            </Col>)}
                                    </Row>)}
                            </div>
                        </Col>
                        <Col className={"button-group-properties-right my-auto"}>
                            <Row>
                                <Button className={"m-1 min-width-properties-big"} variant="outline-info" size="lg"
                                        onClick={() => this.setToggleLevel(true)}>
                                    Level
                                </Button>
                            </Row>
                            <Row>
                                <Button className={"m-1 min-width-properties-big"} variant="outline-dark" size="lg"
                                        onClick={() => this.saveEditorMap()}>
                                    Ulož zmeny
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </div>
            }
            </Container>
        );
    }
}