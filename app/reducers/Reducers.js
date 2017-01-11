import { ADD_ITEM, DOWNLOAD_ALL } from '../actions/actions.js';

function itens(state = [], action) {
    switch (action.type) {
        case ADD_ITEM:
            let obj = [...state, {
                link: action.link,
                download: action.download,
                id: action.id,
                filePath: ''
            }]
            return obj;

        case DOWNLOAD_ALL:
            return state.map((val, index) => {

                val.download = true;
                val.filePath = action.filePath;
                return val;
            })



        default:

            return state;
    }
}


export default itens;
