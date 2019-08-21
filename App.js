import React from "react";

import {
        StyleSheet,
        View,
        Text,
        FlatList,
        TouchableOpacity,
        Alert
    } from "react-native";

import Item from "./Item";

export default class App extends React.Component {

    constructor(_props) {

        super(_props);
        this.state = {
                itemList: []
            };

    }

    componentDidMount() {

        this._readList = this._readList.bind(this);
        this._onDBRunning = this._onDBRunning.bind(this);
        this._onNewPress = this._onNewPress.bind(this);
        this._readList();

    }

    render() {

        return (
                <View style={ styles.container }>
                    <ListView itemList={ this.state.itemList } refreshList={ () => this._readList() }></ListView>
                    <CreatorView onNewPress={ () => this._onNewPress() }></CreatorView>
                </View>
            );

    }

    _readList() {

        Item.read().then(this._onDBRunning);

    }

    _onDBRunning(_response) {

        const _itemList = [];
        let _index = _response.length;
        while ( _index-- ) {
            const _theItem = _response[_index];
            _theItem.key = String(_index);
            _itemList.unshift(_theItem);
        }
        this.setState( () => ({
                itemList: _itemList
            }) );

    }

    _onNewPress() {
        Item.create().then( () => this._readList() );
    }

}

class ListView extends React.Component {

    render() {

        const { itemList } = this.props;
        return (
                <FlatList data={ itemList } renderItem={ ({ item }) => <ItemView item={ item } refreshList={ () => this.props.refreshList() }></ItemView> } style={ styles.listView }></FlatList>
            );

    }

}

class ItemView extends React.Component {

    render() {

        const { item } = this.props;
        return (
                <View style={ styles.itemView }>
                    <Text style={ styles.itemIdText }>{ item.id }</Text>
                    <Text style={ styles.itemKeyText }>{ item.text }</Text>
                    <TouchableOpacity onPress={ () => {
                            Item.update(item.id).then( () => this.props.refreshList() );
                        } } style={ styles.itemResetTouchable }>
                        <Text style={ styles.itemIconText }>o</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => {
                            Alert.alert("Delete?", null, [{
                                    text: "Yes",
                                    onPress: () => {
                                            Item.delete(item.id).then( () => this.props.refreshList() );
                                        }
                                }, {
                                    text: "No"
                                }])
                        } } style={ styles.itemDeleteTouchable }>
                        <Text style={ styles.itemIconText }>x</Text>
                    </TouchableOpacity>
                </View>
            );

    }

}

class CreatorView extends React.Component {

    render() {

        const { onNewPress } = this.props;
        return (
                <View style={ styles.creatorView }>
                    <TouchableOpacity onPress={ () => onNewPress() } style={ styles.creatorTouchable }>
                        <Text style={ styles.creatorTouchableText }>New</Text>
                    </TouchableOpacity>
                </View>
            );

    }

}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                paddingTop: 20,
                // alignItems: "center",
                // justifyContent: "center",
                backgroundColor: "#dae1fe"
            },
        listView: {
                flex: 1,
                backgroundColor: "#3aa1ce"
            },
        itemView: {
                paddingLeft: 10,
                height: 40,
                justifyContent: "center",
                borderBottomWidth: 1,
                borderColor: "#ddd",
                borderStyle: "solid"
            },
        itemIdText: {
                color: "#ccc",
                fontSize: 12
            },
        itemKeyText: {
                color: "#fff"
            },
        itemDeleteTouchable: {
                position: "absolute",
                right: 10,
                padding: 5
            },
        itemResetTouchable: {
                position: "absolute",
                right: 40,
                padding: 5
            },
        itemIconText: {
                color: "#e5e5e5",
                fontSize: 15
            },
        creatorView: {
                flex: 1,
                position: "absolute",
                bottom: 10,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center"
            },
        creatorTouchable: {
                paddingLeft: 12,
                paddingRight: 12,
                justifyContent: "center",
                height: 30,
                backgroundColor: "#fff",
                borderRadius: 16
            },
        creatorTouchableText: {
                color: "#3aa1ce"
            }
    });
