const permission = {
    get promiseMode() {
        try {
            Notification.requestPermission().then();
            return true;
        } catch (error) {
            return false;
        }
    },
    save: function (permission) {
        if(!Notification.permission) 
            Notification.permission = permission;
    },
    request: function (callback) {
        this.promiseMode ?
        Notification.requestPermission().then(callback) :
        Notification.requestPermission(callback);
    },
    get : () => Notification.permission,

}

export const notifies = { permission };


