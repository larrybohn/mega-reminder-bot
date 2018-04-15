import moment from 'moment';

export default {
    utcToLocalFull: utcDate => moment.utc(utcDate).local().format("MMMM Do YYYY, HH:mm"),
    utcToFromNow: utcDate => moment.utc(utcDate).local().fromNow()
};