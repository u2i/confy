import { Set } from 'immutable';
import * as LocalStorageHelper from 'helpers/LocalStorageHelper';

export function saveFilters(filteredRooms) {
  LocalStorageHelper.setItem('filteredRooms', JSON.stringify(filteredRooms));
}

export function loadFilters() {
  const filteredRooms = LocalStorageHelper.getItem('filteredRooms');
  if (filteredRooms) {
    return new Set(JSON.parse(filteredRooms));
  }
  const initialFilteredRooms = new Set();
  saveFilters(initialFilteredRooms);
  return initialFilteredRooms;
}
