import React from 'react'
import { Checkbox } from 'react-bootstrap'
import './filters.scss'

export default class FilterBox extends React.Component {

    render(){
        return(
            <div className="filter-box" style={{backgroundColor: this.props.conferenceRoom.color}}>
                <Checkbox value={this.props.conferenceRoom.id} onChange={this.props.handler}
                          defaultChecked inline>{this.props.conferenceRoom.title}</Checkbox>
            </div>
        );
    }
}