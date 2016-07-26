import React  from 'react'

export default class RoomsContainer extends React.Component {
    _handle_checkbox(event){
        if(!event.target.checked){
            this.props.add(parseInt(event.target.value));
        }
        else{
            this.props.delete(parseInt(event.target.value));
        }
    }

    render(){
        let filters = this.props.conferenceRooms.map(
            (conference_room) => {
                return (
                    <div>
                        <label htmlFor={conference_room.id}>{conference_room.title}</label>
                        <input key={conference_room.id} type="checkbox" value={conference_room.id}
                               onChange={this._handle_checkbox.bind(this)} defaultChecked={true}/>
                    </div>

                )
            }
        );
        return (
            <form>
                {filters}
            </form>
        );
    }
}