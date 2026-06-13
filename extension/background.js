chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if(request.action === "httpGet")
    {
        fetch(request.url, {
            method: "GET",
            cache: "no-store"
        })
        .then(response => {

            if(!response.ok)
            {
                throw new Error(response.status);
            }

            return response.text();
        })
        .then(data => {
            sendResponse({
                success: true,
                data: data
            });
        })
        .catch(error => {
            sendResponse({
                success: false,
                error: error.toString()
            });
        });

        return true;
    }

});