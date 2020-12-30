import React from "react";
import {PLAYER, TILES} from "../const/images";
import {Level} from "./Level";
import {CustomTypes} from "../const/types";

export class Game extends React.Component<any,any>{
    pictures:any;
    playerPictures:any = PLAYER;
    tilesPictures:any = TILES;
    gameMap:any;
    playerPosition: CustomTypes.Point;
    finishPosition: CustomTypes.Point;

    constructor(props:any) {
        super(props);
        this.gameMap = [
            ["1","1","1","1","1","1","1"],
            ["1","0","1","0","1","0","1"],
            ["1","0","4","0","1","0","1"],
            ["1","0","1","0","0","0","1"],
            ["1","0","4","0","0","0","1"],
            ["1","0","0","0","1","4","1"],
            ["1","1","1","1","1","1","1"]];
        this.playerPosition = [1,1];
        this.finishPosition = [1,5];
    }

    render() {
        return (
            <Level defaultPlayerDirection={"d"} blockType={"1"} playerPictures={this.playerPictures} playerPosition={this.playerPosition}
                               tilesPictures={this.tilesPictures} gameMap={this.gameMap} level={"0"} finishPosition={this.finishPosition}/>
        );
    }
}
