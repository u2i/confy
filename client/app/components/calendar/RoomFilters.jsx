import React  from 'react'

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
                        <label htmlFor={conferenceRoom.id}>{conferenceRoom.title}</label>
                        <input key={conferenceRoom.id} type="checkbox" value={conferenceRoom.id}
                               onChange={this._handleCheckbox.bind(this)} defaultChecked={true}/>
                    </div>

                )
            }
        );
        return (
            <div className="filter-container">
                {filters}
            </div>
        );
    }
}