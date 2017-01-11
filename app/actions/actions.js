export const ADD_ITEM = 'ADD_ITEM';
export const DOWNLOAD_ALL = 'DOWNLOAD_ALL';

let id = 0;

export function addItem(link){

	return {
		type: ADD_ITEM,
		link: link.link,
		download: link.download,
		id: id++
	}

}

export function downloadAll(data){
	return {
		type: DOWNLOAD_ALL,
		filePath: data.filePath
		}

}