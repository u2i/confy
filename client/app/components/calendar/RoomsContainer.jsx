import React  from 'react'

export default class RoomsContainer extends React.Component {

    _room_changed(){
        this.props.changing(1);
    }

    _list_filters(){
        return [1,2,3,4,5,6,7,8].map((i) => <li onClick={() => this.props.changing(i)}>Click</li>);
    }

    render(){
        let lists = this._list_filters();
        return (
            <ul>
                {lists}
            </ul>
        );
    }
}