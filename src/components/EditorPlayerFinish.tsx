import React from "react";

interface EditorPlayerFinishProps{
    tilePicture:any;
    setEditorPlayerDirection:any;
    isPlayer:boolean;
}

interface EditorPlayerFinishState{
    isInEditor:boolean
}

export class EditorPlayerFinish extends React.Component<EditorPlayerFinishProps,EditorPlayerFinishState> {
    objectRef:any;

    constructor(props:any) {
        super(props);
    }

    dragObject(event:any){
        event.dataTransfer.setData("isPlayer", this.props.isPlayer);
    }

    render() {
        return (
            <img onClick={()=> this.props.setEditorPlayerDirection(this.props.isPlayer)}
                 onDragStart={(e)=>{this.dragObject(e)}}
                 className={"arrow-properties"} ref={object => this.objectRef = object}
                 src={this.props.tilePicture.default} alt={"object"}/>
        );
    }
}