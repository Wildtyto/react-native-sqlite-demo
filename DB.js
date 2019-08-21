import {
        SQLite
    } from "expo-sqlite";

export default class DB {

    static read(_tableName) {

        let _resolver;
        return new Promise( _resolve => {
                _resolver = _resolve;
                this._transact().then( _tx => _readTable(_tx) );
            } );

        function _readTable(_tx) {
            _tx.executeSql(`SELECT * FROM ${ _tableName }`, [], (_tx, _results) => {
                    _resolver(_results.rows);
                } , () => {
                    _tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ _tableName } (id unique, text)`, [], _readTable);
                } );
        }

    }

    static create(_tableName, _requestBody) {

        let _resolver;
        let _rejector;
        let _fieldString;
        let _valueString;
        const _promise = new Promise( (_resolverInstance, _rejectorInstance) => {
                _resolver = _resolverInstance;
                _rejector = _rejectorInstance;
            } );
        if ( _tableName ) {
            const _requestKeyArray = Object.keys( _requestBody || {} );
            _fieldString = _requestKeyArray.join(", ");
            _valueString = _requestKeyArray.map( _key => `'${ _requestBody[_key] }'` ).join(", ");
            if ( _fieldString.length && _valueString.length ) this.db.transaction(_onTransaction);
            else _rejector();
        } else _rejector();
        return _promise;

        function _onTransaction(_tx) {
            const _sql = `INSERT INTO ${ _tableName } (${ _fieldString }) VALUES (${ _valueString })`;
            _tx.executeSql(_sql, [], _onResolved);
        }

        function _onResolved(_response) {
            _resolver(_response);
        }

    }

    static update(_tableName, _id, _requestBody) {

        let _resolver;
        let _rejector;
        let _requestString;
        const _promise = new Promise( (_resolverInstance, _rejectorInstance) => {
                _resolver = _resolverInstance;
                _rejector = _rejectorInstance;
            } );
        if ( _tableName && _id ) {
            const _requestKeyArray = Object.keys( _requestBody || {} );
            _requestString = _requestKeyArray.map( _key => `${ _key }='${ _requestBody[_key] }'` ).join(", ");
            if ( _requestString.length ) this.db.transaction(_onTransaction);
            else _rejector();
        } else _rejector();
        return _promise;

        function _onTransaction(_tx) {
            _tx.executeSql(`UPDATE ${ _tableName } SET ${ _requestString } WHERE id=?`, [_id], _onResolved);
        }

        function _onResolved(_response) {
            _resolver(_response);
        }

    }

    static delete(_tableName, _id) {

        let _resolver;
        return new Promise( (_resolve, _reject) => {
                _resolver = _resolve;
                if ( _tableName && _id ) this.db.transaction(_onTransaction);
                else _reject();
            } );

        function _onTransaction(_tx) {
            _tx.executeSql(`DELETE FROM ${ _tableName } WHERE id=?`, [_id], _onResolved);
        }

        function _onResolved(_response) {
            _resolver(_response);
        }

    }

    static _transact() {

        return new Promise( _resolver => {
                if ( !(this.db) ) this.db = SQLite.openDatabase("mydb");
                this.db.transaction( _tx => _resolver(_tx) );
            } );

    }

}