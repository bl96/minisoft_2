import React from "react";
import {CustomTypes} from "../const/types";

interface SquareProps{
    tilePicture:any;
    playerPicture:any;
    finishPicture:any;
    isPlayerOn: boolean;
    isFinishOn: boolean;
    changeValueInArray:any;
    removeObjectFromTile:any;
    tileCoordsInArray: CustomTypes.Point;
}

interface SquareState{
}

export class Square extends React.Component<SquareProps,SquareState> {
    squareRef: any;
    changeValueInArray:any;
    tileCoordsInArray: CustomTypes.Point;

    constructor(props: SquareProps) {
        super(props);
        this.tileCoordsInArray = props.tileCoordsInArray;
        this.changeValueInArray = props.changeValueInArray;
        this.state = {
            isPlayerOn:props.isPlayerOn
        }
    }
    onDropObject(event:any){
        let value:string = event.dataTransfer.getData("arrow_type");
        if(value){
            this.changeValueInArray(value,this.tileCoordsInArray);
        }
    }

    render() {
        return (
            <img
                 onClick={() => this.props.removeObjectFromTile(this.tileCoordsInArray)}
                 onDrop={(e) => this.onDropObject(e)}
                 onDragOver={(e) => e.preventDefault()}
                 className={"square_properties"}
                 src={(this.props.isPlayerOn) ? this.props.playerPicture.default : (this.props.isFinishOn)? this.props.finishPicture.default:this.props.tilePicture.default}
                 alt={"square"}/>
        );
    }
}