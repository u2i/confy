import React  from 'react'

import { Checkbox, Label } from 'react-bootstrap'

import './filters.scss'

export default class RoomFilters extends React.Component {
    
    _handleCheckbox(event){
        if(!event.target.checked){
            this.props.add(parseInt(event.target.value));
        }
        else{
            this.props.delete(parseInt(event.target.value));
        }
    }

    render(){
        let filters = this.props.conferenceRooms.map(
            (conferenceRoom) => {
                return (
                    <div className="filter-box" style={{backgroundColor: conferenceRoom.color}}>
                        <Checkbox value={conferenceRoom.id} onChange={this._handleCheckbox.bind(this)}
                                  defaultChecked inline>{conferenceRoom.title}</Checkbox>
                    </div>
                )}
        );
        return (
            <div className="filter-container">
                {filters}
            </div>
        );
    }
}