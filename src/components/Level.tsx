import React from "react";
import {Square} from "./Square";
import Col from "react-bootstrap/cjs/Col";
import Row from "react-bootstrap/esm/Row";

interface LevelProps{
    toggleMenu: any;
    level:any;
    gameMap:any;
    environmentPictures:any
}

interface MainState{

}

export class Level extends React.Component<LevelProps,MainState> {
    toggleMenu: any;
    level: any;
    gameMap: any;
    environmentPictures: any

    constructor(props: any) {
        super(props);
        this.toggleMenu = this.props.toggleMenu;
        this.gameMap = this.props.gameMap;
        this.environmentPictures = this.props.environmentPictures;
    }

    componentDidMount() {
        this.focusThis();
    }

    componentDidUpdate(prevProps: Readonly<LevelProps>, prevState: Readonly<MainState>, snapshot?: any) {
        this.focusThis();
    }

    focusThis() {
        this.level.focus();
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
                                    <Square wallColor={"blue"} type={colType} pathColor={"black"} sizeX={"50"}
                                            sizeY={"50"} environmentPictures={this.environmentPictures}/>
                                </Col>)}
                        </Row>
                    )}
                </div>
            </div>
        );
    }
}