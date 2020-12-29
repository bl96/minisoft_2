import React from "react";

interface ArrowProps{
    tilePicture:any;
    arrowType:string;
}

interface ArrowState{
    isDraggable:boolean
}

export class Arrow extends React.Component<ArrowProps,ArrowState> {
    arrowRef:any;

    constructor(props: any) {
        super(props);
        this.state = {
            isDraggable:true
        }
        this.setDraggable = this.setDraggable.bind(this);
    }

    setDraggable(bool:boolean){
        this.setState({isDraggable: bool});
    }

    dragObject(event:any){
        event.dataTransfer.setData("arrow_type", this.props.arrowType);
    }

    render() {
        return (
            <img draggable={true} onDragStart={(event) => {
                this.dragObject(event)
            }}
                 className={"arrow-properties"} ref={arrow => this.arrowRef = arrow}
                 src={this.props.tilePicture.default} alt={"arrow"}/>
        );
    }
}