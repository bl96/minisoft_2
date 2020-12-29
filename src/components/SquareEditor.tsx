import React from "react";
import {CustomTypes} from "../const/types";

interface SquareProps{
    tilePicture:any;
    playerPicture:any;
    isPlayerOn: boolean;
    isFinishOn: boolean;
    changeValueInArrayEditor:any;
    checkIfPlayerOnTileEditor:any;
    checkIfFinishOnTileEditor:any;
    setEditorPlayerDirection:any;
    finishPicture:any;
    colType:string;
    tileCoordsInArray: CustomTypes.Point;
}

interface SquareState{

}

export class SquareEditor extends React.Component<SquareProps,SquareState> {
    squareRef: any;
    tileCoordsInArray: CustomTypes.Point;

    constructor(props: SquareProps) {
        super(props);
        this.tileCoordsInArray = props.tileCoordsInArray;
    }

    onDropObject(event:any) {
        let value: string = event.dataTransfer.getData("value");
        if(value === ""){
            return;
        }
        this.props.changeValueInArrayEditor(this.tileCoordsInArray, value, true);
    }

    dragObject(event:any){
        if(this.props.isPlayerOn){
            event.dataTransfer.setData("value","player");
        }
        else if(this.props.isFinishOn){
            event.dataTransfer.setData("value","finish");
        }
        else{
            event.dataTransfer.setData("value",this.props.colType);
        }
    }

    clickToChange(event:any){
        if(this.props.isPlayerOn){
            this.props.setEditorPlayerDirection(true);
            return;
        }

        if(this.props.isFinishOn){
            return;
        }
        this.props.changeValueInArrayEditor(this.tileCoordsInArray, false)
    }

    render() {
        return (
            <img
                onDragStart={(e) => this.dragObject(e)}
                onDrop={(e) => this.onDropObject(e)}
                onDragOver={(e) => e.preventDefault()}
                onClick={(e)=> this.clickToChange(e)}
                className={"square_properties"}
                src={(this.props.isPlayerOn) ? this.props.playerPicture.default : (this.props.isFinishOn) ? this.props.finishPicture.default : this.props.tilePicture.default}
                alt={"square"}/>
        );
    }
}