import { Map } from 'immutable';
import * as LocalStorageHelper from 'helpers/LocalStorageHelper';

export function saveFilters(filteredRooms) {
  LocalStorageHelper.setItem('filteredRooms', JSON.stringify(filteredRooms.entrySeq()));
}

export function loadFilters(conferenceRooms = []) {
  const filteredRooms = LocalStorageHelper.getItem('filteredRooms');

  if (filteredRooms) {
    return new Map(JSON.parse(filteredRooms));
  }
  const initialFilteredRooms = new Map(conferenceRooms.map(room => [room.id, true]));
  saveFilters(initialFilteredRooms);
  return initialFilteredRooms;
}
