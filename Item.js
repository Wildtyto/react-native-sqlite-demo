import DB from "./DB"

export default class Item {

    static read() {

        return DB.read("foo3").then( _response => _response._array );

    }

    static create() {

        return DB.create("foo3", {
                id: +new Date(),
                text: this._getDatetimeName()
            });

    }

    static update(_id) {

        return DB.update("foo3", _id, {
                text: this._getDatetimeName()
            });

    }

    static delete(_id) {

        return DB.delete("foo3", _id);

    }

    static _getDatetimeName() {

        const _date = new Date();
        const _monthString = String( _date.getMonth() + 1 ).padStart(2, 0);
        const _dateString = String( _date.getDate() ).padStart(2, 0);
        const _hoursString = String( _date.getHours() ).padStart(2, 0);
        const _minutesString = String( _date.getMinutes() ).padStart(2, 0);
        const _secondsString = String( _date.getSeconds() ).padStart(2, 0);
        return `TEST_${ _monthString }${ _dateString }_${ _hoursString }${ _minutesString }${ _secondsString }`;

    }

}