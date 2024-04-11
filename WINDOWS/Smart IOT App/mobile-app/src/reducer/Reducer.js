export const reducer = (state, action) => {
    switch (action.type) {
        case "CREATE_HOME": {
            return { ...state, refreshHomes: !state.refreshHomes }
        }
        case "CREATE_FLOOR": {
            return { ...state, refreshFloors: !state.refreshFloors }
        }
        case "CREATE_TANK": {
            return { ...state, refreshTanks: !state.refreshTanks }
        }
        case "CREATE_ROOM": {
            return { ...state, refreshRooms: !state.refreshRooms }
        }
        case "CREATE_PIPELINE": {
            return { ...state, refreshPipelines: !state.refreshPipelines }
        }
        default: {
            return state
        }
    }
}