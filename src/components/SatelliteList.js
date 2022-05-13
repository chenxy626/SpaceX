import React, {Component} from 'react';
import { List, Avatar, Button, Checkbox, Spin } from 'antd';
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    constructor(){
        super();
        this.state = {
            selected: [] //记录了用户到底选择哪个starlink
        };
    }

    onChange = (e) => {
        const { dataInfo, checked } = e.target; 
        //e.target是指导致这个component被点击到本身时触发的， 
        //e.currentTarget是看它绑定在哪个function上，看是否是通过bubble上去导致它被trigger
        //checked是指点的时候亮起来和消下去的信息
        const { selected } = this.state;
        //选中的selected是一列数组
        const list = this.addOrRemove(dataInfo, checked, selected);
        //针对选中的list进行一系列操作
        this.setState({ selected: list })
    }

    addOrRemove = (item, status, list) => {
        const found = list.some( entry => entry.satid === item.satid);
        // array.prototype.some(callbackFuntion), 这个some()函数用来判断是否有一个已经存在于List里
        if(status && !found){
            list=[...list, item] //这三个点叫spread语法，把list中的本来元素进行shallow copy，再加上item，重新组成新的数组赋给list
        }

        if(!status && found){ //unselect一个starlink，需要将这个item从list中移除
            list = list.filter( entry => {
                // filter()函数会返回一个符合函数条件的新数组，把不一样的都拿出来（！==item.satid）组成一个新数组，并赋给list
                // 这样的的话把选中拿走了
                return entry.satid !== item.satid;
            });
        }
        return list;
    }

    onShowSatMap = () =>{
        this.props.onShowMap(this.state.selected);
    }

    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        const { selected } = this.state;

        return (
            <div className="sat-list-box">
                <Button className="sat-list-btn"
                        size="large"
                        disabled={ selected.length === 0} //当用户一个CheckBox都没选的时候，track on map button不能点disable了
                        onClick={this.onShowSatMap}
                >Track on the map</Button>
                <hr/>

                {
                    isLoad ?
                        <div className="spin-box">
                            <Spin tip="Loading..." size="large" />
                        </div>
                        :
                        <List
                            className="sat-list"
                            itemLayout="horizontal"
                            size="small"
                            dataSource={satList}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Checkbox dataInfo={item} onChange={this.onChange}/>]} 
                                    //当用户点CheckBox或un-click checkBox的时候，onChange这个函数会被触发
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size={50} src={satellite} />}
                                        title={<p>{item.satname}</p>}
                                        description={`Launch Date: ${item.launchDate}`}
                                    />

                                </List.Item>
                            )}
                        />
                }
            </div>
        );
    }
}

export default SatelliteList;
