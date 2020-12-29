import React from "react";

interface EditorPlayerFinishProps{
    tilePicture:any;
    setEditorPlayerDirection:any;
    type:string;
}

interface EditorPlayerFinishState{

}

export class EditorPlayerFinish extends React.Component<EditorPlayerFinishProps,EditorPlayerFinishState> {
    objectRef:any;

    constructor(props:any) {
        super(props);
    }

    dragObject(event:any){
        event.dataTransfer.setData("value", this.props.type==="player"?"player":this.props.type==="finish"?"finish":"4");
    }

    render() {
        return (
            <img onClick={()=> this.props.setEditorPlayerDirection(this.props.type==="player")}
                 onDragStart={(e)=>{this.dragObject(e)}}
                 className={"arrow-properties"} ref={object => this.objectRef = object}
                 src={this.props.tilePicture.default} alt={"object"}/>
        );
    }
}