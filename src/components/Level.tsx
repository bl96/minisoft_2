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
    numberOfCoins:number;
    gatheredCoins:number;
    speedValue:number;
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
    maxNumberRowsColsEditor: number = 10;

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
            numberOfCoins:5,
            gatheredCoins:0,
            speedValue:1000,
            minArrows:-1,
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
            finishPosition: this.defaultFinishPosition
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
            this.changeValueEditor(value,coords);

        } else {
            if(this.checkIfFinishOnTileEditor(coords[0],coords[1])){
                this.setState({editorFinishPosition:[-1,-1]});
            }
            if(this.checkIfPlayerOnTileEditor(coords[0],coords[1])){
                this.setState({editorPlayerPosition:[-1,-1]});
            }

            if (type === "0" || type === "1" || type === "4") {
                this.changeValueEditor(type,coords);
                return;
            }

            type==="player"?this.setState({editorPlayerPosition: coords}):this.setState({editorFinishPosition: coords})
        }
    }

    changeValueInArray(value: string, coords: CustomTypes.Point) {
        if(coords[0] === this.state.playerPosition[0] && coords[1] === this.state.playerPosition[1]){
            return;
        }

        let previousValue = this.state.gameMap[coords[0]][coords[1]];
        if (previousValue === "1" || previousValue === "2") {
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
            console.log(stateFromJson);
            ref.setState({...stateFromJson})
        }
        fr.readAsText(file);
    }

    saveFile(fileName:any){
        let blob = new Blob([JSON.stringify(this.state)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, fileName+".json");
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
            <Container fluid={true}>
                {this.state.toggleLevel ?
                    <Row>
                        <div className={"button-group-properties"}>
                            <Button className={"m-1"} variant="outline-success" size="lg"
                                    onClick={() => this.startMovementInterval()}>
                                Štartuj simuláciu
                            </Button>
                            <Button className={"m-1"} variant="outline-danger" size="lg"
                                    onClick={() => this.stopMovementInterval()}>
                                Zastav simuláciu
                            </Button>
                            <Button className={"m-1"} variant="outline-secondary" size="lg"
                                    onClick={() => this.resetPlayerPositionToPrevious()}>
                                Vymaž zmeny
                            </Button>
                            <Form>
                                <Form.Group controlId="formBasicRange">
                                    <Form.Label>Rýchlosť posunu</Form.Label>
                                    <Form.Control onChange={(e:any) => this.changeSpeed(e)} min={100} max={1000} step={50} value={this.state.speedValue} type="range" />
                                </Form.Group>
                            </Form>
                        </div>
                        <div className={"arrows-group-properties"}>
                            <Arrow arrowType={"w"} tilePicture={this.tilesPictures["w"]}/>
                            <Arrow arrowType={"s"} tilePicture={this.tilesPictures["s"]}/>
                            <Arrow arrowType={"a"} tilePicture={this.tilesPictures["a"]}/>
                            <Arrow arrowType={"d"} tilePicture={this.tilesPictures["d"]}/>
                        </div>
                    </Row> :
                    <Row>
                        <div className={"input-group-properties"}>
                            <Container>
                                <Row>
                                    <label className={"mr-2"} htmlFor="rows">Počet stĺpcov (min {this.minNumberRowsColsEditor},
                                        max {this.maxNumberRowsColsEditor}): {this.state.editorNmbRows}</label>
                                    <Button variant={"outline-success mr-2"}
                                            onClick={() => this.changeNmbRowsCols("r",true)}>
                                        +
                                    </Button>
                                    <Button variant={"outline-danger"}
                                            onClick={() => this.changeNmbRowsCols("r",false)}>
                                        -
                                    </Button>
                                </Row>
                                <div className={"mt-3"} >
                                    <Row>
                                        <label className={"mr-2"} htmlFor="rows">Počet stĺpcov (min {this.minNumberRowsColsEditor},
                                            max {this.maxNumberRowsColsEditor}): {this.state.editorNmbCols}</label>
                                        <Button variant={"outline-success mr-2"}
                                                onClick={() => this.changeNmbRowsCols("c",true)}>
                                            +
                                        </Button>
                                        <Button variant={"outline-danger"}
                                                onClick={() => this.changeNmbRowsCols("c",false)}>
                                            -
                                        </Button>
                                    </Row>
                                </div>
                            </Container>
                    </div>
                        <div className={"arrows-group-properties"}>
                            {(this.state.editorPlayerPosition[0]===-1 && this.state.editorPlayerPosition[1]===-1)?
                                <EditorPlayerFinish type={"player"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.playerPictures[this.state.editorPlayerDirection]}/>:
                                <div>
                                </div>
                            }
                            {(this.state.editorFinishPosition[0]===-1 && this.state.editorFinishPosition[1]===-1)?
                                <EditorPlayerFinish type={"finish"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.tilesPictures["2"]}/>:
                                <div>
                                </div>
                            }
                            <EditorPlayerFinish type={"coin"} setEditorPlayerDirection={this.setEditorPlayerDirection} tilePicture={this.tilesPictures["4"]}/>
                        </div>
                    </Row>}

                <div className={"menu-button-properties"}>
                    {this.state.toggleLevel ?
                        <Button className={"m-1"} variant="outline-primary" size="lg"
                                onClick={() => this.setToggleLevel(false)}>
                            Editor
                        </Button> :
                        <Button className={"m-1"} variant="outline-info" size="lg"
                                onClick={() => this.setToggleLevel(true)}>
                            Level
                        </Button>
                    }
                    {this.state.toggleLevel ?
                        <Button className={"m-1"} variant="outline-dark" size="lg"
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
                        </Button>:
                        <div>
                        </div>
                    }
                    {this.state.toggleLevel ?
                        <Button className={"m-1"} variant="outline-dark" size="lg"
                                onClick={() => this.saveFile("savedSipky")}>
                            Ulož
                        </Button>:
                        <Button className={"m-1"} variant="outline-dark" size="lg"
                                onClick={() => this.saveEditorMap()}>
                            Ulož zmeny
                        </Button>
                    }

                </div>
                <div className={"level_properties"} tabIndex={1} ref={current => this.level = current}>
                    {this.state.toggleLevel ?
                        <div className={"playground_properties"}>
                            {this.state.gameMap.map((row: Array<string>, countRow: number) =>
                                <Row key={"gameRow" + countRow}>
                                    {row.map((colType: string, countCol: number) =>
                                        <Col key={"gameCol" + countCol}>
                                            <Square
                                                finishPicture={this.tilesPictures["2"]}
                                                removeObjectFromTile={this.removeObjectFromTile}
                                                changeValueInArray={this.changeValueInArray}
                                                tileCoordsInArray={[countRow, countCol]}
                                                playerPicture={this.playerPictures[this.state.playerDirection]}
                                                tilePicture={this.tilesPictures[colType]}
                                                isPlayerOn={this.checkIfPlayerOnTile(countRow, countCol)}
                                                isFinishOn={this.checkIfFinishOnTile(countRow, countCol)}
                                            />
                                        </Col>)}
                                </Row>
                            )}
                        </div> :
                        <div className={"playground_properties"}>
                            {this.state.editorMap.map((row: Array<string>, countRow: number) =>
                                <Row key={"gameRow" + countRow}>
                                    {row.map((colType: string, countCol: number) =>
                                        <Col key={"gameCol" + countCol}>
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
                                </Row>
                            )}
                        </div>}
                </div>
                {this.state.toggleLevel ?
                    <p>Počet pozbieraných mincí: {this.state.gatheredCoins}</p>:<p/>
                }
            </Container>
        );
    }
}