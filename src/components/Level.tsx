import React from "react";
import {Square} from "./Square";
import Col from "react-bootstrap/cjs/Col";
import Row from "react-bootstrap/esm/Row";
import {CustomTypes} from "../const/types";
import Button from "react-bootstrap/cjs/Button";
import ButtonGroup from "react-bootstrap/cjs/ButtonGroup";

interface LevelProps{
    toggleMenu: any;
    level:any;
    gameMap:any;
    environmentPictures:any;
    playerPictures:any;
    playerPosition:CustomTypes.Point;
    blockType:string;
}

interface LevelState{
    playerPosition:CustomTypes.Point;
}

export class Level extends React.Component<LevelProps,LevelState> {
    toggleMenu: any;
    level: any;
    gameMap: any;
    environmentPictures: any
    playerPictures:any
    movementInterval:any;
    movementPoint:CustomTypes.Point;
    blockType:string;
    defaultPlayerPosition: CustomTypes.Point;

    constructor(props: any) {
        super(props);
        this.toggleMenu = props.toggleMenu;
        this.gameMap = props.gameMap;
        this.environmentPictures = props.environmentPictures;
        this.playerPictures = props.playerPictures;
        this.blockType = props.blockType;
        this.defaultPlayerPosition = props.playerPosition;
        this.state = {
            playerPosition: props.playerPosition
        }
        this.movementPoint = [0,1]; //GO RIGHT

        this.changePlayerPosition = this.changePlayerPosition.bind(this);
    }

    componentDidMount() {
        this.focusThis();
    }

    componentDidUpdate(prevProps: Readonly<LevelProps>, prevState: Readonly<LevelState>, snapshot?: any) {
        this.focusThis();
    }

    changePlayerPosition(point:CustomTypes.Point){
        this.checkPlayerCollisionWithObject()
        this.setState({playerPosition:[this.state.playerPosition[0]+this.movementPoint[0],this.state.playerPosition[1]+this.movementPoint[1]]})
    }

    checkPlayerCollisionWithObject(){
        let value = this.gameMap[this.state.playerPosition[0]+this.movementPoint[0]][this.state.playerPosition[1]+this.movementPoint[1]]
        if(value === "1"){
            this.movementPoint = [0,0];
        }
    }

    startMovementInterval(){
        this.movementInterval = setInterval(this.changePlayerPosition,1000);
    }

    stopMovementInterval(){
        clearInterval(this.movementInterval);
    }

    focusThis() {
        this.level.focus();
    }

    checkIfPlayerOnTile(countRow:number, countCol:number):boolean{
        return countRow === this.state.playerPosition[0] && countCol === this.state.playerPosition[1];
    }

    resetPlayerPositionToPrevious(){
        clearInterval(this.movementInterval);
        this.setState({playerPosition:this.defaultPlayerPosition});
    }

    render() {
        return (
            <div className={"level_properties"} tabIndex={1} onKeyDown={(e: any) => {
                if (e.key === "Escape") {
                    this.toggleMenu(true);
                }
            }} ref={current => this.level = current}>
                <div className={"playground_properties"}>
                    {this.gameMap.map((row: Array<string>, countRow: number) =>
                        <Row key={"gameRow" + countRow}>
                            {row.map((colType: string, countCol: number) =>
                                <Col key={"gameCol" + countCol}>
                                    <Square
                                        isPlayerOn={this.checkIfPlayerOnTile(countRow, countCol)}
                                        playerPictures={this.playerPictures} wallColor={"blue"} type={colType}
                                        pathColor={"black"} sizeX={"50"}
                                        sizeY={"50"} environmentPictures={this.environmentPictures}>
                                    </Square>
                                </Col>)}
                        </Row>
                    )}</div>

                <ButtonGroup>
                    <Button className={"level-buttons-properties"} variant="success" size="lg" onClick={() => this.startMovementInterval()}>
                        Štart
                    </Button>
                    <Button className={"level-buttons-properties"} variant="danger" size="lg" onClick={() => this.stopMovementInterval()}>
                        Stop
                    </Button>
                    <Button className={"level-buttons-properties"} variant="secondary" size="lg" onClick={() => this.resetPlayerPositionToPrevious()}>
                        Reset
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}