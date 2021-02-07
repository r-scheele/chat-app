function addClientToMap(userName, socketId){
    if (!userSocketIdMap.has(userName)) {
    //when user is joining first time
    userSocketIdMap.set(userName, new Set([socketId]));
    } else{
    //user had already joined from one client and now joining using another
    client
    userSocketIdMap.get(userName).add(socketId);
    }
    }